"use client"

import { useRef, useState } from "react"
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
  DELIVERY_COUPON_PROFIT_FAQ_ITEMS,
  DELIVERY_COUPON_PROFIT_GUIDE_DESCRIPTION,
  DELIVERY_COUPON_PROFIT_GUIDE_ITEMS,
} from "@/lib/calculators/faq/delivery-coupon-profit-faq"
import { formatAmount, parsePositiveNumber } from "@/lib/calculators/format"
import {
  calculateDeliveryCouponProfit,
  DEFAULT_DELIVERY_COUPON_INPUT,
  formatOrders,
  formatRatePercent,
  formatWon,
  parseAmountInput,
  type DeliveryCouponProfitResult,
} from "@/lib/calculators/delivery-coupon-profit"
import { getCouponRecommendationStatus } from "@/lib/calculators/result-status"
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
        step={0.1}
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

function formatProfitDiff(diff: number): string {
  const prefix = diff > 0 ? "+" : ""
  return `${prefix}${formatWon(diff)}`
}

function DeliveryCouponProfitDetailCard({
  result,
}: {
  result: DeliveryCouponProfitResult
}) {
  const rows = [
    { label: "주문금액", value: formatWon(result.sellingPrice) },
    { label: "원가", value: formatWon(result.cost) },
    {
      label: "수수료 (쿠폰 전)",
      value: formatWon(result.totalFeeBefore),
      description: `중개 ${formatAmount(result.brokerageFee)}원 + PG ${formatAmount(result.pgFee)}원 + 부가세 ${formatAmount(result.vatBefore)}원`,
    },
    {
      label: "수수료 (쿠폰 후)",
      value: formatWon(result.totalFeeAfter),
      description: `부가세 ${formatAmount(result.vatAfter)}원 포함`,
    },
    {
      label: "쿠폰 부담액 (건당)",
      value: formatWon(result.ownerBurdenDiscount),
    },
    {
      label: "주문당 순이익 (쿠폰 전)",
      value: formatWon(result.profitBeforePerOrder),
      highlight: true,
    },
    {
      label: "주문당 순이익 (쿠폰 후)",
      value: formatWon(result.profitAfterPerOrder),
      highlight: true,
    },
    {
      label: "총 순이익 (쿠폰 전)",
      value: formatWon(result.totalProfitBefore),
      description: `${formatOrders(result.expectedOrders)} 기준`,
    },
    {
      label: "총 순이익 (쿠폰 후)",
      value: formatWon(result.totalProfitAfter),
      description: `${formatOrders(result.ordersAfterCoupon)} 기준`,
      highlight: true,
    },
    {
      label: "쿠폰 전후 차이",
      value: formatProfitDiff(result.totalProfitDiff),
      highlight: true,
      valueClassName:
        result.totalProfitDiff >= 0 ? "text-emerald-700" : "text-red-700",
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
                        row.highlight && calculatorHighlightClass,
                        "valueClassName" in row && row.valueClassName
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

function DeliveryCouponProfitFormulaCard({
  result,
}: {
  result: DeliveryCouponProfitResult
}) {
  const formulas = [
    {
      label: "쿠폰 전 순이익",
      formula: "판매가 − 원가 − 수수료",
      example: `${formatAmount(result.sellingPrice)} − ${formatAmount(result.cost)} − ${formatAmount(result.totalFeeBefore)}`,
      value: formatWon(result.profitBeforePerOrder),
    },
    {
      label: "쿠폰 후 순이익",
      formula: "판매가 − 원가 − 수수료 − 사장 부담 할인금액",
      example: `${formatAmount(result.sellingPrice)} − ${formatAmount(result.cost)} − ${formatAmount(result.totalFeeAfter)} − ${formatAmount(result.ownerBurdenDiscount)}`,
      value: formatWon(result.profitAfterPerOrder),
    },
    {
      label: "총 순이익",
      formula: "주문당 순이익 × 주문 수",
      example: `${formatAmount(Math.round(result.profitAfterPerOrder))} × ${formatAmount(result.ordersAfterCoupon)}건`,
      value: formatWon(result.totalProfitAfter),
    },
    {
      label: "손익분기 추가 주문 수",
      formula: "쿠폰 부담 총액 ÷ 쿠폰 전 주문당 순이익",
      example:
        result.profitBeforePerOrder > 0
          ? `${formatAmount(result.totalCouponBurden)} ÷ ${formatAmount(Math.round(result.profitBeforePerOrder))}`
          : "쿠폰 전 순이익 0 이하",
      value: formatOrders(result.breakEvenAdditionalOrders),
    },
  ]

  return (
    <Card className={calculatorCardClass}>
      <CardHeader className={calculatorCardHeaderClass}>
        <CardTitle>계산 공식</CardTitle>
        <CardDescription>
          수수료는 중개수수료·PG수수료·부가세(10%)를 포함합니다.
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

export function DeliveryCouponProfitCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [sellingPrice, setSellingPrice] = useState(
    DEFAULT_DELIVERY_COUPON_INPUT.sellingPrice
  )
  const [cost, setCost] = useState(DEFAULT_DELIVERY_COUPON_INPUT.cost)
  const [brokerageRate, setBrokerageRate] = useState(
    DEFAULT_DELIVERY_COUPON_INPUT.brokerageRate
  )
  const [pgRate, setPgRate] = useState(DEFAULT_DELIVERY_COUPON_INPUT.pgRate)
  const [couponDiscount, setCouponDiscount] = useState(
    DEFAULT_DELIVERY_COUPON_INPUT.couponDiscount
  )
  const [ownerBurdenDiscount, setOwnerBurdenDiscount] = useState(
    DEFAULT_DELIVERY_COUPON_INPUT.ownerBurdenDiscount
  )
  const [expectedOrders, setExpectedOrders] = useState(
    DEFAULT_DELIVERY_COUPON_INPUT.expectedOrders
  )
  const [orderIncreaseRate, setOrderIncreaseRate] = useState(
    DEFAULT_DELIVERY_COUPON_INPUT.orderIncreaseRate
  )
  const [result, setResult] = useState<DeliveryCouponProfitResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    const calculated = calculateDeliveryCouponProfit({
      sellingPrice,
      cost,
      brokerageRate,
      pgRate,
      couponDiscount,
      ownerBurdenDiscount,
      expectedOrders,
      orderIncreaseRate,
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
    setSellingPrice(DEFAULT_DELIVERY_COUPON_INPUT.sellingPrice)
    setCost(DEFAULT_DELIVERY_COUPON_INPUT.cost)
    setBrokerageRate(DEFAULT_DELIVERY_COUPON_INPUT.brokerageRate)
    setPgRate(DEFAULT_DELIVERY_COUPON_INPUT.pgRate)
    setCouponDiscount(DEFAULT_DELIVERY_COUPON_INPUT.couponDiscount)
    setOwnerBurdenDiscount(DEFAULT_DELIVERY_COUPON_INPUT.ownerBurdenDiscount)
    setExpectedOrders(DEFAULT_DELIVERY_COUPON_INPUT.expectedOrders)
    setOrderIncreaseRate(DEFAULT_DELIVERY_COUPON_INPUT.orderIncreaseRate)
    setResult(null)
    setMessage(null)
  }

  const recommendationStatus = result
    ? getCouponRecommendationStatus(result.recommendation)
    : undefined

  const resultItems = result
    ? [
        {
          label: "쿠폰 적용 전 순이익",
          value: formatWon(result.totalProfitBefore),
          description: `${formatOrders(result.expectedOrders)} · 건당 ${formatWon(result.profitBeforePerOrder)}`,
        },
        {
          label: "쿠폰 적용 후 순이익",
          value: formatWon(result.totalProfitAfter),
          description: `${formatOrders(result.ordersAfterCoupon)} · 건당 ${formatWon(result.profitAfterPerOrder)}`,
          highlight: true,
        },
        {
          label: "총 쿠폰 부담액",
          value: formatWon(result.totalCouponBurden),
          description: `건당 ${formatWon(result.ownerBurdenDiscount)} × ${formatOrders(result.ordersAfterCoupon)}`,
        },
        {
          label: "추가 주문 수",
          value: formatOrders(result.additionalOrders),
          description: `증가율 ${formatRatePercent(result.orderIncreaseRate)}`,
        },
        {
          label: "손익분기 추가 주문 수",
          value: formatOrders(result.breakEvenAdditionalOrders),
          description: "쿠폰 부담을 상쇄하는 데 필요한 추가 주문",
          emphasized: true,
        },
        {
          label: "쿠폰 진행 추천 여부",
          value: result.recommendationLabel,
          status: recommendationStatus,
          statusLabel: result.recommendationLabel,
          emphasized: true,
          className: "sm:col-span-2",
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        {
          label: "쿠폰 적용 전 순이익",
          value: formatWon(result.totalProfitBefore),
        },
        {
          label: "쿠폰 적용 후 순이익",
          value: formatWon(result.totalProfitAfter),
        },
        { label: "총 쿠폰 부담액", value: formatWon(result.totalCouponBurden) },
        { label: "추가 주문 수", value: formatOrders(result.additionalOrders) },
        {
          label: "손익분기 추가 주문 수",
          value: formatOrders(result.breakEvenAdditionalOrders),
        },
        {
          label: "쿠폰 진행 추천",
          value: result.recommendationLabel,
        },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/delivery-coupon-profit"
      resultRef={resultsRef}
      resultId="delivery-coupon-profit-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="메뉴·수수료·쿠폰 조건을 입력하면 쿠폰 손익을 확인할 수 있습니다."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <MoneyField
            label="메뉴 판매가"
            value={sellingPrice}
            onChange={setSellingPrice}
            placeholder="30,000"
          />
          <MoneyField
            label="원가"
            value={cost}
            onChange={setCost}
            placeholder="10,500"
          />
          <RateField
            label="배달앱 수수료율 (%)"
            description="중개수수료율"
            value={brokerageRate}
            onChange={setBrokerageRate}
            placeholder="7.8"
          />
          <RateField
            label="PG 수수료율 (%)"
            value={pgRate}
            onChange={setPgRate}
            placeholder="3.0"
          />
          <MoneyField
            label="쿠폰 할인금액"
            description="고객에게 적용되는 총 할인액"
            value={couponDiscount}
            onChange={setCouponDiscount}
            placeholder="3,000"
          />
          <MoneyField
            label="사장 부담 할인금액"
            description="정산에서 차감되는 본인 부담분"
            value={ownerBurdenDiscount}
            onChange={setOwnerBurdenDiscount}
            placeholder="3,000"
          />
          <CountField
            label="예상 주문 수"
            description="쿠폰 적용 전 기준 주문 수"
            value={expectedOrders}
            onChange={setExpectedOrders}
            placeholder="200"
          />
          <RateField
            label="쿠폰 적용 후 주문 증가율 (%)"
            description="쿠폰 이벤트로 늘어날 것으로 예상하는 주문 증가율"
            value={orderIncreaseRate}
            onChange={setOrderIncreaseRate}
            placeholder="20"
          />
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description="쿠폰 적용 전·후 순이익과 손익분기 주문 수입니다."
            message={message}
            items={resultItems}
            shareContext="배달 쿠폰 손익 계산 결과"
            showPdf
            pdfTitle="배달 쿠폰 손익 계산 결과"
            pdfSubtitle="사장만 배달 쿠폰 손익 계산기"
            pdfFilename="배달쿠폰손익_계산결과"
            pdfRows={pdfRows}
            footer={
              result && result.profitBeforePerOrder <= 0 ? (
                <div className="flex gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-relaxed text-red-950">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>
                    쿠폰 적용 전에도 건당 순이익이 0 이하입니다. 쿠폰 이벤트
                    전에 메뉴 원가·판매가를 먼저 점검하세요.
                  </p>
                </div>
              ) : undefined
            }
          />
          {result && (
            <>
              <DeliveryCouponProfitFormulaCard result={result} />
              <DeliveryCouponProfitDetailCard result={result} />
            </>
          )}
        </>
      }
      seo={
        <>
          <CalculatorFaq
            description={DELIVERY_COUPON_PROFIT_GUIDE_DESCRIPTION}
            items={DELIVERY_COUPON_PROFIT_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={DELIVERY_COUPON_PROFIT_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
