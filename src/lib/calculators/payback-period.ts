import {
  formatAmount,
  parseAmountInput,
} from "@/lib/calculators/format"

export interface PaybackPeriodInput {
  initialInvestment: number
  deposit: number
  interiorCost: number
  equipmentCost: number
  otherStartupCost: number
  monthlyRevenue: number
  monthlyCost: number
  useDirectNetProfit: boolean
  directMonthlyNetProfit: number
}

export interface PaybackPeriodResult {
  initialInvestment: number
  deposit: number
  interiorCost: number
  equipmentCost: number
  otherStartupCost: number
  monthlyRevenue: number
  monthlyCost: number
  useDirectNetProfit: boolean
  totalInvestment: number
  monthlyNetProfit: number
  paybackMonths: number | null
  annualNetProfit: number
  cumulativeProfitAfterRecovery: number
  canRecover: boolean
  recoveryMessage: string | null
  canCalculate: boolean
  errorMessage: string | null
}

export const DEFAULT_PAYBACK_PERIOD_INPUT: PaybackPeriodInput = {
  initialInvestment: 10_000_000,
  deposit: 30_000_000,
  interiorCost: 50_000_000,
  equipmentCost: 20_000_000,
  otherStartupCost: 5_000_000,
  monthlyRevenue: 25_000_000,
  monthlyCost: 18_000_000,
  useDirectNetProfit: false,
  directMonthlyNetProfit: 5_000_000,
}

export { parseAmountInput }

export function formatWon(amount: number): string {
  return `${formatAmount(amount)}원`
}

export function formatPaybackMonths(months: number): string {
  if (!Number.isFinite(months) || months <= 0) return "-"

  const rounded = Math.ceil(months * 10) / 10
  if (rounded < 12) {
    return `약 ${Math.ceil(rounded)}개월`
  }

  const wholeMonths = Math.ceil(rounded)
  const years = Math.floor(wholeMonths / 12)
  const remainingMonths = wholeMonths % 12

  if (remainingMonths === 0) {
    return `약 ${years}년`
  }

  return `약 ${years}년 ${remainingMonths}개월`
}

export function calculatePaybackPeriod(
  input: PaybackPeriodInput
): PaybackPeriodResult {
  const initialInvestment = Math.max(0, input.initialInvestment)
  const deposit = Math.max(0, input.deposit)
  const interiorCost = Math.max(0, input.interiorCost)
  const equipmentCost = Math.max(0, input.equipmentCost)
  const otherStartupCost = Math.max(0, input.otherStartupCost)
  const monthlyRevenue = Math.max(0, input.monthlyRevenue)
  const monthlyCost = Math.max(0, input.monthlyCost)

  const totalInvestment =
    initialInvestment +
    deposit +
    interiorCost +
    equipmentCost +
    otherStartupCost

  const base: PaybackPeriodResult = {
    initialInvestment,
    deposit,
    interiorCost,
    equipmentCost,
    otherStartupCost,
    monthlyRevenue,
    monthlyCost,
    useDirectNetProfit: input.useDirectNetProfit,
    totalInvestment,
    monthlyNetProfit: 0,
    paybackMonths: null,
    annualNetProfit: 0,
    cumulativeProfitAfterRecovery: 0,
    canRecover: false,
    recoveryMessage: null,
    canCalculate: false,
    errorMessage: null,
  }

  if (totalInvestment <= 0) {
    return {
      ...base,
      errorMessage: "0보다 큰 창업비용을 입력해주세요.",
    }
  }

  const monthlyNetProfit = input.useDirectNetProfit
    ? input.directMonthlyNetProfit
    : monthlyRevenue - monthlyCost

  const resultWithProfit = {
    ...base,
    monthlyNetProfit,
    canCalculate: true,
  }

  if (monthlyNetProfit <= 0) {
    return {
      ...resultWithProfit,
      canRecover: false,
      recoveryMessage: "현재 조건에서는 투자금 회수가 어렵습니다.",
    }
  }

  const paybackMonths = totalInvestment / monthlyNetProfit
  const annualNetProfit = monthlyNetProfit * 12
  const cumulativeProfitAfterRecovery = monthlyNetProfit * 12

  return {
    ...resultWithProfit,
    paybackMonths,
    annualNetProfit,
    cumulativeProfitAfterRecovery,
    canRecover: true,
    recoveryMessage: null,
  }
}
