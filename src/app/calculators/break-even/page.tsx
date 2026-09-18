import type { Metadata } from "next"

import { BreakEvenCalculator } from "@/components/calculators/break-even-calculator"
import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { CalculatorGuideArticles } from "@/lib/calculators/seo/article-content"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/break-even"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "손익분기점 계산기 | BEP 계산 방법·공식 - 사장만",
  description:
    "고정비·판매가·변동비를 입력해 손익분기점 판매 수량과 매출을 계산하세요. BEP 공식과 활용 방법도 함께 확인할 수 있습니다.",
  keywords: ["손익분기점 계산기", "BEP 계산", "손익분기점 공식", "자영업 손익분기점"],
})

export default function BreakEvenCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "손익분기점 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
        howTo={SEO.howTo}
      />
      <CalculatorHeader
        title="손익분기점 계산기"
        description="고정비, 판매가, 변동비를 입력하여 손익분기점 수량·매출과 예상 수익을 계산하세요."
      />
      <BreakEvenCalculator
        seoArticles={<CalculatorGuideArticles href={PATH} />}
      />
    </SiteLayout>
  )
}
