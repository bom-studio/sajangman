export interface BreakEvenInput {
  fixedCost: number
  sellingPrice: number
  variableCost: number
  expectedQuantity: number
}

export interface BreakEvenResult {
  fixedCost: number
  sellingPrice: number
  variableCost: number
  expectedQuantity: number
  contributionPerUnit: number
  contributionMarginRate: number
  breakEvenQuantity: number | null
  breakEvenRevenue: number | null
  expectedRevenue: number
  expectedNetProfit: number
  canBreakEven: boolean
}

export interface BreakEvenChartPoint {
  quantity: number
  revenue: number
  totalCost: number
}

export const DEFAULT_BREAK_EVEN_INPUT: BreakEvenInput = {
  fixedCost: 2_000_000,
  sellingPrice: 50_000,
  variableCost: 20_000,
  expectedQuantity: 100,
}

export function parseAmountInput(value: string): number {
  const digits = value.replace(/[^\d]/g, "")
  if (!digits) return 0
  const parsed = Number(digits)
  return Number.isFinite(parsed) ? parsed : 0
}

export function parsePositiveNumber(value: string): number {
  const parsed = Number(value)
  if (!Number.isFinite(parsed) || parsed < 0) return 0
  return parsed
}

export function formatAmount(amount: number): string {
  if (!Number.isFinite(amount)) return "0"
  return Math.round(amount).toLocaleString("ko-KR")
}

export function formatWon(amount: number): string {
  return `${formatAmount(amount)}원`
}

export function formatQuantity(quantity: number): string {
  if (!Number.isFinite(quantity)) return "0개"
  return `${Math.round(quantity).toLocaleString("ko-KR")}개`
}

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0%"
  return `${value.toFixed(1)}%`
}

function sanitizeAmount(value: number): number {
  return Number.isFinite(value) ? Math.max(0, value) : 0
}

/**
 * 단위당 기여이익 = 판매가 - 변동비
 * 손익분기점 판매수량 = 고정비 ÷ 단위당 기여이익
 * 손익분기점 매출 = 손익분기점 판매수량 × 판매가
 * 예상 매출 = 판매가 × 예상 판매수량
 * 예상 순이익 = 예상 매출 - (고정비 + 변동비 × 판매수량)
 * 기여이익률 = (판매가 - 변동비) ÷ 판매가 × 100
 */
export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const fixedCost = sanitizeAmount(input.fixedCost)
  const sellingPrice = sanitizeAmount(input.sellingPrice)
  const variableCost = sanitizeAmount(input.variableCost)
  const expectedQuantity = sanitizeAmount(input.expectedQuantity)

  const contributionPerUnit = sellingPrice - variableCost
  const canBreakEven = contributionPerUnit > 0 && fixedCost > 0

  const breakEvenQuantity = canBreakEven
    ? Math.ceil(fixedCost / contributionPerUnit)
    : null

  const breakEvenRevenue =
    breakEvenQuantity !== null ? breakEvenQuantity * sellingPrice : null

  const expectedRevenue = sellingPrice * expectedQuantity
  const expectedNetProfit =
    expectedRevenue - (fixedCost + variableCost * expectedQuantity)

  const contributionMarginRate =
    sellingPrice > 0 ? (contributionPerUnit / sellingPrice) * 100 : 0

  return {
    fixedCost,
    sellingPrice,
    variableCost,
    expectedQuantity,
    contributionPerUnit,
    contributionMarginRate,
    breakEvenQuantity,
    breakEvenRevenue,
    expectedRevenue,
    expectedNetProfit,
    canBreakEven,
  }
}

export function buildBreakEvenChartData(
  result: BreakEvenResult,
  pointCount = 24
): BreakEvenChartPoint[] {
  const breakEvenQty = result.breakEvenQuantity ?? 0
  const maxQuantity = Math.max(
    result.expectedQuantity,
    breakEvenQty,
    10
  )
  const upperBound = Math.ceil(maxQuantity * 1.25)
  const step = Math.max(1, Math.ceil(upperBound / pointCount))

  const points: BreakEvenChartPoint[] = []

  for (let quantity = 0; quantity <= upperBound; quantity += step) {
    points.push({
      quantity,
      revenue: result.sellingPrice * quantity,
      totalCost: result.fixedCost + result.variableCost * quantity,
    })
  }

  if (points[points.length - 1]?.quantity !== upperBound) {
    points.push({
      quantity: upperBound,
      revenue: result.sellingPrice * upperBound,
      totalCost: result.fixedCost + result.variableCost * upperBound,
    })
  }

  return points
}
