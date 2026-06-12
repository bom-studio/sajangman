import { SITE_NAME, SITE_URL } from "@/lib/site-config"
import type { ResourceArticle } from "@/lib/resources/types"
import { estimateReadingMinutes } from "@/lib/resources/utils"

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function buildResourceBreadcrumbSchema(
  articleTitle: string,
  slug: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "자료실",
        item: absoluteUrl("/resources"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: articleTitle,
        item: absoluteUrl(`/resources/${slug}`),
      },
    ],
  }
}

export function buildArticleSchema(article: ResourceArticle) {
  const url = absoluteUrl(`/resources/${article.slug}`)

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    author: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    timeRequired: `PT${estimateReadingMinutes(article)}M`,
    articleSection: article.sections.map((section) => section.title),
  }
}

export function buildResourceOpenGraph(article: ResourceArticle) {
  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.description,
    url: absoluteUrl(`/resources/${article.slug}`),
    type: "article" as const,
    publishedTime: article.publishedAt,
  }
}
