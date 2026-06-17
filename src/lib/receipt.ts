import { getTodayKST } from "@/lib/date-kst"
import {
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatDisplayDate,
  formatKRW,
  type SupplierInfo,
} from "@/lib/estimate"

export {
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatDisplayDate,
  formatKRW,
}
export type { SupplierInfo }

export type PaymentMethod =
  | "cash"
  | "card"
  | "transfer"
  | "easy_pay"
  | "other"

export type VatMode = "included" | "separate"

export type ReceiptStyle = "default" | "ledger_red"

export type ReceiptCopyType = "supplier" | "customer"

export type ReceiptPdfFormat = "a4" | "receipt"

export const PAYMENT_METHOD_OPTIONS: {
  value: PaymentMethod
  label: string
}[] = [
  { value: "cash", label: "현금" },
  { value: "card", label: "카드" },
  { value: "transfer", label: "계좌이체" },
  { value: "easy_pay", label: "간편결제" },
  { value: "other", label: "기타" },
]

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  cash: "현금",
  card: "카드",
  transfer: "계좌이체",
  easy_pay: "간편결제",
  other: "기타",
}

export const RECEIPT_PURPOSE_OPTIONS = [
  "물품대금",
  "서비스 이용료",
  "디자인비",
  "인쇄비",
  "배송비",
  "기타",
] as const

export const RECEIPT_STYLE_OPTIONS: {
  value: ReceiptStyle
  label: string
}[] = [
  { value: "default", label: "기본형" },
  { value: "ledger_red", label: "붉은 장부형" },
]

export const RECEIPT_COPY_TYPE_OPTIONS: {
  value: ReceiptCopyType
  label: string
}[] = [
  { value: "supplier", label: "공급자용" },
  { value: "customer", label: "고객보관용" },
]

export interface ReceiptSupplier extends SupplierInfo {
  contactPerson: string
  businessType: string
  businessItem: string
}

export interface ReceiptRecipient {
  name: string
  phone: string
  email: string
  address: string
  showHonorific: boolean
}

export interface ReceiptItem {
  id: string
  date: string
  name: string
  spec: string
  quantity: number
  unit: string
  unitPrice: number
  note: string
}

export interface ReceiptInfo {
  number: string
  issueDate: string
  paymentDate: string
  paymentMethod: PaymentMethod
  vatMode: VatMode
  purpose: string
  style: ReceiptStyle
  copyType: ReceiptCopyType
  pdfFormat: ReceiptPdfFormat
}

export interface ReceiptData {
  supplier: ReceiptSupplier
  recipient: ReceiptRecipient
  receipt: ReceiptInfo
  remarks: string
  items: ReceiptItem[]
}

export interface ReceiptLineAmounts {
  supplyAmount: number
  vat: number
  total: number
}

export interface ReceiptTotals {
  itemCount: number
  supplyAmount: number
  vat: number
  total: number
}

function createItemId() {
  return crypto.randomUUID()
}

export function createEmptyReceiptItem(issueDate?: string): ReceiptItem {
  return {
    id: createItemId(),
    date: issueDate ?? "",
    name: "",
    spec: "",
    quantity: 1,
    unit: DEFAULT_ESTIMATE_UNIT,
    unitPrice: 0,
    note: "",
  }
}

export function getDefaultReceiptNumber(date: string): string {
  return `RC-${date.replace(/-/g, "")}-001`
}

export function getDefaultReceiptData(): ReceiptData {
  const today = getTodayKST()
  return {
    supplier: {
      companyName: "",
      representative: "",
      businessNumber: "",
      address: "",
      businessType: "",
      businessItem: "",
      contactPerson: "",
      phone: "",
      email: "",
    },
    recipient: {
      name: "",
      phone: "",
      email: "",
      address: "",
      showHonorific: true,
    },
    receipt: {
      number: getDefaultReceiptNumber(today),
      issueDate: today,
      paymentDate: today,
      paymentMethod: "cash",
      vatMode: "separate",
      purpose: "물품대금",
      style: "default",
      copyType: "customer",
      pdfFormat: "a4",
    },
    remarks: "위 금액을 정히 영수함.",
    items: [createEmptyReceiptItem(today)],
  }
}

export function getLineAmounts(
  item: ReceiptItem,
  vatMode: VatMode
): ReceiptLineAmounts {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0
  const lineTotal = quantity * unitPrice

  if (vatMode === "included") {
    const supplyAmount = Math.round(lineTotal / 1.1)
    const vat = lineTotal - supplyAmount
    return { supplyAmount, vat, total: lineTotal }
  }

  const supplyAmount = lineTotal
  const vat = Math.round(supplyAmount * 0.1)
  return { supplyAmount, vat, total: supplyAmount + vat }
}

export function calculateReceipt(
  items: ReceiptItem[],
  vatMode: VatMode
): ReceiptTotals {
  const filledItems = items.filter((item) => item.name.trim())
  const itemCount = filledItems.length

  const supplyAmount = items.reduce(
    (sum, item) => sum + getLineAmounts(item, vatMode).supplyAmount,
    0
  )
  const vat = items.reduce(
    (sum, item) => sum + getLineAmounts(item, vatMode).vat,
    0
  )
  const total = items.reduce(
    (sum, item) => sum + getLineAmounts(item, vatMode).total,
    0
  )

  return { itemCount, supplyAmount, vat, total }
}

export function sanitizeFilenamePart(value: string): string {
  return value.trim().replace(/[/\\?%*:|"<>]/g, "-") || "수신자"
}

export function validateReceipt(data: ReceiptData): string | null {
  if (!data.supplier.companyName.trim()) {
    return "공급자 상호명을 입력해주세요."
  }
  if (!data.supplier.businessNumber.trim()) {
    return "사업자등록번호를 입력해주세요."
  }
  if (!data.recipient.name.trim()) {
    return "수신자명을 입력해주세요."
  }
  if (!data.receipt.issueDate) {
    return "발행일자를 입력해주세요."
  }
  const validItems = data.items.filter((item) => item.name.trim())
  if (validItems.length === 0) {
    return "품목을 1개 이상 입력해주세요."
  }
  const totals = calculateReceipt(data.items, data.receipt.vatMode)
  if (totals.total <= 0) {
    return "총 영수금액이 0원보다 커야 합니다."
  }
  return null
}
