import Link from "next/link"
import { ArrowRight, BookOpen } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { getResourceArticlesByCalculatorHref } from "@/data/resources"
import { cn } from "@/lib/utils"

interface RelatedResourceGuidesProps {
  calculatorHref: string
  className?: string
}

export function RelatedResourceGuides({
  calculatorHref,
  className,
}: RelatedResourceGuidesProps) {
  const articles = getResourceArticlesByCalculatorHref(calculatorHref)

  if (articles.length === 0) return null

  return (
    <section className={cn("border-t border-slate-200 pt-12", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        관련 가이드
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        계산 전·후에 함께 읽으면 도움이 되는 자료실 글입니다.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/resources/${article.slug}`}
            className="group block h-full"
          >
            <Card className="h-full gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white py-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-md">
              <CardContent className="flex h-full items-start gap-4 p-5 sm:p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <BookOpen className="size-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-semibold text-foreground">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {article.description}
                  </p>
                </div>
                <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
