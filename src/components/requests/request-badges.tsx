import { cn } from "@/lib/utils"
import {
  getCategoryBadgeClass,
  getCategoryLabel,
  getStatusBadgeClass,
  getStatusLabel,
} from "@/lib/requests/constants"
import type {
  FeatureRequestCategory,
  FeatureRequestStatus,
} from "@/lib/supabase/database.types"

export function RequestCategoryBadge({
  category,
  className,
}: {
  category: FeatureRequestCategory
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        getCategoryBadgeClass(),
        className
      )}
    >
      {getCategoryLabel(category)}
    </span>
  )
}

export function RequestStatusBadge({
  status,
  className,
}: {
  status: FeatureRequestStatus
  className?: string
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold",
        getStatusBadgeClass(status),
        className
      )}
    >
      {getStatusLabel(status)}
    </span>
  )
}
