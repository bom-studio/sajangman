import type { Metadata } from "next"

import { EstimateGenerator } from "@/components/estimate/estimate-generator"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "견적서 작성기 | 사장만",
  description:
    "공급자와 고객 정보, 품목을 입력하고 회사 직인을 넣어 견적서를 PDF로 다운로드하세요.",
}

export default function EstimatePage() {
  return (
    <SiteLayout>
      <PageHeader
        title="견적서 작성기"
        description="공급자와 고객 정보, 품목을 입력하고 회사 직인을 넣어 견적서를 PDF로 다운로드하세요."
      />
      <EstimateGenerator />
    </SiteLayout>
  )
}
