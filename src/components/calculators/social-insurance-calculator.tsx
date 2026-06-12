"use client"

import { useMemo, useRef, useState } from "react"

import { CalculatorDonutChart } from "@/components/calculators/calculator-donut-chart"
import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultActions } from "@/components/calculators/calculator-result-actions"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import {
  ResultStatCard,
  ResultStatEmptyState,
  ResultStatGrid,
  ResultStatMessage,
} from "@/components/calculators/result-stat-card"
import { Input } from "@/components/ui/input"
import {
  formatAmount,
  formatWon,
  parseAmountInput,
} from "@/lib/calculators/format"
import {
  SOCIAL_INSURANCE_FAQ_ITEMS,
  SOCIAL_INSURANCE_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/social-insurance-faq"
import {
  calculateSocialInsurance,
  DEFAULT_SOCIAL_INSURANCE_INPUT,
} from "@/lib/calculators/socialInsurance"

function SocialInsuranceResultPanel({
  result,
}: {
  result: NonNullable<ReturnType<typeof calculateSocialInsurance>>
}) {
  const totalBurden = result.employee.total + result.employer.total

  const shareItems = [
    { label: "국민연금", value: formatWon(result.employee.nationalPension) },
    { label: "건강보험", value: formatWon(result.employee.healthInsurance) },
    {
      label: "장기요양보험",
      value: formatWon(result.employee.longTermCare),
    },
    {
      label: "고용보험",
      value: formatWon(result.employee.employmentInsurance),
    },
    { label: "근로자 부담 총액", value: formatWon(result.employee.total) },
    { label: "사업주 부담 총액", value: formatWon(result.employer.total) },
    { label: "총 부담액", value: formatWon(totalBurden) },
  ]

  return (
    <div className="space-y-6">
      <CalculatorDonutChart
        title="근로자 부담 보험료 비중"
        centerValue={formatWon(result.employee.total)}
        centerLabel="근로자 부담 합계"
        segments={[
          {
            key: "pension",
            label: "국민연금",
            value: result.employee.nationalPension,
            color: "#2563eb",
          },
          {
            key: "health",
            label: "건강보험",
            value: result.employee.healthInsurance,
            color: "#10b981",
          },
          {
            key: "ltc",
            label: "장기요양보험",
            value: result.employee.longTermCare,
            color: "#8b5cf6",
          },
          {
            key: "employment",
            label: "고용보험",
            value: result.employee.employmentInsurance,
            color: "#f59e0b",
          },
        ]}
      />

      <p className="text-sm font-medium text-muted-foreground">
        근로자 부담 (항목별)
      </p>
      <ResultStatGrid>
        <ResultStatCard
          label="국민연금"
          value={formatWon(result.employee.nationalPension)}
        />
        <ResultStatCard
          label="건강보험"
          value={formatWon(result.employee.healthInsurance)}
        />
        <ResultStatCard
          label="장기요양보험"
          value={formatWon(result.employee.longTermCare)}
        />
        <ResultStatCard
          label="고용보험"
          value={formatWon(result.employee.employmentInsurance)}
        />
      </ResultStatGrid>

      <p className="text-sm font-medium text-muted-foreground">
        사업주 부담 (항목별)
      </p>
      <ResultStatGrid>
        <ResultStatCard
          label="국민연금"
          value={formatWon(result.employer.nationalPension)}
        />
        <ResultStatCard
          label="건강보험"
          value={formatWon(result.employer.healthInsurance)}
        />
        <ResultStatCard
          label="장기요양보험"
          value={formatWon(result.employer.longTermCare)}
        />
        <ResultStatCard
          label="고용보험"
          value={formatWon(result.employer.employmentInsurance)}
        />
      </ResultStatGrid>

      <ResultStatGrid>
        <ResultStatCard
          label="근로자 부담 총액"
          value={formatWon(result.employee.total)}
          highlight
        />
        <ResultStatCard
          label="사업주 부담 총액"
          value={formatWon(result.employer.total)}
          highlight
        />
        <ResultStatCard
          label="총 부담액"
          value={formatWon(totalBurden)}
          emphasized
          className="sm:col-span-2"
        />
      </ResultStatGrid>

      <CalculatorResultActions
        items={shareItems}
        shareContext={`월급 ${formatWon(result.monthlySalary)} 기준`}
        shareTitle="4대보험 계산 결과"
      />

      <p className="rounded-xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs leading-relaxed text-muted-foreground">
        산재보험은 업종별 요율이 달라 이 계산기에서는 제외했습니다. 정확한
        산재보험료는 근로복지공단 또는 노무 전문가를 통해 확인하세요.
      </p>
    </div>
  )
}

export function SocialInsuranceCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [monthlySalary, setMonthlySalary] = useState(
    DEFAULT_SOCIAL_INSURANCE_INPUT.monthlySalary
  )
  const [submitted, setSubmitted] = useState(false)

  const result = useMemo(() => {
    if (!submitted) return null
    return calculateSocialInsurance({ monthlySalary })
  }, [submitted, monthlySalary])

  const message = useMemo(() => {
    if (!submitted) return null
    if (monthlySalary <= 0) return "0보다 큰 월급을 입력해주세요."
    return null
  }, [submitted, monthlySalary])

  function handleCalculate() {
    setSubmitted(true)
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setMonthlySalary(DEFAULT_SOCIAL_INSURANCE_INPUT.monthlySalary)
    setSubmitted(false)
  }

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/social-insurance"
      resultRef={resultsRef}
      resultId="social-insurance-results"
      input={
        <CalculatorInputCard
          title="급여 정보 입력"
          description="세전 월급을 입력하면 근로자·사업주 4대보험 부담금을 계산합니다."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">월급</label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              세전 월급 기준
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
          description="근로자·사업주 부담금을 확인하세요."
          showCopy={false}
        >
          {message ? (
            <ResultStatMessage message={message} />
          ) : result ? (
            <SocialInsuranceResultPanel result={result} />
          ) : (
            <ResultStatEmptyState />
          )}
        </CalculatorResultCard>
      }
      seo={
        <CalculatorFaq
          description={SOCIAL_INSURANCE_GUIDE_DESCRIPTION}
          items={SOCIAL_INSURANCE_FAQ_ITEMS}
        />
      }
    />
  )
}
