import { formatAmount, formatPercent, parseAmountInput } from "@/lib/calculators/format"

const VAT_RATE = 0.1

export interface CardFeeInput {
  cardSales: number
  feeRate: number
  vatIncluded: boolean
  monthlyTransactionCount: number
  averagePayment: number
}

export interface CardFeeResult {
  cardSales: number
  feeRate: number
  vatIncluded: boolean
  monthlyTransactionCount: number
  averagePayment: number
  feeBase: number
  vatOnFee: number
  cardFee: number
  settlementAmount: number
  feePerTransaction: number
  monthlyTotalFee: number
  effectiveFeeRate: number
  canCalculate: boolean
  errorMessage: string | null
}

export const DEFAULT_CARD_FEE_INPUT: CardFeeInput = {
  cardSales: 10_000_000,
  feeRate: 2.0,
  vatIncluded: false,
  monthlyTransactionCount: 500,
  averagePayment: 20_000,
}

export { parseAmountInput }

export function formatWon(amount: number): string {
  return `${formatAmount(amount)}원`
}

export function formatTransactions(count: number): string {
  if (!Number.isFinite(count) || count <= 0) return "0건"
  return `${Math.round(count).toLocaleString("ko-KR")}건`
}

function sanitizeRate(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.max(0, value)
}

export function calculateCardFee(input: CardFeeInput): CardFeeResult {
  const cardSales = Math.max(0, input.cardSales)
  const feeRate = sanitizeRate(input.feeRate)
  const vatIncluded = input.vatIncluded
  const monthlyTransactionCount = Math.max(
    0,
    Math.floor(input.monthlyTransactionCount)
  )
  const averagePayment = Math.max(0, input.averagePayment)

  const base: CardFeeResult = {
    cardSales,
    feeRate,
    vatIncluded,
    monthlyTransactionCount,
    averagePayment,
    feeBase: 0,
    vatOnFee: 0,
    cardFee: 0,
    settlementAmount: 0,
    feePerTransaction: 0,
    monthlyTotalFee: 0,
    effectiveFeeRate: 0,
    canCalculate: false,
    errorMessage: null,
  }

  if (cardSales <= 0) {
    return { ...base, errorMessage: "0보다 큰 카드 매출액을 입력해주세요." }
  }

  if (monthlyTransactionCount <= 0) {
    return {
      ...base,
      errorMessage: "0보다 큰 월 카드 거래 건수를 입력해주세요.",
    }
  }

  let feeBase: number
  let vatOnFee: number
  let cardFee: number

  if (vatIncluded) {
    cardFee = Math.round(cardSales * (feeRate / 100))
    feeBase = Math.round(cardFee / (1 + VAT_RATE))
    vatOnFee = cardFee - feeBase
  } else {
    feeBase = Math.round(cardSales * (feeRate / 100))
    vatOnFee = Math.round(feeBase * VAT_RATE)
    cardFee = feeBase + vatOnFee
  }

  const settlementAmount = cardSales - cardFee
  const feePerTransaction = Math.round(cardFee / monthlyTransactionCount)
  const monthlyTotalFee = cardFee
  const effectiveFeeRate =
    cardSales > 0 ? (cardFee / cardSales) * 100 : 0

  return {
    ...base,
    feeBase,
    vatOnFee,
    cardFee,
    settlementAmount,
    feePerTransaction,
    monthlyTotalFee,
    effectiveFeeRate,
    canCalculate: true,
    errorMessage: null,
  }
}

export function formatRatePercent(rate: number): string {
  return formatPercent(rate)
}

export function formatVatIncludedLabel(vatIncluded: boolean): string {
  return vatIncluded ? "부가세 포함" : "부가세 별도"
}
