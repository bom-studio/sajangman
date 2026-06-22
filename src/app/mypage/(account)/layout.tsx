import { redirect } from "next/navigation"

import { MypageShell } from "@/components/auth/mypage-shell"
import { createClient } from "@/lib/supabase/server"

export default async function MypageAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  return <MypageShell>{children}</MypageShell>
}
