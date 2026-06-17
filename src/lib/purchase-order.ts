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

export interface PurchaseOrderSupplier extends SupplierInfo {
  contactPerson: string
}

export interface PurchaseOrderVendor {
  companyName: string
  contactName: string
  phone: string
  email: string
  address: string
}

export interface PurchaseOrderItem {
  id: string
  name: string
  spec: string
  quantity: number
  unit: string
  unitPrice: number
}

export interface PurchaseOrderData {
  supplier: PurchaseOrderSupplier
  vendor: PurchaseOrderVendor
  order: {
    number: string
    date: string
    deliveryDate: string
    deliveryLocation: string
    paymentTerms: string
  }
  remarks: string
  items: PurchaseOrderItem[]
}

export interface PurchaseOrderTotals {
  supplyAmount: number
  vat: number
  total: number
}

function createItemId() {
  return crypto.randomUUID()
}

export function createEmptyPurchaseOrderItem(): PurchaseOrderItem {
  return {
    id: createItemId(),
    name: "",
    spec: "",
    quantity: 1,
    unit: DEFAULT_ESTIMATE_UNIT,
    unitPrice: 0,
  }
}

export function getDefaultPurchaseOrderNumber(date: string): string {
  return `PO-${date.replace(/-/g, "")}-001`
}

export function getDefaultPurchaseOrderData(): PurchaseOrderData {
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
    },
    vendor: {
      companyName: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
    },
    order: {
      number: getDefaultPurchaseOrderNumber(today),
      date: today,
      deliveryDate: "",
      deliveryLocation: "",
      paymentTerms: "",
    },
    remarks: "",
    items: [createEmptyPurchaseOrderItem()],
  }
}

export function getLineSupplyAmount(item: PurchaseOrderItem): number {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0
  return quantity * unitPrice
}

export function getLineVat(item: PurchaseOrderItem): number {
  return Math.round(getLineSupplyAmount(item) * 0.1)
}

export function getLineTotal(item: PurchaseOrderItem): number {
  return getLineSupplyAmount(item) + getLineVat(item)
}

export function calculatePurchaseOrder(
  items: PurchaseOrderItem[]
): PurchaseOrderTotals {
  const supplyAmount = items.reduce(
    (sum, item) => sum + getLineSupplyAmount(item),
    0
  )
  const vat = Math.round(supplyAmount * 0.1)
  const total = supplyAmount + vat

  return { supplyAmount, vat, total }
}

export function validatePurchaseOrder(data: PurchaseOrderData): string | null {
  if (!data.supplier.companyName.trim()) {
    return "공급자 상호를 입력해주세요."
  }
  if (!data.vendor.companyName.trim()) {
    return "발주처 상호를 입력해주세요."
  }
  if (!data.order.date) {
    return "발주일자를 입력해주세요."
  }
  const validItems = data.items.filter((item) => item.name.trim())
  if (validItems.length === 0) {
    return "품목을 1개 이상 입력해주세요."
  }
  return null
}
