"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useId, useRef, useState } from "react"
import { ArrowRight, ChevronDown, Menu, X } from "lucide-react"

import {
  CalculatorMegaMenu,
  DocumentMegaMenu,
  getMobileCalculatorLinks,
  getMobileDocumentLinks,
  type MegaMenuId,
} from "@/components/header-mega-menu"
import { Button } from "@/components/ui/button"
import { AI_FEATURES_ENABLED } from "@/lib/features"
import { BOM_STUDIO_URL } from "@/lib/site-config"
import { cn } from "@/lib/utils"

const CLOSE_DELAY_MS = 160

const allNavItems = [
  { label: "홈", href: "/", mega: null },
  { label: "계산기", href: "/calculators", mega: "calculators" as const },
  { label: "문서작성", href: "/documents", mega: "documents" as const },
  { label: "자료실", href: "/resources", mega: null },
  { label: "기능 요청", href: "/requests", mega: null },
  { label: "AI 생성기", href: "/ai", mega: null },
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
        "inline-flex items-center justify-center gap-1.5 rounded-[10px] bg-[#EF111B] font-bold text-white transition-colors hover:bg-[#d40f18] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF111B] focus-visible:ring-offset-2",
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

function isActivePath(pathname: string, href: string) {
  if (href === "/") return pathname === "/"
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function Header() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openMenu, setOpenMenu] = useState<MegaMenuId | null>(null)
  const [mobileAccordion, setMobileAccordion] = useState<MegaMenuId | null>(
    null
  )
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const calculatorsPanelId = useId()
  const documentsPanelId = useId()

  function clearCloseTimer() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }

  function openMega(menu: MegaMenuId) {
    clearCloseTimer()
    setOpenMenu(menu)
  }

  function scheduleCloseMega() {
    clearCloseTimer()
    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null)
    }, CLOSE_DELAY_MS)
  }

  function closeMega() {
    clearCloseTimer()
    setOpenMenu(null)
  }

  useEffect(() => {
    closeMega()
    setMobileOpen(false)
    setMobileAccordion(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- close on route change only
  }, [pathname])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") closeMega()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [])

  useEffect(() => () => clearCloseTimer(), [])

  return (
    <header className="relative sticky top-0 z-50 border-b border-[#E2E8F0]/80 bg-white/90 backdrop-blur-md">
      <div className="relative mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-3 px-4 sm:h-[68px] sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-xl font-bold tracking-tight text-[#0F172A]"
        >
          <span className="text-primary">사장</span>만
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="주요 메뉴">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href)
            const megaOpen = item.mega !== null && openMenu === item.mega
            const panelId =
              item.mega === "calculators"
                ? calculatorsPanelId
                : item.mega === "documents"
                  ? documentsPanelId
                  : undefined

            if (!item.mega) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-primary"
                      : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                  )}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-primary sm:-bottom-[15px]" />
                  ) : null}
                </Link>
              )
            }

            return (
              <div
                key={item.href}
                className="relative"
                onMouseEnter={() => openMega(item.mega!)}
                onMouseLeave={scheduleCloseMega}
              >
                <Link
                  href={item.href}
                  className={cn(
                    "relative inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    active || megaOpen
                      ? "text-primary"
                      : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                  )}
                  aria-expanded={megaOpen}
                  aria-haspopup="true"
                  aria-controls={panelId}
                  onFocus={() => openMega(item.mega!)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      // Allow navigation on Enter; Space toggles panel
                      if (event.key === " ") {
                        event.preventDefault()
                        setOpenMenu((prev) =>
                          prev === item.mega ? null : item.mega
                        )
                      }
                    }
                  }}
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-3.5 opacity-70 transition-transform",
                      megaOpen && "rotate-180"
                    )}
                    aria-hidden
                  />
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-[13px] h-0.5 rounded-full bg-primary sm:-bottom-[15px]" />
                  ) : null}
                </Link>
              </div>
            )
          })}
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
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Desktop mega menu overlay */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 top-full z-[60] hidden md:block",
          openMenu && "pointer-events-auto"
        )}
        onMouseEnter={clearCloseTimer}
        onMouseLeave={scheduleCloseMega}
      >
        <div
          className={cn(
            "origin-top border-b border-[#E5E7EB] bg-white shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition-all duration-150",
            openMenu
              ? "translate-y-0 opacity-100"
              : "pointer-events-none -translate-y-1 opacity-0"
          )}
        >
          {openMenu === "calculators" ? (
            <CalculatorMegaMenu
              id={calculatorsPanelId}
              onNavigate={closeMega}
            />
          ) : null}
          {openMenu === "documents" ? (
            <DocumentMegaMenu
              id={documentsPanelId}
              onNavigate={closeMega}
            />
          ) : null}
        </div>
      </div>

      {/* Mobile nav */}
      <nav
        className={cn(
          "border-t border-[#E2E8F0] bg-white md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        aria-label="모바일 메뉴"
      >
        <div className="mx-auto flex max-w-[1200px] flex-col gap-1 px-4 py-3 sm:px-6">
          {navItems.map((item) => {
            const active = isActivePath(pathname, item.href)

            if (!item.mega) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    active
                      ? "bg-primary/10 text-primary"
                      : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                  )}
                >
                  {item.label}
                </Link>
              )
            }

            const expanded = mobileAccordion === item.mega
            const childLinks =
              item.mega === "calculators"
                ? getMobileCalculatorLinks()
                : getMobileDocumentLinks()

            return (
              <div key={item.href} className="rounded-lg">
                <button
                  type="button"
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors",
                    active || expanded
                      ? "bg-primary/10 text-primary"
                      : "text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                  )}
                  aria-expanded={expanded}
                  onClick={() =>
                    setMobileAccordion((prev) =>
                      prev === item.mega ? null : item.mega
                    )
                  }
                >
                  {item.label}
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform",
                      expanded && "rotate-180"
                    )}
                    aria-hidden
                  />
                </button>
                {expanded ? (
                  <div className="mb-1 ml-2 space-y-0.5 border-l border-[#E5E7EB] pl-3">
                    {childLinks.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block rounded-md px-2 py-2 text-sm text-[#64748B] hover:bg-slate-50 hover:text-[#0F172A]"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      </nav>
    </header>
  )
}
