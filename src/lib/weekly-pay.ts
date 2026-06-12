export const WEEKLY_HOLIDAY_MIN_HOURS = 15

export type WeeklyPayCalculationMode = "simple" | "byDay"

export interface DailyHours {
  mon: number
  tue: number
  wed: number
  thu: number
  fri: number
  sat: number
  sun: number
}

export interface SimpleWeeklyPayInput {
  hourlyWage: number
  daysPerWeek: number
  hoursPerDay: number
}

export interface DailyWeeklyPayInput {
  hourlyWage: number
  dailyHours: DailyHours
}

export interface WeeklyPayResult {
  weeklyTotalHours: number
  workDays: number
  averageHoursPerDay: number
  isHolidayPayEligible: boolean
  weeklyHolidayPay: number
  weeklyWorkPay: number
  estimatedWeeklyPay: number
}

export const DEFAULT_SIMPLE_INPUT: SimpleWeeklyPayInput = {
  hourlyWage: 10030,
  daysPerWeek: 5,
  hoursPerDay: 8,
}

export const DEFAULT_DAILY_HOURS: DailyHours = {
  mon: 8,
  tue: 8,
  wed: 8,
  thu: 8,
  fri: 8,
  sat: 0,
  sun: 0,
}

export const DEFAULT_CALCULATION_MODE: WeeklyPayCalculationMode = "simple"

export function createDefaultDailyHours(): DailyHours {
  return { ...DEFAULT_DAILY_HOURS }
}

export const DAILY_HOUR_KEYS = [
  "mon",
  "tue",
  "wed",
  "thu",
  "fri",
  "sat",
  "sun",
] as const satisfies readonly (keyof DailyHours)[]

export const DAILY_HOUR_LABELS: Record<keyof DailyHours, string> = {
  mon: "월요일",
  tue: "화요일",
  wed: "수요일",
  thu: "목요일",
  fri: "금요일",
  sat: "토요일",
  sun: "일요일",
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

export function formatHours(hours: number): string {
  if (!Number.isFinite(hours) || hours <= 0) return "0시간"
  const rounded = Number.isInteger(hours) ? hours : Number(hours.toFixed(1))
  return `${rounded.toLocaleString("ko-KR")}시간`
}

export function formatWorkDays(days: number): string {
  if (!Number.isFinite(days) || days <= 0) return "0일"
  return `${days.toLocaleString("ko-KR")}일`
}

function sanitizeHourlyWage(hourlyWage: number): number {
  return Number.isFinite(hourlyWage) ? Math.max(0, hourlyWage) : 0
}

function computeWeeklyPayResult(
  hourlyWage: number,
  weeklyTotalHours: number,
  workDays: number
): WeeklyPayResult {
  const wage = sanitizeHourlyWage(hourlyWage)
  const totalHours = Number.isFinite(weeklyTotalHours)
    ? Math.max(0, weeklyTotalHours)
    : 0
  const days = Number.isFinite(workDays) ? Math.max(0, workDays) : 0

  const averageHoursPerDay = days > 0 ? totalHours / days : 0
  const isHolidayPayEligible = totalHours >= WEEKLY_HOLIDAY_MIN_HOURS

  const weeklyHolidayPay = isHolidayPayEligible
    ? Math.round(wage * averageHoursPerDay)
    : 0

  const weeklyWorkPay = Math.round(wage * totalHours)
  const estimatedWeeklyPay = weeklyWorkPay + weeklyHolidayPay

  return {
    weeklyTotalHours: totalHours,
    workDays: days,
    averageHoursPerDay,
    isHolidayPayEligible,
    weeklyHolidayPay,
    weeklyWorkPay,
    estimatedWeeklyPay,
  }
}

/** 간단 계산: 주 총 근무시간 = 주 근무일수 × 일 근무시간 */
export function calculateSimpleWeeklyPay(
  input: SimpleWeeklyPayInput
): WeeklyPayResult {
  const daysPerWeek = Number.isFinite(input.daysPerWeek)
    ? Math.max(0, input.daysPerWeek)
    : 0
  const hoursPerDay = Number.isFinite(input.hoursPerDay)
    ? Math.max(0, input.hoursPerDay)
    : 0

  const weeklyTotalHours = daysPerWeek * hoursPerDay

  return computeWeeklyPayResult(
    input.hourlyWage,
    weeklyTotalHours,
    daysPerWeek
  )
}

/** 요일별 계산: 근무일수 = 0보다 큰 근무시간을 입력한 요일 개수 */
export function calculateDailyWeeklyPay(
  input: DailyWeeklyPayInput
): WeeklyPayResult {
  const hours = DAILY_HOUR_KEYS.map((key) => {
    const value = input.dailyHours[key]
    return Number.isFinite(value) ? Math.max(0, value) : 0
  })

  const weeklyTotalHours = hours.reduce((sum, hour) => sum + hour, 0)
  const workDays = hours.filter((hour) => hour > 0).length

  return computeWeeklyPayResult(input.hourlyWage, weeklyTotalHours, workDays)
}
