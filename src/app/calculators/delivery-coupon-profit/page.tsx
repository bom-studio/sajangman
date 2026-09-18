import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { DeliveryCouponProfitCalculator } from "@/components/calculators/delivery-coupon-profit-calculator"
import { PageBreadcrumb } from "@/components/page-breadcrumb"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"
import { buildCalculatorMetadata } from "@/lib/seo/metadata"

const PATH = "/calculators/delivery-coupon-profit"
const SEO = getCalculatorSeoConfig(PATH)

export const metadata: Metadata = buildCalculatorMetadata({
  path: PATH,
  title: "배달 쿠폰 손익 계산기 | 사장만",
  description:
    "할인쿠폰을 적용했을 때 실제 순이익과 추가로 필요한 주문 수를 계산할 수 있습니다.",
  keywords: [
    "배달 쿠폰 손익 계산기",
    "배달앱 쿠폰",
    "할인쿠폰",
    "배달 마진",
    "손익분기",
    "사장만",
  ],
})

export default function DeliveryCouponProfitCalculatorPage() {
  return (
    <SiteLayout>
      <PageBreadcrumb
        items={[
          { label: "홈", href: "/" },
          { label: "계산기", href: "/calculators" },
          { label: "배달 쿠폰 손익 계산기" },
        ]}
      />
      <CalculatorSeoSchemas
        calculatorName={SEO.name}
        calculatorHref={SEO.href}
        faqItems={SEO.faqItems}
      />
      <CalculatorHeader
        title="배달 쿠폰 손익 계산기"
        description="할인쿠폰을 적용했을 때 실제 순이익과 추가로 필요한 주문 수를 계산할 수 있습니다."
      />
      <DeliveryCouponProfitCalculator />
    </SiteLayout>
  )
}
