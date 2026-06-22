import type { Metadata } from "next"

import { DocumentListPage } from "@/components/documents/document-list-page"

export const metadata: Metadata = {
  title: "저장된 거래확인서 | 문서관리 | 사장만",
  description: "저장된 거래확인서를 확인하고 관리하세요.",
}

export default function SavedTransactionConfirmationsPage() {
  return <DocumentListPage documentType="transaction_confirmation" />
}
