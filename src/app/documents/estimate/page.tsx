import type { Metadata } from "next"

import { DocumentToolSeo } from "@/components/documents/document-tool-seo"
import { EstimateGenerator } from "@/components/estimate/estimate-generator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { buildDocumentMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = buildDocumentMetadata({
  path: "/documents/estimate",
  title: "견적서 작성기 | 무료 견적서 PDF | 사장만",
  description:
    "공급자·고객·품목을 입력하고 직인을 넣어 견적서를 작성한 뒤 PDF로 저장하세요. 회원가입 없이 바로 이용할 수 있습니다.",
})

export default function EstimatePage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "문서작성", href: "/documents" },
          { label: "견적서" },
        ]}
      />
      <PageHeader
        title="견적서 작성기"
        description="공급자와 고객 정보, 품목을 입력하고 회사 직인을 넣어 견적서를 PDF로 다운로드하세요."
      />
      <EstimateGenerator />
      <DocumentToolSeo href="/documents/estimate" />
    </SiteLayout>
  )
}
