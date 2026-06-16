"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import { ResourceArticleCard } from "@/components/resources/resource-article-card"
import { Input } from "@/components/ui/input"
import {
  RESOURCE_CATEGORIES,
  RESOURCE_CATEGORY_BADGE_CLASS,
} from "@/data/resources/categories"
import type { ResourceArticleMeta, ResourceCategoryId } from "@/lib/resources/types"
import { cn } from "@/lib/utils"

interface ResourceHubProps {
  articles: ResourceArticleMeta[]
}

export function ResourceHub({ articles }: ResourceHubProps) {
  const [query, setQuery] = useState("")
  const [category, setCategory] = useState<ResourceCategoryId | "all">("all")

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    return articles.filter((article) => {
      const matchesCategory =
        category === "all" || article.category === category
      const matchesQuery =
        normalizedQuery.length === 0 ||
        article.title.toLowerCase().includes(normalizedQuery) ||
        article.excerpt.toLowerCase().includes(normalizedQuery)

      return matchesCategory && matchesQuery
    })
  }, [articles, category, query])

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-md flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="제목으로 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="pl-9"
            aria-label="자료실 제목 검색"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          총 {filteredArticles.length}개 자료
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setCategory("all")}
          className={cn(
            "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
            category === "all"
              ? "bg-primary text-primary-foreground"
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
              "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
              category === item.id
                ? "bg-primary text-primary-foreground"
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

      {filteredArticles.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ResourceArticleCard key={article.slug} article={article} />
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
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
