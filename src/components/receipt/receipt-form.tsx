"use client"

import { useState } from "react"
import { Plus, RotateCcw, Trash2 } from "lucide-react"

import { calculatorSelectClassName } from "@/components/calculators/calculator-styles"
import { FormField } from "@/components/estimate/form-field"
import { FormTextarea } from "@/components/estimate/form-textarea"
import { SealEditorDialog } from "@/components/estimate/seal-editor-dialog"
import { SupplierSectionHeader } from "@/components/documents/supplier-section-header"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatBusinessNumber, formatPhoneNumber } from "@/lib/format-kr"
import { applyProfileToSupplierInfo } from "@/lib/apply-business-profile"
import {
  calculateReceipt,
  createEmptyReceiptItem,
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatKRW,
  getLineAmounts,
  PAYMENT_METHOD_OPTIONS,
  RECEIPT_COPY_TYPE_OPTIONS,
  RECEIPT_PURPOSE_OPTIONS,
  RECEIPT_STYLE_OPTIONS,
  type ReceiptData,
  type ReceiptPdfFormat,
  type VatMode,
} from "@/lib/receipt"
import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import { cn } from "@/lib/utils"

interface ReceiptFormProps {
  data: ReceiptData
  onChange: (data: ReceiptData) => void
  sealUrl: string | null
  onSealChange: (url: string | null) => void
  onResetRequest: () => void
}

function SealUploadControls({
  sealUrl,
  onSealChange,
}: {
  sealUrl: string | null
  onSealChange: (url: string | null) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-medium">공급자 직인</p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            {sealUrl ? "직인 수정" : "직인 등록"}
          </Button>
          {sealUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onSealChange(null)}
            >
              직인 삭제
            </Button>
          )}
          {sealUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sealUrl}
              alt="공급자 직인 미리보기"
              className="size-10 rounded border object-contain p-0.5"
            />
          )}
        </div>
        <p className="text-xs text-muted-foreground">PNG, JPG, JPEG 지원</p>
      </div>
      <SealEditorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentImage={sealUrl ?? undefined}
        onApply={onSealChange}
      />
    </>
  )
}

