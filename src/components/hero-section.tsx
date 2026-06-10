import Link from "next/link"
import { ArrowRight, Calculator } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
            사장님, 장사만 하세요.
          </p>

          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            사장님, 장사만 하세요.
          </h1>

          <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            견적서 작성부터 계산기까지
            <br className="hidden sm:block" />
            사장님들이 자주 사용하는 무료 업무 도구를 제공합니다.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-xl px-6 text-base sm:w-auto"
            >
              <Link href="/documents/estimate">
                견적서 작성하기
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-xl px-6 text-base sm:w-auto"
            >
              <Link href="/calculators/delivery-margin">
                <Calculator className="size-4" />
                배달 마진 계산하기
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
