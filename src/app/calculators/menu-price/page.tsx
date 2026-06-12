import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { MenuPriceCalculator } from "@/components/calculators/menu-price-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/menu-price")

export const metadata: Metadata = {
  title: "메뉴 가격 계산기 | 사장만",
  description:
    "원가와 목표 마진율을 기준으로 권장 판매가를 계산합니다.",
  keywords: [
    "메뉴 가격 계산기",
    "메뉴 가격 책정",
    "목표 마진율",
    "음식점 메뉴 가격",
    "사장만",
  ],
}

export default function MenuPriceCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
        howTo={SEO.howTo}
      />
      <CalculatorHeader
        title="메뉴 가격 계산기"
        description="원가와 목표 마진율을 기준으로 권장 판매가를 계산합니다."
      />
      <MenuPriceCalculator />
    </SiteLayout>
  )
}
