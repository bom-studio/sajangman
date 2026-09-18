import type { Metadata } from "next"

import { DeliveryNoteGenerator } from "@/components/delivery-note/delivery-note-generator"
import { DocumentToolSeo } from "@/components/documents/document-tool-seo"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { buildDocumentMetadata } from "@/lib/seo/metadata"

export const metadata: Metadata = buildDocumentMetadata({
  path: "/documents/delivery-note",
  title: "납품서 생성기 | 무료 납품서 작성 및 PDF 다운로드 | 사장만",
  description:
    "거래처 납품서를 온라인으로 작성하고 PDF로 저장하세요. 제조업, 인쇄업, 식자재 납품업체, 도소매 사업자를 위한 무료 납품서 생성기입니다.",
  keywords: [
    "납품서 생성기",
    "납품서 작성",
    "납품서 PDF",
    "B2B 납품서",
    "사장만",
  ],
})

export default function DeliveryNotePage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "문서작성", href: "/documents" },
          { label: "납품서" },
        ]}
      />
      <PageHeader
        title="납품서 생성기"
        description="거래처에 제출할 납품서를 작성하고 PDF로 저장할 수 있습니다."
      />
      <DeliveryNoteGenerator />
      <DocumentToolSeo href="/documents/delivery-note" />
    </SiteLayout>
  )
}
