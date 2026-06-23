import type { MetadataRoute } from "next"

import { CALCULATORS } from "@/data/calculators"
import { getAllResourceArticles } from "@/data/resources"
import { SITE_URL } from "@/lib/site-config"

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>

interface SitemapPageConfig {
  path: string
  changeFrequency: ChangeFrequency
  priority: number
  lastModified?: Date | string
}

const DOCUMENT_PAGES: SitemapPageConfig[] = [
  { path: "/documents/estimate", changeFrequency: "monthly", priority: 0.8 },
  { path: "/documents/quote-request", changeFrequency: "monthly", priority: 0.8 },
  { path: "/documents/statement", changeFrequency: "monthly", priority: 0.8 },
  { path: "/documents/purchase-order", changeFrequency: "monthly", priority: 0.8 },
  { path: "/documents/supply-contract", changeFrequency: "monthly", priority: 0.8 },
  { path: "/documents/delivery-note", changeFrequency: "monthly", priority: 0.8 },
  { path: "/documents/receipt", changeFrequency: "monthly", priority: 0.8 },
  { path: "/documents/transaction-confirmation", changeFrequency: "monthly", priority: 0.8 },
]

const STATIC_PAGES: SitemapPageConfig[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/calculators", changeFrequency: "weekly", priority: 0.9 },
  { path: "/documents", changeFrequency: "weekly", priority: 0.9 },
  { path: "/resources", changeFrequency: "weekly", priority: 0.9 },
  { path: "/privacy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
]

function getSiteUrl() {
  return SITE_URL.replace(/\/$/, "")
}

function toAbsoluteUrl(path: string): string {
  const baseUrl = getSiteUrl()
  return path === "/" ? baseUrl : `${baseUrl}${path}`
}

function toSafeDate(value?: Date | string): Date {
  if (!value) return new Date()

  const date = value instanceof Date ? value : new Date(value)

  return Number.isNaN(date.getTime()) ? new Date() : date
}

function toSitemapEntry({
  path,
  changeFrequency,
  priority,
  lastModified,
}: SitemapPageConfig): MetadataRoute.Sitemap[number] {
  return {
    url: toAbsoluteUrl(path),
    lastModified: toSafeDate(lastModified),
    changeFrequency,
    priority,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const builtAt = new Date()

  const staticEntries = STATIC_PAGES.map((page) =>
    toSitemapEntry({ ...page, lastModified: builtAt })
  )

  const calculatorEntries = CALCULATORS.map((calculator) =>
    toSitemapEntry({
      path: calculator.href,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: builtAt,
    })
  )

  const documentEntries = DOCUMENT_PAGES.map((page) =>
    toSitemapEntry({ ...page, lastModified: builtAt })
  )

  const resourceEntries = getAllResourceArticles()
    .filter((article) => article.slug)
    .map((article) =>
      toSitemapEntry({
        path: `/resources/${article.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
        lastModified: article.publishedAt,
      })
    )

  return [
    ...staticEntries,
    ...calculatorEntries,
    ...documentEntries,
    ...resourceEntries,
  ]
}