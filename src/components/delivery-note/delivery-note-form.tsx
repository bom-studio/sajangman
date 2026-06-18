"use client"

import { useState } from "react"
import { Plus, RotateCcw, Trash2 } from "lucide-react"

import { FormField } from "@/components/estimate/form-field"
import { FormTextarea } from "@/components/estimate/form-textarea"
import { SealEditorDialog } from "@/components/estimate/seal-editor-dialog"
import { SupplierSectionHeader } from "@/components/documents/supplier-section-header"
import { calculatorSelectClassName } from "@/components/calculators/calculator-styles"
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
  calculateDeliveryNote,
  createEmptyDeliveryNoteItem,
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatKRW,
  SHIPPING_METHOD_OPTIONS,
  type DeliveryNoteData,
  type ShippingMethod,
} from "@/lib/delivery-note"
import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import { cn } from "@/lib/utils"

interface DeliveryNoteFormProps {
  data: DeliveryNoteData
  onChange: (data: DeliveryNoteData) => void
  sealUrl: string | null
  onSealChange: (url: string | null) => void
  onReset: () => void
  onImportFromStatement: () => void
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

export function DeliveryNoteForm({
  data,
  onChange,
  sealUrl,
  onSealChange,
  onReset,
  onImportFromStatement,
}: DeliveryNoteFormProps) {
  const totals = calculateDeliveryNote(data.items)

  function updateSupplier(
    field: keyof DeliveryNoteData["supplier"],
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
    field: keyof DeliveryNoteData["recipient"],
    value: string
  ) {
    onChange({
      ...data,
      recipient: { ...data.recipient, [field]: value },
    })
  }

  function updateDelivery(
    field: keyof DeliveryNoteData["delivery"],
    value: string
  ) {
    onChange({
      ...data,
      delivery: { ...data.delivery, [field]: value },
    })
  }

  function updateItem(
    id: string,
    field: keyof Omit<DeliveryNoteData["items"][number], "id">,
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
      items: [...data.items, createEmptyDeliveryNoteItem()],
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
      <div className="flex flex-wrap items-center justify-end gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onImportFromStatement}
        >
          거래명세서에서 불러오기
        </Button>
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
            label="업태"
            value={data.supplier.businessType}
            onChange={(v) => updateSupplier("businessType", v)}
            placeholder="제조업"
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
            label="거래처명"
            value={data.recipient.companyName}
            onChange={(v) => updateRecipient("companyName", v)}
            placeholder="ABC상사"
            className="sm:col-span-2"
          />
          <FormField
            label="담당자명"
            value={data.recipient.contactName}
            onChange={(v) => updateRecipient("contactName", v)}
            placeholder="담당자명"
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
            placeholder="vendor@example.com"
            className="sm:col-span-2"
          />
          <FormField
            label="주소"
            value={data.recipient.address}
            onChange={(v) => updateRecipient("address", v)}
            placeholder="서울특별시 ..."
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>납품 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="납품번호"
            value={data.delivery.number}
            onChange={(v) => updateDelivery("number", v)}
            placeholder="DN-20260617-001"
            className="sm:col-span-2"
          />
          <FormField
            label="납품일자"
            type="date"
            value={data.delivery.date}
            onChange={(v) => updateDelivery("date", v)}
          />
          <FormField
            label="납품장소"
            value={data.delivery.location}
            onChange={(v) => updateDelivery("location", v)}
            placeholder="거래처 창고 또는 매장"
            className="sm:col-span-2"
          />
          <div className="space-y-2 sm:col-span-2">
            <label className="text-sm font-medium">운송방법</label>
            <select
              value={data.delivery.shippingMethod}
              onChange={(e) =>
                onChange({
                  ...data,
                  delivery: {
                    ...data.delivery,
                    shippingMethod: e.target.value as ShippingMethod,
                  },
                })
              }
              className={calculatorSelectClassName}
            >
              {SHIPPING_METHOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
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
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow>
                  <TableHead>품목명</TableHead>
                  <TableHead className="w-20">규격</TableHead>
                  <TableHead className="w-16">수량</TableHead>
                  <TableHead className="w-20">단위</TableHead>
                  <TableHead className="w-24">금액</TableHead>
                  <TableHead className="w-24">비고</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => (
                  <TableRow key={item.id}>
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
                        value={item.amount || ""}
                        onChange={(e) =>
                          updateItem(
                            item.id,
                            "amount",
                            Number(e.target.value) || 0
                          )
                        }
                      />
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
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-2 rounded-xl bg-muted/50 p-4 text-sm">
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
          </div>
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
              "예: 이상 없이 납품 완료\n수량 확인 요청\n검수 후 이상 시 연락 바랍니다"
            }
            rows={5}
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>서명/직인</CardTitle>
        </CardHeader>
        <CardContent className={cardContentClass}>
          <SealUploadControls sealUrl={sealUrl} onSealChange={onSealChange} />
        </CardContent>
      </Card>
    </div>
  )
}
