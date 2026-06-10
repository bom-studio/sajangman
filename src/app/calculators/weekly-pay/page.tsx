import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "주휴수당 계산기 | 사장만",
  description: "시급과 근무시간을 입력하면 주휴수당과 예상 주급을 계산합니다.",
}

export default function WeeklyPayPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="주휴수당 계산기"
        description="시급과 근무시간을 입력하면 주휴수당과 예상 주급을 계산합니다."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ComingSoon />
      </div>
    </SiteLayout>
  )
}
