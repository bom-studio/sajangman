"use client"

import { CalculatorCopyButton } from "@/components/calculators/calculator-copy-button"
import { CalculatorPdfButton } from "@/components/calculators/calculator-pdf-button"
import type { CalculatorResultItem } from "@/components/calculators/calculator-result-card"
import type { CalculatorPdfRow } from "@/lib/calculators/calculator-pdf"

interface CalculatorResultActionsProps {
  items?: CalculatorResultItem[]
  shareText?: string
  shareTitle?: string
  shareContext?: string
  pdfTitle?: string
  pdfSubtitle?: string
  pdfFilename?: string
  pdfRows?: CalculatorPdfRow[]
  showShare?: boolean
  showPdf?: boolean
}

export function CalculatorResultActions({
  items,
  shareText,
  shareTitle,
  shareContext,
  pdfTitle,
  pdfSubtitle,
  pdfFilename,
  pdfRows,
  showShare = true,
  showPdf = false,
}: CalculatorResultActionsProps) {
  const hasShare = showShare && (shareText || (items && items.length > 0))
  const hasPdf = showPdf && pdfTitle && pdfFilename && pdfRows?.length

  if (!hasShare && !hasPdf) return null

  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasShare && (
        <CalculatorCopyButton
          items={items}
          text={shareText}
          title={shareTitle}
          context={shareContext}
        />
      )}
      {hasPdf && (
        <CalculatorPdfButton
          title={pdfTitle!}
          subtitle={pdfSubtitle}
          filename={pdfFilename!}
          rows={pdfRows!}
        />
      )}
    </div>
  )
}
