import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="bg-white pb-14 sm:pb-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-[22px] bg-[#0F2346] px-6 py-10 sm:px-8 lg:px-10">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_right,rgba(147,197,253,0.12),transparent_55%)]"
          />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <p className="text-sm font-medium text-[#93C5FD]">
                지금 바로 시작하세요
              </p>
              <h2 className="mt-2 text-[24px] font-black tracking-tight text-white sm:text-[30px]">
                복잡한 업무는 줄이고,
                <br className="sm:hidden" /> 장사에 더 집중하세요.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70 sm:text-[15px]">
                계산기, 문서작성, 사업 운영 자료를
                <br className="hidden sm:block" />
                회원가입 없이 바로 사용할 수 있습니다.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Button
                asChild
                size="lg"
                className="h-12 rounded-xl bg-white px-6 text-base text-[#0F2346] hover:bg-white/90"
              >
                <Link href="/calculators">
                  계산기 사용하기
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 rounded-xl border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white"
              >
                <Link href="/documents/estimate">견적서 작성하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
