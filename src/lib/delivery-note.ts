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

export type ShippingMethod =
  | "direct"
  | "parcel"
  | "quick"
  | "freight"
  | "other"

export const SHIPPING_METHOD_OPTIONS: {
  value: ShippingMethod
  label: string
}[] = [
  { value: "direct", label: "직접배송" },
  { value: "parcel", label: "택배" },
  { value: "quick", label: "퀵서비스" },
  { value: "freight", label: "화물배송" },
  { value: "other", label: "기타" },
]

export const SHIPPING_METHOD_LABEL: Record<ShippingMethod, string> = {
  direct: "직접배송",
  parcel: "택배",
  quick: "퀵서비스",
  freight: "화물배송",
  other: "기타",
}

export interface DeliveryNoteSupplier extends SupplierInfo {
  contactPerson: string
  businessType: string
  businessItem: string
}

export interface DeliveryNoteRecipient {
  companyName: string
  contactName: string
  phone: string
  email: string
  address: string
}

export interface DeliveryNoteItem {
  id: string
  name: string
  spec: string
  quantity: number
  unit: string
  amount: number
  note: string
}

export interface DeliveryNoteData {
  supplier: DeliveryNoteSupplier
  recipient: DeliveryNoteRecipient
  delivery: {
    number: string
    date: string
    location: string
    shippingMethod: ShippingMethod
  }
  remarks: string
  items: DeliveryNoteItem[]
}

export interface DeliveryNoteTotals {
  itemCount: number
  quantitySum: number
  totalAmount: number
}

function createItemId() {
  return crypto.randomUUID()
}

export function createEmptyDeliveryNoteItem(): DeliveryNoteItem {
  return {
    id: createItemId(),
    name: "",
    spec: "",
    quantity: 1,
    unit: DEFAULT_ESTIMATE_UNIT,
    amount: 0,
    note: "",
  }
}

export function getDefaultDeliveryNoteNumber(date: string): string {
  return `DN-${date.replace(/-/g, "")}-001`
}

export function getDefaultDeliveryNoteData(): DeliveryNoteData {
  const today = getTodayKST()
  return {
    supplier: {
      companyName: "",
      representative: "",
      businessNumber: "",
      contactPerson: "",
      phone: "",
      email: "",
      address: "",
      businessType: "",
      businessItem: "",
    },
    recipient: {
      companyName: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
    },
    delivery: {
      number: getDefaultDeliveryNoteNumber(today),
      date: today,
      location: "",
      shippingMethod: "direct",
    },
    remarks: "",
    items: [createEmptyDeliveryNoteItem()],
  }
}

export function calculateDeliveryNote(
  items: DeliveryNoteItem[]
): DeliveryNoteTotals {
  const filledItems = items.filter((item) => item.name.trim())
  const itemCount = filledItems.length
  const quantitySum = items.reduce(
    (sum, item) =>
      sum + (Number.isFinite(item.quantity) ? item.quantity : 0),
    0
  )
  const totalAmount = items.reduce(
    (sum, item) => sum + (Number.isFinite(item.amount) ? item.amount : 0),
    0
  )

  return { itemCount, quantitySum, totalAmount }
}

export function sanitizeFilenamePart(value: string): string {
  return value.trim().replace(/[/\\?%*:|"<>]/g, "-") || "거래처"
}

export function validateDeliveryNote(data: DeliveryNoteData): string | null {
  if (!data.supplier.companyName.trim()) {
    return "공급자 상호명을 입력해주세요."
  }
  if (!data.recipient.companyName.trim()) {
    return "거래처명을 입력해주세요."
  }
  if (!data.delivery.date) {
    return "납품일자를 입력해주세요."
  }
  const validItems = data.items.filter((item) => item.name.trim())
  if (validItems.length === 0) {
    return "품목을 1개 이상 입력해주세요."
  }
  return null
}
