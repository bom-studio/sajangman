"use client"

import { useRef, useState, type ReactNode } from "react"

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
  calculatorSelectClassName,
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
  INVENTORY_TURNOVER_FAQ_ITEMS,
  INVENTORY_TURNOVER_GUIDE_DESCRIPTION,
  INVENTORY_TURNOVER_GUIDE_ITEMS,
} from "@/lib/calculators/faq/inventory-turnover-faq"
import { formatAmount, parseAmountInput } from "@/lib/calculators/format"
import {
  calculateInventoryTurnover,
  DEFAULT_INVENTORY_TURNOVER_INPUT,
  formatHoldingDays,
  formatTurnoverRate,
  formatWon,
  INVENTORY_MANAGEMENT_STATUS_LABEL,
  type InventoryPeriod,
  type InventoryTurnoverResult,
} from "@/lib/calculators/inventory-turnover"
import { cn } from "@/lib/utils"

const PERIOD_OPTIONS: { id: InventoryPeriod; label: string }[] = [
  { id: "monthly", label: "월간" },
  { id: "annual", label: "연간" },
]

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

function InventoryTurnoverDetailCard({
  result,
}: {
  result: InventoryTurnoverResult
}) {
  const rows = [
    { label: "기초 재고액", value: formatWon(result.beginningInventory) },
    { label: "기말 재고액", value: formatWon(result.endingInventory) },
    {
      label: "평균 재고액",
      value: formatWon(result.averageInventory),
      description: result.useDirectAverage ? "직접 입력" : "(기초 + 기말) ÷ 2",
      highlight: true,
    },
    { label: "매출원가", value: formatWon(result.costOfGoodsSold), highlight: true },
    {
      label: "재고 회전율",
      value: formatTurnoverRate(result.inventoryTurnover),
      description: `${result.periodLabel} 기준`,
      highlight: true,
    },
    {
      label: "보유일수",
      value: formatHoldingDays(result.holdingDays),
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
                      {"description" in row && row.description && (
                        <span className="mt-0.5 block text-xs font-normal">
                          {row.description}
                        </span>
                      )}
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

function InventoryTurnoverFormulaCard({
  result,
}: {
  result: InventoryTurnoverResult
}) {
  const periodDays = result.period === "monthly" ? 30 : 365
  const avgFormula = result.useDirectAverage
    ? "직접 입력값"
    : "(기초 재고액 + 기말 재고액) ÷ 2"
  const avgExample = result.useDirectAverage
    ? "직접 입력"
    : `(${formatAmount(result.beginningInventory)} + ${formatAmount(result.endingInventory)}) ÷ 2`

  const formulas = [
    {
      label: "평균 재고액",
      formula: avgFormula,
      example: avgExample,
      value: formatWon(result.averageInventory),
    },
    {
      label: "재고 회전율",
      formula: "매출원가 ÷ 평균 재고액",
      example: `${formatAmount(result.costOfGoodsSold)} ÷ ${formatAmount(result.averageInventory)}`,
      value: formatTurnoverRate(result.inventoryTurnover),
    },
    {
      label: "재고 보유일수",
      formula: `${periodDays} ÷ 재고 회전율`,
      example: `${periodDays} ÷ ${result.inventoryTurnover.toFixed(2)}`,
      value: formatHoldingDays(result.holdingDays),
    },
  ]

  return (
    <Card className={calculatorCardClass}>
      <CardHeader className={calculatorCardHeaderClass}>
        <CardTitle>계산 공식</CardTitle>
        <CardDescription>
          {result.periodLabel} 기준으로 적용된 계산식입니다.
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

export function InventoryTurnoverCalculator({
  seoArticles,
}: {
  seoArticles?: ReactNode
} = {}) {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [period, setPeriod] = useState<InventoryPeriod>(
    DEFAULT_INVENTORY_TURNOVER_INPUT.period
  )
  const [costOfGoodsSold, setCostOfGoodsSold] = useState(
    DEFAULT_INVENTORY_TURNOVER_INPUT.costOfGoodsSold
  )
  const [beginningInventory, setBeginningInventory] = useState(
    DEFAULT_INVENTORY_TURNOVER_INPUT.beginningInventory
  )
  const [endingInventory, setEndingInventory] = useState(
    DEFAULT_INVENTORY_TURNOVER_INPUT.endingInventory
  )
  const [useDirectAverage, setUseDirectAverage] = useState(
    DEFAULT_INVENTORY_TURNOVER_INPUT.useDirectAverage
  )
  const [directAverageInventory, setDirectAverageInventory] = useState(
    DEFAULT_INVENTORY_TURNOVER_INPUT.directAverageInventory
  )
  const [result, setResult] = useState<InventoryTurnoverResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    const calculated = calculateInventoryTurnover({
      period,
      costOfGoodsSold,
      beginningInventory,
      endingInventory,
      useDirectAverage,
      directAverageInventory,
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
    setPeriod(DEFAULT_INVENTORY_TURNOVER_INPUT.period)
    setCostOfGoodsSold(DEFAULT_INVENTORY_TURNOVER_INPUT.costOfGoodsSold)
    setBeginningInventory(DEFAULT_INVENTORY_TURNOVER_INPUT.beginningInventory)
    setEndingInventory(DEFAULT_INVENTORY_TURNOVER_INPUT.endingInventory)
    setUseDirectAverage(DEFAULT_INVENTORY_TURNOVER_INPUT.useDirectAverage)
    setDirectAverageInventory(
      DEFAULT_INVENTORY_TURNOVER_INPUT.directAverageInventory
    )
    setResult(null)
    setMessage(null)
  }

  const computedAverage = useDirectAverage
    ? directAverageInventory
    : Math.round((beginningInventory + endingInventory) / 2)

  const resultItems = result
    ? [
        {
          label: "평균 재고액",
          value: formatWon(result.averageInventory),
          description: result.useDirectAverage
            ? "직접 입력"
            : "(기초 + 기말) ÷ 2",
        },
        {
          label: "재고 회전율",
          value: formatTurnoverRate(result.inventoryTurnover),
          description: `${result.periodLabel} 기준`,
          highlight: true,
        },
        {
          label: "재고 보유일수",
          value: formatHoldingDays(result.holdingDays),
          emphasized: true,
        },
        {
          label: "재고 관리 상태",
          value: result.managementStatusLabel,
          status: result.managementStatus,
          statusLabel: INVENTORY_MANAGEMENT_STATUS_LABEL[result.managementStatus],
          emphasized: true,
          className: "sm:col-span-2",
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        { label: "평균 재고액", value: formatWon(result.averageInventory) },
        {
          label: "재고 회전율",
          value: formatTurnoverRate(result.inventoryTurnover),
        },
        { label: "재고 보유일수", value: formatHoldingDays(result.holdingDays) },
        {
          label: "재고 관리 상태",
          value: result.managementStatusLabel,
        },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/inventory-turnover"
      resultRef={resultsRef}
      resultId="inventory-turnover-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="매출원가와 재고 정보를 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              기간 선택
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value as InventoryPeriod)}
              className={calculatorSelectClassName}
            >
              {PERIOD_OPTIONS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <MoneyField
            label="매출원가"
            description={
              period === "monthly"
                ? "해당 월 매출원가(식자재·상품 원가 등)"
                : "연간 매출원가 합계"
            }
            value={costOfGoodsSold}
            onChange={setCostOfGoodsSold}
            placeholder="15,000,000"
          />
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <input
              type="checkbox"
              checked={useDirectAverage}
              onChange={(e) => setUseDirectAverage(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-foreground">
                평균 재고액 직접 입력
              </span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                체크 시 기초·기말 재고 대신 평균 재고액을 직접 입력합니다.
              </span>
            </span>
          </label>
          {useDirectAverage ? (
            <MoneyField
              label="평균 재고액"
              value={directAverageInventory}
              onChange={setDirectAverageInventory}
              placeholder="2,500,000"
            />
          ) : (
            <>
              <MoneyField
                label="기초 재고액"
                description="기간 시작 시점 재고"
                value={beginningInventory}
                onChange={setBeginningInventory}
                placeholder="3,000,000"
              />
              <MoneyField
                label="기말 재고액"
                description="기간 종료 시점 재고"
                value={endingInventory}
                onChange={setEndingInventory}
                placeholder="2,000,000"
              />
              <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">예상 평균 재고액</span>
                <span className="font-semibold text-foreground">
                  {formatWon(computedAverage)}
                </span>
              </div>
            </>
          )}
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description="재고 회전율과 보유일수, 관리 상태입니다."
            message={message}
            items={resultItems}
            shareContext="재고 회전율 계산 결과"
            showPdf
            pdfTitle="재고 회전율 계산 결과"
            pdfSubtitle="사장만 재고 회전율 계산기"
            pdfFilename="재고회전율_계산결과"
            pdfRows={pdfRows}
          />
          {result && (
            <>
              <InventoryTurnoverFormulaCard result={result} />
              <InventoryTurnoverDetailCard result={result} />
            </>
          )}
        </>
      }
      seo={
        <>
          {seoArticles}
          <CalculatorFaq
            description={INVENTORY_TURNOVER_GUIDE_DESCRIPTION}
            items={INVENTORY_TURNOVER_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={INVENTORY_TURNOVER_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
