import type { Metadata } from "next"

import { DocumentToolSeo } from "@/components/documents/document-tool-seo"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { PageHeader } from "@/components/page-header"
import { PurchaseOrderGenerator } from "@/components/purchase-order/purchase-order-generator"
import { SiteLayout } from "@/components/site-layout"
import { buildDocumentMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = buildDocumentMetadata({
  path: "/documents/purchase-order",
  title: "발주서 생성기 | 무료 발주서 작성 및 PDF 다운로드 | 사장만",
  description:
    "거래처 발주서를 온라인으로 작성하고 PDF로 저장하세요. 음식점, 카페, 제조업, 인쇄업 등 모든 사업자가 무료로 사용할 수 있는 발주서 생성기입니다.",
  keywords: [
    "발주서 생성기",
    "발주서 작성",
    "발주서 PDF",
    "무료 발주서",
    "사장만",
  ],
})

export default function PurchaseOrderPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "문서작성", href: "/documents" },
          { label: "발주서" },
        ]}
      />
      <PageHeader
        title="발주서 생성기"
        description="거래처에 보낼 발주서를 작성하고 PDF로 저장할 수 있습니다."
      />
      <PurchaseOrderGenerator />
      <DocumentToolSeo href="/documents/purchase-order" />
    </SiteLayout>
  )
}
