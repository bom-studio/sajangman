import { formatAmount, formatPercent, parseAmountInput } from "@/lib/calculators/format"

export type InventoryPeriod = "monthly" | "annual"

export interface InventoryTurnoverInput {
  period: InventoryPeriod
  costOfGoodsSold: number
  beginningInventory: number
  endingInventory: number
  useDirectAverage: boolean
  directAverageInventory: number
}

export interface InventoryTurnoverResult {
  period: InventoryPeriod
  periodLabel: string
  costOfGoodsSold: number
  beginningInventory: number
  endingInventory: number
  useDirectAverage: boolean
  averageInventory: number
  inventoryTurnover: number
  holdingDays: number
  managementStatus: "good" | "medium" | "warning"
  managementStatusLabel: string
  canCalculate: boolean
  errorMessage: string | null
}

export const DEFAULT_INVENTORY_TURNOVER_INPUT: InventoryTurnoverInput = {
  period: "monthly",
  costOfGoodsSold: 15_000_000,
  beginningInventory: 3_000_000,
  endingInventory: 2_000_000,
  useDirectAverage: false,
  directAverageInventory: 2_500_000,
}

export { parseAmountInput }

export function formatWon(amount: number): string {
  return `${formatAmount(amount)}원`
}

export function formatTurnoverRate(rate: number): string {
  if (!Number.isFinite(rate) || rate <= 0) return "0회"
  return `${rate.toFixed(2)}회`
}

export function formatHoldingDays(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return "0일"
  return `${Math.round(days).toLocaleString("ko-KR")}일`
}

function resolveManagementStatus(
  holdingDays: number,
  period: InventoryPeriod
): Pick<InventoryTurnoverResult, "managementStatus" | "managementStatusLabel"> {
  if (period === "annual") {
    if (holdingDays <= 30) {
      return { managementStatus: "good", managementStatusLabel: "양호" }
    }
    if (holdingDays <= 60) {
      return { managementStatus: "medium", managementStatusLabel: "보통" }
    }
    return { managementStatus: "warning", managementStatusLabel: "개선 필요" }
  }

  if (holdingDays <= 7) {
    return { managementStatus: "good", managementStatusLabel: "양호" }
  }
  if (holdingDays <= 15) {
    return { managementStatus: "medium", managementStatusLabel: "보통" }
  }
  return { managementStatus: "warning", managementStatusLabel: "개선 필요" }
}

export function calculateInventoryTurnover(
  input: InventoryTurnoverInput
): InventoryTurnoverResult {
  const period = input.period
  const periodLabel = period === "monthly" ? "월간" : "연간"
  const costOfGoodsSold = Math.max(0, input.costOfGoodsSold)
  const beginningInventory = Math.max(0, input.beginningInventory)
  const endingInventory = Math.max(0, input.endingInventory)
  const useDirectAverage = input.useDirectAverage
  const directAverageInventory = Math.max(0, input.directAverageInventory)

  const base: InventoryTurnoverResult = {
    period,
    periodLabel,
    costOfGoodsSold,
    beginningInventory,
    endingInventory,
    useDirectAverage,
    averageInventory: 0,
    inventoryTurnover: 0,
    holdingDays: 0,
    managementStatus: "warning",
    managementStatusLabel: "개선 필요",
    canCalculate: false,
    errorMessage: null,
  }

  if (costOfGoodsSold <= 0) {
    return { ...base, errorMessage: "0보다 큰 매출원가를 입력해주세요." }
  }

  const averageInventory = useDirectAverage
    ? directAverageInventory
    : Math.round((beginningInventory + endingInventory) / 2)

  if (averageInventory <= 0) {
    return {
      ...base,
      errorMessage: useDirectAverage
        ? "0보다 큰 평균 재고액을 입력해주세요."
        : "기초·기말 재고액 합계가 0보다 커야 합니다.",
    }
  }

  const inventoryTurnover = costOfGoodsSold / averageInventory
  const periodDays = period === "monthly" ? 30 : 365
  const holdingDays = inventoryTurnover > 0 ? periodDays / inventoryTurnover : 0

  const status = resolveManagementStatus(holdingDays, period)

  return {
    ...base,
    averageInventory,
    inventoryTurnover,
    holdingDays,
    ...status,
    canCalculate: true,
    errorMessage: null,
  }
}

export function formatRatePercent(rate: number): string {
  return formatPercent(rate)
}

export const INVENTORY_MANAGEMENT_STATUS_LABEL: Record<
  "good" | "medium" | "warning",
  string
> = {
  good: "양호",
  medium: "보통",
  warning: "개선 필요",
}
