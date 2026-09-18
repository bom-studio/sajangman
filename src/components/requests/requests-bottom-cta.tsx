import Link from "next/link"
import { ArrowRight, Megaphone } from "lucide-react"

import { Button } from "@/components/ui/button"

export function RequestsBottomCta() {
  return (
    <section className="rounded-2xl border border-primary/15 bg-[#F5F8FF] px-6 py-10 sm:px-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-4">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Megaphone className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              찾는 기능이 없으신가요?
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              사장님들의 소중한 의견이 더 좋은 사장만을 만듭니다.
              필요한 기능을 알려주시면 빠르게 검토하고 반영하겠습니다.
            </p>
          </div>
        </div>
        <Button asChild size="lg" className="h-12 shrink-0 rounded-xl px-6">
          <Link href="/requests/new">
            기능 요청하기
            <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>
    </section>
  )
}
