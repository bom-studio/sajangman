"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

import { SaveDocumentLoginDialog } from "@/components/documents/save-document-login-dialog"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface SaveDocumentButtonProps {
  onSave: () => Promise<{ error: string | null }>
  disabled?: boolean
  className?: string
}

export function SaveDocumentButton({
  onSave,
  disabled = false,
  className,
}: SaveDocumentButtonProps) {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)
  const [saving, setSaving] = useState(false)
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)

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

  async function handleClick() {
    if (!isLoggedIn) {
      setLoginDialogOpen(true)
      return
    }

    setSaving(true)
    const result = await onSave()
    setSaving(false)

    if (!result.error) {
      router.refresh()
    }

    return result
  }

  return (
    <>
      <Button
        type="button"
        onClick={handleClick}
        disabled={disabled || saving || isLoggedIn === null}
        className={cn(className)}
      >
        {saving ? "저장 중..." : "저장하기"}
      </Button>

      <SaveDocumentLoginDialog
        open={loginDialogOpen}
        onOpenChange={setLoginDialogOpen}
      />
    </>
  )
}
