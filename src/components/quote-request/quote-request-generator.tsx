"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Download, Printer } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { EstimateToast } from "@/components/estimate/estimate-toast"
import { QuoteRequestForm } from "@/components/quote-request/quote-request-form"
import { QuoteRequestPreview } from "@/components/quote-request/quote-request-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  QUOTE_REQUEST_FAQ_ITEMS,
  QUOTE_REQUEST_GUIDE_DESCRIPTION,
  QUOTE_REQUEST_GUIDE_ITEMS,
} from "@/lib/faq/quote-request-faq"
import {
  getDefaultQuoteRequestData,
  validateQuoteRequest,
  type QuoteRequestData,
} from "@/lib/quote-request"
import {
  downloadQuoteRequestPdf,
  getQuoteRequestDocumentElement,
  getQuoteRequestPdfFilename,
} from "@/lib/quote-request-pdf"
import {
  loadStoredQuoteRequester,
  saveStoredQuoteRequester,
} from "@/lib/quote-request-storage"
import { loadInitialRequester } from "@/lib/supplier-hydration"

const RELATED_DOCUMENTS = [
  { title: "견적서 생성기", href: "/documents/estimate" },
  { title: "발주서 생성기", href: "/documents/purchase-order" },
  { title: "납품서 생성기", href: "/documents/delivery-note" },
  { title: "거래명세서 생성기", href: "/documents/statement" },
  { title: "거래확인서 생성기", href: "/documents/transaction-confirmation" },
] as const

const RELATED_CALCULATORS = [
  { title: "부가세 계산기", href: "/calculators/vat" },
  { title: "원가율 계산기", href: "/calculators/cost-rate" },
  { title: "손익분기점 계산기", href: "/calculators/break-even" },
  { title: "목표매출 계산기", href: "/calculators/sales-goal" },
] as const

function applyStoredRequester(
  data: QuoteRequestData,
  stored: Awaited<ReturnType<typeof loadInitialRequester>> | ReturnType<typeof loadStoredQuoteRequester>
): QuoteRequestData {
  if (!stored) return data

  return {
    ...data,
    requester: { ...stored },
  }
}

export function QuoteRequestGenerator() {
  const [data, setData] = useState<QuoteRequestData>(getDefaultQuoteRequestData)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  const itemCount = data.items.filter((item) => item.name.trim()).length

  useEffect(() => {
    let cancelled = false

    async function hydrate() {
      const stored = (await loadInitialRequester()) ?? loadStoredQuoteRequester()
      if (cancelled) return

      setData((prev) => applyStoredRequester(prev, stored))
      setHydrated(true)
    }

    hydrate()

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    saveStoredQuoteRequester(data.requester)
  }, [data.requester, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  function handleReset() {
    const fresh = getDefaultQuoteRequestData()
    setData({
      ...fresh,
      requester: data.requester,
    })
  }

  function handlePrint() {
    const validationError = validateQuoteRequest(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }
    window.print()
  }

  async function handlePdfDownload() {
    const validationError = validateQuoteRequest(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }

    setIsDownloading(true)

    try {
      const element = getQuoteRequestDocumentElement()
      if (!element) {
        setToast({
          message:
            "견적 요청서 문서 영역을 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.",
          variant: "error",
        })
        return
      }

      const filename = getQuoteRequestPdfFilename(
        data.target.companyName,
        data.request.writtenDate
      )

      await downloadQuoteRequestPdf(element, filename)
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
            <QuoteRequestForm
              data={data}
              onChange={setData}
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

            <QuoteRequestPreview data={data} />

            <Card
              data-html2canvas-ignore="true"
              className="mt-5 gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 shadow-sm"
            >
              <CardHeader className="border-b border-border/60 px-6 py-4 !pb-4">
                <CardTitle className="text-base">요약</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 px-6 py-5 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">견적 요청 품목 수</span>
                  <span className="font-medium">{itemCount}건</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">요청 대상</span>
                  <span className="font-medium">
                    {data.target.companyName || "-"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">첨부자료</span>
                  <span className="font-medium">
                    {data.attachments.length}개
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <CalculatorFaq
            title="견적 요청서 가이드"
            description={QUOTE_REQUEST_GUIDE_DESCRIPTION}
            items={QUOTE_REQUEST_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={QUOTE_REQUEST_FAQ_ITEMS}
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
    </>
  )
}
