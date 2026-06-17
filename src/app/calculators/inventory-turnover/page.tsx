import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { InventoryTurnoverCalculator } from "@/components/calculators/inventory-turnover-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/inventory-turnover")

export const metadata: Metadata = {
  title: "재고 회전율 계산기 | 사장만",
  description:
    "매출원가와 평균 재고액을 입력하면 재고 회전율과 재고 보유기간을 계산할 수 있습니다.",
  keywords: [
    "재고 회전율 계산기",
    "재고 회전율",
    "재고 보유일수",
    "평균 재고액",
    "매출원가",
    "사장만",
  ],
}

export default function InventoryTurnoverCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="재고 회전율 계산기"
        description="매출원가와 평균 재고액을 입력하면 재고 회전율과 재고 보유기간을 계산할 수 있습니다."
      />
      <InventoryTurnoverCalculator />
    </SiteLayout>
  )
}
