import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { InventoryTurnoverCalculator } from "@/components/calculators/inventory-turnover-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { CalculatorGuideArticles } from "@/lib/calculators/seo/article-content"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/inventory-turnover"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "재고회전율 계산기 | 재고회전율 개념·계산 방법 - 사장만",
  description:
    "매출원가와 평균 재고액으로 재고회전율과 재고 보유기간을 계산하세요. 재고회전율 개념과 활용 방법도 함께 확인할 수 있습니다.",
  keywords: ["재고회전율", "재고회전율 계산기", "재고 보유기간", "재고회전율 개념"],
})

export default function InventoryTurnoverPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "재고회전율 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="재고회전율 계산기"
        description="매출원가와 평균 재고액을 입력하면 재고회전율과 재고 보유기간을 계산할 수 있습니다."
      />
      <InventoryTurnoverCalculator
        seoArticles={<CalculatorGuideArticles href={PATH} />}
      />
    </SiteLayout>
  )
}
