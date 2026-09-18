import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { getHomeQuickStartItems } from "@/data/home"

export function QuickStartSection() {
  const items = getHomeQuickStartItems().slice(0, 3)

  return (
    <section className="bg-white pb-14 pt-12 sm:pb-16 sm:pt-14">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-[28px]">
              지금 바로 많이 쓰는 도구
            </h2>
            <p className="mt-1.5 text-sm text-[#64748B]">
              복잡한 가입 없이 바로 사용할 수 있어요.
            </p>
          </div>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            전체 도구 보기
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-3">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex min-h-[132px] items-start gap-4 rounded-[18px] border border-[#E2E8F0] bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_28px_rgba(37,99,235,0.08)]"
              >
                <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon className="size-6" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-[#0F172A] group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-[#64748B]">
                    {item.description}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                    바로가기
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
