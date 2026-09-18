import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { SeverancePayCalculator } from "@/components/calculators/severance-pay-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/severance-pay"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "퇴직금 계산기 | 사장만",
  description:
    "입사일, 퇴사일, 평균임금을 입력해 예상 퇴직금을 계산합니다.",
  keywords: [
    "퇴직금 계산기",
    "퇴직금 계산",
    "평균임금",
    "근속연수",
    "사장만",
  ],
})

export default function SeverancePayCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "퇴직금 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="퇴직금 계산기"
        description="입사일, 퇴사일, 평균임금을 입력해 예상 퇴직금을 계산합니다."
      />
      <SeverancePayCalculator />
    </SiteLayout>
  )
}
