import type { Metadata } from "next"

import { DocumentListPage } from "@/components/documents/document-list-page"

export const metadata: Metadata = {
  title: "저장된 발주서 | 문서관리 | 사장만",
  description: "저장된 발주서를 확인하고 관리하세요.",
}

export default function SavedPurchaseOrdersPage() {
  return <DocumentListPage documentType="purchase_order" />
}
