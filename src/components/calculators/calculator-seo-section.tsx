import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

interface CalculatorSeoSectionProps {
  children: ReactNode
  className?: string
}

export function CalculatorSeoSection({
  children,
  className,
}: CalculatorSeoSectionProps) {
  return (
    <section
      className={cn("mt-16 border-t border-slate-200 pt-12", className)}
    >
      <div className="mx-auto max-w-3xl space-y-10">{children}</div>
    </section>
  )
}

interface CalculatorSeoArticleProps {
  title: string
  children: ReactNode
  as?: "h2" | "h3"
}

export function CalculatorSeoArticle({
  title,
  children,
  as: Heading = "h2",
}: CalculatorSeoArticleProps) {
  const headingClassName =
    Heading === "h2"
      ? "text-2xl font-bold tracking-tight text-foreground"
      : "text-xl font-bold tracking-tight text-foreground"

  return (
    <article>
      <Heading className={headingClassName}>{title}</Heading>
      <div className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
        {children}
      </div>
    </article>
  )
}
