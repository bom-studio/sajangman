"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle, Printer } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { DocumentEditorActions } from "@/components/documents/document-editor-actions"
import { EstimateToast } from "@/components/estimate/estimate-toast"
import { TransactionConfirmationForm } from "@/components/transaction-confirmation/transaction-confirmation-form"
import { TransactionConfirmationPreview } from "@/components/transaction-confirmation/transaction-confirmation-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSavedDocumentLoader } from "@/hooks/use-saved-document-loader"
import { buildSupplierSnapshot } from "@/lib/document-metadata"
import { saveDocument } from "@/lib/documents"
import { saveStoredSupplier } from "@/lib/estimate-storage"
import { loadInitialSupplier } from "@/lib/supplier-hydration"
import {
  TRANSACTION_CONFIRMATION_FAQ_ITEMS,
  TRANSACTION_CONFIRMATION_GUIDE_DESCRIPTION,
  TRANSACTION_CONFIRMATION_GUIDE_ITEMS,
} from "@/lib/faq/transaction-confirmation-faq"
import {
  calculateTransactionConfirmation,
  formatKRW,
  getDefaultTransactionConfirmationData,
  validateTransactionConfirmation,
  type TransactionConfirmationData,
} from "@/lib/transaction-confirmation"
import {
  downloadTransactionConfirmationPdf,
  getTransactionConfirmationDocumentElement,
  getTransactionConfirmationPdfFilename,
} from "@/lib/transaction-confirmation-pdf"
import type { SavedDocument } from "@/types/documents"

const RELATED_DOCUMENTS = [
  { title: "견적서 생성기", href: "/documents/estimate" },
  { title: "발주서 생성기", href: "/documents/purchase-order" },
  { title: "납품서 생성기", href: "/documents/delivery-note" },
  { title: "거래명세서 생성기", href: "/documents/statement" },
  { title: "물품공급계약서 생성기", href: "/documents/supply-contract" },
] as const

const RELATED_CALCULATORS = [
  { title: "부가세 계산기", href: "/calculators/vat" },
  { title: "원가율 계산기", href: "/calculators/cost-rate" },
  { title: "손익분기점 계산기", href: "/calculators/break-even" },
  { title: "카드 수수료 계산기", href: "/calculators/card-fee" },
] as const

function applyStoredSupplier(
  data: TransactionConfirmationData,
  stored: Awaited<ReturnType<typeof loadInitialSupplier>>
): TransactionConfirmationData {
  if (!stored) return data

  return {
    ...data,
    supplier: {
      ...data.supplier,
      companyName: stored.companyName,
      representative: stored.representative,
      businessNumber: stored.businessNumber,
      phone: stored.phone,
      address: stored.address,
    },
  }
}

