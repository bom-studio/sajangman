import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { CardFeeCalculator } from "@/components/calculators/card-fee-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/card-fee")

export const metadata: Metadata = {
  title: "카드 수수료 계산기 | 사장만",
  description:
    "카드 매출과 수수료율을 입력하면 실제 정산금액을 계산할 수 있습니다.",
  keywords: [
    "카드 수수료 계산기",
    "카드 수수료",
    "정산금액",
    "영세가맹점",
    "부가세",
    "사장만",
  ],
}

export default function CardFeeCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="카드 수수료 계산기"
        description="카드 매출과 수수료율을 입력하면 실제 정산금액을 계산할 수 있습니다."
      />
      <CardFeeCalculator />
    </SiteLayout>
  )
}
