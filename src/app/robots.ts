import type { MetadataRoute } from "next"

import { SITE_URL } from "@/lib/site-config"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/ai/", "/ai"],
    },
    sitemap: `${SITE_URL.replace(/\/$/, "")}/sitemap.xml`,
  }
}
