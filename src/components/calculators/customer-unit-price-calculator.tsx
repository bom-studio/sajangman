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
  CUSTOMER_UNIT_PRICE_FAQ_ITEMS,
  CUSTOMER_UNIT_PRICE_GUIDE_DESCRIPTION,
  CUSTOMER_UNIT_PRICE_GUIDE_ITEMS,
} from "@/lib/calculators/faq/customer-unit-price-faq"
import { formatAmount, parseAmountInput, parsePositiveNumber } from "@/lib/calculators/format"
import {
  calculateCustomerUnitPrice,
  DEFAULT_CUSTOMER_UNIT_PRICE_INPUT,
  formatCustomers,
  formatWon,
  type CustomerUnitPriceResult,
} from "@/lib/calculators/customer-unit-price"
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

function CustomerUnitPriceDetailCard({
  result,
}: {
  result: CustomerUnitPriceResult
}) {
  const rows = [
    { label: "총 매출", value: formatWon(result.totalRevenue) },
    { label: "고객 수", value: formatCustomers(result.customerCount) },
    {
      label: "객단가",
      value: formatWon(result.averageUnitPrice),
      highlight: true,
    },
    { label: "목표 매출", value: formatWon(result.targetRevenue) },
    {
      label: "필요 고객 수",
      value: formatCustomers(result.requiredTotalCustomers),
      highlight: true,
    },
    {
      label: "하루 필요 고객 수",
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

function CustomerUnitPriceFormulaCard({
  result,
}: {
  result: CustomerUnitPriceResult
}) {
  const formulas = [
    {
      label: "객단가",
      formula: "총 매출 ÷ 고객 수",
      example: `${formatAmount(result.totalRevenue)} ÷ ${result.customerCount.toLocaleString("ko-KR")}명`,
      value: formatWon(result.averageUnitPrice),
    },
    {
      label: "필요 고객 수",
      formula: "목표 매출 ÷ 객단가",
      example: `${formatAmount(result.targetRevenue)} ÷ ${formatAmount(Math.round(result.averageUnitPrice))}`,
      value: formatCustomers(result.requiredTotalCustomers),
    },
    {
      label: "하루 필요 고객 수",
      formula: "필요 고객 수 ÷ 영업일수",
      example: `${result.requiredTotalCustomers.toLocaleString("ko-KR")}명 ÷ ${result.businessDays}일`,
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

export function CustomerUnitPriceCalculator({
  seoArticles,
}: {
  seoArticles?: ReactNode
} = {}) {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [totalRevenue, setTotalRevenue] = useState(
    DEFAULT_CUSTOMER_UNIT_PRICE_INPUT.totalRevenue
  )
  const [customerCount, setCustomerCount] = useState(
    DEFAULT_CUSTOMER_UNIT_PRICE_INPUT.customerCount
  )
  const [targetRevenue, setTargetRevenue] = useState(
    DEFAULT_CUSTOMER_UNIT_PRICE_INPUT.targetRevenue
  )
  const [businessDays, setBusinessDays] = useState(
    DEFAULT_CUSTOMER_UNIT_PRICE_INPUT.businessDays
  )
  const [result, setResult] = useState<CustomerUnitPriceResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    const calculated = calculateCustomerUnitPrice({
      totalRevenue,
      customerCount,
      targetRevenue,
      businessDays,
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
    setTotalRevenue(DEFAULT_CUSTOMER_UNIT_PRICE_INPUT.totalRevenue)
    setCustomerCount(DEFAULT_CUSTOMER_UNIT_PRICE_INPUT.customerCount)
    setTargetRevenue(DEFAULT_CUSTOMER_UNIT_PRICE_INPUT.targetRevenue)
    setBusinessDays(DEFAULT_CUSTOMER_UNIT_PRICE_INPUT.businessDays)
    setResult(null)
    setMessage(null)
  }

  const resultItems = result
    ? [
        {
          label: "평균 객단가",
          value: formatWon(result.averageUnitPrice),
          emphasized: true,
          description: "총 매출 ÷ 고객 수",
        },
        {
          label: "목표 매출 달성에 필요한 총 고객 수",
          value: formatCustomers(result.requiredTotalCustomers),
          highlight: true,
        },
        {
          label: "하루 필요 고객 수",
          value: formatCustomers(result.requiredDailyCustomers),
          highlight: true,
          description: `${result.businessDays}영업일 기준`,
        },
        {
          label: "현재 대비 추가 필요 고객 수",
          value: formatCustomers(result.additionalCustomers),
          valueClassName:
            result.additionalCustomers > 0 ? "text-amber-700" : undefined,
          className: "sm:col-span-2",
          description:
            result.additionalCustomers > 0
              ? `현재 ${formatCustomers(result.customerCount)} 대비`
              : "목표 매출을 이미 달성한 수준입니다",
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        { label: "총 매출", value: formatWon(result.totalRevenue) },
        { label: "고객 수", value: formatCustomers(result.customerCount) },
        { label: "평균 객단가", value: formatWon(result.averageUnitPrice) },
        { label: "목표 매출", value: formatWon(result.targetRevenue) },
        {
          label: "필요 총 고객 수",
          value: formatCustomers(result.requiredTotalCustomers),
        },
        {
          label: "하루 필요 고객 수",
          value: formatCustomers(result.requiredDailyCustomers),
        },
        {
          label: "추가 필요 고객 수",
          value: formatCustomers(result.additionalCustomers),
        },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/customer-unit-price"
      resultRef={resultsRef}
      resultId="customer-unit-price-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="매출과 고객 수, 목표 매출을 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <MoneyField
            label="총 매출"
            description="분석 기간(예: 한 달) 총 매출"
            value={totalRevenue}
            onChange={setTotalRevenue}
            placeholder="30,000,000"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              고객 수
            </label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              같은 기간 결제 건수 또는 방문 고객 수
            </p>
            <Input
              type="number"
              min={1}
              step={1}
              value={customerCount || ""}
              onChange={(e) =>
                setCustomerCount(parsePositiveNumber(e.target.value))
              }
              placeholder="2000"
            />
          </div>
          <MoneyField
            label="목표 매출"
            description="달성하고 싶은 매출 목표"
            value={targetRevenue}
            onChange={setTargetRevenue}
            placeholder="40,000,000"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              영업일수
            </label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              목표 기간 중 실제 영업일
            </p>
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
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description="평균 객단가와 목표 매출 달성에 필요한 고객 수입니다."
            message={message}
            items={resultItems}
            shareContext="객단가 계산 결과"
            showPdf
            pdfTitle="객단가 계산 결과"
            pdfSubtitle="사장만 객단가 계산기"
            pdfFilename="객단가_계산결과"
            pdfRows={pdfRows}
          />
          {result && (
            <>
              <CustomerUnitPriceFormulaCard result={result} />
              <CustomerUnitPriceDetailCard result={result} />
            </>
          )}
        </>
      }
      seo={
        <>
          {seoArticles}
          <CalculatorFaq
            description={CUSTOMER_UNIT_PRICE_GUIDE_DESCRIPTION}
            items={CUSTOMER_UNIT_PRICE_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={CUSTOMER_UNIT_PRICE_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
