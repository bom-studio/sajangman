"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  DOCUMENTS_NAV_ITEMS,
  isDocumentsNavActive,
} from "@/lib/documents-nav"
import { cn } from "@/lib/utils"

export function DocumentsSidebar() {
  const pathname = usePathname()

  return (
    <nav aria-label="문서관리 메뉴" className="space-y-4">
      <h1 className="text-lg font-bold text-foreground">문서관리</h1>
      <ul className="space-y-0.5">
        {DOCUMENTS_NAV_ITEMS.map((item) => {
          const active = isDocumentsNavActive(pathname, item.href)

          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "block rounded-md px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary/10 font-medium text-primary"
                    : "text-foreground hover:bg-muted"
                )}
                aria-current={active ? "page" : undefined}
              >
                {item.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
