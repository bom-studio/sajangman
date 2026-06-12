import { cn } from "@/lib/utils"

export const calculatorCardClass =
  "gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white py-0 shadow-sm"

export const calculatorCardHeaderClass =
  "border-b border-slate-200 px-6 py-4 !pb-4"

export const calculatorCardContentClass = "px-6 py-5"

export const calculatorSelectClassName = cn(
  "h-9 w-full min-w-0 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
)

export const calculatorHighlightClass = "text-blue-600"

export const calculatorResultRowClass =
  "flex items-center justify-between gap-3 border-b border-slate-100 pb-3 last:border-0 last:pb-0"
