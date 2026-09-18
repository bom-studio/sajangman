import { NextResponse } from "next/server"

import { recordSiteVisit } from "@/lib/visitors/queries"

export const runtime = "nodejs"

/**
 * POST /api/visitors
 * Body: { visitor_id: string } only.
 * site_key is forced server-side to SITE_KEY — never trusted from client.
 */
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
  const visitorId =
    typeof raw.visitor_id === "string"
      ? raw.visitor_id
      : typeof raw.visitorId === "string"
        ? raw.visitorId
        : ""

  const result = await recordSiteVisit(visitorId)

  if (!result.ok) {
    return NextResponse.json(result, { status: 400 })
  }

  return NextResponse.json(result)
}
