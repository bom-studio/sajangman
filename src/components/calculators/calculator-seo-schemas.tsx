import Script from "next/script"

import type { CalculatorFaqItem } from "@/components/calculators/calculator-faq"
import type { HowToSchemaInput } from "@/lib/calculators/seo/schema"
import {
  buildBreadcrumbSchema,
  buildFaqPageSchema,
  buildHowToSchema,
} from "@/lib/calculators/seo/schema"

interface CalculatorSeoSchemasProps {
  calculatorName: string
  calculatorHref: string
  faqItems: CalculatorFaqItem[]
  howTo?: HowToSchemaInput
}

export function CalculatorSeoSchemas({
  calculatorName,
  calculatorHref,
  faqItems,
  howTo,
}: CalculatorSeoSchemasProps) {
  const schemas = [
    buildBreadcrumbSchema(calculatorName, calculatorHref),
    buildFaqPageSchema(faqItems, calculatorHref),
    ...(howTo ? [buildHowToSchema(howTo, calculatorHref)] : []),
  ]

  return (
    <>
      {schemas.map((schema, index) => (
        <Script
          key={`${calculatorHref}-schema-${index}`}
          id={`${calculatorHref.replace(/\//g, "-")}-schema-${index}`}
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  )
}
