"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, FileText, Receipt } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { EstimateToast } from "@/components/estimate/estimate-toast"
import { PurchaseOrderForm } from "@/components/purchase-order/purchase-order-form"
import { PurchaseOrderPreview } from "@/components/purchase-order/purchase-order-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { loadStoredSupplier, saveStoredSupplier } from "@/lib/estimate-storage"
import {
  PURCHASE_ORDER_FAQ_ITEMS,
  PURCHASE_ORDER_GUIDE_DESCRIPTION,
  PURCHASE_ORDER_GUIDE_ITEMS,
} from "@/lib/faq/purchase-order-faq"
import {
  calculatePurchaseOrder,
  formatKRW,
  getDefaultPurchaseOrderData,
  validatePurchaseOrder,
  type PurchaseOrderData,
} from "@/lib/purchase-order"
import {
  downloadPurchaseOrderPdf,
  getPurchaseOrderDocumentElement,
  getPurchaseOrderPdfFilename,
} from "@/lib/purchase-order-pdf"

const RELATED_DOCUMENTS = [
  {
    title: "견적서 생성기",
    href: "/documents/estimate",
    available: true,
  },
  {
    title: "거래명세서 생성기",
    href: "/documents/statement",
    available: true,
  },
  {
    title: "거래확인서 생성기",
    href: "/documents/transaction-confirmation",
    available: true,
  },
  {
    title: "납품서 생성기",
    href: "/documents/delivery-note",
    available: true,
  },
] as const

function applyStoredSupplier(
  data: PurchaseOrderData,
  stored: ReturnType<typeof loadStoredSupplier>
): PurchaseOrderData {
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

export function PurchaseOrderGenerator() {
  const [data, setData] = useState<PurchaseOrderData>(getDefaultPurchaseOrderData)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  const totals = calculatePurchaseOrder(data.items)

  useEffect(() => {
    setData((prev) => applyStoredSupplier(prev, loadStoredSupplier()))
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
      null
    )
  }, [data.supplier, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  function handleReset() {
    const fresh = getDefaultPurchaseOrderData()
    setData(applyStoredSupplier(fresh, loadStoredSupplier()))
  }

  async function handlePdfDownload() {
    const validationError = validatePurchaseOrder(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }

    setIsDownloading(true)

    try {
      const element = getPurchaseOrderDocumentElement()

      if (!element) {
        setToast({
          message:
            "발주서 문서 영역을 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.",
          variant: "error",
        })
        return
      }

      const filename = getPurchaseOrderPdfFilename(
        data.order.number,
        data.order.date
      )

      await downloadPurchaseOrderPdf(element, filename)

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
            <PurchaseOrderForm
              data={data}
              onChange={setData}
              onReset={handleReset}
            />
          </div>

          <div className="xl:w-[60%] xl:flex-1">
            <div
              data-html2canvas-ignore="true"
              className="mb-4 flex items-center justify-between gap-4"
            >
              <p className="text-sm font-medium text-muted-foreground">
                <span className="lg:hidden">미리보기</span>
                <span className="hidden lg:inline">실시간 미리보기 (A4)</span>
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

            <PurchaseOrderPreview data={data} />

            <Card
              data-html2canvas-ignore="true"
              className="mt-5 gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 shadow-sm"
            >
              <CardHeader className="border-b border-border/60 px-6 py-4 !pb-4">
                <CardTitle className="text-base">계산 결과</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-6 py-5 text-sm">
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
                  <span className="font-semibold">총 발주금액</span>
                  <span className="font-bold text-primary">
                    {formatKRW(totals.total)}원
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <CalculatorFaq
            title="발주서 가이드"
            description={PURCHASE_ORDER_GUIDE_DESCRIPTION}
            items={PURCHASE_ORDER_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={PURCHASE_ORDER_FAQ_ITEMS}
            defaultOpenFirst={false}
          />

          <section>
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              관련 문서
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {RELATED_DOCUMENTS.map((doc) =>
                doc.available ? (
                  <Link
                    key={doc.title}
                    href={doc.href}
                    className="flex items-center gap-3 rounded-xl border border-border/70 bg-card px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    {doc.title.includes("견적") ? (
                      <FileText className="size-4 shrink-0 text-primary" />
                    ) : (
                      <Receipt className="size-4 shrink-0 text-primary" />
                    )}
                    {doc.title}
                  </Link>
                ) : (
                  <div
                    key={doc.title}
                    className="flex items-center gap-3 rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {doc.title} (예정)
                  </div>
                )
              )}
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
