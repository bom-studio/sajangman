import type { Metadata } from "next"

import { DocumentListPage } from "@/components/documents/document-list-page"

export const metadata: Metadata = {
  title: "저장된 견적 요청서 | 문서관리 | 사장만",
  description: "저장된 견적 요청서를 확인하고 관리하세요.",
}

export default function SavedQuoteRequestsPage() {
  return <DocumentListPage documentType="quote_request" />
}
