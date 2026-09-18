import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { VatTypeCompareCalculator } from "@/components/calculators/vat-type-compare-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/vat-type-compare"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "간이과세자 일반과세자 비교 계산기 | 사장만",
  description:
    "매출과 매입 비용을 입력하면 과세유형별 예상 부가세 차이를 비교할 수 있습니다.",
  keywords: [
    "간이과세자",
    "일반과세자",
    "간이과세 일반과세 차이",
    "부가세",
    "과세유형",
    "사장만",
  ],
})

export default function VatTypeCompareCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "간이과세자 일반과세자 비교 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="간이과세자 일반과세자 비교 계산기"
        description="매출과 매입 비용을 입력하면 과세유형별 예상 부가세 차이를 비교할 수 있습니다."
      />
      <VatTypeCompareCalculator />
    </SiteLayout>
  )
}
