import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { AiGenerator } from "@/components/ai/AiGenerator"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import {
  AI_CATEGORY_BADGE_CLASS,
  AI_CATEGORY_MAP,
} from "@/data/ai/categories"
import type { AiTool } from "@/lib/ai/types"
import { cn } from "@/lib/utils"

interface AiToolPageProps {
  tool: AiTool
}

export function AiToolPage({ tool }: AiToolPageProps) {
  const category = AI_CATEGORY_MAP[tool.category]

  return (
    <SiteLayout>
      <PageHeader title={tool.title} description={tool.description} />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/ai"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="size-4" />
          AI 생성기 목록
        </Link>

        <div className="mt-6">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              AI_CATEGORY_BADGE_CLASS[tool.category]
            )}
          >
            {category.label}
          </span>
        </div>

        <div className="mt-8">
          <AiGenerator toolId={tool.id} />
        </div>
      </div>
    </SiteLayout>
  )
}
