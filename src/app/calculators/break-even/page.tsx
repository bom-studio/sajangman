import type { Metadata } from "next"

import { BreakEvenCalculator } from "@/components/calculators/break-even-calculator"
import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/break-even")

export const metadata: Metadata = {
  title: "손익분기점 계산기 | 사장만",
  description:
    "고정비, 판매가, 변동비를 입력하고 손익분기점 판매수량과 손익분기점 매출을 계산해보세요.",
  keywords: [
    "손익분기점 계산기",
    "BEP 계산기",
    "손익분기점 공식",
    "자영업 손익분기점",
    "음식점 손익분기점",
    "쇼핑몰 손익분기점",
    "사장만",
  ],
}

export default function BreakEvenCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
        howTo={SEO.howTo}
      />
      <CalculatorHeader
        title="손익분기점 계산기"
        description="고정비, 판매가격, 변동비를 입력하여 손익분기점과 예상 수익을 계산하세요."
      />
      <BreakEvenCalculator />
    </SiteLayout>
  )
}
