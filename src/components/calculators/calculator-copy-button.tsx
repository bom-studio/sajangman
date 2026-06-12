"use client"

import { useEffect, useState } from "react"
import { Copy } from "lucide-react"

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

interface CalculatorCopyButtonProps {
  items?: CalculatorResultItem[]
  text?: string
  title?: string
}

export function CalculatorCopyButton({
  items,
  text,
  title,
}: CalculatorCopyButtonProps) {
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(false), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  async function handleCopy() {
    const content =
      text ?? (items ? buildResultCopyText(items, title) : "")

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
        <Copy className="size-4" />
        결과 복사
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
