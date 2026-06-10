"use client"

import { useEffect, useRef, useState } from "react"
import { Download } from "lucide-react"

import { EstimateForm } from "@/components/estimate/estimate-form"
import { EstimatePreview } from "@/components/estimate/estimate-preview"
import { EstimateToast } from "@/components/estimate/estimate-toast"
import { Button } from "@/components/ui/button"
import { getDefaultEstimateData, type EstimateData } from "@/lib/estimate"
import {
  downloadEstimatePdf,
  getEstimatePdfFilename,
} from "@/lib/estimate-pdf"
import { loadStoredSupplier, saveStoredSupplier } from "@/lib/estimate-storage"

export function EstimateGenerator() {
  const [data, setData] = useState<EstimateData>(getDefaultEstimateData)
  const [sealUrl, setSealUrl] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const stored = loadStoredSupplier()
    if (stored) {
      setData((prev) => ({
        ...prev,
        supplier: {
          companyName: stored.companyName,
          representative: stored.representative,
          businessNumber: stored.businessNumber,
          phone: stored.phone,
          email: stored.email,
          address: stored.address,
        },
      }))
      setSealUrl(stored.sealUrl)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveStoredSupplier(data.supplier, sealUrl)
  }, [data.supplier, sealUrl, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  async function handlePdfDownload() {
    if (!previewRef.current) return

    setIsDownloading(true)
    try {
      const filename = getEstimatePdfFilename(
        data.estimate.number,
        data.estimate.date
      )
      await downloadEstimatePdf(previewRef.current, filename)
      setToast({
        message: "PDF가 다운로드되었습니다.",
        variant: "success",
      })
    } catch {
      setToast({
        message: "PDF 생성 중 오류가 발생했습니다. 다시 시도해 주세요.",
        variant: "error",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 py-8 pb-24 sm:px-6 lg:px-8 xl:pb-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <div className="xl:w-[40%] xl:shrink-0">
            <p className="mb-4 text-sm font-medium text-muted-foreground lg:hidden">
              입력 폼
            </p>
            <EstimateForm data={data} onChange={setData} />
          </div>

          <div className="xl:w-[60%] xl:flex-1">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-muted-foreground">
                <span className="lg:hidden">미리보기</span>
                <span className="hidden lg:inline">실시간 미리보기</span>
              </p>
              <Button
                type="button"
                onClick={handlePdfDownload}
                disabled={isDownloading}
                className="hidden xl:inline-flex"
              >
                <Download className="size-4" />
                {isDownloading ? "PDF 생성 중..." : "PDF 다운로드"}
              </Button>
            </div>
            <EstimatePreview
              ref={previewRef}
              data={data}
              sealUrl={sealUrl}
              onSealChange={setSealUrl}
            />
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={handlePdfDownload}
        disabled={isDownloading}
        size="lg"
        className="fixed bottom-6 right-6 z-50 shadow-lg xl:hidden"
      >
        <Download className="size-4" />
        {isDownloading ? "PDF 생성 중..." : "PDF 다운로드"}
      </Button>

      {toast && (
        <EstimateToast
          message={toast.message}
          variant={toast.variant}
          className="bottom-24 xl:bottom-6"
        />
      )}
    </>
  )
}
