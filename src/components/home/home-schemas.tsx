import Script from "next/script"

import {
  buildOrganizationSchema,
  buildWebSiteSchema,
} from "@/lib/home/schema"

export function HomeSchemas() {
  const schemas = [buildWebSiteSchema(), buildOrganizationSchema()]

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`home-schema-${index}`}
          id={`home-schema-${index}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
