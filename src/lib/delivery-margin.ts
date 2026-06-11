export const DELIVERY_APPS = [
  { id: "baemin", label: "배달의민족" },
  { id: "coupang", label: "쿠팡이츠" },
  { id: "yogiyo", label: "요기요" },
  { id: "ttaenggyeo", label: "땡겨요" },
] as const

export const ORDER_TYPES = [
  { id: "delivery", label: "배달" },
  { id: "pickup", label: "포장/픽업" },
] as const

export const SALES_TIERS = [
  { id: "top35", label: "상위 35%", brokerageRate: 0.078 },
  { id: "mid45", label: "35~80%", brokerageRate: 0.068 },
  { id: "bottom20", label: "하위 20%", brokerageRate: 0.02 },
] as const

export type DeliveryAppId = (typeof DELIVERY_APPS)[number]["id"]
export type OrderTypeId = (typeof ORDER_TYPES)[number]["id"]
export type SalesTierId = (typeof SALES_TIERS)[number]["id"]

export const VIEW_MODES = [
  { id: "compare", label: "전체 앱 비교" },
  ...DELIVERY_APPS,
] as const

export type ViewModeId = (typeof VIEW_MODES)[number]["id"]

export const APP_SHORT_LABELS: Record<DeliveryAppId, string> = {
  baemin: "배민",
  coupang: "쿠팡",
  yogiyo: "요기요",
  ttaenggyeo: "땡겨요",
}

export interface AppComparisonResult {
  app: DeliveryAppId
  label: string
  shortLabel: string
  result: DeliveryMarginResult
}

export interface DeliveryMarginInput {
  app: DeliveryAppId
  orderType: OrderTypeId
  salesTier: SalesTierId
  orderAmount: number
  cost: number
  customerDeliveryFee: number
  ownerDeliveryFee: number
  ownerDiscount: number
}

export interface DeliveryMarginResult {
  brokerageRate: number
  pgRate: number
  brokerageFee: number
  pgFee: number
  /** 부가세 = (중개수수료 + PG수수료 + 사장부담배달비 + 사장부담할인) × 10% */
  vat: number
  /** 중개수수료 + PG수수료 + 부가세 (플랫폼 수수료 합계) */
  totalFee: number
  /** 중개수수료 + PG수수료 + 부가세 + 사장부담배달비 + 사장부담할인 */
  totalDeduction: number
  settlementAmount: number
  netProfit: number
  marginRate: number
}

export const FEE_REFERENCE_TABLE = [
  {
    app: "배달의민족",
    deliveryFee: "상위 7.8% / 35~80% 6.8% / 하위20% 2.0%",
    pickupFee: "6.8%",
    pgFee: "3.0%",
    note: "배민배달 상생요금제 기준",
  },
  {
    app: "쿠팡이츠",
    deliveryFee: "상위 7.8% / 35~80% 6.8% / 하위20% 2.0%",
    pickupFee: "상위~80% 6.8% / 하위20% 0%",
    pgFee: "3.0%",
    note: "전통시장 무료연장 대상은 별도",
  },
  {
    app: "요기요",
    deliveryFee: "9.7%",
    pickupFee: "7.7%",
    pgFee: "3.3%",
    note: "요기요 라이트 기준",
  },
  {
    app: "땡겨요",
    deliveryFee: "2.0%",
    pickupFee: "2.0%",
    pgFee: "2.5%",
    note: "계약 조건에 따라 달라질 수 있음",
  },
] as const

const VAT_RATE = 0.1

