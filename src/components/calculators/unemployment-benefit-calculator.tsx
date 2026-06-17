"use client"

import { useRef, useState } from "react"
import { AlertCircle } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import {
  calculatorCardClass,
  calculatorHighlightClass,
  calculatorResultRowClass,
  calculatorSelectClassName,
} from "@/components/calculators/calculator-styles"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  UNEMPLOYMENT_BENEFIT_FAQ_ITEMS,
  UNEMPLOYMENT_BENEFIT_GUIDE_DESCRIPTION,
  UNEMPLOYMENT_BENEFIT_GUIDE_ITEMS,
} from "@/lib/calculators/faq/unemployment-benefit-faq"
import { formatAmount, parseAmountInput } from "@/lib/calculators/format"
import { getUnemploymentEligibilityStatus } from "@/lib/calculators/result-status"
import {
  calculateUnemploymentBenefit,
  DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT,
  formatDays,
  formatWon,
  getResignationReasonLabel,
  parsePositiveNumber,
  RESIGNATION_REASONS,
  type ResignationReasonId,
  type UnemploymentBenefitResult,
} from "@/lib/calculators/unemployment-benefit"
import { cn } from "@/lib/utils"

const DISCLAIMER =
  "실업급여는 고용보험 가입기간, 퇴사 사유, 재취업 활동 여부에 따라 달라집니다. 본 계산기는 예상 참고용입니다."

