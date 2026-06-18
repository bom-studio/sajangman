"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  isMypageNavActive,
  MYPAGE_NAV_SECTIONS,
} from "@/lib/mypage-nav"
import { cn } from "@/lib/utils"

export function MypageSidebar() {
  const pathname = usePathname()

  return (
    <nav aria-label="마이페이지 메뉴" className="space-y-8">
      <h1 className="text-lg font-bold text-foreground">마이페이지</h1>

      {MYPAGE_NAV_SECTIONS.map((section) => (
        <div key={section.title}>
          <p className="mb-2 text-sm font-bold text-foreground">{section.title}</p>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const active = isMypageNavActive(pathname, item.href)

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
        </div>
      ))}
    </nav>
  )
}
