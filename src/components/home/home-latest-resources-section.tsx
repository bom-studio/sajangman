import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HomeSectionHeader } from "@/components/home/home-section-header"
import { ResourceArticleCard } from "@/components/resources/resource-article-card"
import { Button } from "@/components/ui/button"
import { getHomeFeaturedResources } from "@/data/home"

export function HomeLatestResourcesSection() {
  const articles = getHomeFeaturedResources()

  return (
    <section className="bg-slate-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <HomeSectionHeader title="사장님이 알아두면 좋은 자료" />
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/resources">
              자료실 전체 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ResourceArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </div>
    </section>
  )
}
