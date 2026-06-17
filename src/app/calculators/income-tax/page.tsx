import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { IncomeTaxCalculator } from "@/components/calculators/income-tax-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/income-tax")

export const metadata: Metadata = {
  title: "종합소득세 계산기 | 사장만",
  description:
    "연간 매출, 비용, 공제금액을 입력하면 예상 종합소득세를 계산할 수 있습니다.",
  keywords: [
    "종합소득세 계산기",
    "종합소득세",
    "개인사업자 세금",
    "과세표준",
    "필요경비",
    "사장만",
  ],
}

export default function IncomeTaxCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="종합소득세 계산기"
        description="연간 매출, 비용, 공제금액을 입력하면 예상 종합소득세를 계산할 수 있습니다."
      />
      <IncomeTaxCalculator />
    </SiteLayout>
  )
}
