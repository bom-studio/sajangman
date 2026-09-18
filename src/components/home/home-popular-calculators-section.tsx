import Link from "next/link"
import { ArrowRight, Zap } from "lucide-react"

import { getHomeFeaturedCalculators } from "@/data/home"
import {
  RESOURCE_CATEGORY_BADGE_CLASS,
  RESOURCE_CATEGORY_MAP,
} from "@/data/resources/categories"
import { cn } from "@/lib/utils"

export function HomePopularCalculatorsSection() {
  const calculators = getHomeFeaturedCalculators()

  return (
    <section className="bg-white py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-[28px]">
              사장님들이 많이 찾는 계산기
            </h2>
            <p className="mt-1.5 text-sm text-[#64748B]">
              자주 필요한 계산을 빠르게 확인해보세요.
            </p>
          </div>
          <Link
            href="/calculators"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            전체 계산기 보기
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => {
            const Icon = calculator.icon
            const category = RESOURCE_CATEGORY_MAP[calculator.category]

            return (
              <Link
                key={calculator.href}
                href={calculator.href}
                className="group flex items-start gap-3 rounded-2xl border border-[#E2E8F0] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_28px_rgba(37,99,235,0.08)]"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={cn(
                        "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                        RESOURCE_CATEGORY_BADGE_CLASS[calculator.category]
                      )}
                    >
                      {category.label}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
                      <Zap className="size-3" />
                      {calculator.estimatedTime}
                    </span>
                  </div>

                  <div className="mt-3 flex items-start gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[15px] font-bold text-[#0F172A] group-hover:text-primary">
                        {calculator.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-[#64748B]">
                        {calculator.description}
                      </p>
                    </div>
                  </div>
                </div>

                <span className="mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
