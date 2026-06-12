import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { DeliveryMarginCalculator } from "@/components/calculators/delivery-margin-calculator"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "배달 수수료·순이익 비교 계산기 | 사장만",
  description:
    "배달의민족, 쿠팡이츠, 요기요, 땡겨요의 예상 정산금액, 순이익, 마진율을 비교할 수 있습니다.",
}

export default function DeliveryMarginPage() {
  return (
    <SiteLayout>
      <CalculatorHeader
        title="배달 수수료·순이익 비교 계산기"
        description="배달의민족, 쿠팡이츠, 요기요, 땡겨요의 예상 정산금액, 순이익, 마진율을 비교할 수 있습니다."
      />
      <DeliveryMarginCalculator />
    </SiteLayout>
  )
}
