import { getTodayKST } from "@/lib/date-kst"
import {
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatDisplayDate,
  formatKRW,
  type SupplierInfo,
} from "@/lib/estimate"

export { DEFAULT_ESTIMATE_UNIT, ESTIMATE_UNIT_OPTIONS, formatDisplayDate, formatKRW }
export type { SupplierInfo }

export const BANK_OPTIONS = [
  "국민은행",
  "신한은행",
  "우리은행",
  "하나은행",
  "기업은행",
  "농협은행",
  "카카오뱅크",
  "토스뱅크",
  "케이뱅크",
  "SC제일은행",
  "씨티은행",
  "부산은행",
  "대구은행",
  "광주은행",
  "전북은행",
  "경남은행",
  "새마을금고",
  "신협",
  "우체국",
  "수협",
  "산업은행",
] as const

export const DEFAULT_BANK_NAME = "국민은행"

export interface StatementItem {
  id: string
  name: string
  spec: string
  quantity: number
  unit: string
  unitPrice: number
  note: string
}

export interface StatementData {
  supplier: SupplierInfo
  recipient: {
    companyName: string
    contactName: string
    phone: string
  }
  transaction: {
    number: string
    date: string
  }
  bankAccount: {
    bankName: string
    accountHolder: string
    accountNumber: string
  }
  items: StatementItem[]
}

export type BankAccountInfo = StatementData["bankAccount"]

export interface StatementTotals {
  quantitySum: number
  supplyAmount: number
  vat: number
  total: number
}

function createItemId() {
  return crypto.randomUUID()
}

export function createEmptyStatementItem(): StatementItem {
  return {
    id: createItemId(),
    name: "",
    spec: "",
    quantity: 1,
    unit: DEFAULT_ESTIMATE_UNIT,
    unitPrice: 0,
    note: "",
  }
}

export function getDefaultStatementData(): StatementData {
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
    recipient: {
      companyName: "",
      contactName: "",
      phone: "",
    },
    transaction: {
      number: `STM-${today.replace(/-/g, "")}`,
      date: today,
    },
    bankAccount: {
      bankName: DEFAULT_BANK_NAME,
      accountHolder: "",
      accountNumber: "",
    },
    items: [createEmptyStatementItem()],
  }
}

export function getLineSupplyAmount(item: StatementItem): number {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0
  return quantity * unitPrice
}

export function getLineVat(item: StatementItem): number {
  return Math.round(getLineSupplyAmount(item) * 0.1)
}

export function calculateStatement(items: StatementItem[]): StatementTotals {
  const supplyAmount = items.reduce(
    (sum, item) => sum + getLineSupplyAmount(item),
    0
  )
  const quantitySum = items.reduce(
    (sum, item) =>
      sum + (Number.isFinite(item.quantity) ? item.quantity : 0),
    0
  )
  const vat = Math.round(supplyAmount * 0.1)
  const total = supplyAmount + vat

  return { quantitySum, supplyAmount, vat, total }
}
