import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { PaybackPeriodCalculator } from "@/components/calculators/payback-period-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { CalculatorGuideArticles } from "@/lib/calculators/seo/article-content"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/payback-period"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "투자금 회수기간 계산기 | 투자금회수기간 계산 - 사장만",
  description:
    "창업·시설 투자금과 월 순이익을 입력하면 투자금 회수까지 걸리는 기간을 계산할 수 있습니다. 손익분기점과 함께 검토해 보세요.",
  keywords: ["투자금 회수기간", "투자금회수기간", "회수기간 계산기", "창업 투자"],
})

export default function PaybackPeriodPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "투자금 회수기간 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="투자금 회수기간 계산기"
        description="창업비용과 월 순이익을 입력하면 투자금 회수까지 걸리는 기간을 계산할 수 있습니다."
      />
      <PaybackPeriodCalculator
        seoArticles={<CalculatorGuideArticles href={PATH} />}
      />
    </SiteLayout>
  )
}
