import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { CalculatorCard } from "@/components/calculators/calculator-card"
import { HomeSectionHeader } from "@/components/home/home-section-header"
import { Button } from "@/components/ui/button"
import { getHomeFeaturedCalculators } from "@/data/home"

export function HomePopularCalculatorsSection() {
  const calculators = getHomeFeaturedCalculators()

  return (
    <section className="bg-slate-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <HomeSectionHeader title="사장님들이 많이 찾는 계산기" />
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/calculators">
              전체 계산기 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((calculator) => (
            <CalculatorCard key={calculator.href} calculator={calculator} />
          ))}
        </div>
      </div>
    </section>
  )
}
