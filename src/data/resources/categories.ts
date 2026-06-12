import type { ResourceCategory, ResourceCategoryId } from "@/lib/resources/types"

export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  { id: "tax", label: "세금" },
  { id: "labor", label: "노무" },
  { id: "delivery", label: "배달" },
  { id: "startup", label: "창업" },
  { id: "sales", label: "매출관리" },
]

export const RESOURCE_CATEGORY_MAP: Record<ResourceCategoryId, ResourceCategory> =
  Object.fromEntries(
    RESOURCE_CATEGORIES.map((category) => [category.id, category])
  ) as Record<ResourceCategoryId, ResourceCategory>

export const RESOURCE_CATEGORY_BADGE_CLASS: Record<ResourceCategoryId, string> =
  {
    tax: "bg-violet-100 text-violet-800",
    labor: "bg-blue-100 text-blue-800",
    delivery: "bg-orange-100 text-orange-800",
    startup: "bg-emerald-100 text-emerald-800",
    sales: "bg-amber-100 text-amber-800",
  }
