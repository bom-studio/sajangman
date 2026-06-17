import { formatAmount, formatPercent, parseAmountInput } from "@/lib/calculators/format"

const VAT_RATE = 0.1

export type CouponRecommendation = "recommended" | "caution" | "not_recommended"

export interface DeliveryCouponProfitInput {
  sellingPrice: number
  cost: number
  brokerageRate: number
  pgRate: number
  couponDiscount: number
  ownerBurdenDiscount: number
  expectedOrders: number
  orderIncreaseRate: number
}

export interface DeliveryCouponProfitResult {
  sellingPrice: number
  cost: number
  brokerageRate: number
  pgRate: number
  couponDiscount: number
  ownerBurdenDiscount: number
  expectedOrders: number
  orderIncreaseRate: number
  brokerageFee: number
  pgFee: number
  vatBefore: number
  vatAfter: number
  totalFeeBefore: number
  totalFeeAfter: number
  profitBeforePerOrder: number
  profitAfterPerOrder: number
  totalCouponBurden: number
  ordersAfterCoupon: number
  additionalOrders: number
  totalProfitBefore: number
  totalProfitAfter: number
  totalProfitDiff: number
  breakEvenAdditionalOrders: number
  recommendation: CouponRecommendation
  recommendationLabel: string
  canCalculate: boolean
  errorMessage: string | null
}

export const DEFAULT_DELIVERY_COUPON_INPUT: DeliveryCouponProfitInput = {
  sellingPrice: 30_000,
  cost: 10_500,
  brokerageRate: 7.8,
  pgRate: 3.0,
  couponDiscount: 3_000,
  ownerBurdenDiscount: 3_000,
  expectedOrders: 200,
  orderIncreaseRate: 20,
}

export { parseAmountInput }

export function formatWon(amount: number): string {
  return `${formatAmount(amount)}원`
}

export function formatOrders(count: number): string {
  if (!Number.isFinite(count) || count <= 0) return "0건"
  return `${Math.ceil(count).toLocaleString("ko-KR")}건`
}

function sanitizeRate(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, value)
}

function calculatePlatformFees(
  sellingPrice: number,
  brokerageRate: number,
  pgRate: number,
  ownerBurdenDiscount: number
) {
  const brokerageFee = Math.round(sellingPrice * (brokerageRate / 100))
  const pgFee = Math.round(sellingPrice * (pgRate / 100))
  const vat = Math.round(
    (brokerageFee + pgFee + ownerBurdenDiscount) * VAT_RATE
  )
  const totalFee = brokerageFee + pgFee + vat

  return { brokerageFee, pgFee, vat, totalFee }
}

function resolveRecommendation(
  profitBeforePerOrder: number,
  totalProfitBefore: number,
  totalProfitAfter: number,
  breakEvenAdditionalOrders: number,
  additionalOrders: number
): Pick<
  DeliveryCouponProfitResult,
  "recommendation" | "recommendationLabel"
> {
  if (profitBeforePerOrder <= 0) {
    return {
      recommendation: "not_recommended",
      recommendationLabel: "비추천",
    }
  }

  if (totalProfitAfter >= totalProfitBefore) {
    return {
      recommendation: "recommended",
      recommendationLabel: "진행 추천",
    }
  }

  if (additionalOrders >= breakEvenAdditionalOrders) {
    return {
      recommendation: "caution",
      recommendationLabel: "주의",
    }
  }

  return {
    recommendation: "not_recommended",
    recommendationLabel: "비추천",
  }
}

export function calculateDeliveryCouponProfit(
  input: DeliveryCouponProfitInput
): DeliveryCouponProfitResult {
  const sellingPrice = Math.max(0, input.sellingPrice)
  const cost = Math.max(0, input.cost)
  const brokerageRate = sanitizeRate(input.brokerageRate)
  const pgRate = sanitizeRate(input.pgRate)
  const couponDiscount = Math.max(0, input.couponDiscount)
  const ownerBurdenDiscount = Math.max(0, input.ownerBurdenDiscount)
  const expectedOrders = Math.max(0, Math.floor(input.expectedOrders))
  const orderIncreaseRate = sanitizeRate(input.orderIncreaseRate)

  const base: DeliveryCouponProfitResult = {
    sellingPrice,
    cost,
    brokerageRate,
    pgRate,
    couponDiscount,
    ownerBurdenDiscount,
    expectedOrders,
    orderIncreaseRate,
    brokerageFee: 0,
    pgFee: 0,
    vatBefore: 0,
    vatAfter: 0,
    totalFeeBefore: 0,
    totalFeeAfter: 0,
    profitBeforePerOrder: 0,
    profitAfterPerOrder: 0,
    totalCouponBurden: 0,
    ordersAfterCoupon: 0,
    additionalOrders: 0,
    totalProfitBefore: 0,
    totalProfitAfter: 0,
    totalProfitDiff: 0,
    breakEvenAdditionalOrders: 0,
    recommendation: "not_recommended",
    recommendationLabel: "비추천",
    canCalculate: false,
    errorMessage: null,
  }

  if (sellingPrice <= 0) {
    return { ...base, errorMessage: "0보다 큰 메뉴 판매가를 입력해주세요." }
  }

  if (expectedOrders <= 0) {
    return { ...base, errorMessage: "0보다 큰 예상 주문 수를 입력해주세요." }
  }

  const feesBefore = calculatePlatformFees(
    sellingPrice,
    brokerageRate,
    pgRate,
    0
  )
  const feesAfter = calculatePlatformFees(
    sellingPrice,
    brokerageRate,
    pgRate,
    ownerBurdenDiscount
  )

  const profitBeforePerOrder =
    sellingPrice - cost - feesBefore.totalFee
  const profitAfterPerOrder =
    sellingPrice - cost - feesAfter.totalFee - ownerBurdenDiscount

  const ordersAfterCoupon = Math.round(
    expectedOrders * (1 + orderIncreaseRate / 100)
  )
  const additionalOrders = Math.max(0, ordersAfterCoupon - expectedOrders)
  const totalCouponBurden = ownerBurdenDiscount * ordersAfterCoupon

  const totalProfitBefore = profitBeforePerOrder * expectedOrders
  const totalProfitAfter = profitAfterPerOrder * ordersAfterCoupon
  const totalProfitDiff = totalProfitAfter - totalProfitBefore

  const breakEvenAdditionalOrders =
    profitBeforePerOrder > 0
      ? Math.ceil(totalCouponBurden / profitBeforePerOrder)
      : Infinity

  const recommendation = resolveRecommendation(
    profitBeforePerOrder,
    totalProfitBefore,
    totalProfitAfter,
    breakEvenAdditionalOrders,
    additionalOrders
  )

  return {
    ...base,
    brokerageFee: feesBefore.brokerageFee,
    pgFee: feesBefore.pgFee,
    vatBefore: feesBefore.vat,
    vatAfter: feesAfter.vat,
    totalFeeBefore: feesBefore.totalFee,
    totalFeeAfter: feesAfter.totalFee,
    profitBeforePerOrder,
    profitAfterPerOrder,
    totalCouponBurden,
    ordersAfterCoupon,
    additionalOrders,
    totalProfitBefore,
    totalProfitAfter,
    totalProfitDiff,
    breakEvenAdditionalOrders: Number.isFinite(breakEvenAdditionalOrders)
      ? breakEvenAdditionalOrders
      : 0,
    ...recommendation,
    canCalculate: true,
    errorMessage: null,
  }
}

export function formatRatePercent(rate: number): string {
  return formatPercent(rate)
}
