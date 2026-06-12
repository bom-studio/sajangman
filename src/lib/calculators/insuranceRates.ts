const NATIONAL_PENSION_RATE = 0.045
const HEALTH_INSURANCE_RATE = 0.03545
const LONG_TERM_CARE_RATE = 0.1295
const EMPLOYMENT_EMPLOYEE_RATE = 0.009
const EMPLOYMENT_EMPLOYER_RATE = 0.0115

export interface EmployeeInsuranceResult {
  nationalPension: number
  healthInsurance: number
  longTermCare: number
  employmentInsurance: number
  total: number
}

export interface EmployerInsuranceResult {
  nationalPension: number
  healthInsurance: number
  longTermCare: number
  employmentInsurance: number
  total: number
}

export function calculateEmployeeInsurance(
  monthlySalary: number
): EmployeeInsuranceResult {
  const nationalPension = Math.round(monthlySalary * NATIONAL_PENSION_RATE)
  const healthInsurance = Math.round(monthlySalary * HEALTH_INSURANCE_RATE)
  const longTermCare = Math.round(healthInsurance * LONG_TERM_CARE_RATE)
  const employmentInsurance = Math.round(
    monthlySalary * EMPLOYMENT_EMPLOYEE_RATE
  )

  return {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    total:
      nationalPension +
      healthInsurance +
      longTermCare +
      employmentInsurance,
  }
}

export function calculateEmployerInsurance(
  monthlySalary: number
): EmployerInsuranceResult {
  const nationalPension = Math.round(monthlySalary * NATIONAL_PENSION_RATE)
  const healthInsurance = Math.round(monthlySalary * HEALTH_INSURANCE_RATE)
  const longTermCare = Math.round(healthInsurance * LONG_TERM_CARE_RATE)
  const employmentInsurance = Math.round(
    monthlySalary * EMPLOYMENT_EMPLOYER_RATE
  )

  return {
    nationalPension,
    healthInsurance,
    longTermCare,
    employmentInsurance,
    total:
      nationalPension +
      healthInsurance +
      longTermCare +
      employmentInsurance,
  }
}
