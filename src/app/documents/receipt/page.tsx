import type { Metadata } from "next"

import { DocumentToolSeo } from "@/components/documents/document-tool-seo"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { PageHeader } from "@/components/page-header"
import { ReceiptGenerator } from "@/components/receipt/receipt-generator"
import { SiteLayout } from "@/components/site-layout"
import { buildDocumentMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = buildDocumentMetadata({
  path: "/documents/receipt",
  title: "영수증 생성기 | 무료 영수증 작성 및 PDF 다운로드 | 사장만",
  description:
    "사업자용 영수증을 온라인으로 작성하고 PDF로 저장하세요. 품목, 수량, 단가, 공급가액을 입력하고 직인까지 삽입할 수 있습니다.",
  keywords: [
    "영수증 생성기",
    "영수증 작성",
    "영수증 PDF",
    "사업자 영수증",
    "사장만",
  ],
})

export default function ReceiptPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "문서작성", href: "/documents" },
          { label: "영수증" },
        ]}
      />
      <PageHeader
        title="영수증 생성기"
        description="공급자 정보와 품목을 입력하면 영수증을 작성하고 PDF로 저장할 수 있습니다."
      />
      <ReceiptGenerator />
      <DocumentToolSeo href="/documents/receipt" />
    </SiteLayout>
  )
}
