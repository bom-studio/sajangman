import type { Metadata } from "next"
import { redirect } from "next/navigation"

import { SignupForm } from "@/components/auth/signup-form"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "무료 회원가입 | 사장만",
  description: "사장만 무료 회원가입 — 작성 내용 저장을 위한 회원 기능",
}

export default async function SignupPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    redirect("/mypage")
  }

  return (
    <SiteLayout>
      <PageHeader
        title="무료 회원가입"
        description="회원가입 후 저장 기능을 이용할 수 있습니다. 계산기·문서작성·자료실은 가입 없이도 이용 가능합니다."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <SignupForm />
      </div>
    </SiteLayout>
  )
}
