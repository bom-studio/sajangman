import { RESOURCE_ARTICLES } from "@/data/resources/articles"
import type { ResourceArticle, ResourceArticleMeta } from "@/lib/resources/types"
import { toArticleMeta } from "@/lib/resources/utils"

export { RESOURCE_ARTICLES }
export { RESOURCE_CATEGORIES, RESOURCE_CATEGORY_MAP } from "@/data/resources/categories"

export function getAllResourceArticles(): ResourceArticle[] {
  return RESOURCE_ARTICLES
}

export function getAllResourceArticleMetas(): ResourceArticleMeta[] {
  return RESOURCE_ARTICLES.map(toArticleMeta)
}

export function getResourceArticleBySlug(
  slug: string
): ResourceArticle | undefined {
  return RESOURCE_ARTICLES.find((article) => article.slug === slug)
}

export function getResourceArticlesByCalculatorHref(
  calculatorHref: string
): ResourceArticleMeta[] {
  return RESOURCE_ARTICLES.filter(
    (article) => article.calculatorHref === calculatorHref
  ).map(toArticleMeta)
}

export function getRelatedResourceArticles(
  article: ResourceArticle,
  limit = 3
): ResourceArticleMeta[] {
  const fromSlugs = article.relatedSlugs
    .map((relatedSlug) => getResourceArticleBySlug(relatedSlug))
    .filter((item): item is ResourceArticle => Boolean(item))
    .map(toArticleMeta)

  if (fromSlugs.length >= limit) {
    return fromSlugs.slice(0, limit)
  }

  const fallback = RESOURCE_ARTICLES.filter(
    (item) =>
      item.slug !== article.slug &&
      item.category === article.category &&
      !article.relatedSlugs.includes(item.slug)
  )
    .map(toArticleMeta)
    .slice(0, limit - fromSlugs.length)

  return [...fromSlugs, ...fallback].slice(0, limit)
}
