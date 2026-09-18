import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { MinimumWageCalculator } from "@/components/calculators/minimum-wage-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/minimum-wage"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "최저임금 계산기 | 사장만",
  description:
    "시급과 근무시간을 입력하면 최저임금 충족 여부와 예상 급여를 확인할 수 있습니다.",
  keywords: [
    "최저임금 계산기",
    "최저임금",
    "2026 최저임금",
    "시급",
    "주휴수당",
    "사장만",
  ],
})

export default function MinimumWageCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "최저임금 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="최저임금 계산기"
        description="시급과 근무시간을 입력하면 최저임금 충족 여부와 예상 급여를 확인할 수 있습니다."
      />
      <MinimumWageCalculator />
    </SiteLayout>
  )
}
