"use client"

import { useRef, useState } from "react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import {
  calculatorCardClass,
  calculatorCardContentClass,
  calculatorCardHeaderClass,
  calculatorHighlightClass,
  calculatorResultRowClass,
} from "@/components/calculators/calculator-styles"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  SALES_GOAL_FAQ_ITEMS,
  SALES_GOAL_GUIDE_DESCRIPTION,
  SALES_GOAL_GUIDE_ITEMS,
} from "@/lib/calculators/faq/sales-goal-faq"
import { formatAmount, parseAmountInput, parsePositiveNumber } from "@/lib/calculators/format"
import {
  calculateSalesGoal,
  DEFAULT_SALES_GOAL_INPUT,
  formatCustomers,
  formatRatePercent,
  formatWon,
  type SalesGoalResult,
} from "@/lib/calculators/sales-goal"
import { cn } from "@/lib/utils"

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

function RateField({
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
        type="number"
        min={0}
        max={100}
        step={0.1}
        value={value || ""}
        onChange={(e) => onChange(parsePositiveNumber(e.target.value))}
        placeholder={placeholder}
      />
    </div>
  )
}

function SalesGoalDetailCard({ result }: { result: SalesGoalResult }) {
  const rows = [
    { label: "목표 순이익", value: formatWon(result.targetNetProfit) },
    { label: "고정비", value: formatWon(result.fixedCost) },
    {
      label: "변동비율",
      value: formatRatePercent(result.variableCostRate),
      highlight: true,
    },
    {
      label: "필요 매출",
      value: formatWon(result.requiredMonthlySales),
      highlight: true,
    },
    { label: "일 매출", value: formatWon(result.requiredDailySales) },
    {
      label: "필요 고객 수",
      value: formatCustomers(result.requiredDailyCustomers),
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

function SalesGoalFormulaCard({ result }: { result: SalesGoalResult }) {
  const formulas = [
    {
      label: "필요 매출",
      formula: "(목표 순이익 + 고정비) ÷ (1 − 변동비율)",
      example: `(${formatAmount(result.targetNetProfit)} + ${formatAmount(result.fixedCost)}) ÷ (1 − ${result.variableCostRate}%)`,
      value: formatWon(result.requiredMonthlySales),
    },
    {
      label: "하루 매출",
      formula: "필요 매출 ÷ 월 영업일수",
      example: `${formatAmount(result.requiredMonthlySales)} ÷ ${result.businessDays}일`,
      value: formatWon(result.requiredDailySales),
    },
    {
      label: "필요 고객 수",
      formula: "하루 매출 ÷ 평균 객단가",
      example: `${formatAmount(result.requiredDailySales)} ÷ ${formatAmount(result.averageTicket)}`,
      value: formatCustomers(result.requiredDailyCustomers),
    },
  ]

  return (
    <Card className={calculatorCardClass}>
      <CardHeader className={calculatorCardHeaderClass}>
        <CardTitle>계산 공식</CardTitle>
        <CardDescription>
          입력값을 바탕으로 적용된 계산식입니다.
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("space-y-5", calculatorCardContentClass)}>
        {formulas.map((item) => (
          <div
            key={item.label}
            className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3"
          >
            <p className="text-sm font-semibold text-foreground">{item.label}</p>
            <p className="mt-1 text-xs text-muted-foreground">{item.formula}</p>
            <p className="mt-2 font-mono text-xs text-muted-foreground">
              = {item.example}
            </p>
            <p className={cn("mt-2 text-lg font-bold", calculatorHighlightClass)}>
              {item.value}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function SalesGoalCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [targetNetProfit, setTargetNetProfit] = useState(
    DEFAULT_SALES_GOAL_INPUT.targetNetProfit
  )
  const [fixedCost, setFixedCost] = useState(DEFAULT_SALES_GOAL_INPUT.fixedCost)
  const [costRate, setCostRate] = useState(DEFAULT_SALES_GOAL_INPUT.costRate)
  const [laborRate, setLaborRate] = useState(DEFAULT_SALES_GOAL_INPUT.laborRate)
  const [otherCostRate, setOtherCostRate] = useState(
    DEFAULT_SALES_GOAL_INPUT.otherCostRate
  )
  const [businessDays, setBusinessDays] = useState(
    DEFAULT_SALES_GOAL_INPUT.businessDays
  )
  const [averageTicket, setAverageTicket] = useState(
    DEFAULT_SALES_GOAL_INPUT.averageTicket
  )
  const [result, setResult] = useState<SalesGoalResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    const calculated = calculateSalesGoal({
      targetNetProfit,
      fixedCost,
      costRate,
      laborRate,
      otherCostRate,
      businessDays,
      averageTicket,
    })

    if (!calculated.canCalculate) {
      setResult(null)
      setMessage(calculated.errorMessage)
    } else {
      setResult(calculated)
      setMessage(null)
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setTargetNetProfit(DEFAULT_SALES_GOAL_INPUT.targetNetProfit)
    setFixedCost(DEFAULT_SALES_GOAL_INPUT.fixedCost)
    setCostRate(DEFAULT_SALES_GOAL_INPUT.costRate)
    setLaborRate(DEFAULT_SALES_GOAL_INPUT.laborRate)
    setOtherCostRate(DEFAULT_SALES_GOAL_INPUT.otherCostRate)
    setBusinessDays(DEFAULT_SALES_GOAL_INPUT.businessDays)
    setAverageTicket(DEFAULT_SALES_GOAL_INPUT.averageTicket)
    setResult(null)
    setMessage(null)
  }

  const resultItems = result
    ? [
        {
          label: "필요한 월 매출",
          value: formatWon(result.requiredMonthlySales),
          emphasized: true,
          description: "목표 순이익 달성에 필요한 월 매출 목표",
        },
        {
          label: "필요한 일 매출",
          value: formatWon(result.requiredDailySales),
          highlight: true,
          description: `${result.businessDays}영업일 기준`,
        },
        {
          label: "하루 필요 고객 수",
          value: formatCustomers(result.requiredDailyCustomers),
          highlight: true,
          description: `객단가 ${formatWon(result.averageTicket)} 기준`,
        },
        {
          label: "총 비용률",
          value: formatRatePercent(result.variableCostRate),
          description: "원가율 + 인건비율 + 기타 비용률",
        },
        {
          label: "예상 순이익률",
          value: formatRatePercent(result.netProfitMarginRate),
          highlight: true,
          description: "목표 순이익 ÷ 필요 월 매출",
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        { label: "월 목표 순이익", value: formatWon(result.targetNetProfit) },
        { label: "월 고정비", value: formatWon(result.fixedCost) },
        { label: "총 비용률", value: formatRatePercent(result.variableCostRate) },
        { label: "필요한 월 매출", value: formatWon(result.requiredMonthlySales) },
        { label: "필요한 일 매출", value: formatWon(result.requiredDailySales) },
        {
          label: "하루 필요 고객 수",
          value: formatCustomers(result.requiredDailyCustomers),
        },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/sales-goal"
      resultRef={resultsRef}
      resultId="sales-goal-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="목표 순이익과 비용 구조를 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <MoneyField
            label="월 목표 순이익"
            description="세전 기준 희망 월 순이익"
            value={targetNetProfit}
            onChange={setTargetNetProfit}
            placeholder="5,000,000"
          />
          <MoneyField
            label="월 고정비"
            description="임대료, 기본 인건비, 관리비 등"
            value={fixedCost}
            onChange={setFixedCost}
            placeholder="6,000,000"
          />
          <RateField
            label="예상 원가율 (%)"
            description="매출 대비 재료·상품 원가 비율"
            value={costRate}
            onChange={setCostRate}
            placeholder="32"
          />
          <RateField
            label="예상 인건비율 (%)"
            description="매출 대비 인건비 비율"
            value={laborRate}
            onChange={setLaborRate}
            placeholder="25"
          />
          <RateField
            label="기타 비용률 (%)"
            description="수수료, 포장비, 기타 변동비"
            value={otherCostRate}
            onChange={setOtherCostRate}
            placeholder="8"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              월 영업일수
            </label>
            <Input
              type="number"
              min={1}
              step={1}
              value={businessDays || ""}
              onChange={(e) =>
                setBusinessDays(parsePositiveNumber(e.target.value))
              }
              placeholder="26"
            />
          </div>
          <MoneyField
            label="평균 객단가"
            description="1건(1인)당 평균 결제 금액"
            value={averageTicket}
            onChange={setAverageTicket}
            placeholder="15,000"
          />
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description="목표 순이익 달성에 필요한 매출 목표입니다."
            message={message}
            items={resultItems}
            shareContext="목표 매출 계산 결과"
            showPdf
            pdfTitle="목표 매출 계산 결과"
            pdfSubtitle="사장만 목표 매출 계산기"
            pdfFilename="목표매출_계산결과"
            pdfRows={pdfRows}
          />
          {result && (
            <>
              <SalesGoalFormulaCard result={result} />
              <SalesGoalDetailCard result={result} />
            </>
          )}
        </>
      }
      seo={
        <>
          <CalculatorFaq
            description={SALES_GOAL_GUIDE_DESCRIPTION}
            items={SALES_GOAL_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={SALES_GOAL_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
