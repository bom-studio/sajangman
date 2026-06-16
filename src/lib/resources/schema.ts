import { getResourceContentBySlug, getResourceSectionsFromContent } from "@/data/resource-content"
import { RESOURCE_CATEGORY_MAP } from "@/data/resources/categories"
import { buildResourceKeywords } from "@/lib/resources/metadata"
import { SITE_NAME, SITE_URL } from "@/lib/site-config"
import type { ResourceArticle } from "@/lib/resources/types"

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

function getArticleSectionTitles(article: ResourceArticle): string[] {
  const contentSections = getResourceSectionsFromContent(article.slug)
  if (contentSections && contentSections.length > 0) {
    return contentSections.map((section) => section.title)
  }

  return article.sections.map((section) => section.title)
}

function getArticleWordCount(article: ResourceArticle): number {
  const content = getResourceContentBySlug(article.slug)
  const text = content ?? `${article.excerpt} ${article.description}`
  return text.replace(/\s/g, "").length
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
  const keywords = buildResourceKeywords(article)
  const categoryLabel = RESOURCE_CATEGORY_MAP[article.category].label

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": url,
    headline: article.title,
    name: article.title,
    description: article.excerpt || article.description,
    datePublished: article.publishedAt,
    dateModified: article.publishedAt,
    inLanguage: "ko-KR",
    isAccessibleForFree: true,
    keywords: keywords.join(", "),
    wordCount: getArticleWordCount(article),
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/favicon.ico"),
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    url,
    timeRequired: `PT${article.readTime}M`,
    articleSection: getArticleSectionTitles(article),
    about: {
      "@type": "Thing",
      name: categoryLabel,
    },
  }
}

export function buildResourceOpenGraph(article: ResourceArticle) {
  const url = absoluteUrl(`/resources/${article.slug}`)

  return {
    title: `${article.title} | ${SITE_NAME}`,
    description: article.excerpt || article.description,
    url,
    type: "article" as const,
    publishedTime: article.publishedAt,
    modifiedTime: article.publishedAt,
    section: RESOURCE_CATEGORY_MAP[article.category].label,
  }
}
