import type { MetadataRoute } from "next"

import { getAllResourceArticles } from "@/data/resources"
import { SITE_URL } from "@/lib/site-config"

const STATIC_PATHS = [
  "/",
  "/calculators",
  "/documents",
  "/resources",
] as const

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({
    url: path === "/" ? SITE_URL : `${SITE_URL}${path}`,
  }))

  const resourceEntries: MetadataRoute.Sitemap = getAllResourceArticles().map(
    (article) => ({
      url: `${SITE_URL}/resources/${article.slug}`,
      lastModified: article.publishedAt,
    })
  )

  return [...staticEntries, ...resourceEntries]
}
