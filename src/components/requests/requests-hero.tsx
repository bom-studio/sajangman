import Link from "next/link"
import { ArrowRight, Lightbulb, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"

const BUBBLES = [
  { text: "직원 월급 계산기가 있으면 좋겠어요!", rotate: "-rotate-2", pos: "left-0 top-2" },
  { text: "세금계산서 작성 기능이 필요해요.", rotate: "rotate-2", pos: "right-0 top-16" },
  { text: "배달 마진 계산기 만들어주세요!", rotate: "-rotate-1", pos: "left-4 bottom-2" },
] as const

export function RequestsHero() {
  return (
    <section className="border-b border-border/60 bg-[#F5F8FF]">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div>
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            사장님과 함께 만드는 사장만
          </span>

          <h1 className="mt-5 text-[34px] font-black leading-[1.12] tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[52px]">
            사장만에 필요한
            <br />
            <span className="text-primary">기능을 알려주세요.</span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            장사하면서 필요했던 계산기, 문서, 정보가 있나요?
            <br className="hidden sm:block" />
            사장님들의 요청을 보고 실제 기능으로 만들어갑니다.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button asChild size="lg" className="h-12 rounded-xl px-6 text-base">
              <Link href="/requests/new">
                <Plus className="size-4" />
                기능 요청하기
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 rounded-xl px-6 text-base"
            >
              <a href="#roadmap">개발 로드맵 보기</a>
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            회원가입 없이 간편하게 의견을 남길 수 있어요.
          </p>
        </div>

        <div className="relative mx-auto w-full max-w-md lg:max-w-none">
          <div className="relative min-h-[280px] sm:min-h-[320px]">
            {BUBBLES.map((bubble) => (
              <div
                key={bubble.text}
                className={`absolute ${bubble.pos} z-10 max-w-[200px] rounded-2xl border border-border/70 bg-white px-3.5 py-2.5 text-[12px] leading-snug text-foreground shadow-sm ${bubble.rotate}`}
              >
                {bubble.text}
              </div>
            ))}

            <div className="absolute inset-x-8 top-14 bottom-8 rotate-2 rounded-[22px] border border-border/70 bg-white p-6 shadow-[0_16px_40px_rgba(37,99,235,0.08)] sm:inset-x-12">
              <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Lightbulb className="size-5" />
              </div>
              <p className="mt-5 text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
                사장님의
                <br />
                아이디어가
                <br />
                사장만을 더 좋게
                <br />
                만듭니다!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
