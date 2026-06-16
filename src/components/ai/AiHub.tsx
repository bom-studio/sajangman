"use client"

import { useMemo, useState } from "react"

import { AiCategoryFilter } from "@/components/ai/AiCategoryFilter"
import { AiSearch } from "@/components/ai/AiSearch"
import { AiToolCard } from "@/components/ai/AiToolCard"
import { PopularAiTools } from "@/components/ai/PopularAiTools"
import { AI_TOOLS } from "@/data/ai/tools"
import type { AiCategoryId } from "@/lib/ai/types"

export function AiHub() {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<AiCategoryId | "all">("all")

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return AI_TOOLS.filter((tool) => {
      const matchesCategory =
        category === "all" || tool.category === category
      const matchesQuery =
        normalizedQuery.length === 0 ||
        tool.title.toLowerCase().includes(normalizedQuery) ||
        tool.description.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [category, query])

  return (
    <div className="space-y-8">
      <AiCategoryFilter value={category} onChange={setCategory} />
      <PopularAiTools />
      <AiSearch
        value={query}
        onChange={setQuery}
        resultCount={filteredTools.length}
      />

      {filteredTools.length > 0 ? (
        <div
          key={`${category}-${query}`}
          className="grid grid-cols-1 gap-5 md:grid-cols-2 animate-in fade-in duration-300"
        >
          {filteredTools.map((tool) => (
            <AiToolCard key={tool.href} tool={tool} />
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
