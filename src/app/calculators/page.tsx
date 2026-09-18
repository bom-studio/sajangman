import type { Metadata } from "next"
import { Suspense } from "react"

import { CalculatorHub } from "@/components/calculators/calculator-hub"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { SITE_NAME } from "@/lib/site-config"

export const metadata: Metadata = {
  title: "사장님 계산기 모음 | 원가율·객단가·배달마진·부가세 | 사장만",
  description:
    "자영업자·소상공인을 위한 무료 계산기. 원가율, 객단가, 배달 마진, 부가세, 손익분기점, 종합소득세 등을 바로 계산하세요.",
  alternates: { canonical: "/calculators" },
  openGraph: {
    title: `사장님 계산기 모음 | ${SITE_NAME}`,
    description:
      "원가율·객단가·배달 마진·부가세·손익분기점 계산기를 무료로 이용하세요.",
    url: "/calculators",
    type: "website",
  },
}

export default function CalculatorsPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="계산기"
        description="노무·세금·배달·창업·매출관리 카테고리별로 필요한 계산기를 찾고, 바로 결과를 확인하세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="h-40 animate-pulse rounded-2xl bg-slate-100" />
          }
        >
          <CalculatorHub />
        </Suspense>
      </div>
    </SiteLayout>
  )
}
