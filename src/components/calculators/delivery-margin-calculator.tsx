"use client"

import { useRef, useState } from "react"
import { AlertCircle } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import {
  DELIVERY_MARGIN_FAQ_ITEMS,
  DELIVERY_MARGIN_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/delivery-margin-faq"
import {
  calculatorCardClass,
  calculatorCardContentClass,
  calculatorCardHeaderClass,
  calculatorHighlightClass,
  calculatorResultRowClass,
  calculatorSelectClassName,
} from "@/components/calculators/calculator-styles"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  calculateDeliveryMargin,
  compareAllDeliveryApps,
  logDeliveryMarginResults,
  FEE_REFERENCE_TABLE,
  formatAmount,
  formatPercent,
  getAppLabel,
  ORDER_TYPES,
  parseAmountInput,
  SALES_TIERS,
  showsSalesTierForView,
  VIEW_MODES,
  type AppComparisonResult,
  type DeliveryAppId,
  type DeliveryMarginResult,
  type OrderTypeId,
  type SalesTierId,
  type ViewModeId,
} from "@/lib/delivery-margin"
import { cn } from "@/lib/utils"

const DEFAULT_INPUTS = {
  viewMode: "compare" as ViewModeId,
  orderType: "delivery" as OrderTypeId,
  salesTier: "top35" as SalesTierId,
  orderAmount: 30000,
  cost: 10500,
  customerDeliveryFee: 0,
  ownerDeliveryFee: 3000,
  ownerDiscount: 0,
}

const RANK_BADGES = [
  { emoji: "🥇", label: "가장 유리" },
  { emoji: "🥈", label: "2위" },
  { emoji: "🥉", label: "3위" },
  { emoji: "", label: "4위" },
] as const

const DISCLAIMER = [
  "본 계산기는 참고용입니다.",
  "실제 정산금액은 계약 조건, 광고상품, 프로모션, 배달거리, 지역, 결제수단 등에 따라 달라질 수 있습니다.",
  "배달앱 수수료는 공개된 기준을 참고하여 계산됩니다.",
] as const

interface MoneyFieldProps {
  label: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
  description?: string
  className?: string
}

function MoneyField({
  label,
  value,
  onChange,
  placeholder,
  description,
  className,
}: MoneyFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
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

function formatCostRate(cost: number, orderAmount: number): string {
  if (orderAmount <= 0) return "0.0"
  return ((cost / orderAmount) * 100).toFixed(1)
}

function ResultMetric({
  label,
  value,
  emphasis = false,
}: {
  label: string
  value: string
  emphasis?: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={cn(
          "font-medium",
          emphasis ? "text-base font-bold text-primary" : "text-foreground"
        )}
      >
        {value}
      </span>
    </div>
  )
}

function CompareAppCard({
  item,
  rank,
  isSelected,
  onSelect,
}: {
  item: AppComparisonResult
  rank: number
  isSelected: boolean
  onSelect: () => void
}) {
  const badge = RANK_BADGES[rank] ?? RANK_BADGES[3]

  return (
    <button
      type="button"
      onClick={onSelect}
      className="w-full text-left"
    >
      <Card
        className={cn(
          calculatorCardClass,
          "transition-all duration-200 hover:-translate-y-1 hover:shadow-md",
          isSelected ? "border-blue-600 ring-2 ring-blue-600" : ""
        )}
      >
        <CardContent className="space-y-4 p-5">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="text-lg font-bold text-foreground">
                {item.shortLabel}
              </p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
                rank === 0
                  ? "bg-primary/10 text-primary"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {badge.emoji && <span>{badge.emoji}</span>}
              {badge.label}
            </span>
          </div>
          <div className="space-y-2.5">
            <ResultMetric
              label="총 차감액"
              value={`${formatAmount(item.result.totalDeduction)}원`}
            />
            <ResultMetric
              label="예상 정산금액"
              value={`${formatAmount(item.result.settlementAmount)}원`}
            />
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">예상 순이익</span>
              <span className={cn("text-base font-bold", calculatorHighlightClass)}>
                {formatAmount(item.result.netProfit)}원
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="text-muted-foreground">마진율</span>
              <span className="font-bold text-blue-600">
                {formatPercent(item.result.marginRate)}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  )
}

function SingleAppResultCard({
  appLabel,
  result,
  ownerDeliveryFee,
  ownerDiscount,
}: {
  appLabel: string
  result: DeliveryMarginResult
  ownerDeliveryFee: number
  ownerDiscount: number
}) {
  return (
    <Card className={calculatorCardClass}>
      <CardHeader className={calculatorCardHeaderClass}>
        <CardTitle>{appLabel} 계산 결과</CardTitle>
        <CardDescription>
          배우는 사장님들 기준 계산식 적용
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("space-y-3", calculatorCardContentClass)}>
        <ResultMetric
          label="중개수수료"
          value={`${formatAmount(result.brokerageFee)}원`}
        />
        <ResultMetric
          label="PG 수수료"
          value={`${formatAmount(result.pgFee)}원`}
        />
        <ResultMetric label="부가세" value={`${formatAmount(result.vat)}원`} />
        <ResultMetric
          label="사장 부담 배달비"
          value={`${formatAmount(ownerDeliveryFee)}원`}
        />
        <ResultMetric
          label="사장 부담 할인"
          value={`${formatAmount(ownerDiscount)}원`}
        />
        <ResultMetric
          label="총 차감액"
          value={`${formatAmount(result.totalDeduction)}원`}
        />
        <div className="my-1 border-t border-border/60" />
        <ResultMetric
          label="예상 정산금액"
          value={`${formatAmount(result.settlementAmount)}원`}
        />
        <ResultMetric
          label="예상 순이익"
          value={`${formatAmount(result.netProfit)}원`}
          emphasis
        />
        <ResultMetric
          label="마진율"
          value={`${formatPercent(result.marginRate)}%`}
          emphasis
        />
      </CardContent>
    </Card>
  )
}

