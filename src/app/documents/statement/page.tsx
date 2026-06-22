import { Suspense } from "react"
import type { Metadata } from "next"

import { StatementGenerator } from "@/components/statement/statement-generator"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "무료 거래명세서 생성기 | 사장만",
  description:
    "거래처와 품목 정보를 입력하고 회사 직인을 넣어 거래명세서를 PDF로 다운로드하세요.",
}

export default function StatementPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="무료 거래명세서 생성기"
        description="거래처와 품목 정보를 입력하고 회사 직인을 넣어 거래명세서를 PDF로 다운로드하세요."
      />
      <Suspense fallback={<div className="px-4 py-10 text-sm text-muted-foreground">문서를 불러오는 중...</div>}>
        <StatementGenerator />
      </Suspense>
    </SiteLayout>
  )
}
