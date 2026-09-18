import { OPERATOR_NAME, SITE_NAME, SITE_URL } from "@/lib/site-config"

const SITE_DESCRIPTION =
  "자영업자·소상공인이 운영에 필요한 숫자와 정보를 빠르게 확인할 수 있는 무료 실무 도구"

export function buildOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    parentOrganization: {
      "@type": "Organization",
      name: OPERATOR_NAME,
    },
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
      parentOrganization: {
        "@type": "Organization",
        name: OPERATOR_NAME,
      },
    },
  }
}
