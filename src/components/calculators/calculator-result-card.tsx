import type { ReactNode } from "react"

import { CalculatorResultActions } from "@/components/calculators/calculator-result-actions"
import {
  CALCULATOR_RESULT_EMPTY_MESSAGE,
  ResultStatCard,
  ResultStatEmptyState,
  ResultStatGrid,
  ResultStatMessage,
} from "@/components/calculators/result-stat-card"
import {
  calculatorCardClass,
  calculatorCardContentClass,
  calculatorCardHeaderClass,
} from "@/components/calculators/calculator-styles"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import type { CalculatorPdfRow } from "@/lib/calculators/calculator-pdf"
import type { ResultStatus } from "@/lib/calculators/result-status"
import { cn } from "@/lib/utils"

export interface CalculatorResultItem {
  label: string
  value: string
  highlight?: boolean
  emphasized?: boolean
  valueClassName?: string
  description?: string
  className?: string
  status?: ResultStatus
}

interface CalculatorResultCardProps {
  title?: string
  description?: string
  items?: CalculatorResultItem[]
  children?: ReactNode
  headerAction?: ReactNode
  copyText?: string
  copyTitle?: string
  shareContext?: string
  showCopy?: boolean
  showPdf?: boolean
  pdfTitle?: string
  pdfSubtitle?: string
  pdfFilename?: string
  pdfRows?: CalculatorPdfRow[]
  visualization?: ReactNode
  footer?: ReactNode
  message?: string | null
  emptyMessage?: string
  className?: string
}

export function CalculatorResultMetrics({
  items,
  message,
  emptyMessage = CALCULATOR_RESULT_EMPTY_MESSAGE,
  className,
}: {
  items?: CalculatorResultItem[]
  message?: string | null
  emptyMessage?: string
  className?: string
}) {
  if (message) {
    return <ResultStatMessage message={message} className={className} />
  }

  if (items?.length) {
    return (
      <ResultStatGrid className={className}>
        {items.map((item) => (
          <ResultStatCard key={item.label} {...item} />
        ))}
      </ResultStatGrid>
    )
  }

  return <ResultStatEmptyState message={emptyMessage} className={className} />
}

export function CalculatorResultCard({
  title = "계산 결과",
  description,
  items,
  children,
  headerAction,
  copyText,
  copyTitle,
  shareContext,
  showCopy = true,
  showPdf = false,
  pdfTitle,
  pdfSubtitle,
  pdfFilename,
  pdfRows,
  visualization,
  footer,
  message,
  emptyMessage = CALCULATOR_RESULT_EMPTY_MESSAGE,
  className,
}: CalculatorResultCardProps) {
  const hasItems = Boolean(items && items.length > 0)
  const actions =
    headerAction ??
    (hasItems ? (
      <CalculatorResultActions
        items={items}
        shareText={copyText}
        shareTitle={copyTitle ?? title}
        shareContext={shareContext}
        showShare={showCopy}
        showPdf={showPdf}
        pdfTitle={pdfTitle}
        pdfSubtitle={pdfSubtitle}
        pdfFilename={pdfFilename}
        pdfRows={pdfRows}
      />
    ) : null)

  return (
    <Card className={cn(calculatorCardClass, className)}>
      <CardHeader className={calculatorCardHeaderClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-4", calculatorCardContentClass)}>
        {message ? (
          <ResultStatMessage message={message} />
        ) : hasItems ? (
          <ResultStatGrid>
            {items!.map((item) => (
              <ResultStatCard key={item.label} {...item} />
            ))}
          </ResultStatGrid>
        ) : children ? (
          children
        ) : (
          <ResultStatEmptyState message={emptyMessage} />
        )}

        {visualization}
        {footer}
      </CardContent>
    </Card>
  )
}

export {
  CALCULATOR_RESULT_EMPTY_MESSAGE,
  ResultStatCard,
  ResultStatEmptyState,
  ResultStatGrid,
  ResultStatMessage,
} from "@/components/calculators/result-stat-card"
