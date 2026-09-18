import Link from "next/link"
import { ArrowRight, Calculator, FileText, Sparkles } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AI_FEATURES_ENABLED } from "@/lib/features"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-20%,rgba(37,99,235,0.12),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            <span className="text-primary">사장</span>만
          </h1>
          <p className="mt-4 text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            사장님, 장사만 하세요.
          </p>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
            자영업자·소상공인이 운영에 필요한 숫자와 정보를
            <br className="hidden sm:block" />
            빠르게 확인할 수 있는 무료 실무 도구입니다.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-xl px-6 text-base sm:w-auto"
            >
              <Link href="/calculators">
                <Calculator className="size-4" />
                계산기 바로가기
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 w-full rounded-xl px-6 text-base sm:w-auto"
            >
              <Link href="/documents/estimate">
                <FileText className="size-4" />
                견적서 작성하기
              </Link>
            </Button>
            {AI_FEATURES_ENABLED ? (
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-12 w-full rounded-xl px-6 text-base sm:w-auto"
              >
                <Link href="/ai">
                  <Sparkles className="size-4" />
                  AI 생성기 사용하기
                </Link>
              </Button>
            ) : null}
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            무료 사용 · 회원가입 없이 이용 가능 · 자영업자 맞춤 도구
          </p>
        </div>
      </div>
    </section>
  )
}
