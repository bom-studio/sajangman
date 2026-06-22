"use client"

import { MypagePageHeader } from "@/components/auth/mypage-page-header"
import { DocumentList } from "@/components/documents/document-list"
import {
  DOCUMENT_TYPE_CONFIG_MAP,
  type DocumentType,
} from "@/types/documents"

interface DocumentListPageProps {
  documentType: DocumentType
}

export function DocumentListPage({ documentType }: DocumentListPageProps) {
  const config = DOCUMENT_TYPE_CONFIG_MAP[documentType]

  return (
    <div>
      <MypagePageHeader
        title={`저장된 ${config.label}`}
        description={`클라우드에 저장한 ${config.label}를 조회하고 관리할 수 있습니다.`}
      />
      <DocumentList documentType={documentType} />
    </div>
  )
}
