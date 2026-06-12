"use client"

import { useEffect, useState } from "react"
import { FileDown } from "lucide-react"

import { EstimateToast } from "@/components/estimate/estimate-toast"
import { Button } from "@/components/ui/button"
import {
  exportCalculatorPdf,
  type CalculatorPdfRow,
} from "@/lib/calculators/calculator-pdf"

interface CalculatorPdfButtonProps {
  title: string
  subtitle?: string
  filename: string
  rows: CalculatorPdfRow[]
}

export function CalculatorPdfButton({
  title,
  subtitle,
  filename,
  rows,
}: CalculatorPdfButtonProps) {
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(false)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(false), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  async function handleExport() {
    setLoading(true)
    try {
      await exportCalculatorPdf({ title, subtitle, rows, filename })
      setToast(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleExport}
        disabled={loading}
        data-html2canvas-ignore="true"
      >
        <FileDown className="size-4" />
        PDF 저장
      </Button>
      {toast && (
        <EstimateToast
          message="PDF가 저장되었습니다."
          variant="success"
          className="bottom-6"
        />
      )}
    </>
  )
}
