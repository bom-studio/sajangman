import { SITE_NAME, SITE_URL } from "@/lib/site-config"

const SITE_DESCRIPTION =
  "자영업자를 위한 무료 계산기, 문서작성, 자료실 플랫폼"

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  }
}

export function buildWebSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/calculators?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  }
}
