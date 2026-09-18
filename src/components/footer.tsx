import Link from "next/link"

import {
  BOM_STUDIO_URL,
  OPERATOR_NAME,
  SITE_NAME,
} from "@/lib/site-config"

const footerLinks = [
  { label: "서비스 소개", href: "/about" },
  { label: "문의", href: "/contact" },
  { label: "이용약관", href: "/terms" },
  { label: "개인정보처리방침", href: "/privacy" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white py-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-6 text-center">
          <div>
            <p className="text-base font-semibold text-foreground">
              <span className="text-primary">사장</span>만
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
              자영업자·소상공인이 운영에 필요한 숫자와 정보를 빠르게 확인할 수
              있는 실무 도구입니다.
            </p>
          </div>

          <nav
            aria-label="푸터 메뉴"
            className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground"
          >
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <p className="text-sm text-muted-foreground">
            {SITE_NAME}은{" "}
            {BOM_STUDIO_URL ? (
              <a
                href={BOM_STUDIO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground underline-offset-2 hover:text-primary hover:underline"
              >
                {OPERATOR_NAME}
              </a>
            ) : (
              <span className="font-medium text-foreground">{OPERATOR_NAME}</span>
            )}
            에서 제작·운영합니다.
          </p>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
