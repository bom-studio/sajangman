import { Suspense } from "react"
import type { Metadata } from "next"

import { PageHeader } from "@/components/page-header"
import { QuoteRequestGenerator } from "@/components/quote-request/quote-request-generator"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "견적 요청서 생성기 | 무료 RFQ 작성 및 PDF 다운로드 | 사장만",
  description:
    "거래처에 보낼 견적 요청서(RFQ)를 작성하고 PDF로 저장하세요. 제품, 서비스, 인쇄물, 웹사이트 제작 등 다양한 업종에서 사용할 수 있습니다.",
  keywords: [
    "견적 요청서",
    "RFQ",
    "견적 요청서 생성기",
    "견적 요청 PDF",
    "사장만",
  ],
}

export default function QuoteRequestPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="견적 요청서 생성기"
        description="거래처에 견적을 요청하기 위한 견적 요청서를 작성하고 PDF로 저장할 수 있습니다."
      />
      <Suspense fallback={<div className="px-4 py-10 text-sm text-muted-foreground">문서를 불러오는 중...</div>}>
        <QuoteRequestGenerator />
      </Suspense>
    </SiteLayout>
  )
}