export function parseAmountInput(value: string): number {
  const digits = value.replace(/[^\d]/g, "")
  if (!digits) return 0
  const parsed = Number(digits)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatAmount(amount: number): string {
  if (!Number.isFinite(amount)) return "0"
  return Math.round(amount).toLocaleString("ko-KR")
}

export function formatPercent(rate: number): string {
  if (!Number.isFinite(rate)) return "0.0"
  return rate.toFixed(1)
}

export function showsSalesTier(app: DeliveryAppId): boolean {
  return app === "baemin" || app === "coupang"
}

export function showsSalesTierForView(viewMode: ViewModeId): boolean {
  return (
    viewMode === "compare" || viewMode === "baemin" || viewMode === "coupang"
  )
}

export function getAppLabel(app: DeliveryAppId): string {
  return DELIVERY_APPS.find((item) => item.id === app)?.label ?? app
}

export function compareAllDeliveryApps(
  input: Omit<DeliveryMarginInput, "app">
): AppComparisonResult[] {
  return DELIVERY_APPS.map((item) => ({
    app: item.id,
    label: item.label,
    shortLabel: APP_SHORT_LABELS[item.id],
    result: calculateDeliveryMargin({ ...input, app: item.id }),
  })).sort((a, b) => b.result.netProfit - a.result.netProfit)
}

export function logDeliveryMarginResults(results: AppComparisonResult[]): void {
  if (typeof window === "undefined") return

  for (const item of results) {
    console.log({
      platform: item.label,
      brokerageFee: item.result.brokerageFee,
      pgFee: item.result.pgFee,
      vat: item.result.vat,
      totalDeduction: item.result.totalDeduction,
      settlementAmount: item.result.settlementAmount,
      margin: item.result.netProfit,
    })
  }
}

function getBrokerageRate(
  app: DeliveryAppId,
  orderType: OrderTypeId,
  salesTier: SalesTierId
): number {
  if (app === "baemin") {
    if (orderType === "pickup") return 0.068

    switch (salesTier) {
      case "top35":
        return 0.078
      case "mid45":
        return 0.068
      case "bottom20":
        return 0.02
      default:
        return 0.068
    }
  }

  if (app === "coupang") {
    if (orderType === "pickup") {
      return salesTier === "bottom20" ? 0 : 0.068
    }

    switch (salesTier) {
      case "top35":
        return 0.078
      case "mid45":
        return 0.068
      case "bottom20":
        return 0.02
      default:
        return 0.068
    }
  }

  if (app === "yogiyo") {
    return orderType === "delivery" ? 0.097 : 0.077
  }

  return 0.02
}

function getPgRate(app: DeliveryAppId): number {
  switch (app) {
    case "baemin":
    case "coupang":
      return 0.03
    case "yogiyo":
      return 0.033
    case "ttaenggyeo":
      return 0.025
    default:
      return 0.03
  }
}

/**
 * 배우는 사장님들(eventmoa) 배달 수수료 계산기 기준
 * https://eventmoa.kr/배달-수수료-계산기/
 *
 * 중개수수료 = 주문금액 × 중개수수료율
 * PG수수료 = 주문금액 × PG수수료율
 *
 * 부가세 =
 * (중개수수료 + PG수수료 + 사장부담배달비 + 사장부담할인)
 * × 10%
 *
 * 총 차감액 =
 * 중개수수료 + PG수수료 + 부가세 + 사장부담배달비 + 사장부담할인
 *
 * 예상 정산금액 = 주문금액 + 고객부담배달비 - 총 차감액
 * 순이익(마진) = 예상 정산금액 - 원가
 */
export function calculateDeliveryMargin(
  input: DeliveryMarginInput
): DeliveryMarginResult {
  const orderAmount = Number.isFinite(input.orderAmount)
    ? Math.max(0, input.orderAmount)
    : 0
  const cost = Number.isFinite(input.cost) ? Math.max(0, input.cost) : 0
  const customerDeliveryFee = Number.isFinite(input.customerDeliveryFee)
    ? Math.max(0, input.customerDeliveryFee)
    : 0
  const ownerDeliveryFee = Number.isFinite(input.ownerDeliveryFee)
    ? Math.max(0, input.ownerDeliveryFee)
    : 0
  const ownerDiscount = Number.isFinite(input.ownerDiscount)
    ? Math.max(0, input.ownerDiscount)
    : 0

  const brokerageRate = getBrokerageRate(
    input.app,
    input.orderType,
    input.salesTier
  )
  const pgRate = getPgRate(input.app)

  const brokerageFee = Math.round(orderAmount * brokerageRate)
  const pgFee = Math.round(orderAmount * pgRate)

  const vat = Math.round(
    (brokerageFee + pgFee + ownerDeliveryFee + ownerDiscount) * VAT_RATE
  )

  const totalFee = brokerageFee + pgFee + vat
  const totalDeduction =
    brokerageFee + pgFee + vat + ownerDeliveryFee + ownerDiscount

  const settlementAmount = orderAmount + customerDeliveryFee - totalDeduction
  const netProfit = settlementAmount - cost
  const marginRate =
    orderAmount > 0 ? (netProfit / orderAmount) * 100 : 0

  return {
    brokerageRate,
    pgRate,
    brokerageFee,
    pgFee,
    vat,
    totalFee,
    totalDeduction,
    settlementAmount,
    netProfit,
    marginRate,
  }
}
