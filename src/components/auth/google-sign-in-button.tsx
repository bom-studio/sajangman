"use client"

import { useState } from "react"

import { GoogleIcon } from "@/components/auth/google-icon"
import { Button } from "@/components/ui/button"
import { mapSupabaseAuthError } from "@/lib/auth/errors"
import { createClient } from "@/lib/supabase/client"

interface GoogleSignInButtonProps {
  onError?: (message: string) => void
}

export function GoogleSignInButton({ onError }: GoogleSignInButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleGoogleSignIn() {
    setLoading(true)
    onError?.("")

    const supabase = createClient()
    const redirectTo = `${window.location.origin}/auth/callback?next=/mypage`

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    })

    if (error) {
      onError?.(mapSupabaseAuthError(error.message))
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="lg"
      className="w-full gap-2.5 bg-white"
      onClick={handleGoogleSignIn}
      disabled={loading}
    >
      <GoogleIcon className="size-5" />
      {loading ? "Google 연결 중..." : "Google로 계속하기"}
    </Button>
  )
}
