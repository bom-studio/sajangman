"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  MessageCircle,
  Monitor,
  Search,
} from "lucide-react"

import {
  BOM_STUDIO_FREE_PREVIEW_URL,
  OPERATOR_NAME,
} from "@/lib/site-config"
import { cn } from "@/lib/utils"

const FEATURES = [
  { label: "무료 시안 7일", icon: CalendarDays },
  { label: "반응형 웹사이트", icon: Monitor },
  { label: "기본 SEO 적용", icon: Search },
  { label: "빠른 상담", icon: MessageCircle },
] as const

function CopyBlock() {
  return (
    <>
      <div className="bom-cta-rest">
        <p className="text-[15px] font-black tracking-[0.12em] text-[#111111]">
          {OPERATOR_NAME}
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
          WEB DESIGN AGENCY
        </p>
      </div>

      <p className="bom-cta-rest mt-5 text-[15px] font-bold text-[#EF111B] sm:text-base">
        홈페이지, 돈부터 내지 마세요.
      </p>

      <h2 className="mt-3 text-[30px] font-black leading-[1.1] tracking-[-0.04em] sm:text-[36px] lg:text-[44px]">
        <span className="bom-cta-line1 block text-[#EF111B]">
          무료 시안 먼저
        </span>
        <span className="bom-cta-line2 mt-1 block text-[#111111]">
          확인하고 결정하세요.
        </span>
      </h2>

      <p className="bom-cta-rest mt-4 max-w-md text-[15px] leading-relaxed text-[#4B5563] sm:text-[16px]">
        사장님의 업종에 맞춘 홈페이지,
        <br />
        <span className="font-bold text-[#EF111B]">7일 내 무료 시안</span>을
        먼저 확인해보세요.
      </p>

      <ul className="bom-cta-rest mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[13px] font-medium text-[#374151]">
        {FEATURES.map((feature) => {
          const Icon = feature.icon
          return (
            <li key={feature.label} className="inline-flex items-center gap-1.5">
              <Icon className="size-3.5 shrink-0 text-[#EF111B]" aria-hidden />
              {feature.label}
            </li>
          )
        })}
      </ul>

      <div className="bom-cta-rest mt-7">
        <a
          href={BOM_STUDIO_FREE_PREVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="bom-cta-btn group inline-flex h-[54px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#EF111B] px-8 text-[15px] font-extrabold text-white transition-[transform,background-color,box-shadow] duration-200 hover:-translate-y-px hover:bg-[#D90D17] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF111B] focus-visible:ring-offset-2 sm:w-auto"
        >
          무료 시안 신청하기
          <ArrowRight
            className="bom-cta-btn-arrow size-4 transition-transform duration-200 group-hover:translate-x-[3px]"
            aria-hidden
          />
        </a>
      </div>
    </>
  )
}

export function BomStudioCtaSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return
        setInView(true)
        observer.disconnect()
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="bg-white py-12 sm:py-14"
      aria-label="BOM STUDIO 홈페이지 제작 안내"
    >
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "bom-cta-banner relative hidden min-h-[360px] overflow-hidden rounded-[24px] border border-[#E2E8F0] bg-white md:block lg:min-h-[400px]",
            inView && "is-inview"
          )}
        >
          <div className="bom-cta-media absolute inset-0">
            <Image
              src="/bomstudio.png"
              alt="BOM STUDIO 반응형 홈페이지 제작 예시 - 데스크탑과 모바일"
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-cover object-[center_right] scale-[1.03]"
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.98)_28%,rgba(255,255,255,0.78)_46%,rgba(255,255,255,0)_64%)]"
          />
          <div className="relative z-10 flex h-full min-h-[360px] items-center p-8 lg:min-h-[400px] lg:p-10 lg:pr-[40%]">
            <div className="w-full max-w-[460px]">
              <CopyBlock />
            </div>
          </div>
        </div>

        <div
          className={cn(
            "bom-cta-banner overflow-hidden rounded-[20px] border border-[#E2E8F0] bg-white md:hidden",
            inView && "is-inview"
          )}
        >
          <div className="p-6">
            <CopyBlock />
          </div>
          <div className="bom-cta-media relative h-[240px] w-full overflow-hidden bg-[#f8fafc]">
            <Image
              src="/bomstudio.png"
              alt="BOM STUDIO 반응형 홈페이지 제작 예시 - 데스크탑과 모바일"
              fill
              sizes="100vw"
              className="object-cover object-[75%_center] scale-110"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
