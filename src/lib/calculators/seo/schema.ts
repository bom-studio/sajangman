import type { CalculatorFaqItem } from "@/components/calculators/calculator-faq"
import { SITE_NAME, SITE_URL } from "@/lib/site-config"

import { faqItemsToSchemaEntries } from "./faq-text"

export interface HowToStep {
  name: string
  text: string
}

export interface HowToSchemaInput {
  name: string
  description: string
  steps: HowToStep[]
}

function absoluteUrl(path: string): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`
}

export function buildBreadcrumbSchema(calculatorName: string, calculatorHref: string) {
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
        name: "계산기",
        item: absoluteUrl("/calculators"),
      },
      {
        "@type": "ListItem",
        position: 3,
        name: calculatorName,
        item: absoluteUrl(calculatorHref),
      },
    ],
  }
}

export function buildFaqPageSchema(
  faqItems: CalculatorFaqItem[],
  pageUrl: string
) {
  const entries = faqItemsToSchemaEntries(faqItems)

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: entries.map((entry) => ({
      "@type": "Question",
      name: entry.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: entry.answer,
      },
    })),
    url: absoluteUrl(pageUrl),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  }
}

export function buildHowToSchema(
  input: HowToSchemaInput,
  pageUrl: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    step: input.steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
    url: absoluteUrl(pageUrl),
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
    },
  }
}
