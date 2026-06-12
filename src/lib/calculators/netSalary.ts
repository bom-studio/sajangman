import { calculateEmployeeInsurance } from "@/lib/calculators/insuranceRates"

export interface NetSalaryInput {
  monthlySalary: number
}

export interface NetSalaryResult {
  monthlySalary: number
  nationalPension: number
  healthInsurance: number
  longTermCare: number
  employmentInsurance: number
  totalDeduction: number
  netSalary: number
}

export const DEFAULT_NET_SALARY_INPUT: NetSalaryInput = {
  monthlySalary: 3_000_000,
}

export function calculateNetSalary(input: NetSalaryInput): NetSalaryResult | null {
  const monthlySalary = Number.isFinite(input.monthlySalary)
    ? Math.max(0, input.monthlySalary)
    : 0

  if (monthlySalary <= 0) return null

  const insurance = calculateEmployeeInsurance(monthlySalary)

  return {
    monthlySalary,
    nationalPension: insurance.nationalPension,
    healthInsurance: insurance.healthInsurance,
    longTermCare: insurance.longTermCare,
    employmentInsurance: insurance.employmentInsurance,
    totalDeduction: insurance.total,
    netSalary: monthlySalary - insurance.total,
  }
}
