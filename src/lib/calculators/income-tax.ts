export interface IncomeTaxInput {
  annualRevenue: number
  expenses: number
  basicDeduction: number
  otherDeduction: number
  prepaidTax: number
  includeLocalTax: boolean
}

export interface IncomeTaxResult {
  annualRevenue: number
  expenses: number
  incomeAmount: number
  totalDeduction: number
  taxableIncome: number
  nationalTax: number
  localTax: number
  totalTax: number
  prepaidTax: number
  netPayment: number
  includeLocalTax: boolean
}

/** 2026년 기준 종합소득세 누진세율 (간이 적용). 세법 변경 시 본 상수만 수정하세요. */
const INCOME_TAX_BRACKETS_2026 = [
  { max: 14_000_000, rate: 0.06, deduction: 0 },
  { max: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { max: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { max: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { max: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { max: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { max: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { max: Infinity, rate: 0.45, deduction: 65_940_000 },
] as const

export const LOCAL_INCOME_TAX_RATE = 0.1

export const DEFAULT_INCOME_TAX_INPUT: IncomeTaxInput = {
  annualRevenue: 100_000_000,
  expenses: 60_000_000,
  basicDeduction: 1_500_000,
  otherDeduction: 0,
  prepaidTax: 0,
  includeLocalTax: true,
}

export function parseAmountInput(value: string): number {
  const digits = value.replace(/[^\d]/g, "")
  if (!digits) return 0
  const parsed = Number(digits)
  return Number.isFinite(parsed) ? parsed : 0
}

export function formatAmount(value: number): string {
  return Math.round(value).toLocaleString("ko-KR")
}

export function formatWon(value: number): string {
  return `${formatAmount(value)}원`
}

/**
 * 2026년 기준 종합소득세 산출세액 (누진세율 적용).
 * 과세표준은 10원 단위 절사 후 계산합니다.
 */
export function calculateNationalIncomeTax(taxableIncome: number): number {
  const base = Math.max(0, Math.floor(taxableIncome / 10) * 10)
  if (base === 0) return 0

  for (const bracket of INCOME_TAX_BRACKETS_2026) {
    if (base <= bracket.max) {
      return Math.max(0, Math.floor(base * bracket.rate - bracket.deduction))
    }
  }

  return 0
}

export function calculateLocalIncomeTax(
  nationalTax: number,
  includeLocalTax: boolean
): number {
  if (!includeLocalTax || nationalTax <= 0) return 0
  return Math.floor(nationalTax * LOCAL_INCOME_TAX_RATE)
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  const annualRevenue = Math.max(0, input.annualRevenue)
  const expenses = Math.max(0, input.expenses)
  const basicDeduction = Math.max(0, input.basicDeduction)
  const otherDeduction = Math.max(0, input.otherDeduction)
  const prepaidTax = Math.max(0, input.prepaidTax)

  const incomeAmount = Math.max(0, annualRevenue - expenses)
  const totalDeduction = basicDeduction + otherDeduction
  const taxableIncome = Math.max(0, annualRevenue - expenses - totalDeduction)

  const nationalTax = calculateNationalIncomeTax(taxableIncome)
  const localTax = calculateLocalIncomeTax(nationalTax, input.includeLocalTax)
  const totalTax = nationalTax + localTax
  const netPayment = totalTax - prepaidTax

  return {
    annualRevenue,
    expenses,
    incomeAmount,
    totalDeduction,
    taxableIncome,
    nationalTax,
    localTax,
    totalTax,
    prepaidTax,
    netPayment,
    includeLocalTax: input.includeLocalTax,
  }
}
