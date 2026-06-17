"use client"

import { Plus, RotateCcw, Trash2 } from "lucide-react"

import { FormField } from "@/components/estimate/form-field"
import { FormTextarea } from "@/components/estimate/form-textarea"
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
import {
  calculatePurchaseOrder,
  createEmptyPurchaseOrderItem,
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatKRW,
  getLineSupplyAmount,
  getLineTotal,
  getLineVat,
  type PurchaseOrderData,
} from "@/lib/purchase-order"
import { cn } from "@/lib/utils"

interface PurchaseOrderFormProps {
  data: PurchaseOrderData
  onChange: (data: PurchaseOrderData) => void
  onReset: () => void
}

export function PurchaseOrderForm({
  data,
  onChange,
  onReset,
}: PurchaseOrderFormProps) {
  const totals = calculatePurchaseOrder(data.items)

  function updateSupplier(
    field: keyof PurchaseOrderData["supplier"],
    value: string
  ) {
    onChange({
      ...data,
      supplier: { ...data.supplier, [field]: value },
    })
  }

  function updateVendor(
    field: keyof PurchaseOrderData["vendor"],
    value: string
  ) {
    onChange({
      ...data,
      vendor: { ...data.vendor, [field]: value },
    })
  }

  function updateOrder(field: keyof PurchaseOrderData["order"], value: string) {
    onChange({
      ...data,
      order: { ...data.order, [field]: value },
    })
  }

  function updateItem(
    id: string,
    field: keyof Omit<PurchaseOrderData["items"][number], "id">,
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
      items: [...data.items, createEmptyPurchaseOrderItem()],
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
        <CardHeader className={cardHeaderClass}>
          <CardTitle>공급자 정보</CardTitle>
          <CardDescription>
            입력한 정보는 견적서 생성기와 동일하게 이 브라우저에 자동 저장됩니다.
          </CardDescription>
        </CardHeader>
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
          <CardTitle>발주처 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="상호명"
            value={data.vendor.companyName}
            onChange={(v) => updateVendor("companyName", v)}
            placeholder="거래처 상호"
            className="sm:col-span-2"
          />
          <FormField
            label="담당자명"
            value={data.vendor.contactName}
            onChange={(v) => updateVendor("contactName", v)}
            placeholder="담당자명"
          />
          <FormField
            label="연락처"
            value={data.vendor.phone}
            onChange={(v) => updateVendor("phone", formatPhoneNumber(v))}
            placeholder="010-0000-0000"
          />
          <FormField
            label="이메일"
            type="email"
            value={data.vendor.email}
            onChange={(v) => updateVendor("email", v)}
            placeholder="vendor@example.com"
            className="sm:col-span-2"
          />
          <FormField
            label="주소"
            value={data.vendor.address}
            onChange={(v) => updateVendor("address", v)}
            placeholder="서울특별시 ..."
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>발주 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="발주번호"
            value={data.order.number}
            onChange={(v) => updateOrder("number", v)}
            placeholder="PO-20260617-001"
            className="sm:col-span-2"
          />
          <FormField
            label="발주일자"
            type="date"
            value={data.order.date}
            onChange={(v) => updateOrder("date", v)}
          />
          <FormField
            label="납기일"
            type="date"
            value={data.order.deliveryDate}
            onChange={(v) => updateOrder("deliveryDate", v)}
          />
          <FormField
            label="납품장소"
            value={data.order.deliveryLocation}
            onChange={(v) => updateOrder("deliveryLocation", v)}
            placeholder="매장 주소 또는 창고"
            className="sm:col-span-2"
          />
          <FormField
            label="결제조건"
            value={data.order.paymentTerms}
            onChange={(v) => updateOrder("paymentTerms", v)}
            placeholder="선금 50%, 잔금 50%"
            className="sm:col-span-2"
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
          <CardTitle>품목 정보</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4" />
            행 추가
          </Button>
        </CardHeader>
        <CardContent className={cn("space-y-5", cardContentClass)}>
          <div className="overflow-x-auto">
            <Table className="min-w-[880px]">
              <TableHeader>
                <TableRow>
                  <TableHead>품목명</TableHead>
                  <TableHead className="w-20">규격</TableHead>
                  <TableHead className="w-16">수량</TableHead>
                  <TableHead className="w-20">단위</TableHead>
                  <TableHead className="w-24">단가</TableHead>
                  <TableHead className="w-24 text-right">공급가액</TableHead>
                  <TableHead className="w-20 text-right">부가세</TableHead>
                  <TableHead className="w-24 text-right">합계</TableHead>
                  <TableHead className="w-10" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.items.map((item) => {
                  const supply = getLineSupplyAmount(item)
                  const vat = getLineVat(item)
                  const total = getLineTotal(item)

                  return (
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
                      <TableCell className="text-right text-sm font-semibold tabular-nums">
                        {total ? formatKRW(total) : "-"}
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
              <span className="text-muted-foreground">총 부가세 (10%)</span>
              <span className="font-medium">{formatKRW(totals.vat)}원</span>
            </div>
            <div className="flex justify-between border-t border-border/60 pt-2 text-base">
              <span className="font-semibold">총 발주금액</span>
              <span className="font-bold text-primary">
                {formatKRW(totals.total)}원
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cn("gap-2", cardHeaderClass)}>
          <CardTitle>비고</CardTitle>
        </CardHeader>
        <CardContent className={cardContentClass}>
          <FormTextarea
            value={data.remarks}
            onChange={(v) => onChange({ ...data, remarks: v })}
            placeholder={
              "예: 납기 엄수 요청\n포장 상태 확인\n샘플 첨부"
            }
            rows={5}
          />
        </CardContent>
      </Card>
    </div>
  )
}
