"use client"

import { cn } from "@/lib/utils"

interface EstimateToastProps {
  message: string
  variant?: "error" | "success"
  className?: string
}

export function EstimateToast({
  message,
  variant = "error",
  className,
}: EstimateToastProps) {
  return (
    <div
      role="alert"
      className={cn(
        "fixed left-1/2 z-[60] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-xl border px-4 py-3 text-sm shadow-lg",
        variant === "error"
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-primary/30 bg-primary/10 text-primary",
        className
      )}
    >
      {message}
    </div>
  )
}
