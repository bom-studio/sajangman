export interface AnnualLeavePayInput {
  dailyWage: number
  remainingDays: number
}

export interface AnnualLeavePayResult {
  dailyWage: number
  remainingDays: number
  estimatedPay: number
}

export const DEFAULT_ANNUAL_LEAVE_INPUT: AnnualLeavePayInput = {
  dailyWage: 100_000,
  remainingDays: 5,
}

export function calculateAnnualLeavePay(
  input: AnnualLeavePayInput
): AnnualLeavePayResult | null {
  const dailyWage = Number.isFinite(input.dailyWage)
    ? Math.max(0, input.dailyWage)
    : 0
  const remainingDays = Number.isFinite(input.remainingDays)
    ? Math.max(0, input.remainingDays)
    : 0

  if (dailyWage <= 0 || remainingDays <= 0) return null

  return {
    dailyWage,
    remainingDays,
    estimatedPay: Math.round(dailyWage * remainingDays),
  }
}
