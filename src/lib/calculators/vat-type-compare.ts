import {
  formatAmount,
  formatPercent,
  parseAmountInput,
} from "@/lib/calculators/format"
import { VAT_RATE } from "@/lib/calculators/vat"

export type VatTypeId = "simplified" | "general"

export interface VatIndustryType {
  id: string
  label: string
  valueAddedRate: number
  taxDeductionRate: number
  suitableFor: string
}

export interface VatTypeCompareInput {
  annualSales: number
  purchaseCost: number
  industryId: string
  vatIncluded: boolean
  purchaseDeductionEligible: boolean
}

export interface VatTypeDetail {
  type: VatTypeId
  typeLabel: string
  salesVat: number
  purchaseVat: number
  valueAddedRate: number
  calculatedTax: number
  purchaseDeduction: number
  taxInvoiceIssuance: string
  suitableBusinessType: string
}

export interface VatTypeCompareResult {
  annualSales: number
  purchaseCost: number
  industryId: string
  industryLabel: string
  vatIncluded: boolean
  purchaseDeductionEligible: boolean
  supplyAmount: number
  purchaseSupplyAmount: number
  simplified: VatTypeDetail
  general: VatTypeDetail
  simplifiedTax: number
  generalTax: number
  differenceAmount: number
  favorableType: VatTypeId
  favorableTypeLabel: string
  cautionNotes: string[]
  canCalculate: boolean
  errorMessage: string | null
}

export const SIMPLIFIED_SALES_THRESHOLD = 80_000_000

export const VAT_INDUSTRY_TYPES: VatIndustryType[] = [
  {
    id: "restaurant",
    label: "음식점업",
    valueAddedRate: 15,
    taxDeductionRate: 35,
    suitableFor: "외식·배달 중심 B2C 매장",
  },
  {
    id: "cafe",
    label: "카페·음료",
    valueAddedRate: 15,
    taxDeductionRate: 35,
    suitableFor: "음료·디저트 전문점",
  },
  {
    id: "retail",
    label: "소매업",
    valueAddedRate: 15,
    taxDeductionRate: 20,
    suitableFor: "소규모 판매·편의점형 매장",
  },
  {
    id: "wholesale",
    label: "도매업",
    valueAddedRate: 10,
    taxDeductionRate: 15,
    suitableFor: "납품·도매 거래",
  },
  {
    id: "manufacturing",
    label: "제조업",
    valueAddedRate: 20,
    taxDeductionRate: 15,
    suitableFor: "가공·제조형 사업",
  },
  {
    id: "service",
    label: "서비스업",
    valueAddedRate: 40,
    taxDeductionRate: 10,
    suitableFor: "미용·수리·교육 등 용역",
  },
]

export const DEFAULT_VAT_TYPE_COMPARE_INPUT: VatTypeCompareInput = {
  annualSales: 60_000_000,
  purchaseCost: 24_000_000,
  industryId: "restaurant",
  vatIncluded: true,
  purchaseDeductionEligible: true,
}

export { parseAmountInput }

export function formatWon(amount: number): string {
  return `${formatAmount(amount)}원`
}

export function formatRatePercent(rate: number): string {
  return formatPercent(rate)
}

export function getIndustryType(id: string): VatIndustryType {
  return (
    VAT_INDUSTRY_TYPES.find((item) => item.id === id) ?? VAT_INDUSTRY_TYPES[0]
  )
}

function extractSupplyAmount(amount: number, vatIncluded: boolean): number {
  if (!vatIncluded) return amount
  return Math.round(amount / (1 + VAT_RATE))
}

function extractVatAmount(amount: number, vatIncluded: boolean): number {
  const supply = extractSupplyAmount(amount, vatIncluded)
  if (!vatIncluded) return Math.round(supply * VAT_RATE)
  return amount - supply
}

function calculateSimplifiedTax(
  supplyAmount: number,
  industry: VatIndustryType
): Pick<VatTypeDetail, "salesVat" | "calculatedTax" | "valueAddedRate"> {
  const valueAddedRate = industry.valueAddedRate
  const grossTax = Math.round(
    supplyAmount * (valueAddedRate / 100) * VAT_RATE
  )
  const calculatedTax = Math.round(
    grossTax * (1 - industry.taxDeductionRate / 100)
  )

  return {
    salesVat: grossTax,
    calculatedTax,
    valueAddedRate,
  }
}

function calculateGeneralTax(
  supplyAmount: number,
  purchaseSupplyAmount: number,
  purchaseDeductionEligible: boolean
): Pick<
  VatTypeDetail,
  "salesVat" | "purchaseVat" | "purchaseDeduction" | "calculatedTax"
> {
  const salesVat = Math.round(supplyAmount * VAT_RATE)
  const purchaseVat = Math.round(purchaseSupplyAmount * VAT_RATE)
  const purchaseDeduction = purchaseDeductionEligible ? purchaseVat : 0
  const calculatedTax = Math.max(0, salesVat - purchaseDeduction)

  return {
    salesVat,
    purchaseVat,
    purchaseDeduction,
    calculatedTax,
  }
}

