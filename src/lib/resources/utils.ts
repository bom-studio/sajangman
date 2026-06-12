import { CALCULATOR_REGISTRY } from "@/lib/calculators/registry"
import type { ResourceArticle, ResourceArticleMeta } from "@/lib/resources/types"

const KOREAN_READING_CHARS_PER_MINUTE = 500

export function estimateReadingMinutes(article: ResourceArticle): number {
  const text = article.sections
    .flatMap((section) => [section.title, ...section.paragraphs])
    .join("")

  return Math.max(3, Math.ceil(text.length / KOREAN_READING_CHARS_PER_MINUTE))
}

export function toArticleMeta(article: ResourceArticle): ResourceArticleMeta {
  return {
    slug: article.slug,
    title: article.title,
    description: article.description,
    category: article.category,
    publishedAt: article.publishedAt,
    calculatorHref: article.calculatorHref,
    relatedSlugs: article.relatedSlugs,
    readingMinutes: estimateReadingMinutes(article),
  }
}

export function getCalculatorByHref(href: string) {
  return CALCULATOR_REGISTRY.find((item) => item.href === href)
}
