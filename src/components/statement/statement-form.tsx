"use client"

import { Plus, Trash2 } from "lucide-react"

import { FormField } from "@/components/estimate/form-field"
import { SealControls } from "@/components/estimate/seal-signature"
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
import {
  BANK_OPTIONS,
  calculateStatement,
  createEmptyStatementItem,
  DEFAULT_BANK_NAME,
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatKRW,
  type StatementData,
} from "@/lib/statement"
import { formatBusinessNumber, formatPhoneNumber } from "@/lib/format-kr"
import { applyProfileToSupplierInfo } from "@/lib/apply-business-profile"
import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import { cn } from "@/lib/utils"

interface StatementFormProps {
  data: StatementData
  onChange: (data: StatementData) => void
  sealUrl: string | null
  onSealChange: (url: string | null) => void
}

export function StatementForm({
  data,
  onChange,
  sealUrl,
  onSealChange,
}: StatementFormProps) {
  const totals = calculateStatement(data.items)

  function updateSupplier(
    field: keyof StatementData["supplier"],
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
    onSealChange(profile.sealUrl ?? null)
  }

  function updateRecipient(
    field: keyof StatementData["recipient"],
    value: string
  ) {
    onChange({
      ...data,
      recipient: { ...data.recipient, [field]: value },
    })
  }

  function updateTransaction(
    field: keyof StatementData["transaction"],
    value: string
  ) {
    onChange({
      ...data,
      transaction: { ...data.transaction, [field]: value },
    })
  }

  function updateBankAccount(
    field: keyof StatementData["bankAccount"],
    value: string
  ) {
    onChange({
      ...data,
      bankAccount: { ...data.bankAccount, [field]: value },
    })
  }

  function updateItem(
    id: string,
    field: keyof Omit<StatementData["items"][number], "id">,
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
      items: [...data.items, createEmptyStatementItem()],
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
        <SupplierSectionHeader
          className={cardHeaderClass}
          description="입력한 정보는 이 브라우저에 자동 저장됩니다. 견적서와 공유됩니다."
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
          <div className="space-y-2 border-t border-border/60 pt-4 sm:col-span-2">
            <p className="text-sm font-medium">회사 직인</p>
            <p className="text-xs text-muted-foreground">
              미리보기 공급자 정보의 대표자명 옆에 표시됩니다.
            </p>
            <SealControls sealUrl={sealUrl} onSealChange={onSealChange} />
          </div>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>거래처 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="거래처명"
            value={data.recipient.companyName}
            onChange={(v) => updateRecipient("companyName", v)}
            placeholder="거래처명"
            className="sm:col-span-2"
          />
          <FormField
            label="담당자"
            value={data.recipient.contactName}
            onChange={(v) => updateRecipient("contactName", v)}
            placeholder="담당자명"
          />
          <FormField
            label="전화번호"
            value={data.recipient.phone}
            onChange={(v) => updateRecipient("phone", formatPhoneNumber(v))}
            placeholder="010-0000-0000"
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>거래 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="거래번호"
            value={data.transaction.number}
            onChange={(v) => updateTransaction("number", v)}
            placeholder="STM-20260611"
            className="sm:col-span-2"
          />
          <FormField
            label="작성일"
            type="date"
            value={data.transaction.date}
            onChange={(v) => updateTransaction("date", v)}
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
          <div className="overflow-x-auto">
            <Table className="min-w-[720px]">
              <TableHeader>
                <TableRow>
                  <TableHead>품목명</TableHead>
                  <TableHead className="w-20">규격</TableHead>
                  <TableHead className="w-16">수량</TableHead>
                  <TableHead className="w-20">단위</TableHead>
                  <TableHead className="w-24">단가</TableHead>
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
                        placeholder="A4"
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
              <span className="text-muted-foreground">수량</span>
              <span className="font-medium">{formatKRW(totals.quantitySum)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">공급가액</span>
              <span className="font-medium">
                {formatKRW(totals.supplyAmount)}원
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">VAT</span>
              <span className="font-medium">{formatKRW(totals.vat)}원</span>
            </div>
            <div className="flex justify-between border-t border-border/60 pt-2 text-base">
              <span className="font-semibold">합계</span>
              <span className="font-bold text-primary">
                {formatKRW(totals.total)}원
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>입금 계좌</CardTitle>
          <CardDescription>
            입력한 계좌 정보는 이 브라우저에 자동 저장됩니다.
          </CardDescription>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium text-foreground">은행명</label>
            <select
              value={data.bankAccount.bankName || DEFAULT_BANK_NAME}
              onChange={(e) => updateBankAccount("bankName", e.target.value)}
              className={cn(
                "h-9 w-full min-w-0 rounded-md border border-input bg-transparent px-2.5 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:text-sm"
              )}
            >
              {BANK_OPTIONS.map((bank) => (
                <option key={bank} value={bank}>
                  {bank}
                </option>
              ))}
            </select>
          </div>
          <FormField
            label="계좌번호"
            value={data.bankAccount.accountNumber}
            onChange={(v) => updateBankAccount("accountNumber", v)}
            placeholder="123-456-789012"
            className="sm:col-span-2"
          />
          <FormField
            label="예금주"
            value={data.bankAccount.accountHolder}
            onChange={(v) => updateBankAccount("accountHolder", v)}
            placeholder="홍길동"
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>
    </div>
  )
}
