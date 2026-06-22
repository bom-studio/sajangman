"use client"

import { useState } from "react"
import { Plus, RotateCcw, Trash2 } from "lucide-react"

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
import { applyProfileToTransactionParty } from "@/lib/apply-business-profile"
import {
  calculateTransactionConfirmation,
  createEmptyTransactionItem,
  formatKRW,
  getLineSupplyAmount,
  getLineVat,
  type TransactionConfirmationData,
  type TransactionParty,
} from "@/lib/transaction-confirmation"
import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import { cn } from "@/lib/utils"

interface TransactionConfirmationFormProps {
  data: TransactionConfirmationData
  onChange: (data: TransactionConfirmationData) => void
  supplierSealUrl: string | null
  onSupplierSealChange: (url: string | null) => void
  onReset: () => void
}

function SupplierSealControls({
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
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            {sealUrl ? "직인 수정" : "직인 등록"}
          </Button>
          {sealUrl ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={() => onSealChange(null)}
            >
              직인 삭제
            </Button>
          ) : null}
        </div>
        {sealUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sealUrl}
            alt="등록된 직인 미리보기"
            className="size-20 rounded-md border bg-white object-contain"
          />
        ) : null}
        <p className="text-xs text-muted-foreground">PNG, JPG 형식 지원</p>
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

function PartyFields({
  title,
  party,
  onUpdate,
}: {
  title: string
  party: TransactionParty
  onUpdate: (field: keyof TransactionParty, value: string) => void
}) {
  return (
    <Card className="gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 shadow-sm">
      <CardHeader className="border-b border-border/60 px-6 py-4 !pb-4">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 px-6 py-5 sm:grid-cols-2">
        <FormField
          label="상호명"
          value={party.companyName}
          onChange={(v) => onUpdate("companyName", v)}
          placeholder="(주)사장만"
          className="sm:col-span-2"
        />
        <FormField
          label="대표자명"
          value={party.representative}
          onChange={(v) => onUpdate("representative", v)}
          placeholder="홍길동"
        />
        <FormField
          label="사업자등록번호"
          value={party.businessNumber}
          onChange={(v) => onUpdate("businessNumber", formatBusinessNumber(v))}
          placeholder="000-00-00000"
        />
        <FormField
          label="연락처"
          value={party.phone}
          onChange={(v) => onUpdate("phone", formatPhoneNumber(v))}
          placeholder="010-0000-0000"
          className="sm:col-span-2"
        />
        <FormField
          label="주소"
          value={party.address}
          onChange={(v) => onUpdate("address", v)}
          placeholder="서울특별시 ..."
          className="sm:col-span-2"
        />
      </CardContent>
    </Card>
  )
}

export function TransactionConfirmationForm({
  data,
  onChange,
  supplierSealUrl,
  onSupplierSealChange,
  onReset,
}: TransactionConfirmationFormProps) {
  const totals = calculateTransactionConfirmation(data.items)

  function updateSupplier(field: keyof TransactionParty, value: string) {
    onChange({
      ...data,
      supplier: { ...data.supplier, [field]: value },
    })
  }

  function handleSelectProfile(profile: BusinessProfile) {
    onChange({
      ...data,
      supplier: applyProfileToTransactionParty(data.supplier, profile),
    })
    onSupplierSealChange(profile.sealUrl ?? null)
  }

  function updateRecipient(field: keyof TransactionParty, value: string) {
    onChange({
      ...data,
      recipient: { ...data.recipient, [field]: value },
    })
  }

  function updateTransaction(
    field: keyof TransactionConfirmationData["transaction"],
    value: string
  ) {
    onChange({
      ...data,
      transaction: { ...data.transaction, [field]: value },
    })
  }

  function updateItem(
    id: string,
    field: keyof Omit<TransactionConfirmationData["items"][number], "id">,
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
        createEmptyTransactionItem(data.transaction.writtenDate),
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
        <Button type="button" variant="outline" size="sm" onClick={onReset}>
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
            label="연락처"
            value={data.supplier.phone}
            onChange={(v) => updateSupplier("phone", formatPhoneNumber(v))}
            placeholder="010-0000-0000"
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

      <PartyFields
        title="공급받는자 정보"
        party={data.recipient}
        onUpdate={updateRecipient}
      />

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>거래 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="거래확인서 번호"
            value={data.transaction.number}
            onChange={(v) => updateTransaction("number", v)}
            placeholder="TC-20260617-001"
            className="sm:col-span-2"
          />
          <FormField
            label="작성일"
            type="date"
            value={data.transaction.writtenDate}
            onChange={(v) => updateTransaction("writtenDate", v)}
          />
          <div className="hidden sm:block" />
          <FormField
            label="거래기간 시작일"
            type="date"
            value={data.transaction.periodStart}
            onChange={(v) => updateTransaction("periodStart", v)}
          />
          <FormField
            label="거래기간 종료일"
            type="date"
            value={data.transaction.periodEnd}
            onChange={(v) => updateTransaction("periodEnd", v)}
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader
          className={cn(
            "flex flex-row items-center justify-between",
            cardHeaderClass
          )}
        >
          <CardTitle>거래 내역</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4" />
            행 추가
          </Button>
        </CardHeader>
        <CardContent className={cn("space-y-5", cardContentClass)}>
          <div className="overflow-x-auto">
            <Table className="min-w-[960px]">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-28">거래일자</TableHead>
                  <TableHead>품목명</TableHead>
                  <TableHead className="w-20">규격</TableHead>
                  <TableHead className="w-16">수량</TableHead>
                  <TableHead className="w-24">단가</TableHead>
                  <TableHead className="w-24 text-right">공급가액</TableHead>
                  <TableHead className="w-20 text-right">부가세</TableHead>
                  <TableHead className="w-24">비고</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => {
                  const supply = getLineSupplyAmount(item)
                  const vat = getLineVat(item)

                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Input
                          type="date"
                          value={item.transactionDate}
                          onChange={(e) =>
                            updateItem(item.id, "transactionDate", e.target.value)
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
                        {supply ? formatKRW(supply) : "-"}
                      </TableCell>
                      <TableCell className="text-right text-sm font-medium tabular-nums">
                        {vat ? formatKRW(vat) : "-"}
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
              <span className="font-semibold">총 거래금액</span>
              <span className="font-bold text-primary">
                {formatKRW(totals.total)}원
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>확인 문구</CardTitle>
        </CardHeader>
        <CardContent className={cardContentClass}>
          <FormTextarea
            value={data.confirmationText}
            onChange={(v) => onChange({ ...data, confirmationText: v })}
            placeholder="상기 거래 내역이 사실과 다름없음을 상호 확인합니다."
            rows={3}
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>직인</CardTitle>
        </CardHeader>
        <CardContent className={cardContentClass}>
          <SupplierSealControls
            sealUrl={supplierSealUrl}
            onSealChange={onSupplierSealChange}
          />
        </CardContent>
      </Card>
    </div>
  )
}
