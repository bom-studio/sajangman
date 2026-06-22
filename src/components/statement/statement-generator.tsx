"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

import { DocumentEditorActions } from "@/components/documents/document-editor-actions"
import { EstimateToast } from "@/components/estimate/estimate-toast"
import { StatementForm } from "@/components/statement/statement-form"
import { StatementPreview } from "@/components/statement/statement-preview"
import { useSavedDocumentLoader } from "@/hooks/use-saved-document-loader"
import { buildSupplierSnapshot } from "@/lib/document-metadata"
import { saveDocument } from "@/lib/documents"
import { saveStoredSupplier } from "@/lib/estimate-storage"
import { loadInitialSupplier } from "@/lib/supplier-hydration"
import {
  loadStoredBankAccount,
  saveStoredBankAccount,
  saveStatementDraft,
} from "@/lib/statement-storage"
import {
  downloadStatementPdf,
  getStatementDocumentElement,
  getStatementPdfFilename,
} from "@/lib/statement-pdf"
import { getDefaultStatementData, type StatementData } from "@/lib/statement"
import type { SavedDocument } from "@/types/documents"

export function StatementGenerator() {
  const searchParams = useSearchParams()
  const docIdParam = searchParams.get("docId")
  const [data, setData] = useState<StatementData>(getDefaultStatementData)
  const [sealUrl, setSealUrl] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  const applyLoadedDocument = useCallback((document: SavedDocument) => {
    const payload = document.documentData as {
      data?: StatementData
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
    documentType: "statement",
    onLoad: applyLoadedDocument,
  })

  useEffect(() => {
    if (docIdParam) return

    let cancelled = false

    async function hydrate() {
      const storedSupplier = await loadInitialSupplier()
      const storedBankAccount = loadStoredBankAccount()

      if (cancelled) return

      setData((prev) => ({
        ...prev,
        ...(storedSupplier && {
          supplier: {
            companyName: storedSupplier.companyName,
            representative: storedSupplier.representative,
            businessNumber: storedSupplier.businessNumber,
            phone: storedSupplier.phone,
            email: storedSupplier.email,
            address: storedSupplier.address,
          },
        }),
        ...(storedBankAccount && {
          bankAccount: storedBankAccount,
        }),
      }))

      if (storedSupplier) {
        setSealUrl(storedSupplier.sealUrl)
      }
      setHydrated(true)
    }

    hydrate()

    return () => {
      cancelled = true
    }
  }, [docIdParam])

  useEffect(() => {
    if (!hydrated) return
    saveStoredSupplier(data.supplier, sealUrl)
    saveStoredBankAccount(data.bankAccount)
    saveStatementDraft(data)
  }, [data, sealUrl, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  async function handleSave() {
    const result = await saveDocument(
      {
        documentType: "statement",
        documentData: { data, sealUrl },
        supplierSnapshot: buildSupplierSnapshot(
          data.supplier as unknown as Record<string, unknown>,
          sealUrl
        ),
        customerSnapshot: data.recipient as unknown as Record<string, unknown>,
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
      const element = getStatementDocumentElement()

      if (!element) {
        setToast({
          message:
            "거래명세서 문서 영역을 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.",
          variant: "error",
        })
        return
      }

      const filename = getStatementPdfFilename(
        data.transaction.number,
        data.transaction.date
      )

      await downloadStatementPdf(element, filename)

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
            <StatementForm
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
            <StatementPreview data={data} sealUrl={sealUrl} />
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
