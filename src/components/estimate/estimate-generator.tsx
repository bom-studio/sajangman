"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { DocumentEditorActions } from "@/components/documents/document-editor-actions"
import { EstimateForm } from "@/components/estimate/estimate-form"
import { EstimatePreview } from "@/components/estimate/estimate-preview"
import { EstimateToast } from "@/components/estimate/estimate-toast"
import { useSavedDocumentLoader } from "@/hooks/use-saved-document-loader"
import { getDefaultEstimateData, type EstimateData } from "@/lib/estimate"
import {
  downloadEstimatePdf,
  getEstimateDocumentElement,
  getEstimatePdfFilename,
} from "@/lib/estimate-pdf"
import { saveStoredSupplier } from "@/lib/estimate-storage"
import { buildSupplierSnapshot } from "@/lib/document-metadata"
import { saveDocument } from "@/lib/documents"
import { loadInitialSupplier } from "@/lib/supplier-hydration"
import type { SavedDocument } from "@/types/documents"

export function EstimateGenerator() {
  const searchParams = useSearchParams()
  const docIdParam = searchParams.get("docId")
  const [data, setData] = useState<EstimateData>(getDefaultEstimateData)
  const [sealUrl, setSealUrl] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  const applyLoadedDocument = useCallback((document: SavedDocument) => {
    const payload = document.documentData as {
      data?: EstimateData
      sealUrl?: string | null
    }

    if (payload.data) {
      setData(payload.data)
    }

    const nextSeal =
      payload.sealUrl ??
      (document.supplierSnapshot.sealUrl as string | null | undefined) ??
      null
    setSealUrl(nextSeal)
    setHydrated(true)
  }, [])

  const { documentId, setDocumentId } = useSavedDocumentLoader({
    documentType: "estimate",
    onLoad: applyLoadedDocument,
  })

  useEffect(() => {
    if (docIdParam) return

    let cancelled = false

    async function hydrateSupplier() {
      const stored = await loadInitialSupplier()
      if (cancelled) return

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
    }

    hydrateSupplier()

    return () => {
      cancelled = true
    }
  }, [docIdParam])

  useEffect(() => {
    if (!hydrated) return
    saveStoredSupplier(data.supplier, sealUrl)
  }, [data.supplier, sealUrl, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  async function handleSave() {
    const result = await saveDocument(
      {
        documentType: "estimate",
        documentData: { data, sealUrl },
        supplierSnapshot: buildSupplierSnapshot(
          data.supplier as unknown as Record<string, unknown>,
          sealUrl
        ),
        customerSnapshot: data.customer as unknown as Record<string, unknown>,
      },
      documentId
    )

    if (result.error) {
      setToast({ message: result.error, variant: "error" })
      return { error: result.error }
    }

    if (result.data) {
      setDocumentId(result.data.id)
    }

    setToast({ message: "문서가 저장되었습니다.", variant: "success" })
    return { error: null }
  }

  async function handlePdfDownload() {
    setIsDownloading(true)

    try {
      const element = getEstimateDocumentElement()

      if (!element) {
        setToast({
          message:
            "견적서 문서 영역을 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.",
          variant: "error",
        })
        return
      }

      const filename = getEstimatePdfFilename(
        data.estimate.number,
        data.estimate.date
      )

      await downloadEstimatePdf(element, filename)

      setToast({
        message: "PDF가 다운로드되었습니다.",
        variant: "success",
      })
    } catch (error) {
      console.error("PDF 생성 실패:", error)
      setToast({
        message: "PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.",
        variant: "error",
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <>
      <div className="mx-auto max-w-[1440px] px-4 py-8 pb-32 sm:px-6 lg:px-8 xl:pb-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <div className="xl:w-[40%] xl:shrink-0">
            <p className="mb-4 text-sm font-medium text-muted-foreground lg:hidden">
              입력 폼
            </p>
            <EstimateForm
              data={data}
              onChange={setData}
              sealUrl={sealUrl}
              onSealChange={setSealUrl}
            />
          </div>

          <div className="xl:w-[60%] xl:flex-1">
            <div
              data-html2canvas-ignore="true"
              className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <p className="text-sm font-medium text-muted-foreground">
                <span className="lg:hidden">미리보기</span>
                <span className="hidden lg:inline">실시간 미리보기</span>
              </p>
              <DocumentEditorActions
                className="hidden xl:flex"
                onSave={handleSave}
                onPdfDownload={handlePdfDownload}
                isPdfDownloading={isDownloading}
              />
            </div>
            <EstimatePreview data={data} sealUrl={sealUrl} />
          </div>
        </div>
      </div>

      <div
        data-html2canvas-ignore="true"
        className="fixed bottom-6 right-6 z-50 xl:hidden"
      >
        <DocumentEditorActions
          variant="mobile"
          onSave={handleSave}
          onPdfDownload={handlePdfDownload}
          isPdfDownloading={isDownloading}
        />
      </div>

      {toast && (
        <EstimateToast
          message={toast.message}
          variant={toast.variant}
          className="bottom-32 xl:bottom-6"
        />
      )}
    </>
  )
}
