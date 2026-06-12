import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { VatCalculator } from "@/components/calculators/vat-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/vat")

export const metadata: Metadata = {
  title: "부가세 계산기 | 사장만",
  description:
    "공급가액과 부가세 포함 금액을 기준으로 부가세를 쉽고 빠르게 계산하세요.",
  keywords: [
    "부가세 계산기",
    "부가세",
    "공급가액",
    "합계금액",
    "부가세 10%",
    "사장만",
  ],
}

export default function VatCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
        howTo={SEO.howTo}
      />
      <CalculatorHeader
        title="부가세 계산기"
        description="공급가액과 부가세 포함 금액을 기준으로 부가세를 쉽고 빠르게 계산하세요."
      />
      <VatCalculator />
    </SiteLayout>
  )
}