export function ReceiptForm({
  data,
  onChange,
  sealUrl,
  onSealChange,
  onResetRequest,
}: ReceiptFormProps) {
  const totals = calculateReceipt(data.items, data.receipt.vatMode)
  const { vatMode } = data.receipt

  function updateSupplier(
    field: keyof ReceiptData["supplier"],
    value: string
  ) {
    onChange({
      ...data,
      supplier: { ...data.supplier, [field]: value },
    })
  }

  function handleSelectProfile(profile: BusinessProfile) {
    onChange({
      ...data,
      supplier: applyProfileToSupplierInfo(data.supplier, profile),
    })
    if (profile.sealUrl) {
      onSealChange(profile.sealUrl)
    }
  }

  function updateRecipient(
    field: keyof ReceiptData["recipient"],
    value: string | boolean
  ) {
    onChange({
      ...data,
      recipient: { ...data.recipient, [field]: value },
    })
  }

  function updateReceipt(
    field: keyof ReceiptData["receipt"],
    value: string | boolean
  ) {
    onChange({
      ...data,
      receipt: { ...data.receipt, [field]: value },
    })
  }

  function updateItem(
    id: string,
    field: keyof Omit<ReceiptData["items"][number], "id">,
    value: string | number
  ) {
    onChange({
      ...data,
      items: data.items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    })
  }

  function addItem() {
    onChange({
      ...data,
      items: [
        ...data.items,
        createEmptyReceiptItem(data.receipt.issueDate),
      ],
    })
  }

  function removeItem(id: string) {
    if (data.items.length <= 1) return
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    })
  }

  const cardClass =
    "gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 shadow-sm"
  const cardHeaderClass = "border-b border-border/60 px-6 py-4 !pb-4"
  const cardContentClass = "px-6 py-5"

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onResetRequest}
        >
          <RotateCcw className="size-4" />
          초기화
        </Button>
      </div>

      <Card className={cardClass}>
        <SupplierSectionHeader
          className={cardHeaderClass}
          description="입력한 정보는 견적서 생성기와 동일하게 이 브라우저에 자동 저장됩니다."
          onSelectProfile={handleSelectProfile}
        />
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="상호명"
            value={data.supplier.companyName}
            onChange={(v) => updateSupplier("companyName", v)}
            placeholder="(주)사장만"
            className="sm:col-span-2"
          />
          <FormField
            label="대표자명"
            value={data.supplier.representative}
            onChange={(v) => updateSupplier("representative", v)}
            placeholder="홍길동"
          />
          <FormField
            label="사업자등록번호"
            value={data.supplier.businessNumber}
            onChange={(v) =>
              updateSupplier("businessNumber", formatBusinessNumber(v))
            }
            placeholder="000-00-00000"
          />
          <FormField
            label="업태"
            value={data.supplier.businessType}
            onChange={(v) => updateSupplier("businessType", v)}
            placeholder="도소매"
          />
          <FormField
            label="종목"
            value={data.supplier.businessItem}
            onChange={(v) => updateSupplier("businessItem", v)}
            placeholder="인쇄물"
          />
          <FormField
            label="담당자"
            value={data.supplier.contactPerson}
            onChange={(v) => updateSupplier("contactPerson", v)}
            placeholder="김담당"
          />
          <FormField
            label="연락처"
            value={data.supplier.phone}
            onChange={(v) => updateSupplier("phone", formatPhoneNumber(v))}
            placeholder="010-0000-0000"
          />
          <FormField
            label="이메일"
            type="email"
            value={data.supplier.email}
            onChange={(v) => updateSupplier("email", v)}
            placeholder="contact@example.com"
            className="sm:col-span-2"
          />
          <FormField
            label="주소"
            value={data.supplier.address}
            onChange={(v) => updateSupplier("address", v)}
            placeholder="서울특별시 ..."
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>수신자 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="수신자명"
            value={data.recipient.name}
            onChange={(v) => updateRecipient("name", v)}
            placeholder="홍길동 또는 ABC상사"
            className="sm:col-span-2"
          />
          <FormField
            label="연락처"
            value={data.recipient.phone}
            onChange={(v) => updateRecipient("phone", formatPhoneNumber(v))}
            placeholder="010-0000-0000"
          />
          <FormField
            label="이메일"
            type="email"
            value={data.recipient.email}
            onChange={(v) => updateRecipient("email", v)}
            placeholder="customer@example.com"
          />
          <FormField
            label="주소"
            value={data.recipient.address}
            onChange={(v) => updateRecipient("address", v)}
            placeholder="서울특별시 ..."
            className="sm:col-span-2"
          />
          <label className="flex items-center gap-2 sm:col-span-2">
            <input
              type="checkbox"
              checked={data.recipient.showHonorific}
              onChange={(e) =>
                updateRecipient("showHonorific", e.target.checked)
              }
              className="size-4 accent-primary"
            />
            <span className="text-sm">수신자명 뒤 &apos;귀하&apos; 표시</span>
          </label>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>영수 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="영수증 번호"
            value={data.receipt.number}
            onChange={(v) => updateReceipt("number", v)}
            placeholder="RC-20260617-001"
            className="sm:col-span-2"
          />
          <FormField
            label="발행일자"
            type="date"
            value={data.receipt.issueDate}
            onChange={(v) => updateReceipt("issueDate", v)}
          />
          <FormField
            label="결제일자"
            type="date"
            value={data.receipt.paymentDate}
            onChange={(v) => updateReceipt("paymentDate", v)}
          />
          <div className="space-y-2">
            <label className="text-sm font-medium">결제수단</label>
            <select
              value={data.receipt.paymentMethod}
              onChange={(e) => updateReceipt("paymentMethod", e.target.value)}
              className={calculatorSelectClassName}
            >
              {PAYMENT_METHOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">부가세</label>
            <select
              value={data.receipt.vatMode}
              onChange={(e) =>
                updateReceipt("vatMode", e.target.value as VatMode)
              }
              className={calculatorSelectClassName}
            >
              <option value="separate">부가세 별도</option>
              <option value="included">부가세 포함</option>
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">영수 목적</label>
            <select
              value={
                (RECEIPT_PURPOSE_OPTIONS as readonly string[]).includes(
                  data.receipt.purpose
                )
                  ? data.receipt.purpose
                  : "기타"
              }
              onChange={(e) => {
                const value = e.target.value
                updateReceipt("purpose", value === "기타" ? "" : value)
              }}
              className={calculatorSelectClassName}
            >
              {RECEIPT_PURPOSE_OPTIONS.map((purpose) => (
                <option key={purpose} value={purpose}>
                  {purpose}
                </option>
              ))}
            </select>
            {!(RECEIPT_PURPOSE_OPTIONS as readonly string[]).includes(
              data.receipt.purpose
            ) && (
              <Input
                value={data.receipt.purpose}
                onChange={(e) => updateReceipt("purpose", e.target.value)}
                placeholder="영수 목적 직접 입력"
                className="mt-2"
              />
            )}
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">미리보기 스타일</label>
            <select
              value={data.receipt.style}
              onChange={(e) => updateReceipt("style", e.target.value)}
              className={calculatorSelectClassName}
            >
              {RECEIPT_STYLE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">용도 표시</label>
            <select
              value={data.receipt.copyType}
              onChange={(e) => updateReceipt("copyType", e.target.value)}
              className={calculatorSelectClassName}
            >
              {RECEIPT_COPY_TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">PDF 출력 형식</label>
            <select
              value={data.receipt.pdfFormat}
              onChange={(e) =>
                onChange({
                  ...data,
                  receipt: {
                    ...data.receipt,
                    pdfFormat: e.target.value as ReceiptPdfFormat,
                  },
                })
              }
              className={calculatorSelectClassName}
            >
              <option value="a4">A4</option>
              <option value="receipt">영수증 세로형</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader
          className={cn(
            "flex flex-row items-center justify-between",
            cardHeaderClass
          )}
        >
          <CardTitle>품목 정보</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4" />
            행 추가
          </Button>
        </CardHeader>
        <CardContent className={cn("space-y-5", cardContentClass)}>
          <div className="overflow-x-auto">
            <Table className="min-w-[920px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">일자</TableHead>
                  <TableHead>품목명</TableHead>
                  <TableHead className="w-20">규격</TableHead>
                  <TableHead className="w-16">수량</TableHead>
                  <TableHead className="w-20">단위</TableHead>
                  <TableHead className="w-24">단가</TableHead>
                  <TableHead className="w-24 text-right">공급가액</TableHead>
                  <TableHead className="w-24">비고</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => {
                  const amounts = getLineAmounts(item, vatMode)

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          type="date"
                          value={item.date}
                          onChange={(e) =>
                            updateItem(item.id, "date", e.target.value)
                          }
                        />
                      </TableCell>
                      <TableCell className="whitespace-normal">
                        <Input
                          value={item.name}
                          onChange={(e) =>
                            updateItem(item.id, "name", e.target.value)
                          }
                          placeholder="품목명"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.spec}
                          onChange={(e) =>
                            updateItem(item.id, "spec", e.target.value)
                          }
                          placeholder="규격"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          value={item.quantity || ""}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "quantity",
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <select
                          value={item.unit || DEFAULT_ESTIMATE_UNIT}
                          onChange={(e) =>
                            updateItem(item.id, "unit", e.target.value)
                          }
                          className={cn(
                            "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
                          )}
                        >
                          {ESTIMATE_UNIT_OPTIONS.map((unit) => (
                            <option key={unit} value={unit}>
                              {unit}
                            </option>
                          ))}
                        </select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          value={item.unitPrice || ""}
                          onChange={(e) =>
                            updateItem(
                              item.id,
                              "unitPrice",
                              Number(e.target.value) || 0
                            )
                          }
                        />
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">
                        {amounts.supplyAmount
                          ? formatKRW(amounts.supplyAmount)
                          : "-"}
                      </TableCell>
                      <TableCell>
                        <Input
                          value={item.note}
                          onChange={(e) =>
                            updateItem(item.id, "note", e.target.value)
                          }
                          placeholder="비고"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon-sm"
                          onClick={() => removeItem(item.id)}
                          disabled={data.items.length <= 1}
                          aria-label="행 삭제"
                        >
                          <Trash2 className="size-4 text-muted-foreground" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-2 rounded-xl bg-muted/50 p-4 text-sm">
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
              <span className="font-semibold">총 영수금액</span>
              <span className="font-bold text-primary">
                {formatKRW(totals.total)}원
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>직인 삽입</CardTitle>
        </CardHeader>
        <CardContent className={cardContentClass}>
          <SealUploadControls sealUrl={sealUrl} onSealChange={onSealChange} />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>비고</CardTitle>
        </CardHeader>
        <CardContent className={cardContentClass}>
          <FormTextarea
            value={data.remarks}
            onChange={(v) => onChange({ ...data, remarks: v })}
            placeholder={
              "예: 위 금액을 정히 영수함\n현금 결제 완료\n세금계산서 별도 발행"
            }
            rows={5}
          />
        </CardContent>
      </Card>
    </div>
  )
}
