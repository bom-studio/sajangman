import { calculateSimpleWeeklyPay } from "@/lib/weekly-pay"

/** 연도별 최저임금(시급, 원). 세법·고시 변경 시 본 상수만 수정하세요. */
export const MINIMUM_WAGE_BY_YEAR = {
  2024: 9_860,
  2025: 10_030,
  2026: 10_030,
} as const

export type MinimumWageYear = keyof typeof MINIMUM_WAGE_BY_YEAR

export const MINIMUM_WAGE_YEARS = Object.keys(MINIMUM_WAGE_BY_YEAR)
  .map(Number)
  .sort((a, b) => b - a) as MinimumWageYear[]

/** 월 환산 계수 (주급 × 4.345) */
export const MONTHLY_WEEKS_FACTOR = 4.345

export type MonthlyConversionBasis = "weekly" | "monthly"

export interface MinimumWageInput {
  year: MinimumWageYear
  hourlyWage: number
  daysPerWeek: number
  hoursPerDay: number
  includeWeeklyHoliday: boolean
  monthlyConversionBasis: MonthlyConversionBasis
}

export interface MinimumWageResult {
  year: MinimumWageYear
  hourlyWage: number
  minimumWage: number
  isCompliant: boolean
  daysPerWeek: number
  hoursPerDay: number
  weeklyHours: number
  weeklyHolidayPay: number
  weeklyPay: number
  monthlyPay: number
  shortfallHourly: number
  shortfallMonthly: number
  includeWeeklyHoliday: boolean
  monthlyConversionBasis: MonthlyConversionBasis
}

export const DEFAULT_MINIMUM_WAGE_INPUT: MinimumWageInput = {
  year: 2026,
  hourlyWage: 9_500,
  daysPerWeek: 5,
  hoursPerDay: 8,
  includeWeeklyHoliday: true,
  monthlyConversionBasis: "weekly",
}

export function getMinimumWage(year: MinimumWageYear): number {
  return MINIMUM_WAGE_BY_YEAR[year]
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

function computeWeeklyPay(
  hourlyWage: number,
  daysPerWeek: number,
  hoursPerDay: number,
  includeWeeklyHoliday: boolean
): { weeklyPay: number; weeklyHolidayPay: number; weeklyHours: number } {
  const days = Math.max(0, daysPerWeek)
  const hours = Math.max(0, hoursPerDay)
  const weeklyHours = days * hours

  if (includeWeeklyHoliday) {
    const weeklyResult = calculateSimpleWeeklyPay({
      hourlyWage,
      daysPerWeek: days,
      hoursPerDay: hours,
    })
    return {
      weeklyPay: weeklyResult.estimatedWeeklyPay,
      weeklyHolidayPay: weeklyResult.weeklyHolidayPay,
      weeklyHours: weeklyResult.weeklyTotalHours,
    }
  }

  return {
    weeklyPay: Math.round(hourlyWage * weeklyHours),
    weeklyHolidayPay: 0,
    weeklyHours,
  }
}

export function calculateMinimumWage(
  input: MinimumWageInput
): MinimumWageResult {
  const year = input.year
  const hourlyWage = Math.max(0, input.hourlyWage)
  const daysPerWeek = Math.max(0, input.daysPerWeek)
  const hoursPerDay = Math.max(0, input.hoursPerDay)
  const minimumWage = getMinimumWage(year)
  const isCompliant = hourlyWage >= minimumWage

  const { weeklyPay, weeklyHolidayPay, weeklyHours } = computeWeeklyPay(
    hourlyWage,
    daysPerWeek,
    hoursPerDay,
    input.includeWeeklyHoliday
  )

  const monthlyPay = Math.round(weeklyPay * MONTHLY_WEEKS_FACTOR)

  let shortfallHourly = 0
  let shortfallMonthly = 0

  if (!isCompliant) {
    shortfallHourly = minimumWage - hourlyWage

    const minimumWeekly = computeWeeklyPay(
      minimumWage,
      daysPerWeek,
      hoursPerDay,
      input.includeWeeklyHoliday
    )
    const minimumMonthly = Math.round(
      minimumWeekly.weeklyPay * MONTHLY_WEEKS_FACTOR
    )
    shortfallMonthly = Math.max(0, minimumMonthly - monthlyPay)
  }

  return {
    year,
    hourlyWage,
    minimumWage,
    isCompliant,
    daysPerWeek,
    hoursPerDay,
    weeklyHours,
    weeklyHolidayPay,
    weeklyPay,
    monthlyPay,
    shortfallHourly,
    shortfallMonthly,
    includeWeeklyHoliday: input.includeWeeklyHoliday,
    monthlyConversionBasis: input.monthlyConversionBasis,
  }
}

export function getMinimumWageTableRows(): {
  year: MinimumWageYear
  hourly: number
}[] {
  return MINIMUM_WAGE_YEARS.map((year) => ({
    year,
    hourly: MINIMUM_WAGE_BY_YEAR[year],
  }))
}
