import Link from "next/link"
import { ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"

export interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

/** Visible breadcrumb; keep labels in sync with BreadcrumbList JSON-LD. */
export function PageBreadcrumb({ items, className }: PageBreadcrumbProps) {
  if (items.length === 0) return null

  return (
    <nav
      aria-label="breadcrumb"
      className={cn("border-b border-slate-100 bg-white", className)}
    >
      <ol className="mx-auto flex max-w-[1440px] flex-wrap items-center gap-1 px-4 py-3 text-sm text-muted-foreground sm:px-6 lg:px-8">
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={`${item.label}-${index}`} className="inline-flex items-center gap-1">
              {index > 0 ? (
                <ChevronRight className="size-3.5 shrink-0 opacity-50" aria-hidden />
              ) : null}
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="transition-colors hover:text-foreground"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  className={cn(isLast && "font-medium text-foreground")}
                  aria-current={isLast ? "page" : undefined}
                >
                  {item.label}
                </span>
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
