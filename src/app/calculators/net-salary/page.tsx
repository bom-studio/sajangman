import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { NetSalaryCalculator } from "@/components/calculators/net-salary-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/net-salary"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "급여 실수령액 계산기 | 사장만",
  description:
    "월급을 입력해 세금과 공제액을 제외한 예상 실수령액을 계산합니다.",
  keywords: [
    "급여 실수령액 계산기",
    "실수령액 계산",
    "월급 공제",
    "4대보험",
    "사장만",
  ],
})

export default function NetSalaryCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "급여 실수령액 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="급여 실수령액 계산기"
        description="월급을 입력해 세금과 공제액을 제외한 실수령액을 계산합니다."
      />
      <NetSalaryCalculator />
    </SiteLayout>
  )
}
