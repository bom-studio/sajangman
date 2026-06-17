import type { Metadata } from "next"

import { DeliveryNoteGenerator } from "@/components/delivery-note/delivery-note-generator"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
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
}

export default function DeliveryNotePage() {
  return (
    <SiteLayout>
      <PageHeader
        title="납품서 생성기"
        description="거래처에 제출할 납품서를 작성하고 PDF로 저장할 수 있습니다."
      />
      <DeliveryNoteGenerator />
    </SiteLayout>
  )
}
