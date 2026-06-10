import type { EstimateData, StoredSupplier } from "@/lib/estimate"

const STORAGE_KEY = "sajangman-supplier"

export function loadStoredSupplier(): StoredSupplier | null {
  if (typeof window === "undefined") return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as StoredSupplier
    return {
      companyName: parsed.companyName ?? "",
      representative: parsed.representative ?? "",
      businessNumber: parsed.businessNumber ?? "",
      phone: parsed.phone ?? "",
      email: parsed.email ?? "",
      address: parsed.address ?? "",
      sealUrl: parsed.sealUrl ?? null,
    }
  } catch {
    return null
  }
}

export function saveStoredSupplier(
  supplier: EstimateData["supplier"],
  sealUrl: string | null
): void {
  if (typeof window === "undefined") return

  try {
    const payload: StoredSupplier = {
      ...supplier,
      sealUrl,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
  } catch {
    // localStorage 용량 초과 등은 조용히 무시
  }
}
