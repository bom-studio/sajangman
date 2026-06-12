import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { getRelatedCalculators } from "@/lib/calculators/registry"
import { cn } from "@/lib/utils"

function RelatedCalculatorCard({
  title,
  description,
  href,
  icon: Icon,
}: {
  title: string
  description: string
  href: string
  icon: LucideIcon
}) {
  return (
    <Link href={href} className="group block h-full">
      <Card
        className={cn(
          "h-full gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white py-0 shadow-sm",
          "transition-all duration-200 ease-out",
          "hover:-translate-y-1 hover:border-blue-200 hover:shadow-md"
        )}
      >
        <CardContent className="flex h-full items-start gap-4 p-5 sm:p-6">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-foreground">{title}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-muted-foreground transition-all group-hover:bg-blue-600 group-hover:text-white">
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

interface RelatedCalculatorsProps {
  excludeHref: string
  className?: string
}

export function RelatedCalculators({
  excludeHref,
  className,
}: RelatedCalculatorsProps) {
  const items = getRelatedCalculators(excludeHref)

  if (items.length === 0) return null

  return (
    <section className={cn("border-t border-slate-200 pt-12", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        관련 계산기
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        다른 계산기도 함께 활용해 보세요.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <RelatedCalculatorCard key={item.href} {...item} />
        ))}
      </div>
    </section>
  )
}
