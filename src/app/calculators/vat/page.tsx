import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { VatCalculator } from "@/components/calculators/vat-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { CalculatorGuideArticles } from "@/lib/calculators/seo/article-content"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/vat"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "부가세 계산기 | 공급가액·부가가치세 계산 - 사장만",
  description:
    "공급가액 또는 합계 금액으로 부가세(10%)를 바로 계산하세요. 부가가치세 계산 방법과 간이·일반과세 관련 안내도 함께 확인할 수 있습니다.",
  keywords: ["부가세 계산기", "부가가치세 계산", "공급가액", "부가세 10%"],
})

export default function VatCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "부가세 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
        howTo={SEO.howTo}
      />
      <CalculatorHeader
        title="부가세 계산기"
        description="공급가액과 부가세 포함 금액을 기준으로 부가세를 빠르고 정확하게 계산하세요."
      />
      <VatCalculator seoArticles={<CalculatorGuideArticles href={PATH} />} />
    </SiteLayout>
  )
}
