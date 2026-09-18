import type { MetadataRoute } from "next"

import { CALCULATORS } from "@/data/calculators"
import { getAllResourceArticles } from "@/data/resources"
import { getTodayKST } from "@/lib/date-kst"
import { SITE_URL } from "@/lib/site-config"

type ChangeFrequency = NonNullable<
  MetadataRoute.Sitemap[number]["changeFrequency"]
>

const SITEMAP_LAST_MODIFIED = "2026-06-23"

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
  { path: "/about", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.5 },
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

function toDateString(value: Date | string): string | null {
  if (typeof value === "string") {
    const dateStr = value.slice(0, 10)
    return /^\d{4}-\d{2}-\d{2}$/.test(dateStr) ? dateStr : null
  }

  if (Number.isNaN(value.getTime())) return null

  const year = value.getFullYear()
  const month = String(value.getMonth() + 1).padStart(2, "0")
  const day = String(value.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function minDateString(a: string, b: string): string {
  return a <= b ? a : b
}

function resolveLastModified(
  value: Date | string | undefined,
  today: string
): string {
  const dateStr = value ? toDateString(value) : null
  const base = dateStr ?? SITEMAP_LAST_MODIFIED
  return minDateString(base, today)
}

function toSitemapEntry({
  path,
  changeFrequency,
  priority,
  lastModified,
}: SitemapPageConfig & { lastModified: string }): MetadataRoute.Sitemap[number] {
  return {
    url: toAbsoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const today = getTodayKST()

  const staticEntries = STATIC_PAGES.map((page) =>
    toSitemapEntry({
      ...page,
      lastModified: resolveLastModified(SITEMAP_LAST_MODIFIED, today),
    })
  )

  const calculatorEntries = CALCULATORS.map((calculator) =>
    toSitemapEntry({
      path: calculator.href,
      changeFrequency: "monthly",
      priority: 0.8,
      lastModified: resolveLastModified(SITEMAP_LAST_MODIFIED, today),
    })
  )

  const documentEntries = DOCUMENT_PAGES.map((page) =>
    toSitemapEntry({
      ...page,
      lastModified: resolveLastModified(SITEMAP_LAST_MODIFIED, today),
    })
  )

  const resourceEntries = getAllResourceArticles()
    .filter((article) => article.slug)
    .map((article) =>
      toSitemapEntry({
        path: `/resources/${article.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
        lastModified: resolveLastModified(article.publishedAt, today),
      })
    )

  return [
    ...staticEntries,
    ...calculatorEntries,
    ...documentEntries,
    ...resourceEntries,
  ]
}
