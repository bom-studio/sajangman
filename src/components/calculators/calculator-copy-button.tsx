"use client"

import { useEffect, useState } from "react"
import { Share2 } from "lucide-react"

import { EstimateToast } from "@/components/estimate/estimate-toast"
import { Button } from "@/components/ui/button"
import type { CalculatorResultItem } from "@/components/calculators/calculator-result-card"

export function buildResultCopyText(
  items: CalculatorResultItem[],
  title?: string
): string {
  const lines = title ? [title, ""] : []
  for (const item of items) {
    lines.push(`${item.label}: ${item.value}`)
  }
  return lines.join("\n")
}

export function buildFriendlyShareText(
  context: string,
  items: CalculatorResultItem[]
): string {
  const lines = [context]
  for (const item of items) {
    lines.push(`${item.label} ${item.value}`)
  }
  lines.push("", "사장만 계산기")
  return lines.join("\n")
}

interface CalculatorCopyButtonProps {
  items?: CalculatorResultItem[]
  text?: string
  title?: string
  context?: string
}

export function CalculatorCopyButton({
  items,
  text,
  title,
  context,
}: CalculatorCopyButtonProps) {
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(false), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  async function handleCopy() {
    const content =
      text ??
      (context && items
        ? buildFriendlyShareText(context, items)
        : items
          ? buildResultCopyText(items, title)
          : "")

    if (!content) return

    try {
      await navigator.clipboard.writeText(content)
      setToast(true)
    } catch {
      setToast(false)
    }
  }

  return (
    <>
      <Button type="button" variant="outline" size="sm" onClick={handleCopy}>
        <Share2 className="size-4" />
        결과 공유
      </Button>
      {toast && (
        <EstimateToast
          message="결과가 복사되었습니다."
          variant="success"
          className="bottom-6"
        />
      )}
    </>
  )
}
