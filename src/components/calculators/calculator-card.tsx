import Link from "next/link"
import { ArrowRight, Zap, type LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import {
  CALCULATOR_BADGE_LABEL,
  type CalculatorListItem,
} from "@/data/calculators"
import {
  RESOURCE_CATEGORY_BADGE_CLASS,
  RESOURCE_CATEGORY_MAP,
} from "@/data/resources/categories"
import { cn } from "@/lib/utils"

interface CalculatorCardProps {
  calculator: CalculatorListItem
  className?: string
}

export function CalculatorCard({ calculator, className }: CalculatorCardProps) {
  const category = RESOURCE_CATEGORY_MAP[calculator.category]
  const Icon = calculator.icon

  return (
    <Link
      href={calculator.href}
      className={cn("group block h-full", className)}
    >
      <Card className="relative h-full border-0 py-0 shadow-sm ring-1 ring-border/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-primary/20">
        <CardContent className="flex h-full flex-col p-6">
          <div className="flex items-start justify-between gap-3">
            <span
              className={cn(
                "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
                RESOURCE_CATEGORY_BADGE_CLASS[calculator.category]
              )}
            >
              {category.label}
            </span>
            <div className="flex flex-col items-end gap-1.5">
              {calculator.badge ? (
                <span className="text-xs font-medium text-foreground">
                  {CALCULATOR_BADGE_LABEL[calculator.badge]}
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="size-3.5" />
                {calculator.estimatedTime}
              </span>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-base font-semibold text-foreground group-hover:text-primary">
                {calculator.title}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {calculator.description}
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
            바로 계산하기
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

interface PopularCalculatorCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
  estimatedTime: string
}

export function PopularCalculatorCard({
  title,
  description,
  href,
  icon: Icon,
  estimatedTime,
}: PopularCalculatorCardProps) {
  return (
    <Link href={href} className="group block h-full min-w-[280px] flex-1">
      <Card className="h-full border-0 py-0 shadow-sm ring-1 ring-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20">
        <CardContent className="flex h-full items-center gap-4 p-5">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-foreground group-hover:text-primary sm:text-base">
              {title}
            </h3>
            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
              {description}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 text-xs text-muted-foreground">
              <Zap className="size-3.5" />
              {estimatedTime}
            </span>
          </div>
          <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </CardContent>
      </Card>
    </Link>
  )
}
