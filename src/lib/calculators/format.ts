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

export function formatPercent(value: number): string {
  if (!Number.isFinite(value)) return "0.0%"
  return `${value.toFixed(1)}%`
}

export function formatDays(days: number): string {
  if (!Number.isFinite(days)) return "0일"
  return `${Math.round(days).toLocaleString("ko-KR")}일`
}

export function formatYears(years: number): string {
  if (!Number.isFinite(years)) return "0년"
  return `${years.toFixed(1)}년`
}
