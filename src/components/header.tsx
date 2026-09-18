"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AI_FEATURES_ENABLED } from "@/lib/features"
import { BOM_STUDIO_URL } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const allNavItems = [
  { label: "홈", href: "/" },
  { label: "계산기", href: "/calculators" },
  { label: "문서작성", href: "/documents" },
  { label: "자료실", href: "/resources" },
  { label: "AI 생성기", href: "/ai" },
]

const navItems = AI_FEATURES_ENABLED
  ? allNavItems
  : allNavItems.filter((item) => item.href !== "/ai")

function BomStudioHeaderCta({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <a
      href={BOM_STUDIO_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#EF111B] font-bold text-white transition-colors hover:bg-[#d40f18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF111B] focus-visible:ring-offset-2",
        compact ? "h-9 px-3 text-xs" : "h-10 px-3.5 text-sm",
        className
      )}
    >
      <span
        aria-hidden
        className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/20 text-[11px] font-extrabold leading-none"
      >
        B
      </span>
      <span>홈페이지 제작</span>
      <ArrowRight className="size-3.5 shrink-0" aria-hidden />
    </a>
  )
}

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-foreground"
        >
          <span className="text-primary">사장</span>만
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <BomStudioHeaderCta className="hidden sm:inline-flex" />
          <BomStudioHeaderCta className="sm:hidden" compact />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "메뉴 닫기" : "메뉴 열기"}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      <nav
        className={cn(
          "border-t border-border/60 bg-white md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <div className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}
