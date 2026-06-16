"use client"

import { AI_CATEGORIES, AI_CATEGORY_BADGE_CLASS } from "@/data/ai/categories"
import type { AiCategoryId } from "@/lib/ai/types"
import { cn } from "@/lib/utils"

interface AiCategoryFilterProps {
  value: AiCategoryId | "all"
  onChange: (value: AiCategoryId | "all") => void
}

export function AiCategoryFilter({ value, onChange }: AiCategoryFilterProps) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:overflow-visible sm:px-0">
      <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap">
        <button
          type="button"
          onClick={() => onChange("all")}
          className={cn(
            "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
            value === "all"
              ? "scale-105 bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          )}
        >
          전체
        </button>
        {AI_CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => onChange(category.id)}
            className={cn(
              "shrink-0 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
              value === category.id
                ? "scale-105 bg-primary text-primary-foreground shadow-sm"
                : cn(
                    AI_CATEGORY_BADGE_CLASS[category.id],
                    "hover:opacity-90"
                  )
            )}
          >
            {category.label}
          </button>
        ))}
      </div>
    </div>
  )
}
