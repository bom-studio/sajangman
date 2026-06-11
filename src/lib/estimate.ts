import { addDaysToDateString, getTodayKST } from "@/lib/date-kst"

export const ESTIMATE_UNIT_OPTIONS = [
  "EA",
  "개",
  "건",
  "식",
  "시간",
  "일",
  "월",
  "년",
  "세트",
  "매",
  "박스",
  "kg",
  "g",
  "m",
  "cm",
] as const

export const DEFAULT_ESTIMATE_UNIT = "EA"

export interface EstimateItem {
  id: string
  name: string
  quantity: number
  unit: string
  unitPrice: number
}

export interface SupplierInfo {
  companyName: string
  representative: string
  businessNumber: string
  phone: string
  email: string
  address: string
}

export type StoredSupplier = SupplierInfo & {
  sealUrl: string | null
}

export interface EstimateData {
  supplier: SupplierInfo
  customer: {
    name: string
    companyName: string
  }
  estimate: {
    number: string
    date: string
    validUntil: string
  }
  remarks: string
  items: EstimateItem[]
}

export interface EstimateTotals {
  supplyAmount: number
  vat: number
  total: number
}

function createItemId() {
  return crypto.randomUUID()
}

export function createEmptyItem(): EstimateItem {
  return {
    id: createItemId(),
    name: "",
    quantity: 1,
    unit: DEFAULT_ESTIMATE_UNIT,
    unitPrice: 0,
  }
}

export function getDefaultEstimateData(): EstimateData {
  const today = getTodayKST()
  return {
    supplier: {
      companyName: "",
      representative: "",
      businessNumber: "",
      phone: "",
      email: "",
      address: "",
    },
    customer: {
      name: "",
      companyName: "",
    },
    estimate: {
      number: `EST-${today.replace(/-/g, "")}`,
      date: today,
      validUntil: addDaysToDateString(today, 7),
    },
    remarks: "",
    items: [createEmptyItem()],
  }
}

export function getLineAmount(item: EstimateItem): number {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0
  return quantity * unitPrice
}

export function calculateEstimate(items: EstimateItem[]): EstimateTotals {
  const supplyAmount = items.reduce(
    (sum, item) => sum + getLineAmount(item),
    0
  )
  const vat = Math.round(supplyAmount * 0.1)
  const total = supplyAmount + vat

  return { supplyAmount, vat, total }
}

export function formatKRW(amount: number): string {
  return amount.toLocaleString("ko-KR")
}

export function formatDisplayDate(date: string): string {
  if (!date) return "-"
  const [year, month, day] = date.split("-")
  if (!year || !month || !day) return date
  return `${year}년 ${month}월 ${day}일`
}
