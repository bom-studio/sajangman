/** Browser-local visitor identity — shared by boards votes and site visit stats. */

export const VISITOR_STORAGE_KEY = "sajangman_visitor_id"

/** SessionStorage flag: one visit ping per browser tab session */
export const VISITOR_SESSION_PING_KEY = "sajangman_visit_pinged"

function createVisitorId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID()
  }
  return `v_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
}

/**
 * Stable per-browser UUID stored in localStorage.
 * No fingerprinting / PII.
 */
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

export function hasVisitPingedThisSession(): boolean {
  if (typeof window === "undefined") return true
  try {
    return window.sessionStorage.getItem(VISITOR_SESSION_PING_KEY) === "1"
  } catch {
    return false
  }
}

export function markVisitPingedThisSession(): void {
  if (typeof window === "undefined") return
  try {
    window.sessionStorage.setItem(VISITOR_SESSION_PING_KEY, "1")
  } catch {
    // ignore quota / private mode
  }
}
