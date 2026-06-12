import Script from "next/script"

import {
  buildArticleSchema,
  buildResourceBreadcrumbSchema,
} from "@/lib/resources/schema"
import type { ResourceArticle } from "@/lib/resources/types"

interface ResourceArticleSchemasProps {
  article: ResourceArticle
}

export function ResourceArticleSchemas({
  article,
}: ResourceArticleSchemasProps) {
  const schemas = [
    buildArticleSchema(article),
    buildResourceBreadcrumbSchema(article.title, article.slug),
  ]

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`${article.slug}-schema-${index}`}
          id={`resource-${article.slug}-schema-${index}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
