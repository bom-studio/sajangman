import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { LoginForm } from "@/components/auth/login-form"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { getAuthErrorMessage } from "@/lib/auth/errors"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "로그인 | 사장만",
  description: "사장만 회원 로그인 — 작성 내용 저장을 위한 무료 회원 기능",
}

interface LoginPageProps {
  searchParams: Promise<{ error?: string }>
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/mypage")
  }

  const { error } = await searchParams
  const initialError = error ? getAuthErrorMessage(error) : null

  return (
    <SiteLayout>
      <PageHeader
        title="로그인"
        description="로그인하면 작성한 견적서·문서 등을 저장하고 마이페이지에서 관리할 수 있습니다."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <LoginForm initialError={initialError} />
      </div>
    </SiteLayout>
  )
}
