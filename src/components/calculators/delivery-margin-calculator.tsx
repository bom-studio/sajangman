"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import {
  AlertCircle,
  ChevronDown,
  Copy,
  Info,
  Receipt,
  Truck,
} from "lucide-react"

import { EstimateToast } from "@/components/estimate/estimate-toast"
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

const INFO_CARDS = [
  {
    icon: Receipt,
    title: "할인 전 금액 기준",
    description: "수수료는 할인 전 판매가 기준으로 계산될 수 있습니다.",
  },
  {
    icon: Truck,
    title: "배달비 확인",
    description:
      "지역, 거리, 프로모션에 따라 실제 배달비가 달라질 수 있습니다.",
  },
  {
    icon: Info,
    title: "광고비 제외",
    description:
      "광고상품, 노출상품, 프로모션 비용은 계산에 포함되지 않습니다.",
  },
] as const

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

const cardClass =
  "gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 shadow-sm"
const cardHeaderClass = "border-b border-border/60 px-6 py-4 !pb-4"
const cardContentClass = "px-6 py-5"

const selectClassName = cn(
  "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
)

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

function KpiCard({
  label,
  value,
  description,
  highlight = false,
  valueClassName,
}: {
  label: string
  value: string
  description?: string
  highlight?: boolean
  valueClassName?: string
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border px-4 py-4 transition-colors",
        highlight
          ? "border-primary/30 bg-primary/5"
          : "border-border/70 bg-background"
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {description && (
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground/80">
          {description}
        </p>
      )}
      <p
        className={cn(
          "mt-1.5 text-lg font-bold tracking-tight sm:text-xl",
          valueClassName,
          !valueClassName && (highlight ? "text-primary" : "text-foreground")
        )}
      >
        {value}
      </p>
    </div>
  )
}

