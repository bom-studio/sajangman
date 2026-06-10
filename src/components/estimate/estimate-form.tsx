"use client"

import { Plus, Trash2 } from "lucide-react"

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
import {
  calculateEstimate,
  createEmptyItem,
  formatKRW,
  type EstimateData,
} from "@/lib/estimate"
import { formatBusinessNumber, formatPhoneNumber } from "@/lib/format-kr"
import { cn } from "@/lib/utils"

interface EstimateFormProps {
  data: EstimateData
  onChange: (data: EstimateData) => void
}

export function EstimateForm({ data, onChange }: EstimateFormProps) {
  const totals = calculateEstimate(data.items)

  function updateSupplier(
    field: keyof EstimateData["supplier"],
    value: string
  ) {
    onChange({
      ...data,
      supplier: { ...data.supplier, [field]: value },
    })
  }

  function updateCustomer(
    field: keyof EstimateData["customer"],
    value: string
  ) {
    onChange({
      ...data,
      customer: { ...data.customer, [field]: value },
    })
  }

  function updateEstimate(
    field: keyof EstimateData["estimate"],
    value: string
  ) {
    onChange({
      ...data,
      estimate: { ...data.estimate, [field]: value },
    })
  }

  function updateItem(
    id: string,
    field: keyof Omit<EstimateData["items"][number], "id">,
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
      items: [...data.items, createEmptyItem()],
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
      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>공급자 정보</CardTitle>
          <CardDescription>
            입력한 정보는 이 브라우저에 자동 저장됩니다.
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
            label="사업자번호"
            value={data.supplier.businessNumber}
            onChange={(v) =>
              updateSupplier("businessNumber", formatBusinessNumber(v))
            }
            placeholder="000-00-00000"
          />
          <FormField
            label="전화번호"
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
          <CardTitle>고객 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="고객명"
            value={data.customer.name}
            onChange={(v) => updateCustomer("name", v)}
            placeholder="김고객"
          />
          <FormField
            label="회사명"
            value={data.customer.companyName}
            onChange={(v) => updateCustomer("companyName", v)}
            placeholder="고객사"
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>견적 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="견적번호"
            value={data.estimate.number}
            onChange={(v) => updateEstimate("number", v)}
            placeholder="EST-20260101"
            className="sm:col-span-2"
          />
          <FormField
            label="작성일"
            type="date"
            value={data.estimate.date}
            onChange={(v) => updateEstimate("date", v)}
          />
          <FormField
            label="견적 유효기간"
            type="date"
            value={data.estimate.validUntil}
            onChange={(v) => updateEstimate("validUntil", v)}
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
          <CardTitle>품목</CardTitle>
          <Button type="button" variant="outline" size="sm" onClick={addItem}>
            <Plus className="size-4" />
            행 추가
          </Button>
        </CardHeader>
        <CardContent className={cn("space-y-5", cardContentClass)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>품목명</TableHead>
                <TableHead className="w-20">수량</TableHead>
                <TableHead className="w-28">단가</TableHead>
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
                      placeholder="품목명 입력"
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

          <div className="space-y-2 rounded-xl bg-muted/50 p-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">공급가액</span>
              <span className="font-medium">
                {formatKRW(totals.supplyAmount)}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">부가세 (10%)</span>
              <span className="font-medium">{formatKRW(totals.vat)}원</span>
            </div>
            <div className="flex justify-between border-t border-border/60 pt-2 text-base">
              <span className="font-semibold">총액</span>
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
          <CardDescription>
            결제 조건과 추가 안내사항을 견적서 하단에 표시합니다.
          </CardDescription>
        </CardHeader>
        <CardContent className={cardContentClass}>
          <FormTextarea
            value={data.remarks}
            onChange={(v) => onChange({ ...data, remarks: v })}
            placeholder={
              "예: 계약금 30%, 잔금 납품 시 결제\nVAT 별도, 설치비 별도, 발행일 기준 7일간 유효"
            }
            rows={5}
          />
        </CardContent>
      </Card>
    </div>
  )
}
