"use client"

import { useCallback, useEffect, useState } from "react"

import {
  fetchBusinessProfilesFromDb,
  type BusinessProfile,
} from "@/lib/supabase/business-profiles"
import { createClient } from "@/lib/supabase/client"

export function useBusinessProfiles(enabled = true) {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  const reload = useCallback(async () => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    setIsLoggedIn(!!user)

    if (!user) {
      setProfiles([])
      setLoading(false)
      return
    }

    const result = await fetchBusinessProfilesFromDb()
    setProfiles(result.data)
    setError(result.error)
    setLoading(false)
  }, [enabled])

  useEffect(() => {
    reload()
  }, [reload])

  return {
    profiles,
    loading,
    error,
    isLoggedIn,
    reload,
  }
}
