import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { CostRateCalculator } from "@/components/calculators/cost-rate-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { CalculatorGuideArticles } from "@/lib/calculators/seo/article-content"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/cost-rate"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "원가율 계산기 | 원가율 계산 방법·공식 - 사장만",
  description:
    "판매가와 원가를 입력하면 원가율을 바로 계산할 수 있습니다. 원가율 계산 공식과 음식점·카페 등 자영업자가 알아두면 좋은 원가 관리 방법도 함께 확인하세요.",
  keywords: [
    "원가율 계산기",
    "원가율 계산",
    "원가 계산기",
    "음식점 원가율",
    "카페 원가율",
    "마진율",
  ],
})

export default function CostRateCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "원가율 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
        howTo={SEO.howTo}
      />
      <CalculatorHeader
        title="원가율 계산기"
        description="판매가와 원가를 입력해 원가율과 마진율을 바로 계산하세요."
      />
      <CostRateCalculator
        seoArticles={<CalculatorGuideArticles href={PATH} />}
      />
    </SiteLayout>
  )
}
