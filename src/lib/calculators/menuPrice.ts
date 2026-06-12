export interface MenuPriceInput {
  cost: number
  targetMarginRate: number
}

export interface MenuPriceResult {
  cost: number
  targetMarginRate: number
  recommendedPrice: number
  expectedMarginAmount: number
  expectedCostRate: number
}

export const DEFAULT_MENU_PRICE_INPUT: MenuPriceInput = {
  cost: 3_500,
  targetMarginRate: 65,
}

export function calculateMenuPrice(
  input: MenuPriceInput
): MenuPriceResult | null {
  const cost = Number.isFinite(input.cost) ? Math.max(0, input.cost) : 0
  const targetMarginRate = Number.isFinite(input.targetMarginRate)
    ? Math.min(Math.max(0, input.targetMarginRate), 99.9)
    : 0

  if (cost <= 0 || targetMarginRate <= 0) return null

  const recommendedPrice = Math.round(cost / (1 - targetMarginRate / 100))
  const expectedMarginAmount = recommendedPrice - cost
  const expectedCostRate = (cost / recommendedPrice) * 100

  return {
    cost,
    targetMarginRate,
    recommendedPrice,
    expectedMarginAmount,
    expectedCostRate,
  }
}
