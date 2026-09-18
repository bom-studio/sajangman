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
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-sm">
            <p className="text-base font-bold text-[#0F172A]">
              <span className="text-primary">사장</span>만
            </p>
            <p className="mt-2 text-sm leading-relaxed text-[#64748B]">
              자영업자·소상공인이 운영에 필요한 숫자와 정보를 빠르게 확인할 수
              있는 무료 업무 도구입니다.
            </p>
          </div>

          <nav
            aria-label="푸터 메뉴"
            className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#64748B]"
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
        </div>

        <div className="mt-6 flex flex-col gap-2 border-t border-[#E2E8F0] pt-5 text-sm text-[#64748B] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {SITE_NAME}은{" "}
            <a
              href={BOM_STUDIO_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-[#0F172A] underline-offset-2 hover:text-primary hover:underline"
            >
              {OPERATOR_NAME}
            </a>
            에서 제작·운영합니다.
          </p>
          <p className="text-xs sm:text-sm">
            © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
