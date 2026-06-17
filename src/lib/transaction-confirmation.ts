import { getTodayKST } from "@/lib/date-kst"
import {
  formatDisplayDate,
  formatKRW,
  type SupplierInfo,
} from "@/lib/estimate"

export { formatDisplayDate, formatKRW }
export type { SupplierInfo }

export interface TransactionParty {
  companyName: string
  representative: string
  businessNumber: string
  phone: string
  address: string
}

export interface TransactionConfirmationItem {
  id: string
  transactionDate: string
  name: string
  spec: string
  quantity: number
  unitPrice: number
  note: string
}

export interface TransactionConfirmationData {
  supplier: TransactionParty
  recipient: TransactionParty
  transaction: {
    number: string
    writtenDate: string
    periodStart: string
    periodEnd: string
  }
  confirmationText: string
  items: TransactionConfirmationItem[]
}

export interface TransactionConfirmationTotals {
  transactionCount: number
  supplyAmount: number
  vat: number
  total: number
}

export const DEFAULT_CONFIRMATION_TEXT =
  "상기 거래 내역이 사실과 다름없음을 상호 확인합니다."

function createItemId() {
  return crypto.randomUUID()
}

export function createEmptyTransactionItem(
  transactionDate?: string
): TransactionConfirmationItem {
  return {
    id: createItemId(),
    transactionDate: transactionDate ?? "",
    name: "",
    spec: "",
    quantity: 1,
    unitPrice: 0,
    note: "",
  }
}

export function getDefaultTransactionNumber(date: string): string {
  return `TC-${date.replace(/-/g, "")}-001`
}

export function getDefaultTransactionConfirmationData(): TransactionConfirmationData {
  const today = getTodayKST()
  return {
    supplier: {
      companyName: "",
      representative: "",
      businessNumber: "",
      phone: "",
      address: "",
    },
    recipient: {
      companyName: "",
      representative: "",
      businessNumber: "",
      phone: "",
      address: "",
    },
    transaction: {
      number: getDefaultTransactionNumber(today),
      writtenDate: today,
      periodStart: "",
      periodEnd: "",
    },
    confirmationText: DEFAULT_CONFIRMATION_TEXT,
    items: [createEmptyTransactionItem(today)],
  }
}

export function getLineSupplyAmount(
  item: TransactionConfirmationItem
): number {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0
  return quantity * unitPrice
}

export function getLineVat(item: TransactionConfirmationItem): number {
  return Math.round(getLineSupplyAmount(item) * 0.1)
}

export function getLineTotal(item: TransactionConfirmationItem): number {
  return getLineSupplyAmount(item) + getLineVat(item)
}

export function calculateTransactionConfirmation(
  items: TransactionConfirmationItem[]
): TransactionConfirmationTotals {
  const filledItems = items.filter((item) => item.name.trim())
  const transactionCount = filledItems.length
  const supplyAmount = items.reduce(
    (sum, item) => sum + getLineSupplyAmount(item),
    0
  )
  const vat = Math.round(supplyAmount * 0.1)
  const total = supplyAmount + vat

  return { transactionCount, supplyAmount, vat, total }
}

export function sanitizeFilenamePart(value: string): string {
  return value.trim().replace(/[/\\?%*:|"<>]/g, "-") || "거래처"
}

export function validateTransactionConfirmation(
  data: TransactionConfirmationData
): string | null {
  if (!data.supplier.companyName.trim()) {
    return "공급자 상호명을 입력해주세요."
  }
  if (!data.recipient.companyName.trim()) {
    return "공급받는자 상호명을 입력해주세요."
  }
  if (!data.transaction.writtenDate) {
    return "작성일을 입력해주세요."
  }
  const validItems = data.items.filter((item) => item.name.trim())
  if (validItems.length === 0) {
    return "거래내역을 1건 이상 입력해주세요."
  }
  return null
}
