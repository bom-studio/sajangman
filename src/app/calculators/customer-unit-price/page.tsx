import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { CustomerUnitPriceCalculator } from "@/components/calculators/customer-unit-price-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { CalculatorGuideArticles } from "@/lib/calculators/seo/article-content"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/customer-unit-price"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "객단가 계산기 | 평균 객단가 계산 방법 - 사장만",
  description:
    "매출액과 고객 수를 입력해 평균 객단가를 계산하세요. 객단가 계산 공식과 매출 분석에 활용하는 방법을 쉽게 확인할 수 있습니다.",
  keywords: ["객단가 계산기", "객단가 계산", "평균 객단가", "객단가 계산 방법"],
})

export default function CustomerUnitPriceCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "객단가 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="객단가 계산기"
        description="매출과 고객 수를 입력하면 평균 객단가와 목표 달성에 필요한 고객 수를 계산할 수 있습니다."
      />
      <CustomerUnitPriceCalculator
        seoArticles={<CalculatorGuideArticles href={PATH} />}
      />
    </SiteLayout>
  )
}
