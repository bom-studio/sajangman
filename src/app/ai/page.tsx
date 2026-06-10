import type { Metadata } from "next"
import { MessageSquare } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { ToolLinkCard } from "@/components/tool-link-card"

export const metadata: Metadata = {
  title: "AI 생성기 | 사장만",
  description: "리뷰 답글 등 사장님 업무에 도움이 되는 AI 도구를 제공합니다.",
}

const aiTools = [
  {
    title: "리뷰 답글 생성기",
    description: "고객 리뷰에 맞는 친절한 답글을 생성합니다.",
    href: "/ai/review-reply",
    icon: MessageSquare,
  },
]

export default function AiPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="AI 생성기"
        description="리뷰 답글 등 사장님 업무에 도움이 되는 AI 도구를 바로 사용하세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:max-w-2xl">
          {aiTools.map((item) => (
            <ToolLinkCard key={item.href} {...item} />
          ))}
        </div>
      </div>
    </SiteLayout>
  )
}
