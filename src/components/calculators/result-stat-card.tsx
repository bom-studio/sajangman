import type { ReactNode } from "react"

import { ResultStatusBadge } from "@/components/calculators/result-status-badge"
import { calculatorHighlightClass } from "@/components/calculators/calculator-styles"
import {
  RESULT_STATUS_CARD_CLASS,
  RESULT_STATUS_VALUE_CLASS,
  type ResultStatus,
} from "@/lib/calculators/result-status"
import { cn } from "@/lib/utils"

export interface ResultStatCardProps {
  label: string
  value: string
  highlight?: boolean
  emphasized?: boolean
  description?: string
  valueClassName?: string
  className?: string
  status?: ResultStatus
  statusLabel?: string
}

export function ResultStatCard({
  label,
  value,
  highlight = false,
  emphasized = false,
  description,
  valueClassName,
  className,
  status,
  statusLabel,
}: ResultStatCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-slate-200 bg-white p-5 transition-colors sm:p-6",
        highlight && !status && "border-blue-200 bg-blue-50/40",
        emphasized && !status && "border-blue-300 bg-blue-50/60 sm:col-span-2",
        status && RESULT_STATUS_CARD_CLASS[status],
        className
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm text-muted-foreground">{label}</p>
        {status && (
          <ResultStatusBadge status={status} label={statusLabel} />
        )}
      </div>
      <p
        className={cn(
          "mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl",
          highlight && !status && calculatorHighlightClass,
          emphasized && !status && calculatorHighlightClass,
          status && RESULT_STATUS_VALUE_CLASS[status],
          valueClassName
        )}
      >
        {value}
      </p>
      {description && (
        <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  )
}

export const CALCULATOR_RESULT_EMPTY_MESSAGE =
  "값을 입력 후 계산하기 버튼을 눌러주세요."

export function ResultStatGrid({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2", className)}>
      {children}
    </div>
  )
}

export function ResultStatEmptyState({
  message = CALCULATOR_RESULT_EMPTY_MESSAGE,
  className,
}: {
  message?: string
  className?: string
}) {
  return (
    <p
      className={cn(
        "rounded-xl border border-dashed border-slate-200 bg-slate-50/50 px-5 py-8 text-center text-sm leading-relaxed text-muted-foreground",
        className
      )}
    >
      {message}
    </p>
  )
}

export function ResultStatMessage({
  message,
  className,
}: {
  message: string
  className?: string
}) {
  return (
    <p
      className={cn(
        "rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-800",
        className
      )}
    >
      {message}
    </p>
  )
}
