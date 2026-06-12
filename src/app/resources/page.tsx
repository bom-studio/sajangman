import type { Metadata } from "next"

import { PageHeader } from "@/components/page-header"
import { ResourceHub } from "@/components/resources/resource-hub"
import { SiteLayout } from "@/components/site-layout"
import { getAllResourceArticleMetas } from "@/data/resources"
import { SITE_NAME } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "자료실 | 사장만",
  description:
    "세금, 노무, 배달, 창업, 매출관리 가이드를 모은 사장만 자료실. 주휴수당, 부가세, 원가율, 손익분기점 등 소상공인 실무 콘텐츠 허브입니다.",
  openGraph: {
    title: `자료실 | ${SITE_NAME}`,
    description:
      "소상공인·자영업자를 위한 실무 가이드와 계산기 연동 자료를 한곳에서 확인하세요.",
    url: "/resources",
    type: "website",
  },
}

export default function ResourcesPage() {
  const articles = getAllResourceArticleMetas()

  return (
    <SiteLayout>
      <PageHeader
        title="자료실"
        description="세금·노무·배달·창업·매출관리 가이드를 모았습니다. 검색하고 읽은 뒤 관련 계산기로 바로 이어가 보세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <ResourceHub articles={articles} />
      </div>
    </SiteLayout>
  )
}
