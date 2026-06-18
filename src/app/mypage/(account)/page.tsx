import type { Metadata } from "next"

import { MypageProfile } from "@/components/auth/mypage-profile"
import { createClient } from "@/lib/supabase/server"

export const metadata: Metadata = {
  title: "내 정보 | 마이페이지 | 사장만",
  description: "사장만 회원 정보를 확인하세요.",
}

function getAuthProvider(
  appMetadata: Record<string, unknown> | undefined
): string | null {
  const provider = appMetadata?.provider
  return typeof provider === "string" ? provider : null
}

export default async function MypagePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <MypageProfile
      email={user!.email ?? "이메일 없음"}
      provider={getAuthProvider(user!.app_metadata)}
    />
  )
}
