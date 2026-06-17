"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, Download, Printer } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { DeliveryNoteForm } from "@/components/delivery-note/delivery-note-form"
import { DeliveryNotePreview } from "@/components/delivery-note/delivery-note-preview"
import { EstimateToast } from "@/components/estimate/estimate-toast"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { convertStatementToDeliveryNote } from "@/lib/delivery-note-convert"
import {
  calculateDeliveryNote,
  formatKRW,
  getDefaultDeliveryNoteData,
  validateDeliveryNote,
  type DeliveryNoteData,
} from "@/lib/delivery-note"
import {
  downloadDeliveryNotePdf,
  getDeliveryNoteDocumentElement,
  getDeliveryNotePdfFilename,
} from "@/lib/delivery-note-pdf"
import { loadStoredSupplier, saveStoredSupplier } from "@/lib/estimate-storage"
import {
  DELIVERY_NOTE_FAQ_ITEMS,
  DELIVERY_NOTE_GUIDE_DESCRIPTION,
  DELIVERY_NOTE_GUIDE_ITEMS,
} from "@/lib/faq/delivery-note-faq"
import { loadStatementDraft } from "@/lib/statement-storage"

const RELATED_DOCUMENTS = [
  { title: "견적서 생성기", href: "/documents/estimate", available: true },
  { title: "거래명세서 생성기", href: "/documents/statement", available: true },
  { title: "발주서 생성기", href: "/documents/purchase-order", available: true },
  {
    title: "물품공급계약서 생성기",
    href: "/documents/supply-contract",
    available: true,
  },
  { title: "영수증 생성기", href: "/documents/receipt", available: true },
] as const

const RELATED_CALCULATORS = [
  { title: "부가세 계산기", href: "/calculators/vat" },
  { title: "원가율 계산기", href: "/calculators/cost-rate" },
  { title: "메뉴 가격 계산기", href: "/calculators/menu-price" },
  { title: "손익분기점 계산기", href: "/calculators/break-even" },
] as const

function applyStoredSupplier(
  data: DeliveryNoteData,
  stored: ReturnType<typeof loadStoredSupplier>
): DeliveryNoteData {
  if (!stored) return data

  return {
    ...data,
    supplier: {
      ...data.supplier,
      companyName: stored.companyName,
      representative: stored.representative,
      businessNumber: stored.businessNumber,
      phone: stored.phone,
      email: stored.email,
      address: stored.address,
    },
  }
}

export function DeliveryNoteGenerator() {
  const [data, setData] = useState<DeliveryNoteData>(getDefaultDeliveryNoteData)
  const [sealUrl, setSealUrl] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  const totals = calculateDeliveryNote(data.items)

  useEffect(() => {
    const storedSupplier = loadStoredSupplier()
    setData((prev) => applyStoredSupplier(prev, storedSupplier))
    if (storedSupplier?.sealUrl) {
      setSealUrl(storedSupplier.sealUrl)
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) return

    saveStoredSupplier(
      {
        companyName: data.supplier.companyName,
        representative: data.supplier.representative,
        businessNumber: data.supplier.businessNumber,
        phone: data.supplier.phone,
        email: data.supplier.email,
        address: data.supplier.address,
      },
      sealUrl
    )
  }, [data.supplier, sealUrl, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  function handleReset() {
    const fresh = getDefaultDeliveryNoteData()
    const storedSupplier = loadStoredSupplier()
    setData(applyStoredSupplier(fresh, storedSupplier))
    setSealUrl(storedSupplier?.sealUrl ?? null)
  }

  function handleImportFromStatement() {
    const draft = loadStatementDraft()
    if (!draft) {
      setToast({
        message:
          "저장된 거래명세서 데이터가 없습니다. 거래명세서 생성기에서 먼저 작성해주세요.",
        variant: "error",
      })
      return
    }

    const converted = convertStatementToDeliveryNote(draft)
    setData(applyStoredSupplier(converted, loadStoredSupplier()))
    setToast({
      message: "거래명세서 데이터를 납품서로 불러왔습니다.",
      variant: "success",
    })
  }

  function handlePrint() {
    const validationError = validateDeliveryNote(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }
    window.print()
  }

  async function handlePdfDownload() {
    const validationError = validateDeliveryNote(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }

    setIsDownloading(true)

    try {
      const element = getDeliveryNoteDocumentElement()
      if (!element) {
        setToast({
          message:
            "납품서 문서 영역을 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.",
          variant: "error",
        })
        return
      }

      const filename = getDeliveryNotePdfFilename(
        data.recipient.companyName,
        data.delivery.date
      )

      await downloadDeliveryNotePdf(element, filename)
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
      <div className="mx-auto max-w-[1440px] px-4 py-8 pb-24 sm:px-6 lg:px-8 xl:pb-8">
        <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
          <div className="xl:w-[40%] xl:shrink-0">
            <p className="mb-4 text-sm font-medium text-muted-foreground lg:hidden">
              입력 폼
            </p>
            <DeliveryNoteForm
              data={data}
              onChange={setData}
              sealUrl={sealUrl}
              onSealChange={setSealUrl}
              onReset={handleReset}
              onImportFromStatement={handleImportFromStatement}
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
                  인쇄
                </Button>
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
            </div>

            <DeliveryNotePreview data={data} sealUrl={sealUrl} />

            <Card
              data-html2canvas-ignore="true"
              className="mt-5 gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 shadow-sm"
            >
              <CardHeader className="border-b border-border/60 px-6 py-4 !pb-4">
                <CardTitle className="text-base">계산 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-6 py-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 품목 수</span>
                  <span className="font-medium">{totals.itemCount}건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">총 수량</span>
                  <span className="font-medium">
                    {formatKRW(totals.quantitySum)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-2 text-base">
                  <span className="font-semibold">총 납품 금액</span>
                  <span className="font-bold text-primary">
                    {formatKRW(totals.totalAmount)}원
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
                본 문서는 납품 사실을 기록하기 위한 참고용 문서입니다. 실제
                세무 및 법적 증빙은 거래명세서, 세금계산서, 계약서 등과 함께
                관리하시기 바랍니다.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <CalculatorFaq
            title="납품서 가이드"
            description={DELIVERY_NOTE_GUIDE_DESCRIPTION}
            items={DELIVERY_NOTE_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={DELIVERY_NOTE_FAQ_ITEMS}
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
