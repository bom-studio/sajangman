export interface CostRateInput {
  sellingPrice: number
  cost: number
}

export interface CostRateResult {
  sellingPrice: number
  cost: number
  costRate: number
  marginAmount: number
  marginRate: number
}

export const DEFAULT_COST_RATE_INPUT: CostRateInput = {
  sellingPrice: 10_000,
  cost: 3_500,
}

export function calculateCostRate(input: CostRateInput): CostRateResult | null {
  const sellingPrice = Number.isFinite(input.sellingPrice)
    ? Math.max(0, input.sellingPrice)
    : 0
  const cost = Number.isFinite(input.cost) ? Math.max(0, input.cost) : 0

  if (sellingPrice <= 0) return null

  const marginAmount = sellingPrice - cost
  const costRate = (cost / sellingPrice) * 100
  const marginRate = (marginAmount / sellingPrice) * 100

  return {
    sellingPrice,
    cost,
    costRate,
    marginAmount,
    marginRate,
  }
}
