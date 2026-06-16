import type { AiCategory, AiCategoryId } from "@/lib/ai/types"

export const AI_CATEGORIES: AiCategory[] = [
  { id: "customer", label: "고객응대" },
  { id: "operations", label: "매장운영" },
  { id: "marketing", label: "마케팅" },
]

export const AI_CATEGORY_MAP: Record<AiCategoryId, AiCategory> =
  Object.fromEntries(
    AI_CATEGORIES.map((category) => [category.id, category])
  ) as Record<AiCategoryId, AiCategory>

export const AI_CATEGORY_BADGE_CLASS: Record<AiCategoryId, string> = {
  customer: "bg-blue-100 text-blue-800",
  operations: "bg-emerald-100 text-emerald-800",
  marketing: "bg-amber-100 text-amber-800",
}
