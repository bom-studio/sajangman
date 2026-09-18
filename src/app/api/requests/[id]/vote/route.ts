import { NextResponse } from "next/server"

import { toggleFeatureRequestVote } from "@/lib/requests/queries"

export const runtime = "nodejs"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function POST(request: Request, context: RouteContext) {
  const { id } = await context.params

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
  const visitorId =
    typeof raw.visitor_id === "string"
      ? raw.visitor_id
      : typeof raw.visitorId === "string"
        ? raw.visitorId
        : ""

  const result = await toggleFeatureRequestVote(id, visitorId)

  if (!result.ok) {
    const status = result.error.includes("찾을 수 없") ? 404 : 400
    return NextResponse.json(result, { status })
  }

  return NextResponse.json(result)
}
