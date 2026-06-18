"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { AuthDivider } from "@/components/auth/auth-divider"
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { mapSupabaseAuthError } from "@/lib/auth/errors"
import { createClient } from "@/lib/supabase/client"

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirm, setPasswordConfirm] = useState("")
  const [error, setError] = useState("")
  const [successMessage, setSuccessMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError("")
    setSuccessMessage("")

    if (password !== passwordConfirm) {
      setError("비밀번호가 일치하지 않습니다.")
      return
    }

    setLoading(true)

    const supabase = createClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/mypage`,
      },
    })

    if (signUpError) {
      setError(mapSupabaseAuthError(signUpError.message))
      setLoading(false)
      return
    }

    if (data.session) {
      router.push("/mypage")
      router.refresh()
      return
    }

    setSuccessMessage(
      "가입 확인 메일을 보냈습니다. 메일함을 확인한 뒤 로그인해 주세요."
    )
    setLoading(false)
  }

  return (
    <Card className="mx-auto w-full max-w-md shadow-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-xl font-bold">무료 회원가입</CardTitle>
        <CardDescription>
          회원가입 후 저장 기능을 이용할 수 있습니다. 계산기·문서작성·자료실은
          가입 없이도 이용 가능합니다.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GoogleSignInButton onError={setError} />

        <AuthDivider />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="signup-email" className="text-sm font-medium text-foreground">
              이메일
            </label>
            <Input
              id="signup-email"
              type="email"
              autoComplete="email"
              placeholder="name@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="signup-password"
              className="text-sm font-medium text-foreground"
            >
              비밀번호
            </label>
            <Input
              id="signup-password"
              type="password"
              autoComplete="new-password"
              placeholder="6자 이상 입력"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="signup-password-confirm"
              className="text-sm font-medium text-foreground"
            >
              비밀번호 확인
            </label>
            <Input
              id="signup-password-confirm"
              type="password"
              autoComplete="new-password"
              placeholder="비밀번호를 다시 입력"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
              minLength={6}
            />
          </div>

          {error ? (
            <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {successMessage ? (
            <p className="rounded-lg bg-accent px-3 py-2 text-sm text-accent-foreground">
              {successMessage}
            </p>
          ) : null}

          <Button type="submit" size="lg" className="w-full" disabled={loading}>
            {loading ? "가입 처리 중..." : "이메일로 회원가입"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          이미 계정이 있으신가요?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            로그인
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
