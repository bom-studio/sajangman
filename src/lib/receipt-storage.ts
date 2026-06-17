import type { PaymentMethod } from "@/lib/receipt"

const PREFS_KEY = "sajangman-receipt-prefs"

export interface ReceiptPreferences {
  paymentMethod: PaymentMethod
  remarks: string
}

export function loadReceiptPreferences(): ReceiptPreferences | null {
  if (typeof window === "undefined") return null

  try {
    const raw = localStorage.getItem(PREFS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ReceiptPreferences
    return {
      paymentMethod: parsed.paymentMethod ?? "cash",
      remarks: parsed.remarks ?? "",
    }
  } catch {
    return null
  }
}

export function saveReceiptPreferences(prefs: ReceiptPreferences): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch {
    // localStorage 용량 초과 등은 조용히 무시
  }
}
