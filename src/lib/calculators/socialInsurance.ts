import {
  calculateEmployeeInsurance,
  calculateEmployerInsurance,
} from "@/lib/calculators/insuranceRates"

export interface SocialInsuranceInput {
  monthlySalary: number
}

export interface SocialInsuranceResult {
  monthlySalary: number
  employee: ReturnType<typeof calculateEmployeeInsurance>
  employer: ReturnType<typeof calculateEmployerInsurance>
}

export const DEFAULT_SOCIAL_INSURANCE_INPUT: SocialInsuranceInput = {
  monthlySalary: 3_000_000,
}

export function calculateSocialInsurance(
  input: SocialInsuranceInput
): SocialInsuranceResult | null {
  const monthlySalary = Number.isFinite(input.monthlySalary)
    ? Math.max(0, input.monthlySalary)
    : 0

  if (monthlySalary <= 0) return null

  return {
    monthlySalary,
    employee: calculateEmployeeInsurance(monthlySalary),
    employer: calculateEmployerInsurance(monthlySalary),
  }
}
