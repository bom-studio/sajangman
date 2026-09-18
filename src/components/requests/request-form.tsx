"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  CATEGORY_OPTIONS,
  INDUSTRY_OPTIONS,
} from "@/lib/requests/constants"
import { getVisitorId } from "@/lib/requests/visitor"
import type { FeatureRequestCategory } from "@/lib/supabase/database.types"
import { cn } from "@/lib/utils"

export function RequestForm() {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [category, setCategory] = useState<FeatureRequestCategory | "">(
    ""
  )
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [industry, setIndustry] = useState("")
  const [nickname, setNickname] = useState("")
  const [website, setWebsite] = useState("")

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setError(null)

    if (!category) {
      setError("어떤 기능인지 카테고리를 선택해주세요.")
      return
    }

    const visitorId = getVisitorId()
    if (!visitorId) {
      setError("브라우저 저장소를 사용할 수 없습니다.")
      return
    }

    startTransition(async () => {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category,
          title,
          content,
          industry: industry || null,
          nickname: nickname.trim() || null,
          visitor_id: visitorId,
          website,
        }),
      })

      const result = (await response.json()) as
        | { ok: true; id: string }
        | { ok: false; error: string }

      if (!result.ok) {
        setError(result.error)
        return
      }

      router.push(`/requests/${result.id}`)
      router.refresh()
    })
  }

  return (
    <form onSubmit={handleSubmit} className="relative space-y-8">
      {/* Honeypot — hidden from users */}
      <div className="absolute -left-[9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden>
        <label htmlFor="website">Website</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => setWebsite(event.target.value)}
        />
      </div>

      <fieldset>
        <legend className="text-base font-bold text-foreground">
          1. 어떤 기능인가요?
        </legend>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORY_OPTIONS.map((option) => {
            const active = category === option.value
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setCategory(option.value)}
                className={cn(
                  "rounded-xl border px-4 py-4 text-left text-sm font-semibold transition-colors",
                  active
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border bg-white text-foreground hover:border-primary/30"
                )}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div>
        <label htmlFor="title" className="text-base font-bold text-foreground">
          2. 필요한 기능
        </label>
        <Input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={100}
          required
          placeholder="예: 직원 퇴직금 계산기가 필요해요"
          className="mt-3 h-12 rounded-xl"
        />
      </div>

      <div>
        <label
          htmlFor="content"
          className="text-base font-bold text-foreground"
        >
          3. 어떻게 사용하고 싶나요?
        </label>
        <Textarea
          id="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          maxLength={1000}
          required
          rows={6}
          placeholder="예: 입사일과 급여를 입력하면 예상 퇴직금이 자동으로 계산됐으면 좋겠어요."
          className="mt-3 rounded-xl"
        />
        <p className="mt-1.5 text-xs text-muted-foreground">
          {content.length}/1000
        </p>
      </div>

      <div>
        <label
          htmlFor="industry"
          className="text-base font-bold text-foreground"
        >
          4. 업종 <span className="font-normal text-muted-foreground">(선택)</span>
        </label>
        <select
          id="industry"
          value={industry}
          onChange={(event) => setIndustry(event.target.value)}
          className="mt-3 h-12 w-full rounded-xl border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="">선택하지 않음</option>
          {INDUSTRY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="nickname"
          className="text-base font-bold text-foreground"
        >
          5. 닉네임{" "}
          <span className="font-normal text-muted-foreground">(선택)</span>
        </label>
        <Input
          id="nickname"
          value={nickname}
          onChange={(event) => setNickname(event.target.value)}
          maxLength={30}
          placeholder="비워두면 '익명의 사장님'으로 표시됩니다"
          className="mt-3 h-12 rounded-xl"
        />
      </div>

      <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-muted-foreground">
        개인정보나 업체의 민감한 정보는 작성하지 마세요.
      </p>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <Button
        type="submit"
        size="lg"
        disabled={pending}
        className="h-12 w-full rounded-xl text-base sm:w-auto sm:px-8"
      >
        {pending ? "등록 중..." : "요청 등록하기"}
        <ArrowRight className="size-4" />
      </Button>
    </form>
  )
}
