import { formatDays, formatYears } from "@/lib/calculators/format"

export interface SeverancePayInput {
  startDate: string
  endDate: string
  avgMonthlyWage: number
}

export interface SeverancePayResult {
  workDays: number
  workYears: number
  dailyWage: number
  estimatedSeverancePay: number
  isEligible: boolean
}

export const DEFAULT_SEVERANCE_INPUT: SeverancePayInput = {
  startDate: "",
  endDate: "",
  avgMonthlyWage: 3_000_000,
}

function parseDate(value: string): Date | null {
  if (!value) return null
  const date = new Date(`${value}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

function diffDays(start: Date, end: Date): number {
  const ms = end.getTime() - start.getTime()
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)))
}

export function calculateSeverancePay(
  input: SeverancePayInput
): SeverancePayResult | null {
  const start = parseDate(input.startDate)
  const end = parseDate(input.endDate)
  const avgMonthlyWage = Number.isFinite(input.avgMonthlyWage)
    ? Math.max(0, input.avgMonthlyWage)
    : 0

  if (!start || !end || end < start || avgMonthlyWage <= 0) {
    return null
  }

  const workDays = diffDays(start, end)
  const workYears = workDays / 365
  const isEligible = workDays >= 365
  const dailyWage = avgMonthlyWage / 30
  const estimatedSeverancePay = isEligible
    ? Math.round(dailyWage * 30 * (workDays / 365))
    : 0

  return {
    workDays,
    workYears,
    dailyWage,
    estimatedSeverancePay,
    isEligible,
  }
}

export function formatWorkDays(days: number): string {
  return formatDays(days)
}

export function formatWorkYears(years: number): string {
  return formatYears(years)
}

export function formatWorkPeriod(workDays: number): string {
  if (!Number.isFinite(workDays) || workDays <= 0) return "0일"

  const years = Math.floor(workDays / 365)
  const months = Math.floor((workDays % 365) / 30)
  const parts: string[] = []

  if (years > 0) parts.push(`${years}년`)
  if (months > 0) parts.push(`${months}개월`)
  if (parts.length === 0) return formatDays(workDays)

  return parts.join(" ")
}
