import { redirect } from "next/navigation"

import { SiteLayout } from "@/components/site-layout"
import { createClient } from "@/lib/supabase/server"

export default async function MypageLayout({
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

  return (
    <SiteLayout>
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </div>
    </SiteLayout>
  )
}
