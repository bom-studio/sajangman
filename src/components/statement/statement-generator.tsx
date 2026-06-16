"use client"

import { useEffect, useState } from "react"
import { Download } from "lucide-react"

import { EstimateToast } from "@/components/estimate/estimate-toast"
import { StatementForm } from "@/components/statement/statement-form"
import { StatementPreview } from "@/components/statement/statement-preview"
import { Button } from "@/components/ui/button"
import { loadStoredSupplier, saveStoredSupplier } from "@/lib/estimate-storage"
import {
  loadStoredBankAccount,
  saveStoredBankAccount,
} from "@/lib/statement-storage"
import {
  downloadStatementPdf,
  getStatementDocumentElement,
  getStatementPdfFilename,
} from "@/lib/statement-pdf"
import { getDefaultStatementData, type StatementData } from "@/lib/statement"

export function StatementGenerator() {
  const [data, setData] = useState<StatementData>(getDefaultStatementData)
  const [sealUrl, setSealUrl] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  useEffect(() => {
    const storedSupplier = loadStoredSupplier()
    const storedBankAccount = loadStoredBankAccount()

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
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveStoredSupplier(data.supplier, sealUrl)
    saveStoredBankAccount(data.bankAccount)
  }, [data.supplier, data.bankAccount, sealUrl, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

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
      <div className="mx-auto max-w-[1440px] px-4 py-8 pb-24 sm:px-6 lg:px-8 xl:pb-8">
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
              className="mb-4 flex items-center justify-between gap-4"
            >
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
            <StatementPreview data={data} sealUrl={sealUrl} />
          </div>
        </div>
      </div>

      <Button
        type="button"
        onClick={handlePdfDownload}
        disabled={isDownloading}
        size="lg"
        data-html2canvas-ignore="true"
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
