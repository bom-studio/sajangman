import { ResourceArticleCard } from "@/components/resources/resource-article-card"
import type { ResourceArticleMeta } from "@/lib/resources/types"

interface ResourceRelatedArticlesProps {
  articles: ResourceArticleMeta[]
}

export function ResourceRelatedArticles({
  articles,
}: ResourceRelatedArticlesProps) {
  if (articles.length === 0) return null

  return (
    <section className="border-t border-slate-200 pt-12">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        관련 자료
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        함께 읽으면 도움이 되는 가이드입니다.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">
        {articles.map((article) => (
          <ResourceArticleCard key={article.slug} article={article} />
        ))}
      </div>
    </section>
  )
}
