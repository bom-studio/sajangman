import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { DeliveryMarginCalculator } from "@/components/calculators/delivery-margin-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { CalculatorGuideArticles } from "@/lib/calculators/seo/article-content"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/delivery-margin"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "배달 마진 계산기 | 배달앱 수수료·순이익 계산 - 사장만",
  description:
    "배달의민족·쿠팡이츠·요기요·땡겨요 주문 기준으로 배달 수수료와 예상 순이익·마진율을 비교하세요. 배민 수수료·배달 마진 계산에 활용할 수 있습니다.",
  keywords: [
    "배달 마진 계산기",
    "배민 수수료",
    "배달 수수료 계산",
    "배달의민족 수수료",
    "쿠팡이츠 수수료",
  ],
})

export default function DeliveryMarginPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "배달 마진 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName="배달 마진 계산기"
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="배달 마진 계산기"
        description="배달의민족, 쿠팡이츠, 요기요, 땡겨요의 예상 정산금액·순이익·마진율을 비교할 수 있습니다."
      />
      <DeliveryMarginCalculator
        seoArticles={<CalculatorGuideArticles href={PATH} />}
      />
    </SiteLayout>
  )
}
