import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { WeeklyPayCalculator } from "@/components/calculators/weekly-pay-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/weekly-pay"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "주휴수당 계산기 | 사장만",
  description:
    "시급, 근무일수, 근무시간을 입력하면 주휴수당과 예상 주급을 계산할 수 있습니다.",
  keywords: [
    "주휴수당 계산기",
    "주휴수당",
    "알바 주휴수당",
    "아르바이트 급여 계산기",
    "주급 계산기",
    "사장만",
  ],
})

export default function WeeklyPayPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "주휴수당 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
        howTo={SEO.howTo}
      />
      <CalculatorHeader
        title="주휴수당 계산기"
        description="시급, 근무일수, 근무시간을 입력하면 주휴수당과 예상 주급을 계산할 수 있습니다."
      />
      <WeeklyPayCalculator />
    </SiteLayout>
  )
}
