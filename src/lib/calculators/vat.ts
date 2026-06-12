export const VAT_RATE = 0.1

export interface VatResult {
  supplyAmount: number
  vatAmount: number
  totalAmount: number
}

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

export function formatWon(amount: number): string {
  return `${formatAmount(amount)}원`
}

function isValidAmount(amount: number): boolean {
  return Number.isFinite(amount) && amount > 0
}

/**
 * 합계금액 기준
 * 공급가액 = 합계금액 / 1.1
 * 부가세액 = 합계금액 - 공급가액
 */
export function calculateVatFromTotal(totalAmount: number): VatResult | null {
  if (!isValidAmount(totalAmount)) return null

  const supplyAmount = Math.round(totalAmount / (1 + VAT_RATE))
  const vatAmount = totalAmount - supplyAmount

  return {
    supplyAmount,
    vatAmount,
    totalAmount,
  }
}

/**
 * 공급가액 기준
 * 부가세액 = 공급가액 × 0.1
 * 합계금액 = 공급가액 + 부가세액
 */
export function calculateVatFromSupply(supplyAmount: number): VatResult | null {
  if (!isValidAmount(supplyAmount)) return null

  const vatAmount = Math.round(supplyAmount * VAT_RATE)
  const totalAmount = supplyAmount + vatAmount

  return {
    supplyAmount,
    vatAmount,
    totalAmount,
  }
}
