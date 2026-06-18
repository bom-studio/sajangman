"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { isMypageAccountPath } from "@/lib/site-nav"
import { cn } from "@/lib/utils"

interface HeaderAuthMenuProps {
  variant?: "desktop" | "mobile"
  onNavigate?: () => void
}

export function HeaderAuthMenu({
  variant = "desktop",
  onNavigate,
}: HeaderAuthMenuProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [signingOut, setSigningOut] = useState(false)
  const mypageActive = isMypageAccountPath(pathname)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
      setUser(currentUser)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function handleLogout() {
    setSigningOut(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    onNavigate?.()
    router.push("/")
    router.refresh()
  }

  if (loading) {
    return variant === "desktop" ? (
      <div className="hidden h-9 w-36 animate-pulse rounded-md bg-muted md:block" />
    ) : null
  }

  if (user) {
    if (variant === "mobile") {
      return (
        <div className="mt-2 space-y-1 border-t border-border/60 pt-3">
          <Link
            href="/mypage"
            onClick={onNavigate}
            className={cn(
              "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              mypageActive
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            aria-current={mypageActive ? "page" : undefined}
          >
            마이페이지
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={signingOut}
            className="w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50"
          >
            {signingOut ? "로그아웃 중..." : "로그아웃"}
          </button>
        </div>
      )
    }

    return (
      <div className="hidden items-center gap-2 md:flex">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className={cn(mypageActive && "bg-primary/10 text-primary hover:bg-primary/15")}
        >
          <Link href="/mypage" aria-current={mypageActive ? "page" : undefined}>
            마이페이지
          </Link>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={signingOut}
        >
          {signingOut ? "로그아웃 중..." : "로그아웃"}
        </Button>
      </div>
    )
  }

  if (variant === "mobile") {
    return (
      <div className="mt-2 space-y-1 border-t border-border/60 pt-3">
        <Link
          href="/login"
          onClick={onNavigate}
          className="block rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          로그인
        </Link>
        <Link
          href="/signup"
          onClick={onNavigate}
          className="block rounded-lg bg-primary px-3 py-2.5 text-center text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          무료 회원가입
        </Link>
      </div>
    )
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/login">로그인</Link>
      </Button>
      <Button size="sm" asChild>
        <Link href="/signup">무료 회원가입</Link>
      </Button>
    </div>
  )
}
