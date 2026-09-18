import type {
  FeatureRequestCategory,
  FeatureRequestIndustry,
  FeatureRequestStatus,
} from "@/lib/supabase/database.types"

export const REQUESTS_PAGE_SIZE = 12

export const VISITOR_STORAGE_KEY = "sajangman_visitor_id"

export const RATE_LIMIT_WINDOW_MS = 60_000
export const RATE_LIMIT_MAX_PER_WINDOW = 3

export const CATEGORY_OPTIONS: {
  value: FeatureRequestCategory
  label: string
}[] = [
  { value: "calculator", label: "계산기" },
  { value: "document", label: "문서작성" },
  { value: "guide", label: "자료/가이드" },
  { value: "sales", label: "매출관리" },
  { value: "employee", label: "직원관리" },
  { value: "other", label: "기타" },
]

export const STATUS_OPTIONS: {
  value: FeatureRequestStatus
  label: string
}[] = [
  { value: "requested", label: "요청됨" },
  { value: "reviewing", label: "검토중" },
  { value: "planned", label: "개발예정" },
  { value: "developing", label: "개발중" },
  { value: "completed", label: "반영완료" },
  { value: "rejected", label: "반영 어려움" },
]

export const INDUSTRY_OPTIONS: {
  value: FeatureRequestIndustry
  label: string
}[] = [
  { value: "restaurant", label: "음식점" },
  { value: "cafe", label: "카페" },
  { value: "shopping", label: "쇼핑몰" },
  { value: "service", label: "서비스업" },
  { value: "manufacturing", label: "제조업" },
  { value: "other", label: "기타" },
]

export const STATUS_FLOW: FeatureRequestStatus[] = [
  "requested",
  "reviewing",
  "planned",
  "developing",
  "completed",
]

export function getCategoryLabel(category: FeatureRequestCategory): string {
  return CATEGORY_OPTIONS.find((item) => item.value === category)?.label ?? category
}

export function getStatusLabel(status: FeatureRequestStatus): string {
  return STATUS_OPTIONS.find((item) => item.value === status)?.label ?? status
}

export function getIndustryLabel(industry: string | null): string | null {
  if (!industry) return null
  return (
    INDUSTRY_OPTIONS.find((item) => item.value === industry)?.label ?? industry
  )
}

export function getStatusBadgeClass(status: FeatureRequestStatus): string {
  switch (status) {
    case "requested":
      return "bg-slate-100 text-slate-700"
    case "reviewing":
      return "bg-orange-50 text-orange-700"
    case "planned":
      return "bg-amber-50 text-amber-800"
    case "developing":
      return "bg-sky-50 text-sky-700"
    case "completed":
      return "bg-emerald-50 text-emerald-700"
    case "rejected":
      return "bg-rose-50 text-rose-700"
    default:
      return "bg-slate-100 text-slate-700"
  }
}

export function getCategoryBadgeClass(): string {
  return "bg-primary/10 text-primary"
}
