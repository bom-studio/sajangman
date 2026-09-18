"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useTransition } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import { CATEGORY_OPTIONS } from "@/lib/requests/constants"
import type { CategoryCount } from "@/lib/requests/queries"
import { cn } from "@/lib/utils"

interface RequestsFiltersProps {
  categoryCounts: CategoryCount[]
}

export function RequestsFilters({ categoryCounts }: RequestsFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()

  const category = searchParams.get("category") ?? "all"
  const sort = searchParams.get("sort") ?? "latest"
  const q = searchParams.get("q") ?? ""

  const updateParams = useCallback(
    (patch: Record<string, string | undefined>) => {
      const next = new URLSearchParams(searchParams.toString())

      Object.entries(patch).forEach(([key, value]) => {
        if (
          !value ||
          (key === "category" && value === "all") ||
          (key === "sort" && value === "latest") ||
          (key === "q" && value.trim() === "")
        ) {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      })

      next.delete("page")

      startTransition(() => {
        const query = next.toString()
        router.push(query ? `/requests?${query}` : "/requests")
      })
    },
    [router, searchParams]
  )

  const countMap = new Map(
    categoryCounts.map((item) => [item.category, item.count] as const)
  )

  const chips = [
    { value: "all" as const, label: "전체" },
    ...CATEGORY_OPTIONS.map((item) => ({
      value: item.value,
      label: item.label,
    })),
  ]

  return (
    <div
      className={cn(
        "space-y-4 rounded-2xl border border-border/70 bg-white p-4 sm:p-5",
        pending && "opacity-80"
      )}
    >
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {chips.map((chip) => {
          const active = category === chip.value
          const count = countMap.get(chip.value) ?? 0
          return (
            <button
              key={chip.value}
              type="button"
              onClick={() => updateParams({ category: chip.value })}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-2 text-sm font-medium transition-colors",
                active
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-white text-muted-foreground hover:border-primary/30 hover:text-foreground"
              )}
            >
              {chip.label}
              <span
                className={cn(
                  "tabular-nums",
                  active ? "text-primary-foreground/80" : "text-muted-foreground"
                )}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            defaultValue={q}
            placeholder="요청 내용을 검색해보세요."
            className="h-11 rounded-xl pl-9"
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                updateParams({ q: event.currentTarget.value.trim() })
              }
            }}
          />
        </div>
        <select
          value={sort}
          onChange={(event) => updateParams({ sort: event.target.value })}
          className="h-11 rounded-xl border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-40"
          aria-label="정렬"
        >
          <option value="latest">최신순</option>
          <option value="popular">공감순</option>
        </select>
      </div>
    </div>
  )
}
