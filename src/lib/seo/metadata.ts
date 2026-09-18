import type { Metadata } from "next"

import { SITE_NAME, SITE_URL } from "@/lib/site-config"

export function buildCalculatorMetadata(input: {
  path: string
  title: string
  description: string
  keywords?: string[]
}): Metadata {
  const url = `${SITE_URL}${input.path}`
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      type: "website",
      siteName: SITE_NAME,
    },
  }
}

export function buildDocumentMetadata(input: {
  path: string
  title: string
  description: string
  keywords?: string[]
}): Metadata {
  return buildCalculatorMetadata(input)
}
