import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { MinimumWageCalculator } from "@/components/calculators/minimum-wage-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/minimum-wage")

export const metadata: Metadata = {
  title: "최저임금 계산기 | 사장만",
  description:
    "시급과 근무시간을 입력하면 최저임금 충족 여부와 예상 급여를 확인할 수 있습니다.",
  keywords: [
    "최저임금 계산기",
    "최저임금",
    "2026 최저임금",
    "시급",
    "주휴수당",
    "사장만",
  ],
}

export default function MinimumWageCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="최저임금 계산기"
        description="시급과 근무시간을 입력하면 최저임금 충족 여부와 예상 급여를 확인할 수 있습니다."
      />
      <MinimumWageCalculator />
    </SiteLayout>
  )
}
