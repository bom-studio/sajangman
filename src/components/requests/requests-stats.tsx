import {
  CircleCheck,
  Clock,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react"

import type { RequestStats } from "@/lib/requests/queries"
import { cn } from "@/lib/utils"

const ITEMS: {
  key: keyof RequestStats
  label: string
  icon: LucideIcon
  tone: string
}[] = [
  {
    key: "total",
    label: "전체 요청",
    icon: FileText,
    tone: "bg-primary/10 text-primary",
  },
  {
    key: "reviewing",
    label: "검토중",
    icon: Clock,
    tone: "bg-orange-50 text-orange-600",
  },
  {
    key: "planned",
    label: "개발예정",
    icon: Settings,
    tone: "bg-amber-50 text-amber-700",
  },
  {
    key: "completed",
    label: "반영완료",
    icon: CircleCheck,
    tone: "bg-emerald-50 text-emerald-600",
  },
]

export function RequestsStats({ stats }: { stats: RequestStats }) {
  return (
    <div className="rounded-2xl border border-border/70 bg-white p-4 shadow-sm sm:p-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
        {ITEMS.map((item) => {
          const Icon = item.icon
          return (
            <div key={item.key} className="flex items-center gap-3 sm:gap-4">
              <div
                className={cn(
                  "flex size-11 shrink-0 items-center justify-center rounded-xl",
                  item.tone
                )}
              >
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{item.label}</p>
                <p className="text-2xl font-bold tabular-nums tracking-tight text-foreground">
                  {stats[item.key].toLocaleString("ko-KR")}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
