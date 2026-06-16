import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { ComingSoon } from "@/components/coming-soon"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

interface AiDisabledPageProps {
  title?: string
  description?: string
}

export function AiDisabledPage({
  title = "AI 생성기",
  description = "AI 생성기 기능을 준비 중입니다. 곧 더 편리한 도구로 찾아뵙겠습니다.",
}: AiDisabledPageProps) {
  return (
    <SiteLayout>
      <PageHeader title={title} description={description} />
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="size-4" />
          홈으로
        </Link>
        <div className="mt-8">
          <ComingSoon message="준비 중입니다. 계산기·문서작성·자료실은 지금 바로 이용하실 수 있습니다." />
        </div>
      </div>
    </SiteLayout>
  )
}
