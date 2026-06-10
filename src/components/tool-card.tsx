import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"

export type ToolTag = "인기" | "문서" | "계산" | "AI"

const tagStyles: Record<ToolTag, string> = {
  인기: "bg-blue-50 text-blue-600 ring-blue-100",
  문서: "bg-slate-50 text-slate-600 ring-slate-200",
  계산: "bg-emerald-50 text-emerald-600 ring-emerald-100",
  AI: "bg-violet-50 text-violet-600 ring-violet-100",
}

interface ToolCardProps {
  title: string
  description: string
  href: string
  tag: ToolTag
  icon: LucideIcon
}

export function ToolCard({
  title,
  description,
  href,
  tag,
  icon: Icon,
}: ToolCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card
        className={cn(
          "h-full border-0 py-0 shadow-sm ring-1 ring-border/80",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-1 hover:shadow-md hover:ring-primary/20"
        )}
      >
        <CardContent className="flex h-full flex-col p-6">
          <div className="mb-4 flex items-start justify-between gap-3">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <span
              className={cn(
                "inline-flex shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset",
                tagStyles[tag]
              )}
            >
              {tag}
            </span>
          </div>

          <div className="flex flex-1 flex-col">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-end">
            <span className="flex size-8 items-center justify-center rounded-full bg-muted text-muted-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <ArrowRight className="size-4" />
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
