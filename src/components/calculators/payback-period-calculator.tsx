"use client"

import { useRef, useState, type ReactNode } from "react"
import { AlertCircle } from "lucide-react"

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
  PAYBACK_PERIOD_FAQ_ITEMS,
  PAYBACK_PERIOD_GUIDE_DESCRIPTION,
  PAYBACK_PERIOD_GUIDE_ITEMS,
} from "@/lib/calculators/faq/payback-period-faq"
import { formatAmount, parseAmountInput } from "@/lib/calculators/format"
import {
  calculatePaybackPeriod,
  DEFAULT_PAYBACK_PERIOD_INPUT,
  formatPaybackMonths,
  formatWon,
  type PaybackPeriodResult,
} from "@/lib/calculators/payback-period"
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

function PaybackPeriodDetailCard({ result }: { result: PaybackPeriodResult }) {
  const rows = [
    { label: "초기 투자금", value: formatWon(result.initialInvestment) },
    { label: "보증금", value: formatWon(result.deposit) },
    { label: "인테리어 비용", value: formatWon(result.interiorCost) },
    { label: "장비 비용", value: formatWon(result.equipmentCost) },
    { label: "기타 비용", value: formatWon(result.otherStartupCost) },
    {
      label: "총 투자금",
      value: formatWon(result.totalInvestment),
      highlight: true,
    },
    {
      label: "월 순이익",
      value: formatWon(result.monthlyNetProfit),
      highlight: true,
    },
    {
      label: "회수기간",
      value: result.canRecover
        ? formatPaybackMonths(result.paybackMonths!)
        : "회수 불가",
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

function PaybackPeriodFormulaCard({ result }: { result: PaybackPeriodResult }) {
  const formulas = [
    {
      label: "총 투자금",
      formula: "초기 투자금 + 보증금 + 인테리어 + 장비 + 기타",
      example: `${formatAmount(result.initialInvestment)} + ${formatAmount(result.deposit)} + ${formatAmount(result.interiorCost)} + ${formatAmount(result.equipmentCost)} + ${formatAmount(result.otherStartupCost)}`,
      value: formatWon(result.totalInvestment),
    },
    {
      label: "월 순이익",
      formula: result.useDirectNetProfit
        ? "직접 입력값"
        : "월 매출 − 월 비용",
      example: result.useDirectNetProfit
        ? "직접 입력"
        : `${formatAmount(result.monthlyRevenue)} − ${formatAmount(result.monthlyCost)}`,
      value: formatWon(result.monthlyNetProfit),
    },
    {
      label: "회수기간",
      formula: "총 투자금 ÷ 월 순이익",
      example: result.canRecover
        ? `${formatAmount(result.totalInvestment)} ÷ ${formatAmount(Math.round(result.monthlyNetProfit))}`
        : "월 순이익 0 이하",
      value: result.canRecover
        ? formatPaybackMonths(result.paybackMonths!)
        : "회수 불가",
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

export function PaybackPeriodCalculator({
  seoArticles,
}: {
  seoArticles?: ReactNode
} = {}) {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [initialInvestment, setInitialInvestment] = useState(
    DEFAULT_PAYBACK_PERIOD_INPUT.initialInvestment
  )
  const [deposit, setDeposit] = useState(DEFAULT_PAYBACK_PERIOD_INPUT.deposit)
  const [interiorCost, setInteriorCost] = useState(
    DEFAULT_PAYBACK_PERIOD_INPUT.interiorCost
  )
  const [equipmentCost, setEquipmentCost] = useState(
    DEFAULT_PAYBACK_PERIOD_INPUT.equipmentCost
  )
  const [otherStartupCost, setOtherStartupCost] = useState(
    DEFAULT_PAYBACK_PERIOD_INPUT.otherStartupCost
  )
  const [monthlyRevenue, setMonthlyRevenue] = useState(
    DEFAULT_PAYBACK_PERIOD_INPUT.monthlyRevenue
  )
  const [monthlyCost, setMonthlyCost] = useState(
    DEFAULT_PAYBACK_PERIOD_INPUT.monthlyCost
  )
  const [useDirectNetProfit, setUseDirectNetProfit] = useState(
    DEFAULT_PAYBACK_PERIOD_INPUT.useDirectNetProfit
  )
  const [directMonthlyNetProfit, setDirectMonthlyNetProfit] = useState(
    DEFAULT_PAYBACK_PERIOD_INPUT.directMonthlyNetProfit
  )
  const [result, setResult] = useState<PaybackPeriodResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    const calculated = calculatePaybackPeriod({
      initialInvestment,
      deposit,
      interiorCost,
      equipmentCost,
      otherStartupCost,
      monthlyRevenue,
      monthlyCost,
      useDirectNetProfit,
      directMonthlyNetProfit,
    })

    if (!calculated.canCalculate) {
      setResult(null)
      setMessage(calculated.errorMessage)
    } else {
      setResult(calculated)
      setMessage(calculated.recoveryMessage)
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setInitialInvestment(DEFAULT_PAYBACK_PERIOD_INPUT.initialInvestment)
    setDeposit(DEFAULT_PAYBACK_PERIOD_INPUT.deposit)
    setInteriorCost(DEFAULT_PAYBACK_PERIOD_INPUT.interiorCost)
    setEquipmentCost(DEFAULT_PAYBACK_PERIOD_INPUT.equipmentCost)
    setOtherStartupCost(DEFAULT_PAYBACK_PERIOD_INPUT.otherStartupCost)
    setMonthlyRevenue(DEFAULT_PAYBACK_PERIOD_INPUT.monthlyRevenue)
    setMonthlyCost(DEFAULT_PAYBACK_PERIOD_INPUT.monthlyCost)
    setUseDirectNetProfit(DEFAULT_PAYBACK_PERIOD_INPUT.useDirectNetProfit)
    setDirectMonthlyNetProfit(DEFAULT_PAYBACK_PERIOD_INPUT.directMonthlyNetProfit)
    setResult(null)
    setMessage(null)
  }

  const resultItems = result
    ? [
        {
          label: "총 투자금",
          value: formatWon(result.totalInvestment),
          description: "창업·초기 투입 비용 합계",
        },
        {
          label: "월 예상 순이익",
          value: formatWon(result.monthlyNetProfit),
          highlight: true,
          valueClassName:
            result.monthlyNetProfit <= 0 ? "text-red-700" : undefined,
        },
        {
          label: "투자금 회수기간",
          value: result.canRecover
            ? formatPaybackMonths(result.paybackMonths!)
            : "회수 불가",
          emphasized: result.canRecover,
          valueClassName: result.canRecover ? undefined : "text-red-700",
          className: result.canRecover ? undefined : "sm:col-span-2",
        },
        ...(result.canRecover
          ? [
              {
                label: "연간 예상 순이익",
                value: formatWon(result.annualNetProfit),
                highlight: true,
              },
              {
                label: "회수 이후 예상 누적 이익",
                value: formatWon(result.cumulativeProfitAfterRecovery),
                description: "회수 완료 후 12개월 기준",
                highlight: true,
                className: "sm:col-span-2" as const,
              },
            ]
          : []),
      ]
    : undefined

  const pdfRows = result
    ? [
        { label: "총 투자금", value: formatWon(result.totalInvestment) },
        { label: "월 예상 순이익", value: formatWon(result.monthlyNetProfit) },
        {
          label: "투자금 회수기간",
          value: result.canRecover
            ? formatPaybackMonths(result.paybackMonths!)
            : "회수 불가",
        },
        { label: "연간 예상 순이익", value: formatWon(result.annualNetProfit) },
        {
          label: "회수 이후 12개월 누적 이익",
          value: formatWon(result.cumulativeProfitAfterRecovery),
        },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/payback-period"
      resultRef={resultsRef}
      resultId="payback-period-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="창업비용과 월 손익 정보를 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <MoneyField
            label="초기 투자금"
            description="권리금, 가입비, 초기 재고 등"
            value={initialInvestment}
            onChange={setInitialInvestment}
            placeholder="10,000,000"
          />
          <MoneyField
            label="보증금"
            value={deposit}
            onChange={setDeposit}
            placeholder="30,000,000"
          />
          <MoneyField
            label="인테리어 비용"
            value={interiorCost}
            onChange={setInteriorCost}
            placeholder="50,000,000"
          />
          <MoneyField
            label="장비/설비 비용"
            value={equipmentCost}
            onChange={setEquipmentCost}
            placeholder="20,000,000"
          />
          <MoneyField
            label="기타 창업비용"
            description="허가·간판·POS 등"
            value={otherStartupCost}
            onChange={setOtherStartupCost}
            placeholder="5,000,000"
          />

          <div className="border-t border-slate-200 pt-4">
            <p className="mb-3 text-sm font-medium text-foreground">
              월 손익 정보
            </p>
            <div className="space-y-5">
              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
                <input
                  type="checkbox"
                  checked={useDirectNetProfit}
                  onChange={(e) => setUseDirectNetProfit(e.target.checked)}
                  className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
                />
                <span className="space-y-0.5">
                  <span className="block text-sm font-medium text-foreground">
                    월 예상 순이익 직접 입력
                  </span>
                  <span className="block text-xs leading-relaxed text-muted-foreground">
                    체크 시 매출·비용 대신 순이익을 직접 입력합니다.
                  </span>
                </span>
              </label>

              {useDirectNetProfit ? (
                <MoneyField
                  label="월 예상 순이익"
                  value={directMonthlyNetProfit}
                  onChange={setDirectMonthlyNetProfit}
                  placeholder="5,000,000"
                />
              ) : (
                <>
                  <MoneyField
                    label="월 예상 매출"
                    value={monthlyRevenue}
                    onChange={setMonthlyRevenue}
                    placeholder="25,000,000"
                  />
                  <MoneyField
                    label="월 예상 비용"
                    description="원가, 인건비, 임대료, 수수료 등"
                    value={monthlyCost}
                    onChange={setMonthlyCost}
                    placeholder="18,000,000"
                  />
                </>
              )}
            </div>
          </div>
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description="창업비용 대비 투자금 회수기간 예상입니다."
            message={message}
            items={resultItems}
            shareContext="투자금 회수기간 계산 결과"
            showPdf
            pdfTitle="투자금 회수기간 계산 결과"
            pdfSubtitle="사장만 투자금 회수기간 계산기"
            pdfFilename="투자금회수기간_계산결과"
            pdfRows={pdfRows}
            footer={
              result && !result.canRecover ? (
                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-950">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>현재 조건에서는 투자금 회수가 어렵습니다.</p>
                </div>
              ) : undefined
            }
          />
          {result && (
            <>
              <PaybackPeriodFormulaCard result={result} />
              <PaybackPeriodDetailCard result={result} />
            </>
          )}
        </>
      }
      seo={
        <>
          {seoArticles}
          <CalculatorFaq
            description={PAYBACK_PERIOD_GUIDE_DESCRIPTION}
            items={PAYBACK_PERIOD_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={PAYBACK_PERIOD_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
