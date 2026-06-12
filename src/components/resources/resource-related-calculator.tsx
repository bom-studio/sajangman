import Link from "next/link"
import { ArrowRight, Calculator } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { getCalculatorByHref } from "@/lib/resources/utils"

interface ResourceRelatedCalculatorProps {
  calculatorHref: string
}

export function ResourceRelatedCalculator({
  calculatorHref,
}: ResourceRelatedCalculatorProps) {
  const calculator = getCalculatorByHref(calculatorHref)

  if (!calculator) return null

  const Icon = calculator.icon

  return (
    <section className="rounded-xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8">
      <div className="flex items-start gap-4">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
          <Calculator className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-blue-700">관련 계산기</p>
          <h2 className="mt-1 text-lg font-bold text-foreground">
            {calculator.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {calculator.description}
          </p>
          <Link
            href={calculator.href}
            className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Icon className="size-4" />
            계산기 바로가기
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
