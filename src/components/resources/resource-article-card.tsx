import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  RESOURCE_CATEGORY_BADGE_CLASS,
  RESOURCE_CATEGORY_MAP,
} from "@/data/resources/categories"
import type { ResourceArticleMeta } from "@/lib/resources/types"
import { cn } from "@/lib/utils"

interface ResourceArticleCardProps {
  article: ResourceArticleMeta
  className?: string
}

export function ResourceArticleCard({
  article,
  className,
}: ResourceArticleCardProps) {
  const category = RESOURCE_CATEGORY_MAP[article.category]

  return (
    <Link
      href={`/resources/${article.slug}`}
      className={cn("group block h-full", className)}
    >
      <Card className="h-full border-0 py-0 shadow-sm ring-1 ring-border/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-primary/20">
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-center justify-between gap-3">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                RESOURCE_CATEGORY_BADGE_CLASS[article.category]
              )}
            >
              {category.label}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3.5" />
              {article.readingMinutes}분
            </span>
          </div>
          <h2 className="mt-4 text-base font-semibold text-foreground group-hover:text-primary">
            {article.title}
          </h2>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
            {article.description}
          </p>
          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
            자세히 보기
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
