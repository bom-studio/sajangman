import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { SocialInsuranceCalculator } from "@/components/calculators/social-insurance-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/social-insurance")

export const metadata: Metadata = {
  title: "4대보험 계산기 | 사장만",
  description:
    "월급 기준 국민연금, 건강보험, 장기요양보험, 고용보험 근로자·사업주 부담금을 계산합니다.",
  keywords: [
    "4대보험 계산기",
    "국민연금",
    "건강보험",
    "고용보험",
    "사장만",
  ],
}

export default function SocialInsuranceCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="4대보험 계산기"
        description="월급 기준 국민연금, 건강보험, 장기요양보험, 고용보험을 계산합니다."
      />
      <SocialInsuranceCalculator />
    </SiteLayout>
  )
}
