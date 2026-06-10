import type { Metadata } from "next"

import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "리뷰 답글 생성기 | 사장만",
  description: "고객 리뷰에 맞는 친절한 답글을 생성합니다.",
}

export default function ReviewReplyPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="리뷰 답글 생성기"
        description="고객 리뷰에 맞는 친절한 답글을 생성합니다."
      />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <ComingSoon />
      </div>
    </SiteLayout>
  )
}
