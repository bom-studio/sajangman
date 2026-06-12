import type { ReactNode, RefObject } from "react"

import { RelatedCalculators } from "@/components/calculators/related-calculators"
import { RelatedResourceGuides } from "@/components/resources/related-resource-guides"
import { cn } from "@/lib/utils"

interface CalculatorPageLayoutProps {
  input: ReactNode
  result: ReactNode
  resultRef?: RefObject<HTMLDivElement | null>
  resultId?: string
  extensions?: ReactNode
  seo?: ReactNode
  excludeHref: string
  className?: string
}

export function CalculatorPageLayout({
  input,
  result,
  resultRef,
  resultId,
  extensions,
  seo,
  excludeHref,
  className,
}: CalculatorPageLayoutProps) {
  return (
    <div
      className={cn(
        "mx-auto max-w-[1440px] px-4 pb-8 pt-6 sm:px-6 lg:px-8",
        className
      )}
    >
      <div className="flex flex-col gap-6 sm:gap-8 xl:flex-row xl:items-start">
        <div className="w-full xl:w-[35%] xl:shrink-0">{input}</div>
        <div
          ref={resultRef}
          id={resultId}
          className="scroll-mt-6 w-full space-y-6 xl:w-[65%] xl:flex-1"
        >
          {result}
        </div>
      </div>

      {extensions}

      {seo}

      <RelatedResourceGuides calculatorHref={excludeHref} className="mt-16" />
      <RelatedCalculators excludeHref={excludeHref} className="mt-16" />
    </div>
  )
}
