import type { ReactNode } from "react"

import { CalculatorCopyButton } from "@/components/calculators/calculator-copy-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  calculatorCardClass,
  calculatorCardContentClass,
  calculatorCardHeaderClass,
  calculatorHighlightClass,
} from "@/components/calculators/calculator-styles"
import { cn } from "@/lib/utils"

export interface CalculatorResultItem {
  label: string
  value: string
  highlight?: boolean
  valueClassName?: string
  description?: string
}

interface CalculatorResultCardProps {
  title?: string
  description?: string
  items?: CalculatorResultItem[]
  children?: ReactNode
  headerAction?: ReactNode
  copyText?: string
  copyTitle?: string
  showCopy?: boolean
  footer?: ReactNode
  message?: string | null
  emptyMessage?: string
  className?: string
}

function ResultMetric({
  item,
}: {
  item: CalculatorResultItem
}) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-slate-50/60 p-5 transition-colors",
        item.highlight && "border-blue-200 bg-blue-50/50"
      )}
    >
      <p
        className={cn(
          "text-3xl font-bold tracking-tight text-foreground sm:text-4xl",
          item.highlight && calculatorHighlightClass,
          item.valueClassName
        )}
      >
        {item.value}
      </p>
      <p className="mt-2 text-sm text-muted-foreground">{item.label}</p>
      {item.description && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground/80">
          {item.description}
        </p>
      )}
    </div>
  )
}

export function CalculatorResultMetrics({
  items,
  message,
  emptyMessage = "금액을 입력한 뒤 계산하기를 눌러주세요.",
  className,
}: {
  items?: CalculatorResultItem[]
  message?: string | null
  emptyMessage?: string
  className?: string
}) {
  if (message) {
    return (
      <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
        {message}
      </p>
    )
  }

  if (items?.length) {
    return (
      <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
        {items.map((item) => (
          <ResultMetric key={item.label} item={item} />
        ))}
      </div>
    )
  }

  return (
    <p className="text-sm leading-relaxed text-muted-foreground">
      {emptyMessage}
    </p>
  )
}

export function CalculatorResultCard({
  title = "계산 결과",
  description,
  items,
  children,
  headerAction,
  copyText,
  copyTitle,
  showCopy = true,
  footer,
  message,
  emptyMessage = "금액을 입력한 뒤 계산하기를 눌러주세요.",
  className,
}: CalculatorResultCardProps) {
  const hasItems = Boolean(items && items.length > 0)
  const copyAction =
    showCopy && hasItems ? (
      <CalculatorCopyButton
        items={items}
        text={copyText}
        title={copyTitle ?? title}
      />
    ) : null

  return (
    <Card className={cn(calculatorCardClass, className)}>
      <CardHeader className={calculatorCardHeaderClass}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {copyAction}
            {headerAction}
          </div>
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-4", calculatorCardContentClass)}>
        {message ? (
          <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800">
            {message}
          </p>
        ) : hasItems ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items!.map((item) => (
              <ResultMetric key={item.label} item={item} />
            ))}
          </div>
        ) : children ? (
          children
        ) : (
          <p className="text-sm leading-relaxed text-muted-foreground">
            {emptyMessage}
          </p>
        )}

        {footer}
      </CardContent>
    </Card>
  )
}
