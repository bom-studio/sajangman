import { Check } from "lucide-react"

import { STATUS_FLOW, getStatusLabel } from "@/lib/requests/constants"
import type { FeatureRequestStatus } from "@/lib/supabase/database.types"
import { cn } from "@/lib/utils"

export function RequestStatusFlow({
  status,
}: {
  status: FeatureRequestStatus
}) {
  if (status === "rejected") {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4">
        <p className="font-semibold text-rose-800">
          현재는 반영이 어려운 요청입니다.
        </p>
      </div>
    )
  }

  const currentIndex = STATUS_FLOW.indexOf(status)

  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-5">
      {STATUS_FLOW.map((step, index) => {
        const done = index <= currentIndex
        const current = index === currentIndex
        return (
          <li
            key={step}
            className={cn(
              "rounded-xl border px-3 py-3 text-center",
              done
                ? current
                  ? "border-primary bg-primary/10"
                  : "border-emerald-200 bg-emerald-50"
                : "border-border/70 bg-slate-50"
            )}
          >
            <div
              className={cn(
                "mx-auto mb-2 flex size-7 items-center justify-center rounded-full text-xs font-bold",
                done
                  ? current
                    ? "bg-primary text-primary-foreground"
                    : "bg-emerald-600 text-white"
                  : "bg-slate-200 text-slate-500"
              )}
            >
              {done && !current ? <Check className="size-3.5" /> : index + 1}
            </div>
            <p
              className={cn(
                "text-xs font-semibold sm:text-sm",
                done ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {getStatusLabel(step)}
            </p>
          </li>
        )
      })}
    </ol>
  )
}
