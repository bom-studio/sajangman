import type { QuoteRequestRequester } from "@/lib/quote-request"

const STORAGE_KEY = "sajangman-quote-request-requester"

export function loadStoredQuoteRequester(): QuoteRequestRequester | null {
  if (typeof window === "undefined") return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as QuoteRequestRequester
    return {
      companyName: parsed.companyName ?? "",
      contactName: parsed.contactName ?? "",
      phone: parsed.phone ?? "",
      email: parsed.email ?? "",
      address: parsed.address ?? "",
    }
  } catch {
    return null
  }
}

export function saveStoredQuoteRequester(requester: QuoteRequestRequester): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(requester))
  } catch {
    // localStorage 용량 초과 등은 조용히 무시
  }
}
