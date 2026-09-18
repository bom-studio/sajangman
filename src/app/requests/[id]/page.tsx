import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, ChevronLeft } from "lucide-react"

import {
  RequestCategoryBadge,
  RequestStatusBadge,
} from "@/components/requests/request-badges"
import { RequestStatusFlow } from "@/components/requests/request-status-flow"
import { VoteButton } from "@/components/requests/vote-button"
import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import {
  getFeatureRequestById,
} from "@/lib/requests/queries"
import { getIndustryLabel } from "@/lib/requests/constants"
import { SITE_NAME, SITE_URL } from "@/lib/site-config"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params
  const request = await getFeatureRequestById(id)

  if (!request) {
    return { title: `기능 요청 | ${SITE_NAME}` }
  }

  return {
    title: `${request.title} | 기능 요청 | ${SITE_NAME}`,
    description: request.content.slice(0, 140),
    alternates: { canonical: `${SITE_URL}/requests/${id}` },
    openGraph: {
      title: request.title,
      description: request.content.slice(0, 140),
      url: `${SITE_URL}/requests/${id}`,
      type: "article",
      siteName: SITE_NAME,
    },
  }
}

function formatDate(value: string): string {
  return new Date(value).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function RequestDetailPage({ params }: PageProps) {
  const { id } = await params
  const request = await getFeatureRequestById(id)

  if (!request) notFound()

  const nickname = request.nickname?.trim() || "익명의 사장님"
  const industry = getIndustryLabel(request.industry)

  return (
    <SiteLayout>
      <div className="border-b border-border/60 bg-[#F5F8FF]">
        <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <Link
            href="/requests"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="size-4" />
            요청 목록
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <RequestCategoryBadge category={request.category} />
            <RequestStatusBadge status={request.status} />
          </div>

          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            {request.title}
          </h1>

          <p className="mt-3 text-sm text-muted-foreground">
            {nickname}
            {industry ? ` · ${industry}` : ""}
            {" · "}
            {formatDate(request.created_at)}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-2xl border border-border/70 bg-white p-6 sm:p-8">
          <h2 className="text-sm font-semibold text-muted-foreground">
            요청 내용
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-foreground">
            {request.content}
          </p>
        </section>

        <VoteButton
          requestId={request.id}
          initialCount={request.vote_count}
          variant="detail"
        />

        <section className="space-y-4">
          <h2 className="text-lg font-bold text-foreground">진행 상태</h2>
          <RequestStatusFlow status={request.status} />
        </section>

        {request.admin_note ? (
          <section className="rounded-2xl border border-border/70 bg-slate-50 p-6">
            <h2 className="text-sm font-semibold text-muted-foreground">
              운영자 답변
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {request.admin_note}
            </p>
          </section>
        ) : null}

        {request.status === "completed" ? (
          <section className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
            <p className="font-semibold text-emerald-900">
              요청하신 기능이 추가되었습니다.
            </p>
            {request.result_url ? (
              <Button asChild className="mt-4 rounded-xl">
                <Link href={request.result_url}>
                  기능 사용하기
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            ) : null}
          </section>
        ) : null}
      </div>
    </SiteLayout>
  )
}
