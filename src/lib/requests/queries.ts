import "server-only"

import {
  BOARD_KEY,
  RATE_LIMIT_MAX_PER_WINDOW,
  RATE_LIMIT_WINDOW_MS,
  REQUESTS_PAGE_SIZE,
  SITE_KEY,
} from "@/lib/requests/constants"
import {
  createSupabaseAdmin,
  isSupabaseAdminConfigured,
  logSupabaseAdminDiagnostics,
} from "@/lib/supabase/admin"
import type {
  FeatureRequestCategory,
  FeatureRequestRow,
  FeatureRequestStatus,
} from "@/lib/supabase/database.types"
import { z } from "zod"

export type RequestSort = "latest" | "popular"

export interface RequestListParams {
  page?: number
  category?: FeatureRequestCategory | "all"
  sort?: RequestSort
  q?: string
  status?: FeatureRequestStatus | "all"
}

export interface RequestStats {
  total: number
  reviewing: number
  planned: number
  completed: number
}

export interface CategoryCount {
  category: FeatureRequestCategory | "all"
  count: number
}

export interface RequestListResult {
  items: FeatureRequestRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
  configured: boolean
}

const CATEGORIES = [
  "calculator",
  "document",
  "guide",
  "sales",
  "employee",
  "other",
] as const

const STATUSES = [
  "requested",
  "reviewing",
  "planned",
  "developing",
  "completed",
  "rejected",
] as const

const POST_SELECT =
  "id, title, content, nickname, visitor_id, vote_count, created_at, updated_at, metadata, site_key, board_id, is_public, status"

export const createRequestBodySchema = z.object({
  category: z.enum(CATEGORIES),
  title: z.string().trim().min(2).max(100),
  content: z.string().trim().min(2).max(1000),
  industry: z
    .enum([
      "restaurant",
      "cafe",
      "shopping",
      "service",
      "manufacturing",
      "other",
    ])
    .optional()
    .nullable(),
  nickname: z.string().trim().max(30).optional().nullable(),
  visitor_id: z
    .string()
    .trim()
    .min(8)
    .max(80)
    .regex(/^[A-Za-z0-9_-]+$/),
  /** Honeypot — must be empty */
  website: z.string().max(0).optional().nullable(),
})

export type CreateFeatureRequestInput = {
  category: (typeof CATEGORIES)[number]
  title: string
  content: string
  industry?: string | null
  nickname?: string | null
  visitorId: string
}

interface BoardPostRow {
  id: string
  title: string
  content: string
  nickname: string | null
  visitor_id: string | null
  vote_count: number
  created_at: string
  updated_at: string
  metadata: Record<string, unknown> | null
  site_key: string
  board_id: string
  is_public: boolean
  status: string
}

function emptyStats(): RequestStats {
  return { total: 0, reviewing: 0, planned: 0, completed: 0 }
}

function asStatus(value: unknown): FeatureRequestStatus {
  if (
    typeof value === "string" &&
    (STATUSES as readonly string[]).includes(value)
  ) {
    return value as FeatureRequestStatus
  }
  return "requested"
}

function asCategory(value: unknown): FeatureRequestCategory {
  if (
    typeof value === "string" &&
    (CATEGORIES as readonly string[]).includes(value)
  ) {
    return value as FeatureRequestCategory
  }
  return "other"
}

function mapPostToFeatureRequest(row: BoardPostRow): FeatureRequestRow {
  const meta = row.metadata ?? {}
  return {
    id: row.id,
    category: asCategory(meta.category),
    title: row.title,
    content: row.content,
    industry: typeof meta.industry === "string" ? meta.industry : null,
    nickname: row.nickname,
    visitor_id: row.visitor_id ?? "",
    status: asStatus(meta.request_status),
    admin_note: typeof meta.admin_note === "string" ? meta.admin_note : null,
    result_url: typeof meta.result_url === "string" ? meta.result_url : null,
    vote_count: row.vote_count ?? 0,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }
}

let cachedBoardId: string | null | undefined
let boardIdInflight: Promise<string | null> | null = null

async function getFeatureRequestsBoardId(): Promise<string | null> {
  if (cachedBoardId !== undefined) return cachedBoardId
  if (boardIdInflight) return boardIdInflight

  boardIdInflight = (async () => {
    const supabase = createSupabaseAdmin()
    if (!supabase) {
      return null
    }

    try {
      const { data, error } = await supabase
        .from("boards")
        .select("id")
        .eq("site_key", SITE_KEY)
        .eq("board_key", BOARD_KEY)
        .eq("is_active", true)
        .maybeSingle()

      if (error) {
        // Network failures often surface as Postgrest error.message = "TypeError: fetch failed"
        logSupabaseAdminDiagnostics("getFeatureRequestsBoardId", {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint,
        })
        return null
      }

      const id = (data as { id: string } | null)?.id ?? null
      // Cache hits only — miss/network errors must retry on next request
      if (id) cachedBoardId = id
      return id
    } catch (error) {
      logSupabaseAdminDiagnostics("getFeatureRequestsBoardId:fetch", error)
      return null
    } finally {
      boardIdInflight = null
    }
  })()

  return boardIdInflight
}

