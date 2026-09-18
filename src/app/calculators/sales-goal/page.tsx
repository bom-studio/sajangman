import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { SalesGoalCalculator } from "@/components/calculators/sales-goal-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/sales-goal"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "목표 매출 계산기 | 사장만",
  description:
    "원하는 순이익을 입력하면 필요한 월 매출과 하루 매출 목표를 계산할 수 있습니다.",
  keywords: [
    "목표 매출 계산기",
    "목표 매출",
    "월 매출 목표",
    "객단가",
    "순이익",
    "사장만",
  ],
})

export default function SalesGoalCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "목표 매출 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="목표 매출 계산기"
        description="원하는 순이익을 입력하면 필요한 월 매출과 하루 매출 목표를 계산할 수 있습니다."
      />
      <SalesGoalCalculator />
    </SiteLayout>
  )
}
