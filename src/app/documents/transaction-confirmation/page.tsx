import { Suspense } from "react"
import type { Metadata } from "next"

import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { TransactionConfirmationGenerator } from "@/components/transaction-confirmation/transaction-confirmation-generator"

export const metadata: Metadata = {
  title: "거래확인서 생성기 | 무료 거래확인서 작성 및 PDF 다운로드 | 사장만",
  description:
    "공급자와 거래처 간 거래 내역을 확인하는 거래확인서를 온라인으로 작성하고 PDF로 저장하세요.",
  keywords: [
    "거래확인서 생성기",
    "거래확인서 작성",
    "거래확인서 PDF",
    "B2B 거래확인",
    "사장만",
  ],
}

export default function TransactionConfirmationPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="거래확인서 생성기"
        description="거래 내역을 정리하여 거래확인서를 작성하고 PDF로 저장할 수 있습니다."
      />
      <Suspense fallback={<div className="px-4 py-10 text-sm text-muted-foreground">문서를 불러오는 중...</div>}>
        <TransactionConfirmationGenerator />
      </Suspense>
    </SiteLayout>
  )
}