function scopedPublicPosts(boardId: string, withCount = false) {
  const supabase = createSupabaseAdmin()
  if (!supabase) return null

  const select = withCount
    ? supabase.from("board_posts").select(POST_SELECT, { count: "exact" })
    : supabase.from("board_posts").select(POST_SELECT)

  return select
    .eq("board_id", boardId)
    .eq("site_key", SITE_KEY)
    .eq("is_public", true)
    .eq("status", "published")
}

function scopedCount(boardId: string) {
  const supabase = createSupabaseAdmin()
  if (!supabase) return null

  return supabase
    .from("board_posts")
    .select("id", { count: "exact", head: true })
    .eq("board_id", boardId)
    .eq("site_key", SITE_KEY)
    .eq("is_public", true)
    .eq("status", "published")
}

export async function getRequestStats(): Promise<RequestStats> {
  const boardId = await getFeatureRequestsBoardId()
  if (!boardId) return emptyStats()

  const base = () => scopedCount(boardId)
  if (!base()) return emptyStats()

  const [totalRes, reviewingRes, plannedRes, completedRes] = await Promise.all([
    scopedCount(boardId)!,
    scopedCount(boardId)!.eq("metadata->>request_status", "reviewing"),
    scopedCount(boardId)!.eq("metadata->>request_status", "planned"),
    scopedCount(boardId)!.eq("metadata->>request_status", "completed"),
  ])

  return {
    total: totalRes.count ?? 0,
    reviewing: reviewingRes.count ?? 0,
    planned: plannedRes.count ?? 0,
    completed: completedRes.count ?? 0,
  }
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const categories: FeatureRequestCategory[] = [...CATEGORIES]
  const boardId = await getFeatureRequestsBoardId()

  if (!boardId) {
    return [
      { category: "all", count: 0 },
      ...categories.map((category) => ({ category, count: 0 })),
    ]
  }

  const totalRes = await scopedCount(boardId)!
  const counts = await Promise.all(
    categories.map(async (category) => {
      const res = await scopedCount(boardId)!.eq(
        "metadata->>category",
        category
      )
      return { category, count: res.count ?? 0 } as CategoryCount
    })
  )

  return [{ category: "all", count: totalRes.count ?? 0 }, ...counts]
}

export async function listFeatureRequests(
  params: RequestListParams = {}
): Promise<RequestListResult> {
  const page = Math.max(1, params.page ?? 1)
  const pageSize = REQUESTS_PAGE_SIZE
  const boardId = await getFeatureRequestsBoardId()

  if (!boardId || !isSupabaseAdminConfigured()) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      configured: false,
    }
  }

  let query = scopedPublicPosts(boardId, true)
  if (!query) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      configured: false,
    }
  }

  if (params.category && params.category !== "all") {
    query = query.eq("metadata->>category", params.category)
  }

  if (params.status && params.status !== "all") {
    query = query.eq("metadata->>request_status", params.status)
  }

  const q = params.q?.trim()
  if (q) {
    const escaped = q.replace(/[%_,]/g, "")
    if (escaped) {
      query = query.or(`title.ilike.%${escaped}%,content.ilike.%${escaped}%`)
    }
  }

  if (params.sort === "popular") {
    query = query
      .order("vote_count", { ascending: false })
      .order("created_at", { ascending: false })
  } else {
    query = query.order("created_at", { ascending: false })
  }

  const from = (page - 1) * pageSize
  const to = from + pageSize - 1

  const { data, count, error } = await query.range(from, to)

  if (error) {
    console.error("listFeatureRequests:", error.message)
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      configured: true,
    }
  }

  const total = count ?? 0
  return {
    items: ((data ?? []) as BoardPostRow[]).map(mapPostToFeatureRequest),
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    configured: true,
  }
}

export async function getFeatureRequestById(
  id: string
): Promise<FeatureRequestRow | null> {
  if (!id) return null

  const boardId = await getFeatureRequestsBoardId()
  if (!boardId) return null

  const query = scopedPublicPosts(boardId)
  if (!query) return null

  const { data, error } = await query.eq("id", id).maybeSingle()

  if (error) {
    console.error("getFeatureRequestById:", error.message)
    return null
  }

  if (!data) return null
  return mapPostToFeatureRequest(data as BoardPostRow)
}

