import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "거래명세서 생성기 | 사장만",
  description: "공급자와 품목 정보를 입력해 거래명세서를 작성합니다.",
}

export default function StatementPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="거래명세서 생성기"
        description="공급자와 품목 정보를 입력해 거래명세서를 작성합니다."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ComingSoon />
      </div>
    </SiteLayout>
  )
}
