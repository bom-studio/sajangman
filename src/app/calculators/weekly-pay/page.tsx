import type { Metadata } from "next"

import { CalculatorHeader } from "@/components/calculators/calculator-header"
import { WeeklyPayCalculator } from "@/components/calculators/weekly-pay-calculator"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "주휴수당 계산기 | 사장만",
  description:
    "시급, 근무일수, 근무시간을 입력하면 주휴수당과 예상 주급을 계산할 수 있습니다.",
  keywords: [
    "주휴수당 계산기",
    "주휴수당",
    "알바 주휴수당",
    "아르바이트 급여 계산기",
    "주급 계산기",
    "사장만",
  ],
}

export default function WeeklyPayPage() {
  return (
    <SiteLayout>
      <CalculatorHeader
        title="주휴수당 계산기"
        description="시급, 근무일수, 근무시간을 입력하면 주휴수당과 예상 주급을 계산할 수 있습니다."
      />
      <WeeklyPayCalculator />
    </SiteLayout>
  )
}
