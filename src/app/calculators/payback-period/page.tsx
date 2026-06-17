import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { PaybackPeriodCalculator } from "@/components/calculators/payback-period-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/payback-period")

export const metadata: Metadata = {
  title: "투자금 회수기간 계산기 | 사장만",
  description:
    "창업비용과 월 순이익을 입력하면 투자금 회수까지 걸리는 기간을 계산할 수 있습니다.",
  keywords: [
    "투자금 회수기간 계산기",
    "회수기간",
    "창업비용",
    "투자금",
    "손익분기",
    "사장만",
  ],
}

export default function PaybackPeriodCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="투자금 회수기간 계산기"
        description="창업비용과 월 순이익을 입력하면 투자금 회수까지 걸리는 기간을 계산할 수 있습니다."
      />
      <PaybackPeriodCalculator />
    </SiteLayout>
  )
}
