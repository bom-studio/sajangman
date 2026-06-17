import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { SalesGoalCalculator } from "@/components/calculators/sales-goal-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/sales-goal")

export const metadata: Metadata = {
  title: "목표 매출 계산기 | 사장만",
  description:
    "원하는 순이익을 입력하면 필요한 월 매출과 하루 매출 목표를 계산할 수 있습니다.",
  keywords: [
    "목표 매출 계산기",
    "목표 매출",
    "월 매출 목표",
    "객단가",
    "순이익",
    "사장만",
  ],
}

export default function SalesGoalCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="목표 매출 계산기"
        description="원하는 순이익을 입력하면 필요한 월 매출과 하루 매출 목표를 계산할 수 있습니다."
      />
      <SalesGoalCalculator />
    </SiteLayout>
  )
}
