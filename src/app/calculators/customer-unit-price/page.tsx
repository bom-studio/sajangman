import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { CustomerUnitPriceCalculator } from "@/components/calculators/customer-unit-price-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/customer-unit-price")

export const metadata: Metadata = {
  title: "객단가 계산기 | 사장만",
  description:
    "매출과 고객 수를 입력하면 평균 객단가와 목표 매출 달성에 필요한 고객 수를 계산할 수 있습니다.",
  keywords: [
    "객단가 계산기",
    "객단가",
    "평균 객단가",
    "AOV",
    "매출 목표",
    "사장만",
  ],
}

export default function CustomerUnitPriceCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="객단가 계산기"
        description="매출과 고객 수를 입력하면 평균 객단가와 목표 매출 달성에 필요한 고객 수를 계산할 수 있습니다."
      />
      <CustomerUnitPriceCalculator />
    </SiteLayout>
  )
}
