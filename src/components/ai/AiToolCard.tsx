import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  AI_CATEGORY_BADGE_CLASS,
  AI_CATEGORY_MAP,
} from "@/data/ai/categories"
import type { AiTool } from "@/lib/ai/types"
import { cn } from "@/lib/utils"

interface AiToolCardProps {
  tool: AiTool
  className?: string
}

export function AiToolCard({ tool, className }: AiToolCardProps) {
  const category = AI_CATEGORY_MAP[tool.category]

  return (
    <Link href={tool.href} className={cn("group block h-full", className)}>
      <Card className="h-full border-0 py-0 shadow-sm ring-1 ring-border/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-primary/20">
        <CardContent className="flex h-full flex-col p-6">
          <span
            className={cn(
              "inline-flex w-fit rounded-full px-2.5 py-0.5 text-xs font-medium",
              AI_CATEGORY_BADGE_CLASS[tool.category]
            )}
          >
            {category.label}
          </span>
          <h2 className="mt-4 text-base font-semibold text-foreground group-hover:text-primary">
            {tool.title}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {tool.description}
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
            바로 사용하기
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
