"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  DOCUMENTS_NAV_ITEMS,
  getDocumentsNavLabel,
  isDocumentsNavActive,
} from "@/lib/documents-nav"
import { cn } from "@/lib/utils"

export function DocumentsMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const currentLabel = getDocumentsNavLabel(pathname)

  return (
    <div className="space-y-4 lg:hidden">
      <div className="relative">
        <label htmlFor="documents-mobile-select" className="sr-only">
          문서관리 메뉴 선택
        </label>
        <select
          id="documents-mobile-select"
          value={
            DOCUMENTS_NAV_ITEMS.find((item) =>
              isDocumentsNavActive(pathname, item.href)
            )?.href ?? DOCUMENTS_NAV_ITEMS[0].href
          }
          onChange={(event) => router.push(event.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-border/70 bg-background px-4 pr-10 text-sm font-medium text-foreground shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {DOCUMENTS_NAV_ITEMS.map((item) => (
            <option key={item.href} value={item.href}>
              {item.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {DOCUMENTS_NAV_ITEMS.map((item) => {
          const active = isDocumentsNavActive(pathname, item.href)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                active
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border/70 bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          )
        })}
      </div>

      <p className="text-sm font-medium text-muted-foreground">
        현재: <span className="text-foreground">{currentLabel}</span>
      </p>
    </div>
  )
}
