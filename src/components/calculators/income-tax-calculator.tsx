"use client"

import { useRef, useState, type ReactNode } from "react"
import { AlertCircle } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import {
  calculatorCardClass,
  calculatorHighlightClass,
  calculatorResultRowClass,
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
  calculateIncomeTax,
  DEFAULT_INCOME_TAX_INPUT,
  formatAmount,
  formatWon,
  parseAmountInput,
  type IncomeTaxResult,
} from "@/lib/calculators/income-tax"
import {
  INCOME_TAX_FAQ_ITEMS,
  INCOME_TAX_GUIDE_DESCRIPTION,
  INCOME_TAX_GUIDE_ITEMS,
} from "@/lib/calculators/faq/income-tax-faq"
import { cn } from "@/lib/utils"

const DISCLAIMER =
  "본 계산기는 간단한 예상 계산 도구입니다. 실제 종합소득세는 업종, 공제항목, 장부작성 여부, 세무조정에 따라 달라질 수 있으므로 신고 전 세무 전문가와 확인하세요."

interface MoneyFieldProps {
  label: string
  description?: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
}

function MoneyField({
  label,
  description,
  value,
  onChange,
  placeholder,
}: MoneyFieldProps) {
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

function formatNetPaymentLabel(netPayment: number): string {
  if (netPayment > 0) return "추가 납부 예상액"
  if (netPayment < 0) return "환급 예상액"
  return "추가 납부 또는 환급 예상액"
}

function formatNetPaymentValue(netPayment: number): string {
  if (netPayment > 0) return formatWon(netPayment)
  if (netPayment < 0) return formatWon(Math.abs(netPayment))
  return formatWon(0)
}

function IncomeTaxDetailCard({
  result,
}: {
  result: ReturnType<typeof calculateIncomeTax>
}) {
  const rows = [
    { label: "연간 매출", value: formatWon(result.annualRevenue) },
    { label: "필요경비", value: formatWon(result.expenses) },
    { label: "소득금액", value: formatWon(result.incomeAmount), highlight: true },
    { label: "공제금액", value: formatWon(result.totalDeduction) },
    { label: "과세표준", value: formatWon(result.taxableIncome), highlight: true },
    { label: "산출세액", value: formatWon(result.nationalTax) },
    { label: "기납부세액", value: formatWon(result.prepaidTax) },
    {
      label: "예상 납부세액",
      value: formatWon(result.netPayment > 0 ? result.netPayment : 0),
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

export function IncomeTaxCalculator({
  seoArticles,
}: {
  seoArticles?: ReactNode
} = {}) {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [annualRevenue, setAnnualRevenue] = useState(
    DEFAULT_INCOME_TAX_INPUT.annualRevenue
  )
  const [expenses, setExpenses] = useState(DEFAULT_INCOME_TAX_INPUT.expenses)
  const [basicDeduction, setBasicDeduction] = useState(
    DEFAULT_INCOME_TAX_INPUT.basicDeduction
  )
  const [otherDeduction, setOtherDeduction] = useState(
    DEFAULT_INCOME_TAX_INPUT.otherDeduction
  )
  const [prepaidTax, setPrepaidTax] = useState(
    DEFAULT_INCOME_TAX_INPUT.prepaidTax
  )
  const [includeLocalTax, setIncludeLocalTax] = useState(
    DEFAULT_INCOME_TAX_INPUT.includeLocalTax
  )

  const [result, setResult] = useState<IncomeTaxResult | null>(null)

  function handleCalculate() {
    setResult(
      calculateIncomeTax({
        annualRevenue,
        expenses,
        basicDeduction,
        otherDeduction,
        prepaidTax,
        includeLocalTax,
      })
    )
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setAnnualRevenue(DEFAULT_INCOME_TAX_INPUT.annualRevenue)
    setExpenses(DEFAULT_INCOME_TAX_INPUT.expenses)
    setBasicDeduction(DEFAULT_INCOME_TAX_INPUT.basicDeduction)
    setOtherDeduction(DEFAULT_INCOME_TAX_INPUT.otherDeduction)
    setPrepaidTax(DEFAULT_INCOME_TAX_INPUT.prepaidTax)
    setIncludeLocalTax(DEFAULT_INCOME_TAX_INPUT.includeLocalTax)
    setResult(null)
  }

  const netPaymentLabel = result
    ? formatNetPaymentLabel(result.netPayment)
    : "추가 납부 또는 환급 예상액"
  const netPaymentValue = result
    ? formatNetPaymentValue(result.netPayment)
    : ""
  const netPaymentClassName = result
    ? result.netPayment > 0
      ? "text-amber-700"
      : result.netPayment < 0
        ? calculatorHighlightClass
        : undefined
    : undefined

  const resultItems = result
    ? [
        {
          label: "과세표준",
          value: formatWon(result.taxableIncome),
          description: "매출 − 필요경비 − 공제금액",
        },
        {
          label: "예상 종합소득세",
          value: formatWon(result.nationalTax),
          highlight: true,
        },
        {
          label: "지방소득세",
          value: result.includeLocalTax
            ? formatWon(result.localTax)
            : "미포함 (0원)",
          description: result.includeLocalTax
            ? "종합소득세의 10%"
            : "지방소득세 포함 옵션이 꺼져 있습니다",
        },
        {
          label: "총 납부 예상세액",
          value: formatWon(result.totalTax),
          highlight: true,
          description: "종합소득세 + 지방소득세",
        },
        {
          label: netPaymentLabel,
          value: netPaymentValue,
          highlight: true,
          valueClassName: netPaymentClassName,
          className: "sm:col-span-2",
          description:
            result.prepaidTax > 0
              ? `기납부 ${formatWon(result.prepaidTax)} 반영`
              : undefined,
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        { label: "연간 매출액", value: formatWon(result.annualRevenue) },
        { label: "필요경비", value: formatWon(result.expenses) },
        { label: "과세표준", value: formatWon(result.taxableIncome) },
        { label: "예상 종합소득세", value: formatWon(result.nationalTax) },
        { label: "지방소득세", value: formatWon(result.localTax) },
        { label: "총 납부 예상세액", value: formatWon(result.totalTax) },
        { label: netPaymentLabel, value: netPaymentValue },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/income-tax"
      resultRef={resultsRef}
      resultId="income-tax-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="연간 매출, 비용, 공제금액을 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <MoneyField
            label="연간 매출액"
            description="1년간 사업 매출 합계"
            value={annualRevenue}
            onChange={setAnnualRevenue}
            placeholder="100,000,000"
          />
          <MoneyField
            label="필요경비"
            description="사업 관련 인정 비용 합계"
            value={expenses}
            onChange={setExpenses}
            placeholder="60,000,000"
          />
          <MoneyField
            label="기본공제"
            description="인적공제 등 기본 공제액"
            value={basicDeduction}
            onChange={setBasicDeduction}
            placeholder="1,500,000"
          />
          <MoneyField
            label="기타 공제"
            description="추가 소득공제·세액공제 등"
            value={otherDeduction}
            onChange={setOtherDeduction}
            placeholder="0"
          />
          <MoneyField
            label="이미 납부한 세금"
            description="중간예납·원천징수 등 기납부액"
            value={prepaidTax}
            onChange={setPrepaidTax}
            placeholder="0"
          />
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <input
              type="checkbox"
              checked={includeLocalTax}
              onChange={(e) => setIncludeLocalTax(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-foreground">
                지방소득세 포함
              </span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                체크 시 종합소득세의 10%를 지방소득세로 합산합니다.
              </span>
            </span>
          </label>
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description="간이 계산 결과입니다. 실제 신고 세액과 다를 수 있습니다."
            items={resultItems}
            shareContext="종합소득세 간이 계산 결과"
            showPdf
            pdfTitle="종합소득세 간이 계산 결과"
            pdfSubtitle="사장만 종합소득세 계산기"
            pdfFilename="종합소득세_계산결과"
            pdfRows={pdfRows}
          />

          {result && (
            <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-950">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>{DISCLAIMER}</p>
            </div>
          )}

          {result && <IncomeTaxDetailCard result={result} />}
        </>
      }
      seo={
        <>
          {seoArticles}
          <CalculatorFaq
            description={INCOME_TAX_GUIDE_DESCRIPTION}
            items={INCOME_TAX_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={INCOME_TAX_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
