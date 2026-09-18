import { VISITOR_STORAGE_KEY } from "@/lib/requests/constants"

function createVisitorId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

export function getVisitorId(): string {
  if (typeof window === "undefined") return ""

  try {
    const existing = window.localStorage.getItem(VISITOR_STORAGE_KEY)
    if (existing && existing.length >= 8) return existing

    const next = createVisitorId()
    window.localStorage.setItem(VISITOR_STORAGE_KEY, next)
    return next
  } catch {
    return createVisitorId()
  }
}
