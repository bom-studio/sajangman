"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import {
  getMypageNavLabel,
  isMypageNavActive,
  MYPAGE_NAV_ITEMS,
  MYPAGE_NAV_SECTIONS,
} from "@/lib/mypage-nav"
import { cn } from "@/lib/utils"

export function MypageMobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const currentLabel = getMypageNavLabel(pathname)

  return (
    <div className="space-y-4 lg:hidden">
      <div className="relative">
        <label htmlFor="mypage-mobile-select" className="sr-only">
          마이페이지 메뉴 선택
        </label>
        <select
          id="mypage-mobile-select"
          value={
            MYPAGE_NAV_ITEMS.find((item) => isMypageNavActive(pathname, item.href))
              ?.href ?? "/mypage"
          }
          onChange={(event) => router.push(event.target.value)}
          className="h-11 w-full appearance-none rounded-lg border border-border/70 bg-background px-4 pr-10 text-sm font-medium text-foreground shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {MYPAGE_NAV_SECTIONS.map((section) => (
            <optgroup key={section.title} label={section.title}>
              {section.items.map((item) => (
                <option key={item.href} value={item.href}>
                  {item.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {MYPAGE_NAV_ITEMS.map((item) => {
          const active = isMypageNavActive(pathname, item.href)

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
