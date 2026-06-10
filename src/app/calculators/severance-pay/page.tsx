import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "퇴직금 계산기 | 사장만",
  description: "근무 기간과 임금을 입력하면 예상 퇴직금을 계산합니다.",
}

export default function SeverancePayPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="퇴직금 계산기"
        description="근무 기간과 임금을 입력하면 예상 퇴직금을 계산합니다."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ComingSoon />
      </div>
    </SiteLayout>
  )
}
