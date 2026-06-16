import type { ReactNode } from "react"
import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { AiToolCard } from "@/components/ai/AiToolCard"
import { ResourceArticleCard } from "@/components/resources/resource-article-card"
import { Card, CardContent } from "@/components/ui/card"
import type { AiTool } from "@/lib/ai/types"
import type { CalculatorListItem } from "@/data/calculators"
import type { ResourceArticleMeta } from "@/lib/resources/types"
import { cn } from "@/lib/utils"

interface ResourceDetailRelatedSectionsProps {
  calculators: CalculatorListItem[]
  resources: ResourceArticleMeta[]
  aiTools: AiTool[]
  className?: string
}

function RelatedSection({
  title,
  description,
  children,
  className,
}: {
  title: string
  description: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("border-t border-slate-200 pt-12", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function RelatedCalculatorCard({
  calculator,
}: {
  calculator: CalculatorListItem
}) {
  const Icon = calculator.icon

  return (
    <Link href={calculator.href} className="group block h-full">
      <Card className="h-full gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white py-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
        <CardContent className="flex h-full items-start gap-4 p-5 sm:p-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-foreground group-hover:text-primary">
              {calculator.title}
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {calculator.description}
            </p>
          </div>
          <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </CardContent>
      </Card>
    </Link>
  )
}

export function ResourceDetailRelatedSections({
  calculators,
  resources,
  aiTools,
  className,
}: ResourceDetailRelatedSectionsProps) {
  if (
    calculators.length === 0 &&
    resources.length === 0 &&
    aiTools.length === 0
  ) {
    return null
  }

  return (
    <div className={cn("space-y-0", className)}>
      {calculators.length > 0 ? (
        <RelatedSection
          title="관련 계산기"
          description="이 자료와 함께 쓰면 좋은 계산기입니다."
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {calculators.map((calculator) => (
              <RelatedCalculatorCard
                key={calculator.href}
                calculator={calculator}
              />
            ))}
          </div>
        </RelatedSection>
      ) : null}

      {resources.length > 0 ? (
        <RelatedSection
          title="관련 자료"
          description="함께 읽으면 도움이 되는 가이드입니다."
        >
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {resources.map((article) => (
              <ResourceArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </RelatedSection>
      ) : null}

      {aiTools.length > 0 ? (
        <RelatedSection
          title="관련 AI 도구"
          description="읽은 내용을 바로 실무에 적용할 수 있는 AI 도구입니다."
        >
          <div className="mb-4 flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            <span>몇 초 만에 문구를 생성해 보세요.</span>
          </div>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {aiTools.map((tool) => (
              <AiToolCard key={tool.href} tool={tool} />
            ))}
          </div>
        </RelatedSection>
      ) : null}
    </div>
  )
}
