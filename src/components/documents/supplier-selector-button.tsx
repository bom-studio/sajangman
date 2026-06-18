"use client"

import { useEffect, useState } from "react"

import { SupplierSelectDialog } from "@/components/documents/supplier-select-dialog"
import { Button } from "@/components/ui/button"
import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import { createClient } from "@/lib/supabase/client"

interface SupplierSelectorButtonProps {
  onSelect: (profile: BusinessProfile) => void
}

export function SupplierSelectorButton({ onSelect }: SupplierSelectorButtonProps) {
  const [open, setOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsLoggedIn(!!user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session?.user)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isLoggedIn === null || !isLoggedIn) {
    return null
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="shrink-0"
        onClick={() => setOpen(true)}
      >
        공급자 변경
      </Button>
      <SupplierSelectDialog
        open={open}
        onOpenChange={setOpen}
        onSelect={onSelect}
      />
    </>
  )
}
