import Image from "next/image"
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

const FEATURES = [
  { label: "무료 시안 7일", icon: CalendarDays },
  { label: "반응형 웹사이트", icon: Monitor },
  { label: "기본 SEO 적용", icon: Search },
  { label: "빠른 상담", icon: MessageCircle },
] as const

function CopyBlock() {
  return (
    <>
      <div>
        <p className="text-[15px] font-black tracking-[0.12em] text-[#111111]">
          {OPERATOR_NAME}
        </p>
        <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#6B7280]">
          WEB DESIGN AGENCY
        </p>
      </div>

      <p className="mt-5 text-[15px] font-bold text-[#EF111B] underline decoration-[#EF111B]/35 decoration-1 underline-offset-[6px] sm:text-base">
        홈페이지, 돈부터 내지 마세요.
      </p>

      <h2 className="mt-4 text-[30px] font-black leading-[1.1] tracking-[-0.04em] sm:text-[36px] lg:text-[48px]">
        <span className="block text-[#EF111B]">무료 시안 먼저</span>
        <span className="mt-1 block text-[#111111]">확인하고 결정하세요.</span>
      </h2>

      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[#4B5563] sm:text-[17px]">
        사장님의 업종에 맞춘 홈페이지,{" "}
        <span className="font-bold text-[#EF111B]">7일 내 무료 시안</span>을
        먼저 확인해보세요.
      </p>

      <ul className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-2 text-[13px] font-medium text-[#374151]">
        {FEATURES.map((feature, index) => {
          const Icon = feature.icon
          return (
            <li key={feature.label} className="flex items-center gap-2">
              {index > 0 ? (
                <span className="text-[#D1D5DB]" aria-hidden>
                  ·
                </span>
              ) : null}
              <span className="inline-flex items-center gap-1.5">
                <Icon className="size-3.5 shrink-0 text-[#EF111B]" aria-hidden />
                {feature.label}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="mt-7">
        <a
          href={BOM_STUDIO_FREE_PREVIEW_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-[56px] w-full items-center justify-center gap-2 rounded-[13px] bg-[#EF111B] px-8 text-[15px] font-extrabold text-white shadow-[0_8px_20px_rgba(239,17,27,0.18)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#D90D17] hover:shadow-[0_12px_24px_rgba(239,17,27,0.28)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#EF111B] focus-visible:ring-offset-2 sm:w-auto"
        >
          무료 시안 신청하기
          <ArrowRight className="size-4" aria-hidden />
        </a>
        <p className="mt-3 text-[13px] text-[#6B7280]">
          제작비 결제 전, 시안부터 확인하세요.
        </p>
      </div>
    </>
  )
}

export function BomStudioCtaSection() {
  return (
    <section
      className="bg-white py-10 sm:py-12"
      aria-label="BOM STUDIO 홈페이지 제작 안내"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Desktop / tablet hero banner */}
        <div className="relative hidden min-h-[380px] overflow-hidden rounded-[24px] bg-white shadow-[0_10px_40px_rgba(17,17,17,0.05)] md:block lg:min-h-[420px]">
          <Image
            src="/bomstudio.png"
            alt="BOM STUDIO 반응형 홈페이지 제작 예시 - 데스크탑과 모바일"
            fill
            priority={false}
            sizes="(max-width: 1152px) 100vw, 1152px"
            className="object-cover object-[center_right] scale-[1.04]"
          />

          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,1)_0%,rgba(255,255,255,0.98)_30%,rgba(255,255,255,0.80)_47%,rgba(255,255,255,0)_65%)]"
          />

          <div className="relative z-10 flex h-full min-h-[380px] items-center p-8 lg:min-h-[420px] lg:p-10 lg:pr-[42%]">
            <div className="w-full max-w-[480px]">
              <CopyBlock />
            </div>
          </div>
        </div>

        {/* Mobile stacked layout */}
        <div className="overflow-hidden rounded-[20px] border border-[#E5E7EB] bg-white shadow-[0_8px_28px_rgba(17,17,17,0.04)] md:hidden">
          <div className="p-6">
            <CopyBlock />
          </div>
          <div className="relative h-[250px] w-full overflow-hidden bg-[#f8fafc]">
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
