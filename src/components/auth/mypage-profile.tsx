"use client"

import { LogOut, UserRound } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { MypagePageHeader } from "@/components/auth/mypage-page-header"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

interface LogoutButtonProps {
  className?: string
  variant?: "button" | "sidebar"
}

export function LogoutButton({
  className,
  variant = "button",
}: LogoutButtonProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleLogout() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (variant === "sidebar") {
    return (
      <button
        type="button"
        onClick={handleLogout}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-2 text-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-50",
          className
        )}
      >
        <LogOut className="size-4" />
        {loading ? "로그아웃 중..." : "로그아웃"}
      </button>
    )
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleLogout}
      disabled={loading}
    >
      <LogOut className="size-4" />
      {loading ? "로그아웃 중..." : "로그아웃"}
    </Button>
  )
}

interface MypageProfileProps {
  email: string
  provider: string | null
}

export function MypageProfile({ email, provider }: MypageProfileProps) {
  const providerLabel =
    provider === "google" ? "Google" : provider === "email" ? "이메일" : "연동됨"

  return (
    <div>
      <MypagePageHeader
        title="내 정보"
        description="회원 계정 정보를 확인할 수 있습니다."
      />

      <div className="space-y-6">
        <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-slate-50/60 p-4">
          <div className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground">
            <UserRound className="size-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">{email}</p>
            <p className="text-sm text-muted-foreground">{providerLabel} 로그인</p>
          </div>
        </div>

        <dl className="grid gap-4 rounded-xl border border-border/60 bg-slate-50/60 p-4 sm:grid-cols-[120px_1fr]">
          <dt className="text-sm font-medium text-muted-foreground">이메일</dt>
          <dd className="text-sm font-medium text-foreground">{email}</dd>
          <dt className="text-sm font-medium text-muted-foreground">로그인 방식</dt>
          <dd className="text-sm font-medium text-foreground">{providerLabel}</dd>
        </dl>

        <div className="rounded-xl border border-dashed border-border/80 bg-muted/30 p-5">
          <p className="text-sm font-medium text-foreground">문서 저장 기능 준비 중</p>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
            견적서·문서 작성 내용을 클라우드에 저장하고 불러오는 기능이 곧
            추가됩니다. 헤더의 문서관리 메뉴에서 이용하실 수 있습니다.
          </p>
        </div>
      </div>
    </div>
  )
}
