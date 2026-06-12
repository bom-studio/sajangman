import {
  RESULT_STATUS_BADGE_CLASS,
  RESULT_STATUS_LABEL,
  type ResultStatus,
} from "@/lib/calculators/result-status"
import { cn } from "@/lib/utils"

export function ResultStatusBadge({ status }: { status: ResultStatus }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        RESULT_STATUS_BADGE_CLASS[status]
      )}
    >
      {RESULT_STATUS_LABEL[status]}
    </span>
  )
}
