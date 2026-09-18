import Link from "next/link"
import { ArrowRight, Lightbulb } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HomeRequestsCtaSection() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 rounded-2xl border border-border/70 bg-[#F5F8FF] px-6 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <div className="flex gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Lightbulb className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
                사장만에 필요한 기능이 있으신가요?
              </h2>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-muted-foreground">
                필요한 계산기나 업무 기능을 알려주세요. 사장님들의 요청을
                참고해 새로운 기능을 추가합니다.
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:shrink-0">
            <Button asChild className="rounded-xl">
              <Link href="/requests/new">
                기능 요청하기
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-xl">
              <Link href="/requests">요청 목록 보기</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
