import "server-only"

import { unstable_cache } from "next/cache"
import { z } from "zod"

import { SITE_KEY } from "@/lib/site-key"
import {
  createSupabaseAdmin,
  isSupabaseAdminConfigured,
  logSupabaseAdminDiagnostics,
} from "@/lib/supabase/admin"

/**
 * Burst-only guard against concurrent double POSTs (e.g. race).
 * Session boundaries are enforced by client sessionStorage — do NOT use a
 * long window here or a new tab/session within 30m would fail to +1.
 */
export const VISIT_BURST_DEDUPE_MS = 10_000

const visitorIdSchema = z
  .string()
  .trim()
  .min(8)
  .max(80)
  .regex(/^[A-Za-z0-9_-]+$/)

type SiteVisitorRow = {
  id: string
  last_seen_at: string
  visit_count: number
}

export type RecordVisitResult =
  | { ok: true; status: "created" | "updated" | "deduped" }
  | { ok: false; error: string }

function logVisitorError(context: string, error?: unknown) {
  const errObj =
    error && typeof error === "object"
      ? (error as Record<string, unknown>)
      : null

  console.error(`[visitors] ${context}`, {
    siteKey: SITE_KEY,
    hasUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()),
    hasServiceRoleKey: Boolean(
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
    ),
    message:
      error instanceof Error
        ? error.message
        : typeof errObj?.message === "string"
          ? errObj.message
          : error
            ? String(error)
            : undefined,
    code:
      typeof errObj?.code === "string"
        ? errObj.code
        : error instanceof Error
          ? (error as NodeJS.ErrnoException).code
          : undefined,
  })
}

/**
 * Record one visit session for this deploy's SITE_KEY only.
 * Increments visit_count on returning visitors (new browser session).
 * Never reads site_key from the client.
 */
export async function recordSiteVisit(
  visitorIdRaw: string
): Promise<RecordVisitResult> {
  const parsed = visitorIdSchema.safeParse(visitorIdRaw)
  if (!parsed.success) {
    return { ok: false, error: "유효하지 않은 visitor_id입니다." }
  }

  if (!isSupabaseAdminConfigured()) {
    logVisitorError("recordSiteVisit: missing Supabase admin env")
    return { ok: false, error: "방문 통계를 사용할 수 없습니다." }
  }

  const admin = createSupabaseAdmin()
  if (!admin) {
    logVisitorError("recordSiteVisit: createSupabaseAdmin returned null")
    return { ok: false, error: "방문 통계를 사용할 수 없습니다." }
  }

  const visitorId = parsed.data

  try {
    const { data: existing, error: selectError } = await admin
      .from("site_visitors")
      .select("id, last_seen_at, visit_count")
      .eq("site_key", SITE_KEY)
      .eq("visitor_id", visitorId)
      .maybeSingle()

    if (selectError) {
      logSupabaseAdminDiagnostics("recordSiteVisit:select", selectError)
      logVisitorError("recordSiteVisit:select", selectError)
      return { ok: false, error: "방문 기록에 실패했습니다." }
    }

    const row = existing as SiteVisitorRow | null

    if (!row) {
      const { error: insertError } = await admin.from("site_visitors").insert({
        site_key: SITE_KEY,
        visitor_id: visitorId,
      })

      if (insertError) {
        if (insertError.code === "23505") {
          return { ok: true, status: "deduped" }
        }
        logSupabaseAdminDiagnostics("recordSiteVisit:insert", insertError)
        logVisitorError("recordSiteVisit:insert", insertError)
        return { ok: false, error: "방문 기록에 실패했습니다." }
      }

      return { ok: true, status: "created" }
    }

    const lastSeenMs = Date.parse(row.last_seen_at)
    if (
      Number.isFinite(lastSeenMs) &&
      Date.now() - lastSeenMs < VISIT_BURST_DEDUPE_MS
    ) {
      return { ok: true, status: "deduped" }
    }

    const { error: updateError } = await admin
      .from("site_visitors")
      .update({
        last_seen_at: new Date().toISOString(),
        visit_count: row.visit_count + 1,
      })
      .eq("id", row.id)
      .eq("site_key", SITE_KEY)

    if (updateError) {
      logSupabaseAdminDiagnostics("recordSiteVisit:update", updateError)
      logVisitorError("recordSiteVisit:update", updateError)
      return { ok: false, error: "방문 기록에 실패했습니다." }
    }

    return { ok: true, status: "updated" }
  } catch (error) {
    logSupabaseAdminDiagnostics("recordSiteVisit", error)
    logVisitorError("recordSiteVisit", error)
    return { ok: false, error: "방문 기록에 실패했습니다." }
  }
}

async function fetchUniqueVisitorCountFromDb(): Promise<number> {
  const admin = createSupabaseAdmin()
  if (!admin) {
    throw new Error("Supabase admin client unavailable")
  }

  const { count, error } = await admin
    .from("site_visitors")
    .select("id", { count: "exact", head: true })
    .eq("site_key", SITE_KEY)

  if (error) {
    throw error
  }

  return typeof count === "number" ? count : 0
}

/** Cached unique visitor count (kept for analytics; not used on home stats). */
export async function getUniqueVisitorCount(): Promise<number | null> {
  if (!isSupabaseAdminConfigured()) {
    logVisitorError("getUniqueVisitorCount: missing Supabase admin env")
    return null
  }

  try {
    return await unstable_cache(
      fetchUniqueVisitorCountFromDb,
      ["site-visitors-unique-count", SITE_KEY],
      {
        revalidate: 60,
        tags: [`site-visitors-unique:${SITE_KEY}`],
      }
    )()
  } catch (error) {
    logSupabaseAdminDiagnostics("getUniqueVisitorCount", error)
    logVisitorError("Failed to fetch unique visitor count", error)
    return null
  }
}

/**
 * Throws on failure so unstable_cache never stores null/error results.
 * Returns SUM(visit_count) for SITE_KEY (0 when empty).
 */
async function fetchTotalVisitCountFromDb(): Promise<number> {
  const admin = createSupabaseAdmin()
  if (!admin) {
    throw new Error("Supabase admin client unavailable")
  }

  // PostgREST aggregates are disabled on this project — sum in app.
  const { data, error } = await admin
    .from("site_visitors")
    .select("visit_count")
    .eq("site_key", SITE_KEY)

  if (error) {
    throw error
  }

  const rows = (data ?? []) as { visit_count: number }[]
  return rows.reduce((sum, row) => sum + (row.visit_count ?? 0), 0)
}

/**
 * Cached SUM(visit_count) for this site only (SITE_KEY).
 * Failures return null and are NOT cached (thrown inside cache fn).
 */
export async function getTotalVisitCount(): Promise<number | null> {
  if (!isSupabaseAdminConfigured()) {
    logVisitorError("getTotalVisitCount: missing Supabase admin env")
    return null
  }

  try {
    return await unstable_cache(
      fetchTotalVisitCountFromDb,
      ["site-visitors-total-visits", SITE_KEY],
      {
        revalidate: 60,
        tags: [`site-visitors-visits:${SITE_KEY}`],
      }
    )()
  } catch (error) {
    logSupabaseAdminDiagnostics("getTotalVisitCount", error)
    logVisitorError("Failed to fetch total visit count", error)
    return null
  }
}
