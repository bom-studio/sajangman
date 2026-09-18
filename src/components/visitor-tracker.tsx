"use client"

import { useEffect } from "react"

import {
  getVisitorId,
  hasVisitPingedThisSession,
  markVisitPingedThisSession,
} from "@/lib/visitor/id"

/**
 * Fires one visit ping per browser session.
 * Does not send site_key — server locks SITE_KEY.
 */
export function VisitorTracker() {
  useEffect(() => {
    if (hasVisitPingedThisSession()) return

    const visitorId = getVisitorId()
    if (!visitorId) return

    // Mark early to avoid Strict Mode double-fire racing two requests
    markVisitPingedThisSession()

    void fetch("/api/visitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitor_id: visitorId }),
      keepalive: true,
    }).catch(() => {
      try {
        window.sessionStorage.removeItem("sajangman_visit_pinged")
      } catch {
        // ignore
      }
    })
  }, [])

  return null
}
