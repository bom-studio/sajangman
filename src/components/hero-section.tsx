import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

function HeroVisual() {
  return (
    <div className="relative flex w-full items-center justify-center overflow-visible lg:justify-end">
      <Image
        src="/home/hero.png"
        alt="부가세 계산기, 견적서 작성, 배달 마진 계산기 화면 미리보기"
        width={720}
        height={720}
        priority
        sizes="(max-width: 1024px) 100vw, 560px"
        className="h-auto w-full max-w-[420px] object-contain object-center lg:max-h-[420px] lg:max-w-[560px] lg:origin-right lg:translate-x-5 lg:scale-[1.12] lg:object-right"
      />
    </div>
  )
}

export function HeroSection() {
  return (
    <section className="overflow-x-hidden bg-[#F4F8FF]">
      <div className="mx-auto grid max-w-[1200px] items-center gap-8 px-4 pt-10 pb-9 sm:px-6 sm:pt-11 sm:pb-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-8 lg:px-8 lg:pt-14 lg:pb-11">
        <div className="min-w-0">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            자영업자를 위한 무료 업무 도구
          </span>

          <h1 className="mt-4 text-[36px] font-black leading-[1.08] tracking-[-0.04em] text-[#0F172A] sm:text-[44px] lg:text-[52px]">
            사장님,
            <br />
            <span className="text-primary">장사에만 집중하세요.</span>
          </h1>

          <p className="mt-5 max-w-xl text-[16px] leading-relaxed text-[#64748B] sm:text-[18px]">
            계산부터 문서 작성, 사업 운영 정보까지
            <br className="hidden sm:block" />
            사장님에게 필요한 업무 도구를 한곳에서 제공합니다.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-xl px-6 text-base"
            >
              <Link href="/calculators">
                계산기 바로가기
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl border-[#E2E8F0] bg-white px-6 text-base"
            >
              <Link href="/documents/estimate">견적서 작성하기</Link>
            </Button>
          </div>
        </div>

        <HeroVisual />
      </div>
    </section>
  )
}
