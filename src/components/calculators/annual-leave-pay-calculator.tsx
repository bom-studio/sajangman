"use client"

import { useRef, useState } from "react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import { Input } from "@/components/ui/input"
import {
  calculateAnnualLeavePay,
  DEFAULT_ANNUAL_LEAVE_INPUT,
} from "@/lib/calculators/annualLeavePay"
import {
  ANNUAL_LEAVE_PAY_FAQ_ITEMS,
  ANNUAL_LEAVE_PAY_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/annual-leave-pay-faq"
import {
  formatAmount,
  formatDays,
  formatWon,
  parseAmountInput,
  parsePositiveNumber,
} from "@/lib/calculators/format"

export function AnnualLeavePayCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [dailyWage, setDailyWage] = useState(DEFAULT_ANNUAL_LEAVE_INPUT.dailyWage)
  const [remainingDays, setRemainingDays] = useState(
    DEFAULT_ANNUAL_LEAVE_INPUT.remainingDays
  )
  const [result, setResult] = useState<ReturnType<
    typeof calculateAnnualLeavePay
  > | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    if (dailyWage <= 0) {
      setResult(null)
      setMessage("0보다 큰 일급을 입력해주세요.")
    } else if (remainingDays <= 0) {
      setResult(null)
      setMessage("0보다 큰 연차 일수를 입력해주세요.")
    } else {
      setResult(calculateAnnualLeavePay({ dailyWage, remainingDays }))
      setMessage(null)
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setDailyWage(DEFAULT_ANNUAL_LEAVE_INPUT.dailyWage)
    setRemainingDays(DEFAULT_ANNUAL_LEAVE_INPUT.remainingDays)
    setResult(null)
    setMessage(null)
  }

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/annual-leave-pay"
      resultRef={resultsRef}
      resultId="annual-leave-pay-results"
      input={
        <CalculatorInputCard
          title="연차 정보 입력"
          description="일급과 남은 연차 일수를 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">일급</label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              1일 통상임금
            </p>
            <Input
              inputMode="numeric"
              value={dailyWage > 0 ? formatAmount(dailyWage) : ""}
              onChange={(e) => setDailyWage(parseAmountInput(e.target.value))}
              placeholder="100,000"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              남은 연차 일수
            </label>
            <Input
              inputMode="decimal"
              value={remainingDays > 0 ? String(remainingDays) : ""}
              onChange={(e) =>
                setRemainingDays(parsePositiveNumber(e.target.value))
              }
              placeholder="5"
            />
          </div>
        </CalculatorInputCard>
      }
      result={
        <CalculatorResultCard
          description="미사용 연차 기준 예상 연차수당입니다."
          message={message}
          items={
            result
              ? [
                  {
                    label: "일급",
                    value: formatWon(result.dailyWage),
                  },
                  {
                    label: "남은 연차",
                    value: formatDays(result.remainingDays),
                  },
                  {
                    label: "예상 연차수당",
                    value: formatWon(result.estimatedPay),
                    highlight: true,
                    className: "sm:col-span-2",
                  },
                ]
              : undefined
          }
        />
      }
      seo={
        <CalculatorFaq
          description={ANNUAL_LEAVE_PAY_GUIDE_DESCRIPTION}
          items={ANNUAL_LEAVE_PAY_FAQ_ITEMS}
        />
      }
    />
  )
}