export async function getRoadmapRequests(): Promise<{
  planned: FeatureRequestRow[]
  developing: FeatureRequestRow[]
  completed: FeatureRequestRow[]
}> {
  const boardId = await getFeatureRequestsBoardId()
  if (!boardId) {
    return { planned: [], developing: [], completed: [] }
  }

  const resolvedBoardId = boardId

  async function byStatus(
    status: FeatureRequestStatus,
    order: "vote_count" | "updated_at"
  ) {
    const query = scopedPublicPosts(resolvedBoardId)
    if (!query) return []

    const { data } = await query
      .eq("metadata->>request_status", status)
      .order(order, { ascending: false })
      .limit(5)

    return ((data ?? []) as BoardPostRow[]).map(mapPostToFeatureRequest)
  }

  const [planned, developing, completed] = await Promise.all([
    byStatus("planned", "vote_count"),
    byStatus("developing", "updated_at"),
    byStatus("completed", "updated_at"),
  ])

  return { planned, developing, completed }
}

export async function hasVisitorVoted(
  requestId: string,
  visitorId: string
): Promise<boolean> {
  if (!requestId || !visitorId) return false

  const post = await getFeatureRequestById(requestId)
  if (!post) return false

  const supabase = createSupabaseAdmin()
  if (!supabase) return false

  const { data } = await supabase
    .from("board_post_votes")
    .select("id")
    .eq("post_id", requestId)
    .eq("visitor_id", visitorId)
    .maybeSingle()

  return Boolean(data)
}

export async function createFeatureRequest(
  input: CreateFeatureRequestInput & { website?: string | null }
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!isSupabaseAdminConfigured()) {
    return {
      ok: false,
      error:
        "기능 요청 저장소가 아직 연결되지 않았습니다. 잠시 후 다시 시도해주세요.",
    }
  }

  if (input.website) {
    return { ok: false, error: "요청을 처리할 수 없습니다." }
  }

  const parsed = createRequestBodySchema.safeParse({
    category: input.category,
    title: input.title,
    content: input.content,
    industry: input.industry ?? null,
    nickname: input.nickname ?? null,
    visitor_id: input.visitorId,
    website: input.website ?? "",
  })

  if (!parsed.success) {
    return { ok: false, error: "입력 내용을 다시 확인해주세요." }
  }

  const boardId = await getFeatureRequestsBoardId()
  const supabase = createSupabaseAdmin()
  if (!boardId || !supabase) {
    return { ok: false, error: "기능 요청 저장소에 연결할 수 없습니다." }
  }

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const { count: recentCount } = await supabase
    .from("board_posts")
    .select("id", { count: "exact", head: true })
    .eq("board_id", boardId)
    .eq("visitor_id", parsed.data.visitor_id)
    .gte("created_at", since)

  if ((recentCount ?? 0) >= RATE_LIMIT_MAX_PER_WINDOW) {
    return {
      ok: false,
      error: "요청이 너무 빠릅니다. 잠시 후 다시 시도해주세요.",
    }
  }

  const nickname =
    parsed.data.nickname && parsed.data.nickname.length > 0
      ? parsed.data.nickname
      : null

  const { data, error } = await supabase
    .from("board_posts")
    .insert({
      board_id: boardId,
      title: parsed.data.title,
      content: parsed.data.content,
      nickname,
      visitor_id: parsed.data.visitor_id,
      author_type: "visitor",
      status: "published",
      is_public: true,
      is_pinned: false,
      view_count: 0,
      vote_count: 0,
      metadata: {
        category: parsed.data.category,
        industry: parsed.data.industry ?? null,
        request_status: "requested",
        admin_note: null,
        result_url: null,
      },
    })
    .select("id")
    .single()

  if (error || !data) {
    console.error("createFeatureRequest:", error?.message)
    return { ok: false, error: "요청 등록에 실패했습니다. 다시 시도해주세요." }
  }

  return { ok: true, id: (data as { id: string }).id }
}

export async function toggleFeatureRequestVote(
  requestId: string,
  visitorId: string
): Promise<
  | { ok: true; voted: boolean; voteCount: number }
  | { ok: false; error: string }
> {
  if (!isSupabaseAdminConfigured()) {
    return { ok: false, error: "공감 기능을 사용할 수 없습니다." }
  }

  const visitor = visitorId.trim()
  if (
    !requestId ||
    visitor.length < 8 ||
    visitor.length > 80 ||
    !/^[A-Za-z0-9_-]+$/.test(visitor)
  ) {
    return { ok: false, error: "잘못된 요청입니다." }
  }

  const post = await getFeatureRequestById(requestId)
  if (!post) {
    return { ok: false, error: "요청을 찾을 수 없습니다." }
  }

  const supabase = createSupabaseAdmin()
  if (!supabase) {
    return { ok: false, error: "공감 기능을 사용할 수 없습니다." }
  }

  const { data, error } = await supabase.rpc("toggle_board_post_vote", {
    p_post_id: requestId,
    p_visitor_id: visitor,
  })

  if (error) {
    console.error("toggleFeatureRequestVote:", error.message)
    return { ok: false, error: "공감 처리에 실패했습니다." }
  }

  const result = data as { voted?: boolean; vote_count?: number } | null

  return {
    ok: true,
    voted: Boolean(result?.voted),
    voteCount: result?.vote_count ?? post.vote_count,
  }
}

export { isSupabaseAdminConfigured as isRequestsStoreConfigured }