export function TransactionConfirmationGenerator() {
  const searchParams = useSearchParams()
  const docIdParam = searchParams.get("docId")
  const [data, setData] = useState<TransactionConfirmationData>(
    getDefaultTransactionConfirmationData
  )
  const [supplierSealUrl, setSupplierSealUrl] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  const totals = calculateTransactionConfirmation(data.items)

  const applyLoadedDocument = useCallback((document: SavedDocument) => {
    const payload = document.documentData as {
      data?: TransactionConfirmationData
      supplierSealUrl?: string | null
    }

    if (payload.data) {
      setData(payload.data)
    }

    const nextSeal =
      payload.supplierSealUrl ??
      (document.supplierSnapshot.sealUrl as string | null | undefined) ??
      null
    setSupplierSealUrl(nextSeal)
    setHydrated(true)
  }, [])

  const { documentId, setDocumentId } = useSavedDocumentLoader({
    documentType: "transaction_confirmation",
    onLoad: applyLoadedDocument,
  })

  useEffect(() => {
    if (docIdParam) return

    let cancelled = false

    async function hydrate() {
      const storedSupplier = await loadInitialSupplier()
      if (cancelled) return

      setData((prev) => applyStoredSupplier(prev, storedSupplier))
      setSupplierSealUrl(storedSupplier?.sealUrl ?? null)
      setHydrated(true)
    }

    hydrate()

    return () => {
      cancelled = true
    }
  }, [docIdParam])

  useEffect(() => {
    if (!hydrated) return

    saveStoredSupplier(
      {
        companyName: data.supplier.companyName,
        representative: data.supplier.representative,
        businessNumber: data.supplier.businessNumber,
        phone: data.supplier.phone,
        email: "",
        address: data.supplier.address,
      },
      supplierSealUrl
    )
  }, [data.supplier, supplierSealUrl, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  function handleReset() {
    const fresh = getDefaultTransactionConfirmationData()
    setData({
      ...fresh,
      supplier: data.supplier,
    })
    setSupplierSealUrl(supplierSealUrl)
  }

  function handlePrint() {
    const validationError = validateTransactionConfirmation(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }
    window.print()
  }

  async function handleSave() {
    const result = await saveDocument(
      {
        documentType: "transaction_confirmation",
        documentData: { data, supplierSealUrl },
        supplierSnapshot: buildSupplierSnapshot(
          data.supplier as unknown as Record<string, unknown>,
          supplierSealUrl
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
    const validationError = validateTransactionConfirmation(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }

    setIsDownloading(true)

    try {
      const element = getTransactionConfirmationDocumentElement()
      if (!element) {
        setToast({
          message:
            "거래확인서 문서 영역을 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.",
          variant: "error",
        })
        return
      }

      const filename = getTransactionConfirmationPdfFilename(
        data.recipient.companyName,
        data.transaction.writtenDate
      )

      await downloadTransactionConfirmationPdf(element, filename)
      setToast({ message: "PDF가 다운로드되었습니다.", variant: "success" })
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
            <TransactionConfirmationForm
              data={data}
              onChange={setData}
              supplierSealUrl={supplierSealUrl}
              onSupplierSealChange={setSupplierSealUrl}
              onReset={handleReset}
            />
          </div>

          <div className="xl:w-[60%] xl:flex-1">
            <div
              data-html2canvas-ignore="true"
              className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm font-medium text-muted-foreground">
                <span className="lg:hidden">미리보기</span>
                <span className="hidden lg:inline">실시간 미리보기 (A4)</span>
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrint}
                  className="hidden sm:inline-flex"
                >
                  <Printer className="size-4" />
                  인쇄하기
                </Button>
                <DocumentEditorActions
                  className="hidden xl:flex"
                  onSave={handleSave}
                  onPdfDownload={handlePdfDownload}
                  isPdfDownloading={isDownloading}
                />
              </div>
            </div>

            <TransactionConfirmationPreview
              data={data}
              supplierSealUrl={supplierSealUrl}
            />

            <Card
              data-html2canvas-ignore="true"
              className="mt-5 gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 shadow-sm"
            >
              <CardHeader className="border-b border-border/60 px-6 py-4 !pb-4">
                <CardTitle className="text-base">계산 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-6 py-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 거래 건수</span>
                  <span className="font-medium">
                    {totals.transactionCount}건
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 공급가액</span>
                  <span className="font-medium">
                    {formatKRW(totals.supplyAmount)}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 부가세</span>
                  <span className="font-medium">{formatKRW(totals.vat)}원</span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-2 text-base">
                  <span className="font-semibold">총 거래금액</span>
                  <span className="font-bold text-primary">
                    {formatKRW(totals.total)}원
                  </span>
                </div>
              </CardContent>
            </Card>

            <div
              data-html2canvas-ignore="true"
              className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950"
            >
              <AlertCircle className="mt-0.5 size-4 shrink-0" />
              <p>
                본 거래확인서는 거래 사실을 정리하고 확인하기 위한 참고용
                문서입니다. 세무 신고용 증빙은 거래명세서, 세금계산서,
                현금영수증 등 별도 증빙자료를 함께 보관하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <CalculatorFaq
            title="거래확인서 가이드"
            description={TRANSACTION_CONFIRMATION_GUIDE_DESCRIPTION}
            items={TRANSACTION_CONFIRMATION_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={TRANSACTION_CONFIRMATION_FAQ_ITEMS}
            defaultOpenFirst={false}
          />

          <section>
            <h2 className="mb-4 text-lg font-semibold">관련 문서</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {RELATED_DOCUMENTS.map((doc) => (
                <Link
                  key={doc.href}
                  href={doc.href}
                  className="rounded-xl border border-border/70 px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  {doc.title}
                </Link>
              ))}
            </div>
          </section>

          <section>
            <h2 className="mb-4 text-lg font-semibold">관련 계산기</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {RELATED_CALCULATORS.map((calc) => (
                <Link
                  key={calc.href}
                  href={calc.href}
                  className="rounded-xl border border-border/70 px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
                >
                  {calc.title}
                </Link>
              ))}
            </div>
          </section>
        </div>
      </div>

      <div
        data-html2canvas-ignore="true"
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 xl:hidden"
      >
        <Button type="button" variant="outline" size="lg" onClick={handlePrint}>
          <Printer className="size-4" />
          인쇄
        </Button>
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
