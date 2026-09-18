import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function RequestsHero() {
  return (
    <section className="overflow-x-hidden bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-[30px] bg-[#F3F7FF] px-7 py-10 sm:px-10 sm:py-12 lg:px-14 lg:py-12">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
            <div className="min-w-0">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                사장님과 함께 만드는 사장만
              </span>

              <h1 className="mt-4 text-[32px] font-black leading-[1.12] tracking-[-0.04em] text-[#0F172A] sm:text-[38px] lg:text-[42px]">
                필요한 기능이 있으신가요?
              </h1>

              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#64748B] sm:text-base">
                필요한 계산기나 업무 기능을 알려주세요.
                <br />
                사장님들의 요청을 참고해 새로운 기능을 추가합니다.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-11 rounded-xl px-5">
                  <Link href="/requests/new">
                    기능 요청하기
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-11 rounded-xl border-[#E2E8F0] bg-white px-5"
                >
                  <a href="#request-list">요청 목록 보기</a>
                </Button>
              </div>
            </div>

            <div className="relative flex w-full items-center justify-center lg:justify-end">
              <Image
                src="/requests/hero.png"
                alt="사장만 기능 요청 - 필요한 계산기와 업무 기능 제안"
                width={700}
                height={500}
                priority
                sizes="(max-width: 768px) 100vw, 500px"
                className="h-auto w-full max-w-[480px] object-contain object-center sm:max-w-[500px] lg:max-w-[520px] lg:object-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
