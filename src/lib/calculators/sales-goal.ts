import {
  formatAmount,
  formatPercent,
  parseAmountInput,
  parsePositiveNumber,
} from "@/lib/calculators/format"

export interface SalesGoalInput {
  targetNetProfit: number
  fixedCost: number
  costRate: number
  laborRate: number
  otherCostRate: number
  businessDays: number
  averageTicket: number
}

export interface SalesGoalResult {
  targetNetProfit: number
  fixedCost: number
  costRate: number
  laborRate: number
  otherCostRate: number
  variableCostRate: number
  businessDays: number
  averageTicket: number
  requiredMonthlySales: number
  requiredDailySales: number
  requiredDailyCustomers: number
  netProfitMarginRate: number
  canCalculate: boolean
  errorMessage: string | null
}

export const DEFAULT_SALES_GOAL_INPUT: SalesGoalInput = {
  targetNetProfit: 5_000_000,
  fixedCost: 6_000_000,
  costRate: 32,
  laborRate: 25,
  otherCostRate: 8,
  businessDays: 26,
  averageTicket: 15_000,
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

function sanitizeRate(value: number): number {
  if (!Number.isFinite(value)) return 0
  return Math.min(100, Math.max(0, value))
}

export function calculateSalesGoal(input: SalesGoalInput): SalesGoalResult {
  const targetNetProfit = Math.max(0, input.targetNetProfit)
  const fixedCost = Math.max(0, input.fixedCost)
  const costRate = sanitizeRate(input.costRate)
  const laborRate = sanitizeRate(input.laborRate)
  const otherCostRate = sanitizeRate(input.otherCostRate)
  const variableCostRate = costRate + laborRate + otherCostRate
  const businessDays = Math.max(0, Math.floor(input.businessDays))
  const averageTicket = Math.max(0, input.averageTicket)

  const base: SalesGoalResult = {
    targetNetProfit,
    fixedCost,
    costRate,
    laborRate,
    otherCostRate,
    variableCostRate,
    businessDays,
    averageTicket,
    requiredMonthlySales: 0,
    requiredDailySales: 0,
    requiredDailyCustomers: 0,
    netProfitMarginRate: 0,
    canCalculate: false,
    errorMessage: null,
  }

  if (variableCostRate >= 100) {
    return {
      ...base,
      errorMessage:
        "총 변동비율(원가+인건비+기타)이 100% 미만이어야 계산할 수 있습니다.",
    }
  }

  if (businessDays <= 0) {
    return {
      ...base,
      errorMessage: "0보다 큰 월 영업일수를 입력해주세요.",
    }
  }

  if (averageTicket <= 0) {
    return {
      ...base,
      errorMessage: "0보다 큰 평균 객단가를 입력해주세요.",
    }
  }

  const contributionMarginRate = 1 - variableCostRate / 100
  const requiredMonthlySales = Math.ceil(
    (targetNetProfit + fixedCost) / contributionMarginRate
  )
  const requiredDailySales = Math.ceil(requiredMonthlySales / businessDays)
  const requiredDailyCustomers = requiredDailySales / averageTicket
  const netProfitMarginRate =
    requiredMonthlySales > 0
      ? (targetNetProfit / requiredMonthlySales) * 100
      : 0

  return {
    ...base,
    requiredMonthlySales,
    requiredDailySales,
    requiredDailyCustomers,
    netProfitMarginRate,
    canCalculate: true,
    errorMessage: null,
  }
}

export function formatRatePercent(rate: number): string {
  return formatPercent(rate)
}