function FormulaCard({
  appLabel,
  orderAmount,
  result,
}: {
  appLabel: string
  orderAmount: number
  result: DeliveryMarginResult
}) {
  const lines = [
    { label: "주문금액", value: `${formatAmount(orderAmount)}원` },
    { label: "중개수수료", value: `${formatAmount(result.brokerageFee)}원` },
    { label: "PG 수수료", value: `${formatAmount(result.pgFee)}원` },
    { label: "부가세 (10%)", value: `${formatAmount(result.vat)}원` },
    { label: "총 차감액", value: `${formatAmount(result.totalDeduction)}원` },
    {
      label: "예상 정산금액",
      value: `${formatAmount(result.settlementAmount)}원`,
    },
    { label: "예상 순이익", value: `${formatAmount(result.netProfit)}원` },
  ]

  return (
    <Card className={calculatorCardClass}>
      <CardHeader className={calculatorCardHeaderClass}>
        <CardTitle>{appLabel} 상세 계산</CardTitle>
        <CardDescription>
          배우는 사장님들 기준 계산식 적용 · 부가세 = (중개수수료 + PG수수료 +
          사장부담배달비 + 사장부담할인) × 10%
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("space-y-3", calculatorCardContentClass)}>
        {lines.map((line, index) => (
          <div
            key={line.label}
            className={cn(
              calculatorResultRowClass,
              "text-sm",
              index >= lines.length - 2 && "font-semibold"
            )}
          >
            <span className="text-muted-foreground">{line.label}</span>
            <span
              className={cn(
                index >= lines.length - 2 && calculatorHighlightClass
              )}
            >
              {line.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function buildCopyText(allResults: AppComparisonResult[]): string {
  const lines = ["배달 수수료 비교 결과", ""]
  for (const item of allResults) {
    lines.push(
      item.label,
      `순이익 ${formatAmount(item.result.netProfit)}원`,
      `마진율 ${formatPercent(item.result.marginRate)}%`,
      ""
    )
  }
  lines.push("가장 유리한 앱", allResults[0]?.label ?? "-")
  return lines.join("\n")
}

export function DeliveryMarginCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [viewMode, setViewMode] = useState<ViewModeId>(DEFAULT_INPUTS.viewMode)
  const [orderType, setOrderType] = useState<OrderTypeId>(
    DEFAULT_INPUTS.orderType
  )
  const [salesTier, setSalesTier] = useState<SalesTierId>(
    DEFAULT_INPUTS.salesTier
  )
  const [orderAmount, setOrderAmount] = useState(DEFAULT_INPUTS.orderAmount)
  const [cost, setCost] = useState(DEFAULT_INPUTS.cost)
  const [customerDeliveryFee, setCustomerDeliveryFee] = useState(
    DEFAULT_INPUTS.customerDeliveryFee
  )
  const [ownerDeliveryFee, setOwnerDeliveryFee] = useState(
    DEFAULT_INPUTS.ownerDeliveryFee
  )
  const [ownerDiscount, setOwnerDiscount] = useState(
    DEFAULT_INPUTS.ownerDiscount
  )
  const [selectedCompareApp, setSelectedCompareApp] =
    useState<DeliveryAppId | null>(null)
  const [snapshot, setSnapshot] = useState<{
    viewMode: ViewModeId
    orderAmount: number
    ownerDeliveryFee: number
    ownerDiscount: number
    allResults: AppComparisonResult[]
    singleResult: DeliveryMarginResult | null
  } | null>(null)

  const costRate = formatCostRate(cost, orderAmount)

  const allResults = snapshot?.allResults ?? []
  const bestResult = allResults[0]
  const secondResult = allResults[1]
  const profitDiff =
    bestResult && secondResult
      ? bestResult.result.netProfit - secondResult.result.netProfit
      : null

  const snapshotViewMode = snapshot?.viewMode
  const singleResult = snapshot?.singleResult ?? null

  const selectedCompareResult = allResults.find(
    (item) => item.app === selectedCompareApp
  )

  const displayResult =
    snapshot && snapshotViewMode === "compare" && bestResult
      ? (selectedCompareResult?.result ?? bestResult.result)
      : singleResult

  const displayAppLabel =
    snapshot && snapshotViewMode === "compare" && bestResult
      ? (selectedCompareResult?.label ?? bestResult.label)
      : snapshotViewMode && snapshotViewMode !== "compare"
        ? getAppLabel(snapshotViewMode as DeliveryAppId)
        : ""

  function handleCalculate() {
    const baseInput = {
      orderType,
      salesTier,
      orderAmount,
      cost,
      customerDeliveryFee,
      ownerDeliveryFee,
      ownerDiscount,
    }
    const computedAllResults = compareAllDeliveryApps(baseInput)
    const computedSingleResult =
      viewMode !== "compare"
        ? calculateDeliveryMargin({
            ...baseInput,
            app: viewMode as DeliveryAppId,
          })
        : null

    setSnapshot({
      viewMode,
      orderAmount,
      ownerDeliveryFee,
      ownerDiscount,
      allResults: computedAllResults,
      singleResult: computedSingleResult,
    })
    setSelectedCompareApp(
      viewMode === "compare" ? (computedAllResults[0]?.app ?? null) : null
    )
    logDeliveryMarginResults(computedAllResults)
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setViewMode(DEFAULT_INPUTS.viewMode)
    setOrderType(DEFAULT_INPUTS.orderType)
    setSalesTier(DEFAULT_INPUTS.salesTier)
    setOrderAmount(DEFAULT_INPUTS.orderAmount)
    setCost(DEFAULT_INPUTS.cost)
    setCustomerDeliveryFee(DEFAULT_INPUTS.customerDeliveryFee)
    setOwnerDeliveryFee(DEFAULT_INPUTS.ownerDeliveryFee)
    setOwnerDiscount(DEFAULT_INPUTS.ownerDiscount)
    setSelectedCompareApp(null)
    setSnapshot(null)
  }

  const summaryResult =
    snapshot && snapshotViewMode === "compare" && bestResult
      ? bestResult.result
      : singleResult

  const summaryAppLabel =
    snapshot && snapshotViewMode === "compare" && bestResult
      ? `🥇 ${bestResult.shortLabel}`
      : snapshotViewMode && snapshotViewMode !== "compare"
        ? getAppLabel(snapshotViewMode as DeliveryAppId)
        : ""

  return (
    <>
      <CalculatorPageLayout
        excludeHref="/calculators/delivery-margin"
        resultRef={resultsRef}
        resultId="delivery-margin-results"
        input={
          <CalculatorInputCard
            title="계산 조건"
            description="주문 조건을 입력하면 예상 정산금액과 순이익을 확인할 수 있습니다."
            onCalculate={handleCalculate}
            onReset={handleReset}
          >
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                계산 방식
              </label>
              <select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value as ViewModeId)}
                className={calculatorSelectClassName}
              >
                {VIEW_MODES.map((mode) => (
                  <option key={mode.id} value={mode.id}>
                    {mode.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground">
                주문 유형
              </label>
              <select
                value={orderType}
                onChange={(e) => setOrderType(e.target.value as OrderTypeId)}
                className={calculatorSelectClassName}
              >
                {ORDER_TYPES.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
            </div>

            {showsSalesTierForView(viewMode) && (
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  매출 구간
                </label>
                <select
                  value={salesTier}
                  onChange={(e) => setSalesTier(e.target.value as SalesTierId)}
                  className={calculatorSelectClassName}
                >
                  {SALES_TIERS.map((tier) => (
                    <option key={tier.id} value={tier.id}>
                      {tier.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <MoneyField
              label="주문금액 (할인 전 판매가)"
              value={orderAmount}
              onChange={setOrderAmount}
              placeholder="30,000"
            />
            <MoneyField
              label="원가"
              value={cost}
              onChange={setCost}
              placeholder="10,000"
            />
            <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm">
              <span className="text-muted-foreground">원가율</span>
              <span className="font-semibold text-foreground">{costRate}%</span>
            </div>
            <MoneyField
              label="고객 부담 배달비"
              value={customerDeliveryFee}
              onChange={setCustomerDeliveryFee}
              placeholder="3,000"
            />
            <MoneyField
              label="사장 부담 배달비"
              value={ownerDeliveryFee}
              onChange={setOwnerDeliveryFee}
              placeholder="3,000"
            />
            <MoneyField
              label="사장 부담 할인"
              value={ownerDiscount}
              onChange={setOwnerDiscount}
              placeholder="0"
              description="쿠폰·프로모션 등 사장님이 부담하는 할인 금액"
            />
          </CalculatorInputCard>
        }
        result={
          snapshot && summaryResult && displayResult ? (
          <>
            <CalculatorResultCard
              copyText={buildCopyText(allResults)}
              copyTitle="배달 마진 계산 결과"
              items={[
                {
                  label:
                    snapshotViewMode === "compare" ? "가장 유리한 앱" : "선택 앱",
                  value: summaryAppLabel,
                  highlight: true,
                },
                {
                  label: "예상 정산금액",
                  description: "배달앱 정산 전 예상 입금액",
                  value: `${formatAmount(summaryResult.settlementAmount)}원`,
                },
                {
                  label: "예상 순이익",
                  description: "원가 차감 후 예상 이익",
                  value: `${formatAmount(summaryResult.netProfit)}원`,
                  highlight: true,
                },
                {
                  label: "마진율",
                  description: "주문금액 대비 순이익 비율",
                  value: `${formatPercent(summaryResult.marginRate)}%`,
                  highlight: true,
                },
                ...(snapshotViewMode === "compare" &&
                profitDiff !== null &&
                profitDiff > 0
                  ? [
                      {
                        label: "2위 대비 순이익 차이",
                        value: `+${formatAmount(profitDiff)}원`,
                      },
                    ]
                  : []),
              ]}
            />

            {snapshotViewMode === "compare" ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  비교 결과
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  {allResults.map((item, index) => (
                    <CompareAppCard
                      key={item.app}
                      item={item}
                      rank={index}
                      isSelected={selectedCompareApp === item.app}
                      onSelect={() => setSelectedCompareApp(item.app)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <SingleAppResultCard
                appLabel={getAppLabel(snapshotViewMode as DeliveryAppId)}
                result={singleResult!}
                ownerDeliveryFee={snapshot.ownerDeliveryFee}
                ownerDiscount={snapshot.ownerDiscount}
              />
            )}

            <FormulaCard
              appLabel={displayAppLabel}
              orderAmount={snapshot.orderAmount}
              result={displayResult}
            />

            <div className="flex gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-relaxed text-amber-950">
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <div className="space-y-2">
                {DISCLAIMER.map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </div>
            </div>
          </>
          ) : (
            <CalculatorResultCard />
          )
        }
        extensions={
          <Card className={cn("mt-10", calculatorCardClass)}>
            <CardHeader className={calculatorCardHeaderClass}>
              <CardTitle>배달앱 수수료 기준표</CardTitle>
              <CardDescription>
                공개된 기준을 바탕으로 한 참고 수치입니다.
              </CardDescription>
            </CardHeader>
            <CardContent
              className={cn("overflow-x-auto", calculatorCardContentClass)}
            >
              <Table className="min-w-[640px]">
                <TableHeader>
                  <TableRow>
                    <TableHead>앱</TableHead>
                    <TableHead>배달 수수료</TableHead>
                    <TableHead>포장 수수료</TableHead>
                    <TableHead>PG 수수료</TableHead>
                    <TableHead>비고</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {FEE_REFERENCE_TABLE.map((row) => (
                    <TableRow key={row.app}>
                      <TableCell className="font-medium">{row.app}</TableCell>
                      <TableCell>{row.deliveryFee}</TableCell>
                      <TableCell>{row.pickupFee}</TableCell>
                      <TableCell>{row.pgFee}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {row.note}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        }
        seo={
          <CalculatorFaq
            description={DELIVERY_MARGIN_GUIDE_DESCRIPTION}
            items={DELIVERY_MARGIN_FAQ_ITEMS}
          />
        }
      />

    </>
  )
}
