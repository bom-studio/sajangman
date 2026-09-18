"use client"

import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Search } from "lucide-react"

import {
  CalculatorCard,
  PopularCalculatorCard,
} from "@/components/calculators/calculator-card"
import { Input } from "@/components/ui/input"
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_BADGE_CLASS,
} from "@/data/resources/categories"
import {
  CALCULATORS,
  getPopularCalculators,
} from "@/data/calculators"
import type { ResourceCategoryId } from "@/lib/resources/types"
import { cn } from "@/lib/utils"

function parseCategoryParam(
  value: string | null
): ResourceCategoryId | "all" {
  if (!value || value === "all") return "all"
  if (RESOURCE_CATEGORIES.some((item) => item.id === value)) {
    return value as ResourceCategoryId
  }
  return "all"
}

export function CalculatorHub() {
  const searchParams = useSearchParams()
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<ResourceCategoryId | "all">(() =>
    parseCategoryParam(searchParams.get("category"))
  )

  useEffect(() => {
    setCategory(parseCategoryParam(searchParams.get("category")))
  }, [searchParams])

  const popularCalculators = useMemo(() => getPopularCalculators(), [])

  const filteredCalculators = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return CALCULATORS.filter((item) => {
      const matchesCategory =
        category === "all" || item.category === category
      const matchesQuery =
        normalizedQuery.length === 0 ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <div className="space-y-8">
      <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
          <button
            type="button"
            onClick={() => setCategory("all")}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
              category === "all"
                ? "scale-105 bg-primary text-primary-foreground shadow-sm"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            전체
          </button>
          {RESOURCE_CATEGORIES.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setCategory(item.id)}
              className={cn(
                "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
                category === item.id
                  ? "scale-105 bg-primary text-primary-foreground shadow-sm"
                  : cn(
                      RESOURCE_CATEGORY_BADGE_CLASS[item.id],
                      "hover:opacity-90"
                    )
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
            사장님들이 가장 많이 찾는 계산기
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            자주 쓰는 계산기를 빠르게 시작하세요.
          </p>
        </div>
        <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
          {popularCalculators.map((item) => (
            <PopularCalculatorCard
              key={item.href}
              title={item.title}
              description={item.description}
              href={item.href}
              icon={item.icon}
              estimatedTime={item.estimatedTime}
            />
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="계산기 이름 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            aria-label="계산기 이름 검색"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          총 {filteredCalculators.length}개 계산기
        </p>
      </div>

      {filteredCalculators.length > 0 ? (
        <div
          key={`${category}-${query}`}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 animate-in fade-in duration-300"
        >
          {filteredCalculators.map((calculator) => (
            <CalculatorCard key={calculator.href} calculator={calculator} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center animate-in fade-in duration-300">
          <p className="text-sm font-medium text-foreground">
            검색 결과가 없습니다.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            다른 키워드나 카테고리로 다시 검색해 보세요.
          </p>
        </div>
      )}
    </div>
  )
}
