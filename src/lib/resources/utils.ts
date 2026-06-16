import { CALCULATOR_REGISTRY } from "@/lib/calculators/registry"
import type { ResourceArticle, ResourceArticleMeta } from "@/lib/resources/types"

export function toArticleMeta(article: ResourceArticle): ResourceArticleMeta {
  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    description: article.description,
    category: article.category,
    readTime: article.readTime,
    readingMinutes: article.readTime,
    featured: article.featured,
    publishedAt: article.publishedAt,
    calculatorHref: article.calculatorHref,
    relatedSlugs: article.relatedSlugs,
  }
}

export function getCalculatorByHref(href: string) {
  return CALCULATOR_REGISTRY.find((item) => item.href === href)
}
