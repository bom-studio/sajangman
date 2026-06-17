"use client"

import { useRef, useState } from "react"

import { CalculatorDonutChart } from "@/components/calculators/calculator-donut-chart"
import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import { Input } from "@/components/ui/input"
import {
  formatAmount,
  formatPercent,
  formatWon,
  parseAmountInput,
} from "@/lib/calculators/format"
import {
  NET_SALARY_FAQ_ITEMS,
  NET_SALARY_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/net-salary-faq"
import {
  calculateNetSalary,
  DEFAULT_NET_SALARY_INPUT,
} from "@/lib/calculators/netSalary"

export function NetSalaryCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [monthlySalary, setMonthlySalary] = useState(
    DEFAULT_NET_SALARY_INPUT.monthlySalary
  )
  const [result, setResult] = useState<ReturnType<
    typeof calculateNetSalary
  > | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    if (monthlySalary <= 0) {
      setResult(null)
      setMessage("0보다 큰 월급을 입력해주세요.")
    } else {
      setResult(calculateNetSalary({ monthlySalary }))
      setMessage(null)
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setMonthlySalary(DEFAULT_NET_SALARY_INPUT.monthlySalary)
    setResult(null)
    setMessage(null)
  }

  const netSalaryRatio =
    result && result.monthlySalary > 0
      ? (result.netSalary / result.monthlySalary) * 100
      : 0

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/net-salary"
      resultRef={resultsRef}
      resultId="net-salary-results"
      input={
        <CalculatorInputCard
          title="급여 정보 입력"
          description="세전 월급을 입력하세요. 4대보험 근로자 부담분만 반영한 간편 계산입니다."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">월급</label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              세전 월급 (소득세·지방소득세 미포함)
            </p>
            <Input
              inputMode="numeric"
              value={monthlySalary > 0 ? formatAmount(monthlySalary) : ""}
              onChange={(e) =>
                setMonthlySalary(parseAmountInput(e.target.value))
              }
              placeholder="3,000,000"
            />
          </div>
        </CalculatorInputCard>
      }
      result={
        <CalculatorResultCard
          description="4대보험 공제 후 예상 실수령액입니다."
          message={message}
          shareContext={
            result ? `월급 ${formatWon(result.monthlySalary)} 기준` : undefined
          }
          items={
            result
              ? [
                  {
                    label: "세전 월급",
                    value: formatWon(result.monthlySalary),
                  },
                  {
                    label: "4대보험 공제액",
                    value: formatWon(result.totalDeduction),
                  },
                  {
                    label: "예상 실수령액",
                    value: formatWon(result.netSalary),
                    highlight: true,
                  },
                  {
                    label: "실수령 비율",
                    value: formatPercent(netSalaryRatio),
                    highlight: true,
                  },
                ]
              : undefined
          }
          visualization={
            result ? (
              <CalculatorDonutChart
                title="실수령액 vs 공제액"
                centerValue={formatPercent(netSalaryRatio)}
                centerLabel="실수령 비율"
                segments={[
                  {
                    key: "net",
                    label: "실수령액",
                    value: result.netSalary,
                    color: "#2563eb",
                  },
                  {
                    key: "deduction",
                    label: "공제액",
                    value: result.totalDeduction,
                    color: "#94a3b8",
                  },
                ]}
              />
            ) : undefined
          }
          footer={
            result ? (
              <p className="text-xs leading-relaxed text-muted-foreground">
                소득세·지방소득세는 포함되지 않은 MVP용 간편 계산입니다.
              </p>
            ) : undefined
          }
        />
      }
      seo={
        <CalculatorFaq
          description={NET_SALARY_GUIDE_DESCRIPTION}
          items={NET_SALARY_FAQ_ITEMS}
        />
      }
    />
  )
}
