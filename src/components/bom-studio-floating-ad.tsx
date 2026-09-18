import Image from "next/image"
import { ArrowRight, Check } from "lucide-react"

import {
  BOM_STUDIO_FREE_PREVIEW_URL,
  OPERATOR_NAME,
} from "@/lib/site-config"

const FEATURES = [
  "무료 시안",
  "모바일 최적화",
  "기본 SEO",
  "맞춤 제작",
] as const

/**
 * Desktop-only fixed BOM STUDIO side ad.
 * Hidden below ~1700px so it never overlaps the 1200px main column.
 * No close control — always visible on large viewports.
 */
export function BomStudioFloatingAd() {
  return (
    <aside
      className="pointer-events-none fixed top-[128px] right-7 z-40 hidden w-[200px] max-h-[calc(100vh-9.5rem)] min-[1700px]:block"
      aria-label="BOM STUDIO 홈페이지 제작 광고"
    >
      <div className="pointer-events-auto relative flex max-h-[calc(100vh-9.5rem)] flex-col overflow-hidden rounded-[22px] border border-[#F5C2C5] bg-white shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 top-[88px] size-28 rounded-full bg-[#EF111B]/[0.06]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-10 bottom-24 size-24 rounded-full bg-[#EF111B]/[0.05]"
        />

        <div className="relative flex shrink-0 flex-col items-start justify-center bg-[#EF111B] px-4 py-5">
          <div className="flex items-center gap-2.5">
            <span
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[17px] font-black leading-none tracking-tight text-[#EF111B]"
              aria-hidden
            >
              B
            </span>
            <div className="min-w-0">
              <p className="text-[13px] font-extrabold leading-tight tracking-wide text-white">
                {OPERATOR_NAME}
              </p>
              <p className="mt-0.5 text-[11px] font-medium leading-tight text-white/90">
                홈페이지 제작 전문
              </p>
            </div>
          </div>
        </div>

        <div className="relative flex min-h-0 flex-1 flex-col overflow-y-auto px-4 pb-4 pt-4">
          <p className="text-[18px] font-extrabold leading-[1.25] tracking-[-0.03em] text-[#0F172A]">
            홈페이지,
            <br />
            <span className="text-[#EF111B]">아직 없으세요?</span>
          </p>

          <p className="mt-2.5 text-[12.5px] font-medium leading-snug text-[#475569]">
            <span className="font-bold text-[#EF111B]">무료 시안</span>
            으로
            <br />
            먼저 확인하고
            <br />
            결정하세요.
          </p>

          <ul className="mt-3.5 space-y-1.5">
            {FEATURES.map((label) => (
              <li
                key={label}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-[#0F172A]"
              >
                <Check
                  className="size-3.5 shrink-0 text-[#EF111B]"
                  strokeWidth={2.75}
                  aria-hidden
                />
                {label}
              </li>
            ))}
          </ul>

          <div className="relative mt-3.5 h-[88px] w-full overflow-hidden rounded-[12px] bg-[#F8FAFC]">
            <Image
              src="/bomstudio.png"
              alt="BOM STUDIO 홈페이지 제작 예시"
              fill
              sizes="200px"
              className="object-cover object-[72%_center]"
            />
          </div>

          <a
            href={BOM_STUDIO_FREE_PREVIEW_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3.5 inline-flex h-[48px] w-full shrink-0 items-center justify-center gap-1.5 rounded-[12px] bg-[#EF111B] text-[13px] font-bold text-white transition-colors hover:bg-[#D90D17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF111B] focus-visible:ring-offset-2"
          >
            무료 시안 신청하기
            <ArrowRight className="size-3.5" aria-hidden />
          </a>

          <div className="mt-3 flex items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold leading-tight text-[#0F172A]">
                {OPERATOR_NAME}
              </p>
              <p className="mt-0.5 text-[10px] leading-tight text-[#94A3B8]">
                홈페이지 제작 · 웹개발
              </p>
            </div>
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#EF111B] text-[12px] font-black text-white"
              aria-hidden
            >
              B
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