function buildCautionNotes(
  annualSales: number,
  purchaseDeductionEligible: boolean,
  favorableType: VatTypeId,
  differenceAmount: number
): string[] {
  const notes: string[] = [
    "본 계산기는 참고용이며, 실제 과세유형 판단은 국세청 기준·업종·매출 규모·증빙 요건에 따라 달라질 수 있습니다.",
  ]

  if (annualSales > SIMPLIFIED_SALES_THRESHOLD) {
    notes.push(
      `연간 매출이 ${formatAmount(SIMPLIFIED_SALES_THRESHOLD)}원을 초과하면 일반과세자 전환 검토가 필요할 수 있습니다.`
    )
  }

  if (!purchaseDeductionEligible) {
    notes.push(
      "매입세액 공제가 제한되면 일반과세 예상 납부세액이 높아질 수 있습니다."
    )
  }

  if (Math.abs(differenceAmount) < 100_000) {
    notes.push(
      "두 과세유형의 예상 납부세액 차이가 크지 않습니다. 세금계산서 발행·신고 편의성도 함께 검토하세요."
    )
  }

  if (favorableType === "general") {
    notes.push(
      "일반과세는 분기 예정신고·장부 관리 부담이 있습니다. 세무 대리 비용도 함께 고려하세요."
    )
  } else {
    notes.push(
      "간이과세는 세금계산서 발급이 제한됩니다. B2B·법인 거래처와의 계약 시 불리할 수 있습니다."
    )
  }

  return notes
}

export function calculateVatTypeCompare(
  input: VatTypeCompareInput
): VatTypeCompareResult {
  const annualSales = Math.max(0, input.annualSales)
  const purchaseCost = Math.max(0, input.purchaseCost)
  const industry = getIndustryType(input.industryId)
  const vatIncluded = input.vatIncluded
  const purchaseDeductionEligible = input.purchaseDeductionEligible

  const base: VatTypeCompareResult = {
    annualSales,
    purchaseCost,
    industryId: industry.id,
    industryLabel: industry.label,
    vatIncluded,
    purchaseDeductionEligible,
    supplyAmount: 0,
    purchaseSupplyAmount: 0,
    simplified: {
      type: "simplified",
      typeLabel: "간이과세자",
      salesVat: 0,
      purchaseVat: 0,
      valueAddedRate: industry.valueAddedRate,
      calculatedTax: 0,
      purchaseDeduction: 0,
      taxInvoiceIssuance: "발급 불가 (원칙)",
      suitableBusinessType: industry.suitableFor,
    },
    general: {
      type: "general",
      typeLabel: "일반과세자",
      salesVat: 0,
      purchaseVat: 0,
      valueAddedRate: 100,
      calculatedTax: 0,
      purchaseDeduction: 0,
      taxInvoiceIssuance: "발급 가능",
      suitableBusinessType: "매입 공제·B2B 거래가 많은 사업",
    },
    simplifiedTax: 0,
    generalTax: 0,
    differenceAmount: 0,
    favorableType: "simplified",
    favorableTypeLabel: "간이과세자",
    cautionNotes: [],
    canCalculate: false,
    errorMessage: null,
  }

  if (annualSales <= 0) {
    return { ...base, errorMessage: "0보다 큰 연간 예상 매출을 입력해주세요." }
  }

  const supplyAmount = extractSupplyAmount(annualSales, vatIncluded)
  const purchaseSupplyAmount = extractSupplyAmount(purchaseCost, vatIncluded)

  const simplifiedCalc = calculateSimplifiedTax(supplyAmount, industry)
  const generalCalc = calculateGeneralTax(
    supplyAmount,
    purchaseSupplyAmount,
    purchaseDeductionEligible
  )

  const simplifiedTax = simplifiedCalc.calculatedTax
  const generalTax = generalCalc.calculatedTax
  const differenceAmount = generalTax - simplifiedTax
  const favorableType: VatTypeId =
    simplifiedTax <= generalTax ? "simplified" : "general"
  const favorableTypeLabel =
    favorableType === "simplified" ? "간이과세자" : "일반과세자"

  const cautionNotes = buildCautionNotes(
    annualSales,
    purchaseDeductionEligible,
    favorableType,
    differenceAmount
  )

  return {
    ...base,
    supplyAmount,
    purchaseSupplyAmount,
    simplified: {
      type: "simplified",
      typeLabel: "간이과세자",
      salesVat: simplifiedCalc.salesVat,
      purchaseVat: extractVatAmount(purchaseCost, vatIncluded),
      valueAddedRate: simplifiedCalc.valueAddedRate,
      calculatedTax: simplifiedTax,
      purchaseDeduction: 0,
      taxInvoiceIssuance: "발급 불가 (원칙)",
      suitableBusinessType: `${industry.suitableFor} · 신고 단순`,
    },
    general: {
      type: "general",
      typeLabel: "일반과세자",
      salesVat: generalCalc.salesVat,
      purchaseVat: generalCalc.purchaseVat,
      valueAddedRate: 100,
      calculatedTax: generalTax,
      purchaseDeduction: generalCalc.purchaseDeduction,
      taxInvoiceIssuance: "발급 가능",
      suitableBusinessType: "매입세액 공제·법인 거래처 대응",
    },
    simplifiedTax,
    generalTax,
    differenceAmount,
    favorableType,
    favorableTypeLabel,
    cautionNotes,
    canCalculate: true,
    errorMessage: null,
  }
}

export function formatVatIncludedLabel(vatIncluded: boolean): string {
  return vatIncluded ? "부가세 포함" : "부가세 별도"
}

export function formatDifferenceAmount(amount: number): string {
  const prefix = amount > 0 ? "+" : ""
  return `${prefix}${formatWon(amount)}`
}
