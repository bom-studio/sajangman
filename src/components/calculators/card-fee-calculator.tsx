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
  CARD_FEE_FAQ_ITEMS,
  CARD_FEE_GUIDE_DESCRIPTION,
  CARD_FEE_GUIDE_ITEMS,
} from "@/lib/calculators/faq/card-fee-faq"
import { formatAmount, parsePositiveNumber } from "@/lib/calculators/format"
import {
  calculateCardFee,
  DEFAULT_CARD_FEE_INPUT,
  formatRatePercent,
  formatTransactions,
  formatVatIncludedLabel,
  formatWon,
  parseAmountInput,
  type CardFeeResult,
} from "@/lib/calculators/card-fee"
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
        step={0.01}
        value={value || ""}
        onChange={(e) => onChange(parsePositiveNumber(e.target.value))}
        placeholder={placeholder}
      />
    </div>
  )
}

function CountField({
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
        onChange={(e) =>
          onChange(Math.max(0, Math.floor(parseAmountInput(e.target.value))))
        }
        placeholder={placeholder}
      />
    </div>
  )
}

function CardFeeDetailCard({ result }: { result: CardFeeResult }) {
  const rows = [
    { label: "카드 매출", value: formatWon(result.cardSales), highlight: true },
    {
      label: "수수료율",
      value: `${formatRatePercent(result.feeRate)} (${formatVatIncludedLabel(result.vatIncluded)})`,
    },
    {
      label: "수수료 (공급가)",
      value: formatWon(result.feeBase),
      description: result.vatIncluded ? "부가세 포함 금액에서 역산" : undefined,
    },
    ...(result.vatOnFee > 0
      ? [{ label: "부가세 (10%)", value: formatWon(result.vatOnFee) }]
      : []),
    { label: "카드 수수료", value: formatWon(result.cardFee), highlight: true },
    {
      label: "정산금액",
      value: formatWon(result.settlementAmount),
      highlight: true,
    },
    {
      label: "거래 건수",
      value: formatTransactions(result.monthlyTransactionCount),
    },
    {
      label: "건당 평균 수수료",
      value: formatWon(result.feePerTransaction),
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

function CardFeeFormulaCard({ result }: { result: CardFeeResult }) {
  const feeFormula = result.vatIncluded
    ? "카드 매출액 × 수수료율 (부가세 포함)"
    : "카드 매출액 × 수수료율 + 부가세(10%)"

  const feeExample = result.vatIncluded
    ? `${formatAmount(result.cardSales)} × ${formatRatePercent(result.feeRate)}`
    : `${formatAmount(result.feeBase)} + ${formatAmount(result.vatOnFee)}`

  const formulas = [
    {
      label: "카드 수수료",
      formula: feeFormula,
      example: feeExample,
      value: formatWon(result.cardFee),
    },
    {
      label: "정산금액",
      formula: "카드 매출액 − 카드 수수료",
      example: `${formatAmount(result.cardSales)} − ${formatAmount(result.cardFee)}`,
      value: formatWon(result.settlementAmount),
    },
    {
      label: "건당 수수료",
      formula: "카드 수수료 ÷ 거래 건수",
      example: `${formatAmount(result.cardFee)} ÷ ${formatAmount(result.monthlyTransactionCount)}건`,
      value: formatWon(result.feePerTransaction),
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

export function CardFeeCalculator({
  seoArticles,
}: {
  seoArticles?: ReactNode
} = {}) {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [cardSales, setCardSales] = useState(DEFAULT_CARD_FEE_INPUT.cardSales)
  const [feeRate, setFeeRate] = useState(DEFAULT_CARD_FEE_INPUT.feeRate)
  const [vatIncluded, setVatIncluded] = useState(
    DEFAULT_CARD_FEE_INPUT.vatIncluded
  )
  const [monthlyTransactionCount, setMonthlyTransactionCount] = useState(
    DEFAULT_CARD_FEE_INPUT.monthlyTransactionCount
  )
  const [averagePayment, setAveragePayment] = useState(
    DEFAULT_CARD_FEE_INPUT.averagePayment
  )
  const [result, setResult] = useState<CardFeeResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    const calculated = calculateCardFee({
      cardSales,
      feeRate,
      vatIncluded,
      monthlyTransactionCount,
      averagePayment,
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
    setCardSales(DEFAULT_CARD_FEE_INPUT.cardSales)
    setFeeRate(DEFAULT_CARD_FEE_INPUT.feeRate)
    setVatIncluded(DEFAULT_CARD_FEE_INPUT.vatIncluded)
    setMonthlyTransactionCount(DEFAULT_CARD_FEE_INPUT.monthlyTransactionCount)
    setAveragePayment(DEFAULT_CARD_FEE_INPUT.averagePayment)
    setResult(null)
    setMessage(null)
  }

  const estimatedSales = monthlyTransactionCount * averagePayment
  const salesMismatch =
    result &&
    averagePayment > 0 &&
    monthlyTransactionCount > 0 &&
    Math.abs(estimatedSales - cardSales) / cardSales > 0.05

  const resultItems = result
    ? [
        {
          label: "카드 수수료",
          value: formatWon(result.cardFee),
          description: `공급가 ${formatWon(result.feeBase)} + 부가세 ${formatWon(result.vatOnFee)} (${formatVatIncludedLabel(result.vatIncluded)})`,
          highlight: true,
        },
        {
          label: "실제 정산금액",
          value: formatWon(result.settlementAmount),
          description: "카드 매출에서 수수료 차감 후 입금 예상액",
          emphasized: true,
        },
        {
          label: "평균 건당 수수료",
          value: formatWon(result.feePerTransaction),
          description: `${formatTransactions(result.monthlyTransactionCount)} 기준`,
        },
        {
          label: "월 총 수수료",
          value: formatWon(result.monthlyTotalFee),
        },
        {
          label: "수수료율",
          value: `${formatRatePercent(result.effectiveFeeRate)}`,
          description: `입력 ${formatRatePercent(result.feeRate)} (${formatVatIncludedLabel(result.vatIncluded)})`,
          highlight: true,
          className: "sm:col-span-2",
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        { label: "카드 매출", value: formatWon(result.cardSales) },
        { label: "카드 수수료", value: formatWon(result.cardFee) },
        { label: "실제 정산금액", value: formatWon(result.settlementAmount) },
        {
          label: "평균 건당 수수료",
          value: formatWon(result.feePerTransaction),
        },
        { label: "월 총 수수료", value: formatWon(result.monthlyTotalFee) },
        {
          label: "실효 수수료율",
          value: formatRatePercent(result.effectiveFeeRate),
        },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/card-fee"
      resultRef={resultsRef}
      resultId="card-fee-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="카드 매출과 수수료 조건을 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <MoneyField
            label="카드 매출액"
            description="월간 카드 결제 매출 합계"
            value={cardSales}
            onChange={setCardSales}
            placeholder="10,000,000"
          />
          <RateField
            label="카드 수수료율 (%)"
            description="VAN·PG 계약서 기준 수수료율"
            value={feeRate}
            onChange={setFeeRate}
            placeholder="2.0"
          />
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <input
              type="checkbox"
              checked={vatIncluded}
              onChange={(e) => setVatIncluded(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-foreground">
                부가세 포함
              </span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                체크 시 입력한 수수료율에 부가세가 포함된 것으로 계산합니다.
                미체크 시 부가세 10%가 추가됩니다.
              </span>
            </span>
          </label>
          <CountField
            label="월 카드 거래 건수"
            value={monthlyTransactionCount}
            onChange={setMonthlyTransactionCount}
            placeholder="500"
          />
          <MoneyField
            label="평균 결제금액"
            description="건당 평균 카드 결제 금액"
            value={averagePayment}
            onChange={setAveragePayment}
            placeholder="20,000"
          />
          {monthlyTransactionCount > 0 && averagePayment > 0 && (
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">참고: 건수 × 평균 결제</span>
              <span className="font-semibold text-foreground">
                {formatWon(estimatedSales)}
              </span>
            </div>
          )}
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description={`부가세 ${formatVatIncludedLabel(vatIncluded)} 기준 카드 수수료와 정산금액입니다.`}
            message={message}
            items={resultItems}
            shareContext="카드 수수료 계산 결과"
            showPdf
            pdfTitle="카드 수수료 계산 결과"
            pdfSubtitle="사장만 카드 수수료 계산기"
            pdfFilename="카드수수료_계산결과"
            pdfRows={pdfRows}
            footer={
              salesMismatch ? (
                <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
                  거래 건수 × 평균 결제금액({formatWon(estimatedSales)})과
                  입력한 카드 매출액({formatWon(cardSales)})이 다릅니다. 건당
                  수수료 계산 시 거래 건수를 기준으로 합니다.
                </p>
              ) : undefined
            }
          />
          {result && (
            <>
              <CardFeeFormulaCard result={result} />
              <CardFeeDetailCard result={result} />
            </>
          )}
        </>
      }
      seo={
        <>
          {seoArticles}
          <CalculatorFaq
            description={CARD_FEE_GUIDE_DESCRIPTION}
            items={CARD_FEE_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={CARD_FEE_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
