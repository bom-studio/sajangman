import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-primary px-6 py-14 text-center sm:px-12 sm:py-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)]" />

          <div className="relative mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              무료로 시작하는 사장님 업무 도구
            </h2>
            <p className="mt-4 text-base leading-relaxed text-blue-100 sm:text-lg">
              복잡한 가입 없이 필요한 도구를 바로 사용하고, 문서 작성과 계산
              업무를 빠르게 끝내세요.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button
                asChild
                size="lg"
                variant="secondary"
                className="h-12 w-full rounded-xl bg-white px-6 text-base text-primary hover:bg-white/90 sm:w-auto"
              >
                <Link href="/documents/estimate">
                  견적서 작성하기
                  <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="h-12 w-full rounded-xl border-white/30 bg-transparent px-6 text-base text-white hover:bg-white/10 hover:text-white sm:w-auto"
              >
                <Link href="/calculators/delivery-margin">
                  배달 마진 계산하기
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
