import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { MenuPriceCalculator } from "@/components/calculators/menu-price-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/menu-price"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
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
})

export default function MenuPriceCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "메뉴 가격 계산기" },
        ]}
      />
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
