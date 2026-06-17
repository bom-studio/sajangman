"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { AlertCircle, Download, Printer } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { EstimateToast } from "@/components/estimate/estimate-toast"
import { ReceiptForm } from "@/components/receipt/receipt-form"
import { ReceiptPreview } from "@/components/receipt/receipt-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { loadStoredSupplier, saveStoredSupplier } from "@/lib/estimate-storage"
import {
  RECEIPT_FAQ_ITEMS,
  RECEIPT_GUIDE_DESCRIPTION,
  RECEIPT_GUIDE_ITEMS,
} from "@/lib/faq/receipt-faq"
import {
  calculateReceipt,
  formatKRW,
  getDefaultReceiptData,
  validateReceipt,
  type ReceiptData,
} from "@/lib/receipt"
import {
  downloadReceiptPdf,
  getReceiptDocumentElement,
  getReceiptPdfFilename,
} from "@/lib/receipt-pdf"
import {
  loadReceiptPreferences,
  saveReceiptPreferences,
} from "@/lib/receipt-storage"

const RELATED_DOCUMENTS = [
  { title: "견적서 생성기", href: "/documents/estimate" },
  { title: "거래명세서 생성기", href: "/documents/statement" },
  { title: "발주서 생성기", href: "/documents/purchase-order" },
  { title: "납품서 생성기", href: "/documents/delivery-note" },
  { title: "물품공급계약서 생성기", href: "/documents/supply-contract" },
] as const

const RELATED_CALCULATORS = [
  { title: "부가세 계산기", href: "/calculators/vat" },
  { title: "카드 수수료 계산기", href: "/calculators/card-fee" },
  { title: "원가율 계산기", href: "/calculators/cost-rate" },
  { title: "손익분기점 계산기", href: "/calculators/break-even" },
] as const

function applyStoredSupplier(
  data: ReceiptData,
  stored: ReturnType<typeof loadStoredSupplier>
): ReceiptData {
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

export function ReceiptGenerator() {
  const [data, setData] = useState<ReceiptData>(getDefaultReceiptData)
  const [sealUrl, setSealUrl] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [keepSupplierOnReset, setKeepSupplierOnReset] = useState(true)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  const totals = calculateReceipt(data.items, data.receipt.vatMode)

  useEffect(() => {
    const storedSupplier = loadStoredSupplier()
    const prefs = loadReceiptPreferences()

    setData((prev) => {
      let next = applyStoredSupplier(prev, storedSupplier)
      if (prefs) {
        next = {
          ...next,
          receipt: {
            ...next.receipt,
            paymentMethod: prefs.paymentMethod,
          },
          remarks: prefs.remarks || next.remarks,
        }
      }
      return next
    })

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

    saveReceiptPreferences({
      paymentMethod: data.receipt.paymentMethod,
      remarks: data.remarks,
    })
  }, [data.supplier, data.receipt.paymentMethod, data.remarks, sealUrl, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  function performReset(keepSupplier: boolean) {
    const fresh = getDefaultReceiptData()
    const storedSupplier = keepSupplier ? loadStoredSupplier() : null
    const prefs = loadReceiptPreferences()

    let next = applyStoredSupplier(fresh, storedSupplier)
    if (prefs) {
      next = {
        ...next,
        receipt: {
          ...next.receipt,
          paymentMethod: prefs.paymentMethod,
        },
        remarks: prefs.remarks || next.remarks,
      }
    }

    setData(next)
    if (!keepSupplier) {
      setSealUrl(null)
    } else if (storedSupplier?.sealUrl) {
      setSealUrl(storedSupplier.sealUrl)
    }
    setResetDialogOpen(false)
  }

  function handlePrint() {
    const validationError = validateReceipt(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }
    window.print()
  }

  async function handlePdfDownload() {
    const validationError = validateReceipt(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }

    setIsDownloading(true)

    try {
      const element = getReceiptDocumentElement()
      if (!element) {
        setToast({
          message:
            "영수증 문서 영역을 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.",
          variant: "error",
        })
        return
      }

      const filename = getReceiptPdfFilename(
        data.recipient.name,
        data.receipt.issueDate
      )

      await downloadReceiptPdf(
        element,
        filename,
        data.receipt.pdfFormat
      )
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
            <ReceiptForm
              data={data}
              onChange={setData}
              sealUrl={sealUrl}
              onSealChange={setSealUrl}
              onResetRequest={() => setResetDialogOpen(true)}
            />
          </div>

          <div className="xl:w-[60%] xl:flex-1">
            <div
              data-html2canvas-ignore="true"
              className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
            >
              <p className="text-sm font-medium text-muted-foreground">
                <span className="lg:hidden">미리보기</span>
                <span className="hidden lg:inline">실시간 미리보기</span>
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

            <ReceiptPreview data={data} sealUrl={sealUrl} />

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
                  <span className="text-muted-foreground">총 공급가액</span>
                  <span className="font-medium">
                    {formatKRW(totals.supplyAmount)}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">부가세</span>
                  <span className="font-medium">{formatKRW(totals.vat)}원</span>
                </div>
                <div className="flex justify-between border-t border-border/60 pt-2 text-base">
                  <span className="font-semibold">총 영수금액</span>
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
                본 영수증은 거래 사실 확인을 위한 참고용 문서입니다. 세무
                증빙이 필요한 경우 현금영수증, 카드매출전표, 세금계산서 등
                공식 증빙자료와 함께 보관하세요.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <CalculatorFaq
            title="영수증 가이드"
            description={RECEIPT_GUIDE_DESCRIPTION}
            items={RECEIPT_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={RECEIPT_FAQ_ITEMS}
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
        <Button
          type="button"
          onClick={handlePdfDownload}
          disabled={isDownloading}
          size="lg"
          className="shadow-lg"
        >
          <Download className="size-4" />
          {isDownloading ? "PDF 생성 중..." : "PDF 다운로드"}
        </Button>
      </div>

      {toast && (
        <EstimateToast
          message={toast.message}
          variant={toast.variant}
          className="bottom-36 xl:bottom-6"
        />
      )}

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>입력 내용 초기화</DialogTitle>
            <DialogDescription>
              수신자 정보, 품목, 영수 정보를 초기화합니다. 공급자 정보와 직인도
              함께 초기화할까요?
            </DialogDescription>
          </DialogHeader>
          <label className="flex items-start gap-3 rounded-lg border border-border/70 bg-muted/30 px-4 py-3">
            <input
              type="checkbox"
              checked={keepSupplierOnReset}
              onChange={(e) => setKeepSupplierOnReset(e.target.checked)}
              className="mt-0.5 size-4 accent-primary"
            />
            <span className="text-sm">
              공급자 정보 및 직인 유지 (견적서와 공유된 저장 정보)
            </span>
          </label>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setResetDialogOpen(false)}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={() => performReset(keepSupplierOnReset)}
            >
              초기화
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
