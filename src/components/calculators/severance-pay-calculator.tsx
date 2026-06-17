"use client"

import { useRef, useState } from "react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import { Input } from "@/components/ui/input"
import {
  formatAmount,
  formatWon,
  parseAmountInput,
} from "@/lib/calculators/format"
import {
  SEVERANCE_PAY_FAQ_ITEMS,
  SEVERANCE_PAY_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/severance-pay-faq"
import {
  calculateSeverancePay,
  DEFAULT_SEVERANCE_INPUT,
  formatWorkPeriod,
} from "@/lib/calculators/severancePay"

function MoneyField({
  label,
  description,
  value,
  onChange,
  placeholder,
}: {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  placeholder: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Input
        inputMode="numeric"
        value={value > 0 ? formatAmount(value) : ""}
        onChange={(e) => onChange(parseAmountInput(e.target.value))}
        placeholder={placeholder}
      />
    </div>
  )
}

export function SeverancePayCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [startDate, setStartDate] = useState(DEFAULT_SEVERANCE_INPUT.startDate)
  const [endDate, setEndDate] = useState(DEFAULT_SEVERANCE_INPUT.endDate)
  const [avgMonthlyWage, setAvgMonthlyWage] = useState(
    DEFAULT_SEVERANCE_INPUT.avgMonthlyWage
  )
  const [result, setResult] = useState<ReturnType<
    typeof calculateSeverancePay
  > | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    if (!startDate || !endDate) {
      setResult(null)
      setMessage("입사일과 퇴사일을 입력해주세요.")
    } else if (new Date(endDate) < new Date(startDate)) {
      setResult(null)
      setMessage("퇴사일은 입사일 이후여야 합니다.")
    } else if (avgMonthlyWage <= 0) {
      setResult(null)
      setMessage("최근 3개월 평균 월급을 입력해주세요.")
    } else {
      setResult(calculateSeverancePay({ startDate, endDate, avgMonthlyWage }))
      setMessage(null)
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setStartDate(DEFAULT_SEVERANCE_INPUT.startDate)
    setEndDate(DEFAULT_SEVERANCE_INPUT.endDate)
    setAvgMonthlyWage(DEFAULT_SEVERANCE_INPUT.avgMonthlyWage)
    setResult(null)
    setMessage(null)
  }

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/severance-pay"
      resultRef={resultsRef}
      resultId="severance-pay-results"
      input={
        <CalculatorInputCard
          title="퇴직 정보 입력"
          description="입사일, 퇴사일, 최근 3개월 평균 월급을 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">입사일</label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">퇴사일</label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <MoneyField
            label="최근 3개월 평균 월급"
            description="퇴직 전 3개월 평균 임금 (간편 계산용)"
            value={avgMonthlyWage}
            onChange={setAvgMonthlyWage}
            placeholder="3,000,000"
          />
        </CalculatorInputCard>
      }
      result={
        <CalculatorResultCard
          description="근속 기간과 평균임금을 기준으로 예상 퇴직금을 확인하세요."
          message={message}
          shareContext={
            result
              ? `근속 ${formatWorkPeriod(result.workDays)} 기준`
              : undefined
          }
          items={
            result
              ? [
                  {
                    label: "근속기간",
                    value: formatWorkPeriod(result.workDays),
                  },
                  {
                    label: "예상 퇴직금",
                    value: formatWon(result.estimatedSeverancePay),
                    highlight: true,
                  },
                  {
                    label: "월 환산 금액",
                    value: formatWon(
                      Math.round(
                        result.workDays > 0
                          ? result.estimatedSeverancePay / (result.workDays / 30)
                          : 0
                      )
                    ),
                    description: "근속 기간 대비 월평균 퇴직금",
                  },
                ]
              : undefined
          }
          footer={
            result && !result.isEligible ? (
              <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                근속 365일 미만은 퇴직금 지급 대상이 아닙니다. (예상 퇴직금 0원)
              </p>
            ) : undefined
          }
        />
      }
      seo={
        <CalculatorFaq
          description={SEVERANCE_PAY_GUIDE_DESCRIPTION}
          items={SEVERANCE_PAY_FAQ_ITEMS}
        />
      }
    />
  )
}
