import Link from "next/link"
import { Suspense } from "react"
import { ArrowRight, Plus } from "lucide-react"
import type { Metadata } from "next"

import { RequestCard } from "@/components/requests/request-card"
import { RequestsBottomCta } from "@/components/requests/requests-bottom-cta"
import { RequestsFilters } from "@/components/requests/requests-filters"
import { RequestsHero } from "@/components/requests/requests-hero"
import { RequestsRoadmap } from "@/components/requests/requests-roadmap"
import { RequestsStats } from "@/components/requests/requests-stats"
import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"
import {
  getCategoryCounts,
  getRequestStats,
  getRoadmapRequests,
  isRequestsStoreConfigured,
  listFeatureRequests,
  type RequestSort,
} from "@/lib/requests/queries"
import { SITE_NAME, SITE_URL } from "@/lib/site-config"
import type { FeatureRequestCategory } from "@/lib/supabase/database.types"

export const metadata: Metadata = {
  title: `기능 요청 | ${SITE_NAME}`,
  description:
    "사장만에 필요한 계산기, 문서작성, 매출관리 등 새로운 기능을 요청하고 다른 사장님들의 요청에 공감해보세요.",
  alternates: { canonical: `${SITE_URL}/requests` },
  openGraph: {
    title: `기능 요청 | ${SITE_NAME}`,
    description:
      "사장만에 필요한 기능을 요청하고 개발 로드맵을 확인해보세요.",
    url: `${SITE_URL}/requests`,
    type: "website",
    siteName: SITE_NAME,
  },
}

interface PageProps {
  searchParams: Promise<{
    page?: string
    category?: string
    sort?: string
    q?: string
  }>
}

function isCategory(value?: string): value is FeatureRequestCategory | "all" {
  return (
    !value ||
    value === "all" ||
    ["calculator", "document", "guide", "sales", "employee", "other"].includes(
      value
    )
  )
}

export default async function RequestsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const page = Math.max(1, Number(params.page) || 1)
  const category = isCategory(params.category) ? params.category : "all"
  const sort: RequestSort = params.sort === "popular" ? "popular" : "latest"
  const q = params.q?.trim() ?? ""

  const [stats, categoryCounts, list, roadmap] = await Promise.all([
    getRequestStats(),
    getCategoryCounts(),
    listFeatureRequests({
      page,
      category: category ?? "all",
      sort,
      q,
    }),
    getRoadmapRequests(),
  ])

  const configured = isRequestsStoreConfigured()

  return (
    <SiteLayout>
      <RequestsHero />

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
        <RequestsStats stats={stats} />

        {!configured ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950">
            기능 요청 데이터베이스가 아직 연결되지 않았습니다. Supabase에
            migration SQL을 실행하고 환경 변수를 확인해주세요.
          </div>
        ) : null}

        <section id="request-list" className="scroll-mt-24 space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                기능 요청 목록
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                공감이 많은 요청부터 우선 검토합니다.
              </p>
            </div>
            <Button asChild className="rounded-xl">
              <Link href="/requests/new">
                <Plus className="size-4" />
                기능 요청하기
              </Link>
            </Button>
          </div>

          <Suspense
            fallback={
              <div className="h-28 animate-pulse rounded-2xl bg-slate-100" />
            }
          >
            <RequestsFilters categoryCounts={categoryCounts} />
          </Suspense>

          {list.items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-slate-50 px-6 py-16 text-center">
              <p className="text-lg font-semibold text-foreground">
                아직 등록된 요청이 없어요.
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                첫 번째 아이디어를 알려주세요.
              </p>
              <Button asChild className="mt-6 rounded-xl">
                <Link href="/requests/new">
                  기능 요청하기
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
              {list.items.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          )}

          {list.totalPages > 1 ? (
            <nav
              className="flex items-center justify-center gap-2"
              aria-label="페이지"
            >
              {Array.from({ length: list.totalPages }, (_, index) => {
                const pageNumber = index + 1
                const query = new URLSearchParams()
                if (category && category !== "all") query.set("category", category)
                if (sort === "popular") query.set("sort", sort)
                if (q) query.set("q", q)
                if (pageNumber > 1) query.set("page", String(pageNumber))
                const href = query.toString()
                  ? `/requests?${query.toString()}`
                  : "/requests"

                return (
                  <Link
                    key={pageNumber}
                    href={href}
                    className={
                      pageNumber === list.page
                        ? "inline-flex size-10 items-center justify-center rounded-lg bg-primary text-sm font-semibold text-primary-foreground"
                        : "inline-flex size-10 items-center justify-center rounded-lg border border-border text-sm font-medium text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }
                  >
                    {pageNumber}
                  </Link>
                )
              })}
            </nav>
          ) : null}
        </section>

        <RequestsRoadmap
          planned={roadmap.planned}
          developing={roadmap.developing}
          completed={roadmap.completed}
        />

        <RequestsBottomCta />
      </div>
    </SiteLayout>
  )
}
