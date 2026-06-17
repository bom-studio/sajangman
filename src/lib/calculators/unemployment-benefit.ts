import { parseAmountInput, parsePositiveNumber } from "@/lib/calculators/format"

/** 구직급여일액 산정 비율 */
export const DAILY_BENEFIT_RATE = 0.6

/** 2026년 기준 구직급여일액 하한액 (원). 고시 변경 시 수정하세요. */
export const DAILY_BENEFIT_MIN = 63_104

/** 2026년 기준 구직급여일액 상한액 (원). 고시 변경 시 수정하세요. */
export const DAILY_BENEFIT_MAX = 66_000

/** 고용보험 수급 자격 참고: 최근 18개월 중 180일 이상 가입 */
export const MIN_INSURANCE_DAYS = 180

export type ResignationReasonId =
  | "recommended"
  | "contract_expiry"
  | "voluntary"
  | "other"

export type EligibilityLevel = "eligible" | "uncertain" | "unlikely" | "ineligible"

export interface ResignationReasonOption {
  id: ResignationReasonId
  label: string
}

export const RESIGNATION_REASONS: ResignationReasonOption[] = [
  { id: "recommended", label: "권고사직" },
  { id: "contract_expiry", label: "계약만료" },
  { id: "voluntary", label: "자진퇴사" },
  { id: "other", label: "기타" },
]

export interface UnemploymentBenefitInput {
  avgMonthlyWage: number
  employmentMonths: number
  age: number
  isInsured: boolean
  resignationReason: ResignationReasonId
}

export interface UnemploymentBenefitResult {
  avgMonthlyWage: number
  employmentMonths: number
  age: number
  isInsured: boolean
  resignationReason: ResignationReasonId
  dailyAverageWage: number
  rawDailyBenefit: number
  dailyBenefit: number
  paymentDays: number
  totalBenefit: number
  eligibilityLevel: EligibilityLevel
  eligibilityMessage: string
}

export const DEFAULT_UNEMPLOYMENT_BENEFIT_INPUT: UnemploymentBenefitInput = {
  avgMonthlyWage: 3_000_000,
  employmentMonths: 24,
  age: 35,
  isInsured: true,
  resignationReason: "contract_expiry",
}

export { parseAmountInput, parsePositiveNumber }

export function formatWon(amount: number): string {
  return `${Math.round(amount).toLocaleString("ko-KR")}원`
}

export function formatDays(days: number): string {
  return `${days.toLocaleString("ko-KR")}일`
}

function clampDailyBenefit(amount: number): number {
  return Math.min(DAILY_BENEFIT_MAX, Math.max(DAILY_BENEFIT_MIN, Math.round(amount)))
}

/** 나이·고용보험 가입기간(개월) 기준 지급일수 (간이 분기) */
export function calculatePaymentDays(age: number, employmentMonths: number): number {
  const months = Math.max(0, employmentMonths)
  const isSenior = age >= 50
  const isYoung = age < 30

  if (months < 12) {
    return 120
  }

  if (months < 36) {
    if (isSenior) return 180
    if (isYoung) return 120
    return 150
  }

  if (months < 60) {
    if (isSenior) return 210
    if (isYoung) return 150
    return 180
  }

  if (isSenior) return 240
  if (isYoung) return 180
  return 210
}

function resolveEligibility(
  input: UnemploymentBenefitInput
): Pick<UnemploymentBenefitResult, "eligibilityLevel" | "eligibilityMessage" | "paymentDays"> {
  const insuranceDaysApprox = input.employmentMonths * 30

  if (!input.isInsured) {
    return {
      eligibilityLevel: "ineligible",
      eligibilityMessage:
        "고용보험 미가입 근로자는 실업급여 수급 대상이 아닙니다.",
      paymentDays: 0,
    }
  }

  if (insuranceDaysApprox < MIN_INSURANCE_DAYS) {
    return {
      eligibilityLevel: "unlikely",
      eligibilityMessage:
        "고용보험 가입기간이 짧으면 수급 요건(최근 18개월 중 180일 이상 등)을 충족하지 못할 수 있습니다.",
      paymentDays: 0,
    }
  }

  if (input.resignationReason === "voluntary") {
    return {
      eligibilityLevel: "unlikely",
      eligibilityMessage:
        "자진퇴사는 원칙적으로 실업급여 비대상입니다. 정당한 사유가 인정될 때만 예외적으로 가능합니다.",
      paymentDays: 0,
    }
  }

  if (input.resignationReason === "recommended") {
    return {
      eligibilityLevel: "eligible",
      eligibilityMessage:
        "권고사직은 비자발적 퇴사에 해당해 수급 가능성이 높습니다. 고용센터 심사 결과에 따라 달라질 수 있습니다.",
      paymentDays: calculatePaymentDays(input.age, input.employmentMonths),
    }
  }

  if (input.resignationReason === "contract_expiry") {
    return {
      eligibilityLevel: "eligible",
      eligibilityMessage:
        "계약만료 후 재취업이 어려운 경우 수급 가능성이 있습니다. 구직 의사와 재취업 활동이 필요합니다.",
      paymentDays: calculatePaymentDays(input.age, input.employmentMonths),
    }
  }

  return {
    eligibilityLevel: "uncertain",
    eligibilityMessage:
      "퇴사 사유와 가입기간에 따라 수급 여부가 달라집니다. 관할 고용센터에서 확인하세요.",
    paymentDays: calculatePaymentDays(input.age, input.employmentMonths),
  }
}

export function calculateUnemploymentBenefit(
  input: UnemploymentBenefitInput
): UnemploymentBenefitResult {
  const avgMonthlyWage = Math.max(0, input.avgMonthlyWage)
  const employmentMonths = Math.max(0, input.employmentMonths)
  const age = Math.max(0, Math.floor(input.age))

  const dailyAverageWage = avgMonthlyWage / 30
  const rawDailyBenefit = dailyAverageWage * DAILY_BENEFIT_RATE
  const dailyBenefit = clampDailyBenefit(rawDailyBenefit)

  const eligibility = resolveEligibility({
    ...input,
    avgMonthlyWage,
    employmentMonths,
    age,
  })

  const totalBenefit = eligibility.paymentDays * dailyBenefit

  return {
    avgMonthlyWage,
    employmentMonths,
    age,
    isInsured: input.isInsured,
    resignationReason: input.resignationReason,
    dailyAverageWage,
    rawDailyBenefit,
    dailyBenefit,
    paymentDays: eligibility.paymentDays,
    totalBenefit,
    eligibilityLevel: eligibility.eligibilityLevel,
    eligibilityMessage: eligibility.eligibilityMessage,
  }
}

export function getResignationReasonLabel(id: ResignationReasonId): string {
  return RESIGNATION_REASONS.find((item) => item.id === id)?.label ?? id
}
