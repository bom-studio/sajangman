import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { CalculatorSeoSchemas } from "@/components/calculators/calculator-seo-schemas"
import { DeliveryCouponProfitCalculator } from "@/components/calculators/delivery-coupon-profit-calculator"
import { SiteLayout } from "@/components/site-layout"
import { getCalculatorSeoConfig } from "@/lib/calculators/seo/page-config"

const SEO = getCalculatorSeoConfig("/calculators/delivery-coupon-profit")

export const metadata: Metadata = {
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
}

export default function DeliveryCouponProfitCalculatorPage() {
  return (
    <SiteLayout>
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
