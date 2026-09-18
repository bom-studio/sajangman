import { NextResponse } from "next/server"

import {
  createFeatureRequest,
  listFeatureRequests,
  type RequestSort,
} from "@/lib/requests/queries"
import type { FeatureRequestCategory } from "@/lib/supabase/database.types"

export const runtime = "nodejs"

function parseCategory(
  value: string | null
): FeatureRequestCategory | "all" {
  if (
    !value ||
    value === "all" ||
    ["calculator", "document", "guide", "sales", "employee", "other"].includes(
      value
    )
  ) {
    return (value as FeatureRequestCategory | "all") || "all"
  }
  return "all"
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = Math.max(1, Number(searchParams.get("page")) || 1)
  const category = parseCategory(searchParams.get("category"))
  const sort: RequestSort =
    searchParams.get("sort") === "popular" ? "popular" : "latest"
  const q = searchParams.get("q")?.trim() ?? ""

  const result = await listFeatureRequests({ page, category, sort, q })

  return NextResponse.json(result)
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: "잘못된 요청입니다." },
      { status: 400 }
    )
  }

  const raw = body as Record<string, unknown>

  // Whitelist only — ignore site_key, board_id, status, metadata, etc.
  const result = await createFeatureRequest({
    category: raw.category as never,
    title: typeof raw.title === "string" ? raw.title : "",
    content: typeof raw.content === "string" ? raw.content : "",
    industry:
      typeof raw.industry === "string" || raw.industry === null
        ? (raw.industry as string | null)
        : null,
    nickname:
      typeof raw.nickname === "string" || raw.nickname === null
        ? (raw.nickname as string | null)
        : null,
    visitorId:
      typeof raw.visitor_id === "string"
        ? raw.visitor_id
        : typeof raw.visitorId === "string"
          ? raw.visitorId
          : "",
    website: typeof raw.website === "string" ? raw.website : "",
  })

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 })
  }

  return NextResponse.json(result, { status: 201 })
}
