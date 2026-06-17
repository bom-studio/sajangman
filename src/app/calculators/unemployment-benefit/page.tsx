import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { UnemploymentBenefitCalculator } from "@/components/calculators/unemployment-benefit-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/unemployment-benefit")

export const metadata: Metadata = {
  title: "실업급여 계산기 | 사장만",
  description:
    "퇴사 전 평균임금, 근속기간, 나이를 입력하면 예상 실업급여를 계산할 수 있습니다.",
  keywords: [
    "실업급여 계산기",
    "실업급여",
    "구직급여",
    "고용보험",
    "퇴사",
    "사장만",
  ],
}

export default function UnemploymentBenefitCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="실업급여 계산기"
        description="퇴사 전 평균임금, 근속기간, 나이를 입력하면 예상 실업급여를 계산할 수 있습니다."
      />
      <UnemploymentBenefitCalculator />
    </SiteLayout>
  )
}
