"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { DocumentEditorActions } from "@/components/documents/document-editor-actions"
import { EstimateToast } from "@/components/estimate/estimate-toast"
import { SupplyContractForm } from "@/components/supply-contract/supply-contract-form"
import { SupplyContractPreview } from "@/components/supply-contract/supply-contract-preview"
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
import { useSavedDocumentLoader } from "@/hooks/use-saved-document-loader"
import { buildSupplierSnapshot } from "@/lib/document-metadata"
import { saveDocument } from "@/lib/documents"
import { saveStoredSupplier } from "@/lib/estimate-storage"
import { loadInitialSupplier } from "@/lib/supplier-hydration"
import {
  SUPPLY_CONTRACT_FAQ_ITEMS,
  SUPPLY_CONTRACT_GUIDE_DESCRIPTION,
  SUPPLY_CONTRACT_GUIDE_ITEMS,
} from "@/lib/faq/supply-contract-faq"
import {
  loadStoredBankAccount,
  saveStoredBankAccount,
} from "@/lib/statement-storage"
import {
  calculateSupplyContract,
  formatKRW,
  getDefaultSupplyContractData,
  validateSupplyContract,
  type SupplyContractData,
} from "@/lib/supply-contract"
import {
  downloadSupplyContractPdf,
  getSupplyContractDocumentElement,
  getSupplyContractPdfFilename,
} from "@/lib/supply-contract-pdf"
import type { SavedDocument } from "@/types/documents"

const RELATED_DOCUMENTS = [
  { title: "견적서 생성기", href: "/documents/estimate", available: true },
  { title: "발주서 생성기", href: "/documents/purchase-order", available: true },
  { title: "거래명세서 생성기", href: "/documents/statement", available: true },
  { title: "납품서 생성기", href: "/documents/delivery-note", available: true },
] as const

const RELATED_CALCULATORS = [
  { title: "부가세 계산기", href: "/calculators/vat" },
  { title: "원가율 계산기", href: "/calculators/cost-rate" },
  { title: "카드 수수료 계산기", href: "/calculators/card-fee" },
  { title: "손익분기점 계산기", href: "/calculators/break-even" },
] as const

