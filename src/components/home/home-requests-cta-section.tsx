import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HomeRequestsCtaSection() {
  return (
    <section className="overflow-x-hidden bg-white py-8 sm:py-10">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="overflow-x-hidden rounded-[24px] bg-[#F4F8FF] px-5 py-10 sm:px-8 lg:overflow-visible lg:px-10 lg:py-11">
          <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-8">
            <div className="min-w-0">
              <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                사장님과 함께 만드는 사장만
              </span>
              <h2 className="mt-3.5 text-[28px] font-black tracking-tight text-[#0F172A] sm:text-[34px]">
                필요한 기능이 있으신가요?
              </h2>
              <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-[#64748B] sm:text-base">
                필요한 계산기나 업무 기능을 알려주세요.
                <br />
                사장님들의 요청을 참고해 새로운 기능을 추가합니다.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
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
                  <Link href="/requests">요청 목록 보기</Link>
                </Button>
              </div>
            </div>

            <div className="relative flex w-full items-center justify-center overflow-visible lg:justify-end">
              <Image
                src="/home/request.png"
                alt="기능 요청 아이디어와 요청 카드 일러스트"
                width={640}
                height={640}
                sizes="(max-width: 1024px) 100vw, 560px"
                className="h-auto w-full max-w-[520px] object-contain object-center lg:max-h-[280px] lg:max-w-[560px] lg:object-right lg:scale-[1.15] lg:origin-right"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
