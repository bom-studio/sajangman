import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "배달 마진 계산기 | 사장만",
  description:
    "판매가와 비용을 입력하면 배달 주문의 순이익과 마진율을 계산합니다.",
}

export default function DeliveryMarginPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="배달 마진 계산기"
        description="판매가와 비용을 입력하면 배달 주문의 순이익과 마진율을 계산합니다."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ComingSoon />
      </div>
    </SiteLayout>
  )
}