function applyStoredSupplier(
  data: SupplyContractData,
  stored: Awaited<ReturnType<typeof loadInitialSupplier>>
): SupplyContractData {
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

function formatBankAccount(
  bank: ReturnType<typeof loadStoredBankAccount>
): string {
  if (!bank) return ""
  return [bank.bankName, bank.accountNumber, bank.accountHolder]
    .filter(Boolean)
    .join(" ")
}

export function SupplyContractGenerator() {
  const searchParams = useSearchParams()
  const docIdParam = searchParams.get("docId")
  const [data, setData] = useState<SupplyContractData>(
    getDefaultSupplyContractData
  )
  const [supplierSealUrl, setSupplierSealUrl] = useState<string | null>(null)
  const [buyerSealUrl, setBuyerSealUrl] = useState<string | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [keepSupplierOnReset, setKeepSupplierOnReset] = useState(true)
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  const totals = calculateSupplyContract(data.items)

  const applyLoadedDocument = useCallback((document: SavedDocument) => {
    const payload = document.documentData as {
      data?: SupplyContractData
      supplierSealUrl?: string | null
      buyerSealUrl?: string | null
    }

    if (payload.data) {
      setData(payload.data)
    }

    const nextSupplierSeal =
      payload.supplierSealUrl ??
      (document.supplierSnapshot.sealUrl as string | null | undefined) ??
      null
    setSupplierSealUrl(nextSupplierSeal)
    setBuyerSealUrl(payload.buyerSealUrl ?? null)
    setHydrated(true)
  }, [])

  const { documentId, setDocumentId } = useSavedDocumentLoader({
    documentType: "supply_contract",
    onLoad: applyLoadedDocument,
  })

  useEffect(() => {
    if (docIdParam) return

    let cancelled = false

    async function hydrate() {
      const storedSupplier = await loadInitialSupplier()
      const storedBank = loadStoredBankAccount()

      if (cancelled) return

      setData((prev) => {
        let next = applyStoredSupplier(prev, storedSupplier)
        if (storedBank && !next.paymentTerms.bankAccount) {
          next = {
            ...next,
            paymentTerms: {
              ...next.paymentTerms,
              bankAccount: formatBankAccount(storedBank),
            },
          }
        }
        return next
      })

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
        email: data.supplier.email,
        address: data.supplier.address,
      },
      supplierSealUrl
    )

    const bankParts = data.paymentTerms.bankAccount.trim().split(/\s+/)
    if (bankParts.length >= 2) {
      saveStoredBankAccount({
        bankName: bankParts[0] ?? "",
        accountNumber: bankParts[1] ?? "",
        accountHolder: bankParts.slice(2).join(" ") ?? "",
      })
    }
  }, [data.supplier, data.paymentTerms.bankAccount, supplierSealUrl, hydrated])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  function performReset(keepSupplier: boolean) {
    const fresh = getDefaultSupplyContractData()
    const storedBank = loadStoredBankAccount()

    let next = keepSupplier
      ? { ...fresh, supplier: data.supplier }
      : fresh

    if (storedBank) {
      next = {
        ...next,
        paymentTerms: {
          ...next.paymentTerms,
          bankAccount: formatBankAccount(storedBank),
        },
      }
    }

    setData(next)
    setBuyerSealUrl(null)
    if (!keepSupplier) {
      setSupplierSealUrl(null)
    }
    setResetDialogOpen(false)
  }

  async function handleSave() {
    const result = await saveDocument(
      {
        documentType: "supply_contract",
        documentData: { data, supplierSealUrl, buyerSealUrl },
        supplierSnapshot: buildSupplierSnapshot(
          data.supplier as unknown as Record<string, unknown>,
          supplierSealUrl
        ),
        customerSnapshot: data.buyer as unknown as Record<string, unknown>,
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
    const validationError = validateSupplyContract(data)
    if (validationError) {
      setToast({ message: validationError, variant: "error" })
      return
    }

    setIsDownloading(true)

    try {
      const element = getSupplyContractDocumentElement()
      if (!element) {
        setToast({
          message:
            "계약서 문서 영역을 찾을 수 없습니다. 페이지를 새로고침한 뒤 다시 시도해주세요.",
          variant: "error",
        })
        return
      }

      const filename = getSupplyContractPdfFilename(
        data.supplier.companyName,
        data.buyer.companyName,
        data.signing.writtenDate
      )

      await downloadSupplyContractPdf(element, filename)
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
            <SupplyContractForm
              data={data}
              onChange={setData}
              supplierSealUrl={supplierSealUrl}
              buyerSealUrl={buyerSealUrl}
              onSupplierSealChange={setSupplierSealUrl}
              onBuyerSealChange={setBuyerSealUrl}
              onResetRequest={() => setResetDialogOpen(true)}
            />
          </div>

          <div className="xl:w-[60%] xl:flex-1">
            <div
              data-html2canvas-ignore="true"
              className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between"
            >
              <p className="text-sm font-medium text-muted-foreground">
                <span className="lg:hidden">미리보기</span>
                <span className="hidden lg:inline">실시간 미리보기 (A4)</span>
              </p>
              <DocumentEditorActions
                className="hidden xl:flex"
                onSave={handleSave}
                onPdfDownload={handlePdfDownload}
                isPdfDownloading={isDownloading}
              />
            </div>

            <SupplyContractPreview
              data={data}
              supplierSealUrl={supplierSealUrl}
              buyerSealUrl={buyerSealUrl}
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
                  <span className="font-semibold">총 계약금액</span>
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
                본 계약서는 일반적인 물품공급계약서 작성을 돕기 위한 참고용
                문서입니다. 실제 계약 체결 전 거래 조건, 업종 특성, 법적 책임을
                확인하고 필요 시 법률 전문가의 검토를 받으세요.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 space-y-12">
          <CalculatorFaq
            title="물품공급계약서 가이드"
            description={SUPPLY_CONTRACT_GUIDE_DESCRIPTION}
            items={SUPPLY_CONTRACT_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={SUPPLY_CONTRACT_FAQ_ITEMS}
            defaultOpenFirst={false}
          />

          <section>
            <h2 className="mb-4 text-lg font-semibold">관련 문서</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {RELATED_DOCUMENTS.map((doc) =>
                doc.available ? (
                  <Link
                    key={doc.title}
                    href={doc.href}
                    className="rounded-xl border border-border/70 px-4 py-3 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
                  >
                    {doc.title}
                  </Link>
                ) : (
                  <div
                    key={doc.title}
                    className="rounded-xl border border-dashed border-border/70 bg-muted/30 px-4 py-3 text-sm text-muted-foreground"
                  >
                    {doc.title} (예정)
                  </div>
                )
              )}
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

      <Dialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>입력 내용 초기화</DialogTitle>
            <DialogDescription>
              구매자 정보, 품목, 계약 조건을 초기화합니다. 공급자 정보도 함께
              초기화할까요?
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
