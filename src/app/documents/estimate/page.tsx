import type { Metadata } from "next"

import { EstimateGenerator } from "@/components/estimate/estimate-generator"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "견적서 작성기 | 무료 견적서 PDF | 사장만",
  description:
    "공급자·고객·품목을 입력하고 직인을 넣어 견적서를 작성한 뒤 PDF로 저장하세요. 회원가입 없이 바로 이용할 수 있습니다.",
  alternates: { canonical: "/documents/estimate" },
  openGraph: {
    title: "견적서 작성기 | 사장만",
    description:
      "공급자·고객·품목을 입력해 견적서를 만들고 PDF로 다운로드하세요.",
    url: "/documents/estimate",
    type: "website",
  },
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
