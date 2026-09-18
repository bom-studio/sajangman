import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { CardFeeCalculator } from "@/components/calculators/card-fee-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { CalculatorGuideArticles } from "@/lib/calculators/seo/article-content"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/card-fee"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "카드 수수료 계산기 | 가맹점 카드수수료·정산금액 - 사장만",
  description:
    "카드 매출과 수수료율을 입력하면 가맹점 카드수수료와 실제 정산금액을 계산할 수 있습니다. 카드 수수료 계산 방법도 함께 확인하세요.",
  keywords: [
    "카드 수수료 계산기",
    "카드 가맹점 수수료",
    "가맹점 카드수수료",
    "정산금액",
  ],
})

export default function CardFeeCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "카드 수수료 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="카드 수수료 계산기"
        description="카드 매출과 수수료율을 입력하면 실제 정산금액을 계산할 수 있습니다."
      />
      <CardFeeCalculator
        seoArticles={<CalculatorGuideArticles href={PATH} />}
      />
    </SiteLayout>
  )
}
