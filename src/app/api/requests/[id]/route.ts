import { NextResponse } from "next/server"

import { getFeatureRequestById } from "@/lib/requests/queries"

export const runtime = "nodejs"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params
  const request = await getFeatureRequestById(id)

  if (!request) {
    return NextResponse.json(
      { ok: false, error: "요청을 찾을 수 없습니다." },
      { status: 404 }
    )
  }

  return NextResponse.json({ ok: true, item: request })
}
