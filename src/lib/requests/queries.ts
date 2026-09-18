import { z } from "zod"

import {
  RATE_LIMIT_MAX_PER_WINDOW,
  RATE_LIMIT_WINDOW_MS,
  REQUESTS_PAGE_SIZE,
} from "@/lib/requests/constants"
import { createSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/client"
import type {
  FeatureRequestCategory,
  FeatureRequestRow,
  FeatureRequestStatus,
} from "@/lib/supabase/database.types"

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

const createSchema = z.object({
  category: z.enum([
    "calculator",
    "document",
    "guide",
    "sales",
    "employee",
    "other",
  ]),
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
  visitorId: z.string().trim().min(8).max(80),
})

export type CreateFeatureRequestInput = z.infer<typeof createSchema>

function emptyStats(): RequestStats {
  return { total: 0, reviewing: 0, planned: 0, completed: 0 }
}

export async function getRequestStats(): Promise<RequestStats> {
  const supabase = createSupabaseClient()
  if (!supabase) return emptyStats()

  const [totalRes, reviewingRes, plannedRes, completedRes] = await Promise.all([
    supabase.from("feature_requests").select("id", { count: "exact", head: true }),
    supabase
      .from("feature_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "reviewing"),
    supabase
      .from("feature_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "planned"),
    supabase
      .from("feature_requests")
      .select("id", { count: "exact", head: true })
      .eq("status", "completed"),
  ])

  return {
    total: totalRes.count ?? 0,
    reviewing: reviewingRes.count ?? 0,
    planned: plannedRes.count ?? 0,
    completed: completedRes.count ?? 0,
  }
}

export async function getCategoryCounts(): Promise<CategoryCount[]> {
  const supabase = createSupabaseClient()
  const categories: FeatureRequestCategory[] = [
    "calculator",
    "document",
    "guide",
    "sales",
    "employee",
    "other",
  ]

  if (!supabase) {
    return [
      { category: "all", count: 0 },
      ...categories.map((category) => ({ category, count: 0 })),
    ]
  }

  const totalRes = await supabase
    .from("feature_requests")
    .select("id", { count: "exact", head: true })

  const counts = await Promise.all(
    categories.map(async (category) => {
      const res = await supabase
        .from("feature_requests")
        .select("id", { count: "exact", head: true })
        .eq("category", category)
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
  const supabase = createSupabaseClient()

  if (!supabase) {
    return {
      items: [],
      total: 0,
      page,
      pageSize,
      totalPages: 1,
      configured: false,
    }
  }

  let query = supabase
    .from("feature_requests")
    .select("*", { count: "exact" })

  if (params.category && params.category !== "all") {
    query = query.eq("category", params.category)
  }

  if (params.status && params.status !== "all") {
    query = query.eq("status", params.status)
  }

  const q = params.q?.trim()
  if (q) {
    query = query.or(`title.ilike.%${q}%,content.ilike.%${q}%`)
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
    items: (data ?? []) as FeatureRequestRow[],
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
  const supabase = createSupabaseClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from("feature_requests")
    .select("*")
    .eq("id", id)
    .maybeSingle()

  if (error) {
    console.error("getFeatureRequestById:", error.message)
    return null
  }

  return data as FeatureRequestRow | null
}

export async function getRoadmapRequests(): Promise<{
  planned: FeatureRequestRow[]
  developing: FeatureRequestRow[]
  completed: FeatureRequestRow[]
}> {
  const supabase = createSupabaseClient()
  if (!supabase) {
    return { planned: [], developing: [], completed: [] }
  }

  const [planned, developing, completed] = await Promise.all([
    supabase
      .from("feature_requests")
      .select("*")
      .eq("status", "planned")
      .order("vote_count", { ascending: false })
      .limit(5),
    supabase
      .from("feature_requests")
      .select("*")
      .eq("status", "developing")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("feature_requests")
      .select("*")
      .eq("status", "completed")
      .order("updated_at", { ascending: false })
      .limit(5),
  ])

  return {
    planned: (planned.data ?? []) as FeatureRequestRow[],
    developing: (developing.data ?? []) as FeatureRequestRow[],
    completed: (completed.data ?? []) as FeatureRequestRow[],
  }
}

export async function hasVisitorVoted(
  requestId: string,
  visitorId: string
): Promise<boolean> {
  const supabase = createSupabaseClient()
  if (!supabase || !visitorId) return false

  const { data } = await supabase
    .from("feature_request_votes")
    .select("id")
    .eq("request_id", requestId)
    .eq("visitor_id", visitorId)
    .maybeSingle()

  return Boolean(data)
}

export async function getVotedRequestIds(
  visitorId: string,
  requestIds: string[]
): Promise<Set<string>> {
  const supabase = createSupabaseClient()
  if (!supabase || !visitorId || requestIds.length === 0) {
    return new Set()
  }

  const { data } = await supabase
    .from("feature_request_votes")
    .select("request_id")
    .eq("visitor_id", visitorId)
    .in("request_id", requestIds)

  return new Set(
    ((data ?? []) as { request_id: string }[]).map((row) => row.request_id)
  )
}

export async function createFeatureRequest(
  input: CreateFeatureRequestInput
): Promise<{ ok: true; id: string } | { ok: false; error: string }> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "기능 요청 저장소가 아직 연결되지 않았습니다. 잠시 후 다시 시도해주세요.",
    }
  }

  const parsed = createSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, error: "입력 내용을 다시 확인해주세요." }
  }

  const supabase = createSupabaseClient()
  if (!supabase) {
    return { ok: false, error: "기능 요청 저장소에 연결할 수 없습니다." }
  }

  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS).toISOString()
  const { count: recentCount } = await supabase
    .from("feature_requests")
    .select("id", { count: "exact", head: true })
    .eq("visitor_id", parsed.data.visitorId)
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
    .from("feature_requests")
    .insert({
      category: parsed.data.category,
      title: parsed.data.title,
      content: parsed.data.content,
      industry: parsed.data.industry ?? null,
      nickname,
      visitor_id: parsed.data.visitorId,
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
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "공감 기능을 사용할 수 없습니다." }
  }

  if (!requestId || visitorId.trim().length < 8) {
    return { ok: false, error: "잘못된 요청입니다." }
  }

  const supabase = createSupabaseClient()
  if (!supabase) {
    return { ok: false, error: "공감 기능을 사용할 수 없습니다." }
  }

  const { data: existing } = await supabase
    .from("feature_request_votes")
    .select("id")
    .eq("request_id", requestId)
    .eq("visitor_id", visitorId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from("feature_request_votes")
      .delete()
      .eq("request_id", requestId)
      .eq("visitor_id", visitorId)

    if (error) {
      console.error("toggleVote delete:", error.message)
      return { ok: false, error: "공감 취소에 실패했습니다." }
    }
  } else {
    const { error } = await supabase.from("feature_request_votes").insert({
      request_id: requestId,
      visitor_id: visitorId,
    })

    if (error) {
      console.error("toggleVote insert:", error.message)
      return { ok: false, error: "공감 등록에 실패했습니다." }
    }
  }

  const { data: request } = await supabase
    .from("feature_requests")
    .select("vote_count")
    .eq("id", requestId)
    .maybeSingle()

  return {
    ok: true,
    voted: !existing,
    voteCount: (request as { vote_count: number } | null)?.vote_count ?? 0,
  }
}
