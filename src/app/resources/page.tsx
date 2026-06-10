import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "자료실 | 사장만",
  description: "소상공인과 자영업자를 위한 업무 자료와 가이드를 모았습니다.",
}

export default function ResourcesPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="자료실"
        description="소상공인과 자영업자를 위한 업무 자료와 가이드를 모았습니다."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ComingSoon message="자료실 콘텐츠를 준비 중입니다." />
      </div>
    </SiteLayout>
  )
}
