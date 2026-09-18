"use client"

import Link from "next/link"
import type { ReactNode } from "react"
import { ArrowRight, type LucideIcon } from "lucide-react"

import {
  getCalculatorByHref,
  type CalculatorListItem,
} from "@/data/calculators"
import {
  DOCUMENTS,
  getDocumentsByGroup,
  type DocumentListItem,
} from "@/data/documents"
import { HOME_FEATURED_CALCULATOR_HREFS } from "@/data/home"
import { RESOURCE_CATEGORIES } from "@/data/resources/categories"
import { cn } from "@/lib/utils"

export type MegaMenuId = "calculators" | "documents"

const FEATURED_CALCULATORS: CalculatorListItem[] =
  HOME_FEATURED_CALCULATOR_HREFS.map((href) => getCalculatorByHref(href)).filter(
    (item): item is CalculatorListItem => Boolean(item)
  )

const QUICK_CALCULATORS = FEATURED_CALCULATORS.slice(0, 3)

const CALCULATOR_CATEGORIES = [
  { label: "전체 계산기", href: "/calculators" },
  ...RESOURCE_CATEGORIES.map((category) => ({
    label: category.label,
    href: `/calculators?category=${category.id}`,
  })),
]

function MegaLink({
  href,
  children,
  onNavigate,
  className,
}: {
  href: string
  children: ReactNode
  onNavigate?: () => void
  className?: string
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "rounded-lg text-sm transition-colors hover:bg-[#F8FAFC] hover:text-[#0F172A]",
        className
      )}
    >
      {children}
    </Link>
  )
}

function IconLabel({
  icon: Icon,
  label,
}: {
  icon: LucideIcon
  label: string
}) {
  return (
    <span className="inline-flex min-w-0 items-center gap-2.5">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" aria-hidden />
      </span>
      <span className="truncate font-medium text-[#0F172A]">{label}</span>
    </span>
  )
}

export function CalculatorMegaMenu({
  id,
  onNavigate,
}: {
  id: string
  onNavigate?: () => void
}) {
  return (
    <div
      id={id}
      className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1.2fr_0.9fr] lg:gap-10 lg:px-8"
    >
      <div>
        <p className="text-base font-bold text-[#0F172A]">계산기</p>
        <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
          사업 운영에 필요한 계산기를
          <br />
          카테고리별로 빠르게 찾아보세요.
        </p>
        <ul className="mt-5 space-y-1">
          {CALCULATOR_CATEGORIES.map((item) => (
            <li key={item.href}>
              <MegaLink
                href={item.href}
                onNavigate={onNavigate}
                className="block px-3 py-2 font-medium text-[#334155]"
              >
                {item.label}
              </MegaLink>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <p className="text-sm font-semibold text-[#64748B]">많이 찾는 계산기</p>
        <ul className="mt-4 grid gap-1 sm:grid-cols-2">
          {FEATURED_CALCULATORS.map((item) => (
            <li key={item.href}>
              <MegaLink
                href={item.href}
                onNavigate={onNavigate}
                className="block px-2 py-2"
              >
                <IconLabel icon={item.icon} label={item.title} />
              </MegaLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-[#E5E7EB] bg-[#F4F8FF] p-5">
        <p className="text-sm font-bold text-[#0F172A]">바로 계산해보세요</p>
        <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">
          회원가입 없이 무료로 사용할 수 있어요.
        </p>
        <ul className="mt-4 space-y-1">
          {QUICK_CALCULATORS.map((item) => (
            <li key={item.href}>
              <MegaLink
                href={item.href}
                onNavigate={onNavigate}
                className="block px-2 py-2"
              >
                <IconLabel icon={item.icon} label={item.title} />
              </MegaLink>
            </li>
          ))}
        </ul>
        <MegaLink
          href="/calculators"
          onNavigate={onNavigate}
          className="mt-4 inline-flex items-center gap-1.5 px-2 py-2 font-semibold text-primary"
        >
          전체 계산기 보기
          <ArrowRight className="size-3.5" aria-hidden />
        </MegaLink>
      </div>
    </div>
  )
}

function DocumentGroupColumn({
  title,
  items,
  onNavigate,
}: {
  title: string
  items: DocumentListItem[]
  onNavigate?: () => void
}) {
  return (
    <div>
      <p className="text-sm font-semibold text-[#64748B]">{title}</p>
      <ul className="mt-4 space-y-1">
        {items.map((item) => (
          <li key={item.href}>
            <MegaLink
              href={item.href}
              onNavigate={onNavigate}
              className="block px-2 py-2"
            >
              <IconLabel icon={item.icon} label={item.title} />
            </MegaLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DocumentMegaMenu({
  id,
  onNavigate,
}: {
  id: string
  onNavigate?: () => void
}) {
  return (
    <div
      id={id}
      className="mx-auto grid max-w-[1200px] gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[0.9fr_1fr_1fr] lg:gap-10 lg:px-8"
    >
      <div>
        <p className="text-base font-bold text-[#0F172A]">문서작성</p>
        <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
          거래처에 필요한 실무 문서를
          <br />
          간편하게 작성하고 PDF로 저장하세요.
        </p>
        <MegaLink
          href="/documents"
          onNavigate={onNavigate}
          className="mt-5 inline-flex items-center gap-1.5 px-3 py-2 font-semibold text-primary"
        >
          전체 문서 보기
          <ArrowRight className="size-3.5" aria-hidden />
        </MegaLink>
      </div>

      <DocumentGroupColumn
        title="견적·거래"
        items={getDocumentsByGroup("quote-trade")}
        onNavigate={onNavigate}
      />
      <DocumentGroupColumn
        title="발주·계약"
        items={getDocumentsByGroup("order-contract")}
        onNavigate={onNavigate}
      />
    </div>
  )
}

export function getMobileCalculatorLinks() {
  return [
    { label: "전체 계산기", href: "/calculators" },
    ...FEATURED_CALCULATORS.map((item) => ({
      label: item.title,
      href: item.href,
    })),
  ]
}

export function getMobileDocumentLinks() {
  return [
    { label: "전체 문서", href: "/documents" },
    ...DOCUMENTS.map((item) => ({
      label: item.title,
      href: item.href,
    })),
  ]
}