function MoneyField({
  label,
  description,
  value,
  onChange,
  placeholder,
}: {
  label: string
  description?: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {description && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <Input
        inputMode="numeric"
        value={value > 0 ? formatAmount(value) : ""}
        onChange={(e) => onChange(parseAmountInput(e.target.value))}
        placeholder={placeholder}
      />
    </div>
  )
}

function UnemploymentBenefitDetailCard({
  result,
}: {
  result: UnemploymentBenefitResult
}) {
  const rows = [
    { label: "평균 월급", value: formatWon(result.avgMonthlyWage) },
    {
      label: "1일 평균임금",
      value: formatWon(result.dailyAverageWage),
      highlight: true,
    },
    {
      label: "구직급여일액",
      value: formatWon(result.dailyBenefit),
      highlight: true,
    },
    { label: "지급일수", value: formatDays(result.paymentDays) },
    {
      label: "총 예상액",
      value: formatWon(result.totalBenefit),
      highlight: true,
    },
  ]

  return (
    <Card className={calculatorCardClass}>
      <CardContent className="px-0 py-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="detail" className="border-0">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline sm:text-lg">
              상세 계산 내역
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5">
              <dl className="space-y-3">
                {rows.map((row) => (
                  <div key={row.label} className={calculatorResultRowClass}>
                    <dt className="text-sm text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd
                      className={cn(
                        "text-base font-bold text-foreground",
                        row.highlight && calculatorHighlightClass
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export function UnemploymentBenefitCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [avgMonthlyWage, setAvgMonthlyWage] = useState(
    DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.avgMonthlyWage
  )
  const [employmentMonths, setEmploymentMonths] = useState(
    DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.employmentMonths
  )
  const [age, setAge] = useState(DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.age)
  const [isInsured, setIsInsured] = useState(
    DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.isInsured
  )
  const [resignationReason, setResignationReason] =
    useState<ResignationReasonId>(
      DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.resignationReason
    )
  const [result, setResult] = useState<UnemploymentBenefitResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    if (avgMonthlyWage <= 0) {
      setResult(null)
      setMessage("0보다 큰 평균 월급을 입력해주세요.")
    } else if (employmentMonths <= 0) {
      setResult(null)
      setMessage("0보다 큰 근속기간(개월)을 입력해주세요.")
    } else if (age <= 0) {
      setResult(null)
      setMessage("나이를 입력해주세요.")
    } else {
      setResult(
        calculateUnemploymentBenefit({
          avgMonthlyWage,
          employmentMonths,
          age,
          isInsured,
          resignationReason,
        })
      )
      setMessage(null)
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setAvgMonthlyWage(DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.avgMonthlyWage)
    setEmploymentMonths(DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.employmentMonths)
    setAge(DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.age)
    setIsInsured(DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.isInsured)
    setResignationReason(DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT.resignationReason)
    setResult(null)
    setMessage(null)
  }

  const eligibilityStatus = result
    ? getUnemploymentEligibilityStatus(result.eligibilityLevel)
    : undefined

  const resultItems = result
    ? [
        {
          label: "1일 구직급여 예상액",
          value: formatWon(result.dailyBenefit),
          description: "1일 평균임금의 60% (상·하한 적용)",
          highlight: true,
        },
        {
          label: "예상 지급일수",
          value: formatDays(result.paymentDays),
          highlight: result.paymentDays > 0,
        },
        {
          label: "총 실업급여 예상액",
          value: formatWon(result.totalBenefit),
          highlight: true,
          className: "sm:col-span-2",
        },
        {
          label: "수급 가능성 안내",
          value:
            result.eligibilityLevel === "eligible"
              ? "수급 가능성 있음"
              : result.eligibilityLevel === "uncertain"
                ? "확인 필요"
                : result.eligibilityLevel === "unlikely"
                  ? "수급 어려움"
                  : "수급 불가",
          status: eligibilityStatus,
          description: result.eligibilityMessage,
          className: "sm:col-span-2",
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        {
          label: "퇴사 전 3개월 평균 월급",
          value: formatWon(result.avgMonthlyWage),
        },
        {
          label: "퇴사 사유",
          value: getResignationReasonLabel(result.resignationReason),
        },
        {
          label: "1일 구직급여 예상액",
          value: formatWon(result.dailyBenefit),
        },
        { label: "예상 지급일수", value: formatDays(result.paymentDays) },
        { label: "총 실업급여 예상액", value: formatWon(result.totalBenefit) },
        { label: "수급 가능성", value: result.eligibilityMessage },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/unemployment-benefit"
      resultRef={resultsRef}
      resultId="unemployment-benefit-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="퇴사 전 임금과 근무 정보를 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <MoneyField
            label="퇴사 전 3개월 평균 월급"
            description="퇴직 직전 3개월간 받은 임금 평균"
            value={avgMonthlyWage}
            onChange={setAvgMonthlyWage}
            placeholder="3,000,000"
          />

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              근속기간 (개월)
            </label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              고용보험 가입기간과 동일하다고 가정합니다
            </p>
            <Input
              type="number"
              min={0}
              step={1}
              value={employmentMonths || ""}
              onChange={(e) =>
                setEmploymentMonths(parsePositiveNumber(e.target.value))
              }
              placeholder="24"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">나이</label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              퇴사 당시 만 나이
            </p>
            <Input
              type="number"
              min={0}
              step={1}
              value={age || ""}
              onChange={(e) => setAge(parsePositiveNumber(e.target.value))}
              placeholder="35"
            />
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <input
              type="checkbox"
              checked={isInsured}
              onChange={(e) => setIsInsured(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-foreground">
                고용보험 가입
              </span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                퇴사 전 고용보험에 가입되어 있었습니다.
              </span>
            </span>
          </label>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              퇴사 사유
            </label>
            <select
              value={resignationReason}
              onChange={(e) =>
                setResignationReason(e.target.value as ResignationReasonId)
              }
              className={calculatorSelectClassName}
            >
              {RESIGNATION_REASONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description="간이 예상 결과입니다. 실제 수급 여부는 고용센터 심사 결과에 따릅니다."
            message={message}
            items={resultItems}
            shareContext="실업급여 예상 계산 결과"
            showPdf
            pdfTitle="실업급여 예상 계산 결과"
            pdfSubtitle="사장만 실업급여 계산기"
            pdfFilename="실업급여_계산결과"
            pdfRows={pdfRows}
          />

          {result && (
            <>
              <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-950">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>{DISCLAIMER}</p>
              </div>
              <UnemploymentBenefitDetailCard result={result} />
            </>
          )}
        </>
      }
      seo={
        <>
          <CalculatorFaq
            description={UNEMPLOYMENT_BENEFIT_GUIDE_DESCRIPTION}
            items={UNEMPLOYMENT_BENEFIT_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={UNEMPLOYMENT_BENEFIT_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
