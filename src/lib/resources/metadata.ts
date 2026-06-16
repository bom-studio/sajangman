import type { Metadata } from "next"

import { RESOURCE_CATEGORY_MAP } from "@/data/resources/categories"
import {
  RESOURCE_CATEGORY_SEO_KEYWORDS,
  RESOURCE_COMMON_SEO_KEYWORDS,
  RESOURCE_SEO_KEYWORDS,
} from "@/data/resources/seo-keywords"
import type { ResourceArticle } from "@/lib/resources/types"
import { SITE_NAME, SITE_URL } from "@/lib/site-config"

export function getResourceCanonicalUrl(slug: string): string {
  return `${SITE_URL}/resources/${slug}`
}

export function buildResourceKeywords(article: ResourceArticle): string[] {
  const slugKeywords = RESOURCE_SEO_KEYWORDS[article.slug] ?? []
  const categoryKeywords =
    RESOURCE_CATEGORY_SEO_KEYWORDS[article.category] ?? []
  const categoryLabel = RESOURCE_CATEGORY_MAP[article.category].label

  return Array.from(
    new Set([
      article.title,
      categoryLabel,
      ...slugKeywords,
      ...categoryKeywords,
      ...RESOURCE_COMMON_SEO_KEYWORDS,
    ])
  )
}

export function buildResourceArticleMetadata(article: ResourceArticle): Metadata {
  const canonical = getResourceCanonicalUrl(article.slug)
  const title = `${article.title} | ${SITE_NAME}`
  const description = article.excerpt || article.description
  const keywords = buildResourceKeywords(article)
  const categoryLabel = RESOURCE_CATEGORY_MAP[article.category].label

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      siteName: SITE_NAME,
      locale: "ko_KR",
      publishedTime: article.publishedAt,
      modifiedTime: article.publishedAt,
      section: categoryLabel,
      tags: keywords.slice(0, 8),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: categoryLabel,
  }
}
