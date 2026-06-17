import {
  formatAmount,
  parseAmountInput,
  parsePositiveNumber,
} from "@/lib/calculators/format"

export interface CustomerUnitPriceInput {
  totalRevenue: number
  customerCount: number
  targetRevenue: number
  businessDays: number
}

export interface CustomerUnitPriceResult {
  totalRevenue: number
  customerCount: number
  targetRevenue: number
  businessDays: number
  averageUnitPrice: number
  requiredTotalCustomers: number
  requiredDailyCustomers: number
  additionalCustomers: number
  canCalculate: boolean
  errorMessage: string | null
}

export const DEFAULT_CUSTOMER_UNIT_PRICE_INPUT: CustomerUnitPriceInput = {
  totalRevenue: 30_000_000,
  customerCount: 2_000,
  targetRevenue: 40_000_000,
  businessDays: 26,
}

export { parseAmountInput, parsePositiveNumber }

export function formatWon(amount: number): string {
  return `${formatAmount(amount)}원`
}

export function formatCustomers(count: number): string {
  if (!Number.isFinite(count) || count <= 0) return "0명"
  const rounded = Math.ceil(count)
  return `${rounded.toLocaleString("ko-KR")}명`
}

export function calculateCustomerUnitPrice(
  input: CustomerUnitPriceInput
): CustomerUnitPriceResult {
  const totalRevenue = Math.max(0, input.totalRevenue)
  const customerCount = Math.max(0, Math.floor(input.customerCount))
  const targetRevenue = Math.max(0, input.targetRevenue)
  const businessDays = Math.max(0, Math.floor(input.businessDays))

  const base: CustomerUnitPriceResult = {
    totalRevenue,
    customerCount,
    targetRevenue,
    businessDays,
    averageUnitPrice: 0,
    requiredTotalCustomers: 0,
    requiredDailyCustomers: 0,
    additionalCustomers: 0,
    canCalculate: false,
    errorMessage: null,
  }

  if (totalRevenue <= 0) {
    return { ...base, errorMessage: "0보다 큰 총 매출을 입력해주세요." }
  }

  if (customerCount <= 0) {
    return { ...base, errorMessage: "0보다 큰 고객 수를 입력해주세요." }
  }

  if (targetRevenue <= 0) {
    return { ...base, errorMessage: "0보다 큰 목표 매출을 입력해주세요." }
  }

  if (businessDays <= 0) {
    return { ...base, errorMessage: "0보다 큰 영업일수를 입력해주세요." }
  }

  const averageUnitPrice = totalRevenue / customerCount
  const requiredTotalCustomers = Math.ceil(targetRevenue / averageUnitPrice)
  const requiredDailyCustomers = requiredTotalCustomers / businessDays
  const additionalCustomers = Math.max(0, requiredTotalCustomers - customerCount)

  return {
    ...base,
    averageUnitPrice,
    requiredTotalCustomers,
    requiredDailyCustomers,
    additionalCustomers,
    canCalculate: true,
    errorMessage: null,
  }
}