function BestAppKpiCard({
  appLabel,
  shortLabel,
  netProfit,
  profitDiff,
  isCompareMode,
}: {
  appLabel: string
  shortLabel: string
  netProfit: number
  profitDiff: number | null
  isCompareMode: boolean
}) {
  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/5 px-4 py-4">
      <p className="text-xs font-medium text-muted-foreground">가장 유리한 앱</p>
      <p className="mt-1.5 text-lg font-bold tracking-tight text-primary sm:text-xl">
        {isCompareMode ? `🥇 ${shortLabel}` : appLabel}
      </p>
      {isCompareMode && (
        <>
          <p className="mt-3 text-xs text-muted-foreground">예상 순이익</p>
          <p className="mt-0.5 text-base font-bold text-green-600 sm:text-lg">
            {formatAmount(netProfit)}원
          </p>
          {profitDiff !== null && profitDiff > 0 && (
            <>
              <p className="mt-2 text-xs text-muted-foreground">2위 대비</p>
              <p className="mt-0.5 text-sm font-semibold text-primary">
                +{formatAmount(profitDiff)}원
              </p>
            </>
          )}
        </>
      )}
    </div>
  )
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
          "gap-0 overflow-hidden py-0 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:shadow-md",
          isSelected
            ? "border-primary ring-2 ring-primary"
            : "border-border/70"
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
              <span className="text-base font-bold text-green-600">
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
    <Card className="gap-0 overflow-hidden border-primary/20 py-0 shadow-md ring-1 ring-primary/10">
      <CardHeader className={cn("bg-primary/5", cardHeaderClass)}>
        <CardTitle>{appLabel} 계산 결과</CardTitle>
        <CardDescription>
          배우는 사장님들 기준 계산식 적용
        </CardDescription>
      </CardHeader>
      <CardContent className={cn("space-y-3 p-6", cardContentClass)}>
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
    <Card className="gap-0 overflow-hidden border-slate-800 bg-slate-900 py-0 text-slate-100 shadow-lg">
      <CardHeader className="border-b border-slate-700/80 px-6 py-4 !pb-4">
        <CardTitle className="text-slate-50">{appLabel} 계산식</CardTitle>
        <CardDescription className="text-slate-400">
          배우는 사장님들 기준 계산식 적용 · 부가세 = (중개수수료 + PG수수료 +
          사장부담배달비 + 사장부담할인) × 10%
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-6 py-5">
        {lines.map((line, index) => (
          <div
            key={line.label}
            className={cn(
              "flex items-center justify-between gap-4 text-sm",
              index >= lines.length - 2 && "font-semibold text-white"
            )}
          >
            <span className="text-slate-400">{line.label}</span>
            <span>{line.value}</span>
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
  const [copyToast, setCopyToast] = useState(false)

  const costRate = formatCostRate(cost, orderAmount)

  const baseInput = useMemo(
    () => ({
      orderType,
      salesTier,
      orderAmount,
      cost,
      customerDeliveryFee,
      ownerDeliveryFee,
      ownerDiscount,
    }),
    [
      orderType,
      salesTier,
      orderAmount,
      cost,
      customerDeliveryFee,
      ownerDeliveryFee,
      ownerDiscount,
    ]
  )

  const allResults = useMemo(
    () => compareAllDeliveryApps(baseInput),
    [baseInput]
  )

  useEffect(() => {
    logDeliveryMarginResults(allResults)
  }, [allResults])

  const bestResult = allResults[0]
  const secondResult = allResults[1]
  const profitDiff =
    bestResult && secondResult
      ? bestResult.result.netProfit - secondResult.result.netProfit
      : null

  useEffect(() => {
    if (viewMode !== "compare") return
    if (
      !selectedCompareApp ||
      !allResults.some((item) => item.app === selectedCompareApp)
    ) {
      setSelectedCompareApp(bestResult?.app ?? null)
    }
  }, [allResults, bestResult?.app, selectedCompareApp, viewMode])

  useEffect(() => {
    if (!copyToast) return
    const timer = setTimeout(() => setCopyToast(false), 3000)
    return () => clearTimeout(timer)
  }, [copyToast])

  const singleResult = useMemo(() => {
    if (viewMode === "compare") return null
    return calculateDeliveryMargin({
      ...baseInput,
      app: viewMode as DeliveryAppId,
    })
  }, [baseInput, viewMode])

  const selectedCompareResult = allResults.find(
    (item) => item.app === selectedCompareApp
  )

  const displayResult =
    viewMode === "compare"
      ? (selectedCompareResult?.result ?? bestResult.result)
      : singleResult!
  const displayAppLabel =
    viewMode === "compare"
      ? (selectedCompareResult?.label ?? bestResult.label)
      : getAppLabel(viewMode as DeliveryAppId)

  function handleCalculate() {
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
  }

  async function handleCopyResults() {
    try {
      await navigator.clipboard.writeText(buildCopyText(allResults))
      setCopyToast(true)
    } catch {
      setCopyToast(false)
    }
  }

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <DeliveryMarginInfoCards />
      <div className="mt-6 flex flex-col gap-8 xl:flex-row xl:items-start">
        <div className="xl:w-[35%] xl:shrink-0">
          <Card className={cardClass}>
            <CardHeader className={cardHeaderClass}>
              <CardTitle>계산 조건</CardTitle>
              <CardDescription>
                주문 조건을 입력하면 예상 정산금액과 순이익을 확인할 수
                있습니다.
              </CardDescription>
            </CardHeader>
            <CardContent className={cn("space-y-5", cardContentClass)}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  계산 방식
                </label>
                <select
                  value={viewMode}
                  onChange={(e) => setViewMode(e.target.value as ViewModeId)}
                  className={selectClassName}
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
                  onChange={(e) =>
                    setOrderType(e.target.value as OrderTypeId)
                  }
                  className={selectClassName}
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
                    onChange={(e) =>
                      setSalesTier(e.target.value as SalesTierId)
                    }
                    className={selectClassName}
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
              <div className="flex items-center justify-between rounded-lg bg-muted/50 px-3 py-2.5 text-sm">
                <span className="text-muted-foreground">원가율</span>
                <span className="font-semibold text-foreground">
                  {costRate}%
                </span>
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

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Button type="button" onClick={handleCalculate}>
                  계산하기
                </Button>
                <Button type="button" variant="outline" onClick={handleReset}>
                  초기화
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div
          ref={resultsRef}
          id="delivery-margin-results"
          className="scroll-mt-6 space-y-6 xl:w-[65%] xl:flex-1"
        >
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold text-foreground">계산 결과</h2>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleCopyResults}
            >
              <Copy className="size-4" />
              결과 복사
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <BestAppKpiCard
              appLabel={getAppLabel(viewMode as DeliveryAppId)}
              shortLabel={bestResult.shortLabel}
              netProfit={bestResult.result.netProfit}
              profitDiff={profitDiff}
              isCompareMode={viewMode === "compare"}
            />
            <KpiCard
              label="예상 정산금액"
              description="배달앱 정산 전 예상 입금액"
              value={`${formatAmount(bestResult.result.settlementAmount)}원`}
            />
            <KpiCard
              label="예상 순이익"
              description="원가 차감 후 예상 이익"
              value={`${formatAmount(bestResult.result.netProfit)}원`}
              valueClassName="text-green-600"
            />
            <KpiCard
              label="마진율"
              description="주문금액 대비 순이익 비율"
              value={`${formatPercent(bestResult.result.marginRate)}%`}
              valueClassName="text-blue-600"
            />
          </div>

          {viewMode === "compare" ? (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">
                전체 앱 비교
              </h2>
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
              appLabel={getAppLabel(viewMode as DeliveryAppId)}
              result={singleResult!}
              ownerDeliveryFee={ownerDeliveryFee}
              ownerDiscount={ownerDiscount}
            />
          )}

          <FormulaCard
            appLabel={displayAppLabel}
            orderAmount={orderAmount}
            result={displayResult}
          />

          <div className="flex gap-3 rounded-2xl border border-amber-200/80 bg-amber-50/80 px-5 py-4 text-sm leading-relaxed text-amber-950">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <div className="space-y-2">
              {DISCLAIMER.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Card className={cn("mt-10", cardClass)}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>배달앱 수수료 기준표</CardTitle>
          <CardDescription>공개된 기준을 바탕으로 한 참고 수치입니다.</CardDescription>
        </CardHeader>
        <CardContent className={cn("overflow-x-auto", cardContentClass)}>
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

      <DeliveryMarginSeo />

      {copyToast && (
        <EstimateToast
          message="결과가 복사되었습니다."
          variant="success"
          className="bottom-6"
        />
      )}
    </div>
  )
}

function DeliveryMarginInfoCards() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {INFO_CARDS.map((item) => (
        <Card
          key={item.title}
          className={cn(cardClass, "transition-all hover:shadow-md")}
        >
          <CardContent className="px-5 py-4 sm:px-6 sm:py-5">
            <div className="mb-3 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <item.icon className="size-5" />
            </div>
            <h3 className="font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function DeliveryMarginSeo() {
  const [openTitles, setOpenTitles] = useState<Set<string>>(new Set())

  function toggleSection(title: string) {
    setOpenTitles((prev) => {
      const next = new Set(prev)
      if (next.has(title)) {
        next.delete(title)
      } else {
        next.add(title)
      }
      return next
    })
  }

  const sections = [
    {
      title: "배달앱 수수료란?",
      paragraphs: [
        "배달앱 수수료는 음식점이 배달 플랫폼을 통해 주문을 받을 때 플랫폼에 지불하는 비용입니다. 일반적으로 중개수수료와 결제(PG) 수수료로 나뉘며, 주문금액과 배달비 구조에 따라 실제 정산금액이 달라집니다.",
        "많은 사장님이 할인 후 받는 금액만 보고 마진을 판단하지만, 수수료는 할인 전 판매가를 기준으로 계산되는 경우가 많아 실제 순이익이 예상보다 낮을 수 있습니다. 본 계산기는 이런 차이를 빠르게 확인하기 위한 참고 도구입니다.",
      ],
    },
    {
      title: "배달의민족 수수료 계산 방법",
      paragraphs: [
        "배달의민족은 배민배달 상생요금제 기준으로 매출 구간에 따라 중개수수료가 달라집니다. 상위 35% 구간은 7.8%, 35~80% 구간은 6.8%, 하위 20% 구간은 2.0%가 적용됩니다. 포장·픽업 주문은 6.8%가 적용됩니다.",
        "PG 수수료는 3.0%이며, 중개수수료와 PG 수수료 모두 부가가치세(VAT) 10%가 포함되어 계산됩니다. 사장님이 부담하는 배달비는 PG 수수료 산정 기준 금액에 포함되므로 배달비 지원 규모에 따라 수수료 부담도 함께 달라집니다.",
      ],
    },
    {
      title: "쿠팡이츠 수수료 계산 방법",
      paragraphs: [
        "쿠팡이츠도 배달 주문의 경우 매출 구간별 중개수수료가 배달의민족과 유사하게 적용됩니다. 상위 35%는 7.8%, 35~80%는 6.8%, 하위 20%는 2.0%입니다.",
        "포장·픽업 주문은 상위~80% 구간에 6.8%, 하위 20% 구간에 0%가 적용됩니다. PG 수수료는 3.0%이며 VAT가 포함됩니다. 전통시장 무료연장 등 별도 계약이 있는 경우 실제 수수료는 달라질 수 있습니다.",
      ],
    },
    {
      title: "요기요 수수료 계산 방법",
      paragraphs: [
        "요기요 라이트 기준으로 배달 주문 중개수수료는 9.7%, 포장·픽업은 7.7%가 적용됩니다. PG 수수료는 3.3%이며 역시 VAT가 포함되어 계산됩니다.",
        "요기요는 매출 구간 선택 없이 주문 유형에 따라 수수료가 정해지므로, 배달과 포장 중 어떤 채널 비중이 높은지에 따라 전체 마진 구조를 비교해 보는 것이 좋습니다.",
      ],
    },
    {
      title: "땡겨요 수수료 계산 방법",
      paragraphs: [
        "땡겨요는 배달·포장 모두 중개수수료 2.0%, PG 수수료 2.5%가 기본 기준으로 알려져 있습니다. 다른 플랫폼 대비 중개수수료율이 낮은 편이지만, 계약 조건과 지역에 따라 실제 적용 수수료는 달라질 수 있습니다.",
        "수수료가 낮다고 해서 항상 순이익이 높은 것은 아닙니다. 주문 단가, 배달비 부담, 원가율을 함께 비교해야 실제 수익성을 판단할 수 있습니다.",
      ],
    },
    {
      title: "배달 마진을 높이는 방법",
      paragraphs: [
        "배달 마진을 높이려면 할인 전 판매가 대비 원가율을 낮추고, 불필요한 사장 부담 배달비를 줄이는 것이 기본입니다. 메뉴 구성을 세트·추가 옵션 중심으로 조정하면 주문금액 대비 원가 비중을 개선할 수 있습니다.",
        "또한 배달과 포장 비중을 조절하고, 수수료 구조가 유리한 채널을 비교하는 것도 중요합니다. 다만 광고비·프로모션 비용은 본 계산기에 포함되지 않으므로, 실제 운영 시에는 광고 투자 대비 주문 증가 효과까지 함께 검토해야 합니다.",
      ],
    },
    {
      title: "배달앱 수수료는 몇 퍼센트인가요?",
      paragraphs: [
        "배달앱마다 수수료 구조가 다릅니다. 배달의민족·쿠팡이츠는 매출 구간에 따라 배달 중개수수료가 2.0%~7.8%까지 달라지고, 요기요는 배달 9.7%, 땡겨요는 2.0% 수준이 공개된 기준입니다. PG 수수료는 보통 2.5%~3.3% 추가됩니다.",
        "본 계산기는 이러한 공개 기준을 바탕으로 예상 수수료를 계산합니다. 실제 계약 조건, 광고상품, 프로모션 참여 여부에 따라 적용 수수료는 달라질 수 있습니다.",
      ],
    },
    {
      title: "배달의민족 수수료 계산은 어떻게 하나요?",
      paragraphs: [
        "배달의민족은 할인 전 주문금액에 중개수수료율을 곱한 뒤 VAT 10%를 포함해 중개수수료를 계산합니다. PG 수수료는 주문금액과 사장 부담 배달비 합계에 PG 수수료율과 VAT를 적용합니다.",
        "배달 주문은 매출 구간(상위 35%, 35~80%, 하위 20%)에 따라 중개수수료율이 달라지며, 포장·픽업은 6.8%가 적용됩니다.",
      ],
    },
    {
      title: "쿠팡이츠 수수료는 얼마인가요?",
      paragraphs: [
        "쿠팡이츠 배달 주문은 배달의민족과 유사하게 매출 구간별 중개수수료가 적용됩니다. 포장·픽업은 상위~80% 구간 6.8%, 하위 20% 구간 0%가 기준으로 알려져 있습니다.",
        "PG 수수료는 3.0%이며 VAT가 포함됩니다. 전통시장 무료연장 등 별도 혜택이 있는 경우 실제 수수료는 달라질 수 있습니다.",
      ],
    },
    {
      title: "요기요 수수료는 얼마인가요?",
      paragraphs: [
        "요기요 라이트 기준 배달 중개수수료는 9.7%, 포장·픽업은 7.7%입니다. PG 수수료는 3.3%이며 VAT가 포함되어 계산됩니다.",
        "요기요는 매출 구간 구분 없이 주문 유형에 따라 수수료가 정해지므로, 배달과 포장 주문 비중에 따라 전체 마진이 달라질 수 있습니다.",
      ],
    },
    {
      title: "땡겨요 수수료는 얼마인가요?",
      paragraphs: [
        "땡겨요는 배달·포장 모두 중개수수료 2.0%, PG 수수료 2.5%가 기본 기준으로 알려져 있습니다. 다른 플랫폼 대비 중개수수료율이 낮은 편입니다.",
        "다만 계약 조건, 지역, 프로모션에 따라 실제 적용 수수료는 달라질 수 있으므로 정산 내역과 함께 확인하는 것이 좋습니다.",
      ],
    },
    {
      title: "배달 마진율은 몇 퍼센트가 적당한가요?",
      paragraphs: [
        "업종과 원가 구조에 따라 다르지만, 일반적으로 배달 음식점은 마진율 30~50% 구간을 많이 목표로 합니다. 주문금액이 낮거나 원가율이 높으면 20%대 이하로 떨어질 수 있습니다.",
        "본 계산기의 마진율은 주문금액(할인 전 판매가) 대비 순이익 비율입니다. 광고비·인건비·임대료 등은 포함되지 않으므로 실제 사업 마진과는 차이가 있을 수 있습니다.",
      ],
    },
    {
      title: "원가율은 몇 퍼센트가 적당한가요?",
      paragraphs: [
        "외식업 기준으로 원가율 30~40%를 많이 참고합니다. 배달 전문점은 메뉴 구성과 포장비에 따라 35% 전후가 흔하며, 원가율이 50%를 넘으면 수수료와 배달비를 감안할 때 순이익이 크게 줄어들 수 있습니다.",
        "본 계산기에서는 원가 ÷ 주문금액 × 100으로 원가율을 표시합니다. 메뉴별 원가를 정확히 관리하면 채널별 수익성 비교가 더 정확해집니다.",
      ],
    },
  ] as const

  return (
    <section className="mt-16 border-t border-border/60 pt-12">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        배달 수수료·순이익 계산 가이드
      </h2>
      <p className="mt-3 max-w-3xl text-muted-foreground">
        배달앱별 수수료 구조와 마진 계산 방법을 정리했습니다. 궁금한 항목을
        눌러 내용을 확인하세요.
      </p>
      <Card className={cn("mt-8", cardClass)}>
        <CardContent className="divide-y divide-border/60 px-0 py-0">
          {sections.map((section) => {
            const isOpen = openTitles.has(section.title)

            return (
              <article key={section.title}>
                <button
                  type="button"
                  onClick={() => toggleSection(section.title)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-4 text-left transition-colors hover:bg-muted/40"
                >
                  <h3 className="text-base font-semibold text-foreground sm:text-lg">
                    {section.title}
                  </h3>
                  <ChevronDown
                    className={cn(
                      "size-5 shrink-0 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                  />
                </button>
                {isOpen && (
                  <div className="space-y-3 border-t border-border/40 px-6 pb-5 pt-4 text-sm leading-relaxed text-muted-foreground">
                    {section.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </article>
            )
          })}
        </CardContent>
      </Card>
    </section>
  )
}
