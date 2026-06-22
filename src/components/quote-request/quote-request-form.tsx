"use client"

import { useRef } from "react"
import { Plus, RotateCcw, Trash2, Upload } from "lucide-react"

import { FormField } from "@/components/estimate/form-field"
import { FormTextarea } from "@/components/estimate/form-textarea"
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
import { formatPhoneNumber } from "@/lib/format-kr"
import { applyProfileToQuoteRequestRequester } from "@/lib/apply-business-profile"
import {
  ATTACHMENT_ACCEPT,
  createEmptyQuoteRequestItem,
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatFileSize,
  REQUEST_CONDITION_OPTIONS,
  SELECTION_CRITERIA_OPTIONS,
  type QuoteRequestAttachment,
  type QuoteRequestConditions,
  type QuoteRequestContact,
  type QuoteRequestData,
  type QuoteRequestRequester,
  type SelectionCriteria,
} from "@/lib/quote-request"
import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import { cn } from "@/lib/utils"

interface QuoteRequestFormProps {
  data: QuoteRequestData
  onChange: (data: QuoteRequestData) => void
  onReset: () => void
  sealUrl: string | null
  onSealChange: (url: string | null) => void
}

export function QuoteRequestForm({
  data,
  onChange,
  onReset,
  sealUrl,
  onSealChange,
}: QuoteRequestFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function updateRequester(
    field: keyof QuoteRequestRequester,
    value: string
  ) {
    onChange({
      ...data,
      requester: { ...data.requester, [field]: value },
    })
  }

  function handleSelectProfile(profile: BusinessProfile) {
    onChange({
      ...data,
      requester: applyProfileToQuoteRequestRequester(data.requester, profile),
    })
    onSealChange(profile.sealUrl ?? null)
  }

  function updateTarget(field: keyof QuoteRequestContact, value: string) {
    onChange({
      ...data,
      target: { ...data.target, [field]: value },
    })
  }

  function updateRequest(
    field: keyof QuoteRequestData["request"],
    value: string
  ) {
    onChange({
      ...data,
      request: { ...data.request, [field]: value },
    })
  }

  function updateItem(
    id: string,
    field: keyof Omit<QuoteRequestData["items"][number], "id">,
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
      items: [...data.items, createEmptyQuoteRequestItem()],
    })
  }

  function removeItem(id: string) {
    if (data.items.length <= 1) return
    onChange({
      ...data,
      items: data.items.filter((item) => item.id !== id),
    })
  }

  function toggleCondition(key: keyof QuoteRequestConditions) {
    onChange({
      ...data,
      conditions: {
        ...data.conditions,
        [key]: !data.conditions[key],
      },
    })
  }

  function toggleCriteria(key: keyof SelectionCriteria) {
    onChange({
      ...data,
      selectionCriteria: {
        ...data.selectionCriteria,
        [key]: !data.selectionCriteria[key],
      },
    })
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const files = event.target.files
    if (!files?.length) return

    const newAttachments: QuoteRequestAttachment[] = Array.from(files).map(
      (file) => ({
        id: crypto.randomUUID(),
        name: file.name,
        size: file.size,
      })
    )

    onChange({
      ...data,
      attachments: [...data.attachments, ...newAttachments],
    })

    event.target.value = ""
  }

  function removeAttachment(id: string) {
    onChange({
      ...data,
      attachments: data.attachments.filter((file) => file.id !== id),
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
          title="요청자 정보"
          description="입력한 정보는 이 브라우저에 자동 저장됩니다."
          onSelectProfile={handleSelectProfile}
        />
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="회사명"
            value={data.requester.companyName}
            onChange={(v) => updateRequester("companyName", v)}
            placeholder="(주)사장만"
            className="sm:col-span-2"
          />
          <FormField
            label="담당자명"
            value={data.requester.contactName}
            onChange={(v) => updateRequester("contactName", v)}
            placeholder="김담당"
          />
          <FormField
            label="연락처"
            value={data.requester.phone}
            onChange={(v) => updateRequester("phone", formatPhoneNumber(v))}
            placeholder="010-0000-0000"
          />
          <FormField
            label="이메일"
            type="email"
            value={data.requester.email}
            onChange={(v) => updateRequester("email", v)}
            placeholder="contact@example.com"
            className="sm:col-span-2"
          />
          <FormField
            label="주소"
            value={data.requester.address}
            onChange={(v) => updateRequester("address", v)}
            placeholder="서울특별시 ..."
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>견적 요청 대상</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="업체명"
            value={data.target.companyName}
            onChange={(v) => updateTarget("companyName", v)}
            placeholder="묵향인쇄"
            className="sm:col-span-2"
          />
          <FormField
            label="담당자명"
            value={data.target.contactName}
            onChange={(v) => updateTarget("contactName", v)}
            placeholder="담당자명"
          />
          <FormField
            label="연락처"
            value={data.target.phone}
            onChange={(v) => updateTarget("phone", formatPhoneNumber(v))}
            placeholder="010-0000-0000"
          />
          <FormField
            label="이메일"
            type="email"
            value={data.target.email}
            onChange={(v) => updateTarget("email", v)}
            placeholder="vendor@example.com"
            className="sm:col-span-2"
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>요청 정보</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-5 sm:grid-cols-2", cardContentClass)}>
          <FormField
            label="요청번호"
            value={data.request.number}
            onChange={(v) => updateRequest("number", v)}
            placeholder="RFQ-20260617-001"
            className="sm:col-span-2"
          />
          <FormField
            label="작성일"
            type="date"
            value={data.request.writtenDate}
            onChange={(v) => updateRequest("writtenDate", v)}
          />
          <div className="hidden sm:block" />
          <FormField
            label="희망 납기일"
            type="date"
            value={data.request.desiredDeliveryDate}
            onChange={(v) => updateRequest("desiredDeliveryDate", v)}
          />
          <FormField
            label="제출 마감일"
            type="date"
            value={data.request.submissionDeadline}
            onChange={(v) => updateRequest("submissionDeadline", v)}
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
          <CardTitle>견적 요청 품목</CardTitle>
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
                  <TableHead className="w-32">요청사항</TableHead>
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
                        value={item.note}
                        onChange={(e) =>
                          updateItem(item.id, "note", e.target.value)
                        }
                        placeholder="요청사항"
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
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>요청 조건</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-3 sm:grid-cols-2", cardContentClass)}>
          {REQUEST_CONDITION_OPTIONS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-start gap-3 rounded-lg border border-border/70 px-4 py-3"
            >
              <input
                type="checkbox"
                checked={data.conditions[key]}
                onChange={() => toggleCondition(key)}
                className="mt-0.5 size-4 accent-primary"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>업체 선정 기준</CardTitle>
        </CardHeader>
        <CardContent className={cn("grid gap-3 sm:grid-cols-3", cardContentClass)}>
          {SELECTION_CRITERIA_OPTIONS.map(({ key, label }) => (
            <label
              key={key}
              className="flex items-start gap-3 rounded-lg border border-border/70 px-4 py-3"
            >
              <input
                type="checkbox"
                checked={data.selectionCriteria[key]}
                onChange={() => toggleCriteria(key)}
                className="mt-0.5 size-4 accent-primary"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>세부 요청사항</CardTitle>
        </CardHeader>
        <CardContent className={cardContentClass}>
          <FormTextarea
            value={data.details}
            onChange={(v) => onChange({ ...data, details: v })}
            placeholder={
              "예: 명함 500매 양면 컬러\n코팅 포함\n시안 2종 제안 요청\n수정 2회 포함"
            }
            rows={6}
          />
        </CardContent>
      </Card>

      <Card className={cardClass}>
        <CardHeader className={cardHeaderClass}>
          <CardTitle>첨부자료</CardTitle>
          <CardDescription>
            PDF 출력에는 파일명만 표시됩니다. 실제 파일은 이메일 등으로 별도
            전송하세요.
          </CardDescription>
        </CardHeader>
        <CardContent className={cn("space-y-4", cardContentClass)}>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept={ATTACHMENT_ACCEPT}
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="size-4" />
              파일 업로드
            </Button>
            <p className="mt-2 text-xs text-muted-foreground">
              PDF, JPG, PNG, ZIP 지원
            </p>
          </div>
          {data.attachments.length > 0 && (
            <ul className="space-y-2">
              {data.attachments.map((file) => (
                <li
                  key={file.id}
                  className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2 text-sm"
                >
                  <span className="min-w-0 truncate">{file.name}</span>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(file.size)}
                    </span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeAttachment(file.id)}
                      aria-label="첨부 삭제"
                    >
                      <Trash2 className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
