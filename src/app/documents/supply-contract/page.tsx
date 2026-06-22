import { Suspense } from "react"
import type { Metadata } from "next"

import { PageHeader } from "@/components/page-header"
import { SupplyContractGenerator } from "@/components/supply-contract/supply-contract-generator"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "물품공급계약서 생성기 | 무료 계약서 작성 및 PDF 다운로드 | 사장만",
  description:
    "사업자 간 물품공급계약서를 온라인으로 작성하고 PDF로 저장하세요. 공급 물품, 계약기간, 대금지급, 납품장소, 검수 조건까지 무료로 작성할 수 있습니다.",
  keywords: [
    "물품공급계약서",
    "계약서 생성기",
    "공급계약서",
    "B2B 계약서",
    "PDF",
    "사장만",
  ],
}

export default function SupplyContractPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="물품공급계약서 생성기"
        description="공급자와 구매자 정보를 입력하고 공급 물품, 계약 기간, 대금 지급 조건을 설정해 물품공급계약서를 PDF로 저장할 수 있습니다."
      />
      <Suspense fallback={<div className="px-4 py-10 text-sm text-muted-foreground">문서를 불러오는 중...</div>}>
        <SupplyContractGenerator />
      </Suspense>
    </SiteLayout>
  )
}
