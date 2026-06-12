import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { CostRateCalculator } from "@/components/calculators/cost-rate-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/cost-rate")

export const metadata: Metadata = {
  title: "원가율 계산기 | 사장만",
  description:
    "판매가와 원가를 입력해 원가율과 마진율을 계산합니다.",
  keywords: [
    "원가율 계산기",
    "원가율",
    "마진율",
    "음식점 원가율",
    "사장만",
  ],
}

export default function CostRateCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
        howTo={SEO.howTo}
      />
      <CalculatorHeader
        title="원가율 계산기"
        description="판매가와 원가를 입력해 원가율과 마진율을 계산합니다."
      />
      <CostRateCalculator />
    </SiteLayout>
  )
}
