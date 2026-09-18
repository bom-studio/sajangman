import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { IncomeTaxCalculator } from "@/components/calculators/income-tax-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { CalculatorGuideArticles } from "@/lib/calculators/seo/article-content"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/income-tax"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "종합소득세 계산기 | 개인사업자 예상 세금 계산 - 사장만",
  description:
    "연간 매출·비용·공제를 입력해 개인사업자 예상 종합소득세를 계산하세요. 신고 전 세 부담을 가늠하는 참고용 계산기입니다.",
  keywords: [
    "종합소득세 계산기",
    "개인사업자 종합소득세",
    "종합소득세",
    "사업소득",
  ],
})

export default function IncomeTaxCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "종합소득세 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="종합소득세 계산기"
        description="연간 매출, 비용, 공제금액을 입력하면 개인사업자 예상 종합소득세를 계산할 수 있습니다."
      />
      <IncomeTaxCalculator
        seoArticles={<CalculatorGuideArticles href={PATH} />}
      />
    </SiteLayout>
  )
}
