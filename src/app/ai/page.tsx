import { AiHub } from "@/components/ai/AiHub"
import { AiDisabledPage } from "@/components/ai/AiDisabledPage"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { AI_HUB_METADATA, AI_DISABLED_METADATA } from "@/lib/ai/metadata"
import { AI_FEATURES_ENABLED } from "@/lib/features"

export const metadata = AI_FEATURES_ENABLED ? AI_HUB_METADATA : AI_DISABLED_METADATA

export default function AiPage() {
  if (!AI_FEATURES_ENABLED) {
    return (
      <AiDisabledPage
        title="AI 생성기"
        description="사장님 업무를 빠르게 처리할 수 있는 AI 도구 모음입니다. 현재 준비 중입니다."
      />
    )
  }

  return (
    <SiteLayout>
      <PageHeader
        title="AI 생성기"
        description="사장님 업무를 빠르게 처리할 수 있는 AI 도구 모음입니다. 리뷰 답글, 공지사항, 이벤트 문구 등을 몇 초 만에 생성해보세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <AiHub />
      </div>
    </SiteLayout>
  )
}
