import type { Metadata } from "next"

import { AnnualLeavePayCalculator } from "@/components/calculators/annual-leave-pay-calculator"
import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/annual-leave-pay")

export const metadata: Metadata = {
  title: "연차수당 계산기 | 사장만",
  description:
    "남은 연차와 일급을 기준으로 예상 연차수당을 계산합니다.",
  keywords: [
    "연차수당 계산기",
    "연차수당",
    "미사용 연차",
    "퇴사 연차",
    "사장만",
  ],
}

export default function AnnualLeavePayCalculatorPage() {
  return (
    <SiteLayout>
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="연차수당 계산기"
        description="남은 연차와 일급을 기준으로 예상 연차수당을 계산합니다."
      />
      <AnnualLeavePayCalculator />
    </SiteLayout>
  )
}
