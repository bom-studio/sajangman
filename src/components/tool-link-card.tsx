import Link from "next/link"
import { ArrowRight, type LucideIcon } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

interface ToolLinkCardProps {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export function ToolLinkCard({
  title,
  description,
  href,
  icon: Icon,
}: ToolLinkCardProps) {
  return (
    <Link href={href} className="group block h-full">
      <Card className="h-full border-0 py-0 shadow-sm ring-1 ring-border/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-primary/20">
        <CardContent className="flex h-full items-start gap-4 p-6">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          </div>
          <ArrowRight className="mt-1 size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
        </CardContent>
      </Card>
    </Link>
  )
}
