"use client"

import { useState } from "react"
import { Plus, RotateCcw, Trash2 } from "lucide-react"

import { FormField } from "@/components/estimate/form-field"
import { FormTextarea } from "@/components/estimate/form-textarea"
import { SealEditorDialog } from "@/components/estimate/seal-editor-dialog"
import { SupplierSelectorButton } from "@/components/documents/supplier-selector-button"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { calculatorSelectClassName } from "@/components/calculators/calculator-styles"
import { formatBusinessNumber, formatPhoneNumber } from "@/lib/format-kr"
import { applyProfileToContractParty } from "@/lib/apply-business-profile"
import {
  calculateSupplyContract,
  createEmptySupplyContractItem,
  DEFAULT_ESTIMATE_UNIT,
  ENTITY_TYPE_LABEL,
  ESTIMATE_UNIT_OPTIONS,
  formatKRW,
  getAutoRenewalText,
  getLineSupplyAmount,
  getLineTotal,
  getLineVat,
  PAYMENT_METHOD_LABEL,
  SHIPPING_COST_LABEL,
  type BusinessEntityType,
  type ContractParty,
  type PaymentMethod,
  type ShippingCostBearer,
  type SupplyContractData,
} from "@/lib/supply-contract"
import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import { cn } from "@/lib/utils"

interface SupplyContractFormProps {
  data: SupplyContractData
  onChange: (data: SupplyContractData) => void
  supplierSealUrl: string | null
  buyerSealUrl: string | null
  onSupplierSealChange: (url: string | null) => void
  onBuyerSealChange: (url: string | null) => void
  onResetRequest: () => void
}

function SealUploadControls({
  label,
  sealUrl,
  onSealChange,
}: {
  label: string
  sealUrl: string | null
  onSealChange: (url: string | null) => void
}) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="space-y-2">
        <p className="text-sm font-medium">{label}</p>
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
              alt={`${label} 미리보기`}
              className="size-10 rounded border object-contain p-0.5"
            />
          )}
        </div>
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
  onSelectProfile,
}: {
  title: string
  party: ContractParty
  onUpdate: (field: keyof ContractParty, value: string) => void
  onSelectProfile?: (profile: BusinessProfile) => void
}) {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-semibold">{title}</p>
        {onSelectProfile ? (
          <SupplierSelectorButton onSelect={onSelectProfile} />
        ) : null}
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label className="text-sm font-medium">사업자 유형</label>
          <select
            value={party.entityType}
            onChange={(e) =>
              onUpdate("entityType", e.target.value as BusinessEntityType)
            }
            className={calculatorSelectClassName}
          >
            {(Object.keys(ENTITY_TYPE_LABEL) as BusinessEntityType[]).map(
              (key) => (
                <option key={key} value={key}>
                  {ENTITY_TYPE_LABEL[key]}
                </option>
              )
            )}
          </select>
        </div>
        <FormField
          label="상호명"
          value={party.companyName}
          onChange={(v) => onUpdate("companyName", v)}
          className="sm:col-span-2"
        />
        <FormField
          label="대표자명"
          value={party.representative}
          onChange={(v) => onUpdate("representative", v)}
        />
        <FormField
          label="사업자등록번호"
          value={party.businessNumber}
          onChange={(v) => onUpdate("businessNumber", formatBusinessNumber(v))}
        />
        <FormField
          label="업태"
          value={party.businessType}
          onChange={(v) => onUpdate("businessType", v)}
        />
        <FormField
          label="종목"
          value={party.businessItem}
          onChange={(v) => onUpdate("businessItem", v)}
        />
        <FormField
          label="담당자"
          value={party.contactPerson}
          onChange={(v) => onUpdate("contactPerson", v)}
        />
        <FormField
          label="연락처"
          value={party.phone}
          onChange={(v) => onUpdate("phone", formatPhoneNumber(v))}
        />
        <FormField
          label="이메일"
          type="email"
          value={party.email}
          onChange={(v) => onUpdate("email", v)}
          className="sm:col-span-2"
        />
        <FormField
          label="주소"
          value={party.address}
          onChange={(v) => onUpdate("address", v)}
          className="sm:col-span-2"
        />
      </div>
    </div>
  )
}

export function SupplyContractForm({
  data,
  onChange,
  supplierSealUrl,
  buyerSealUrl,
  onSupplierSealChange,
  onBuyerSealChange,
  onResetRequest,
}: SupplyContractFormProps) {
  const totals = calculateSupplyContract(data.items)
  const cardClass =
    "gap-0 overflow-hidden rounded-2xl border border-border/70 py-0 shadow-sm"

  function updateSupplier(field: keyof ContractParty, value: string) {
    onChange({ ...data, supplier: { ...data.supplier, [field]: value } })
  }

  function handleSelectProfile(profile: BusinessProfile) {
    onChange({
      ...data,
      supplier: applyProfileToContractParty(data.supplier, profile),
    })
    if (profile.sealUrl) {
      onSupplierSealChange(profile.sealUrl)
    }
  }

  function updateBuyer(field: keyof ContractParty, value: string) {
    onChange({ ...data, buyer: { ...data.buyer, [field]: value } })
  }

  function updateItem(
    id: string,
    field: keyof Omit<SupplyContractData["items"][number], "id">,
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
      items: [...data.items, createEmptySupplyContractItem()],
    })
  }

  function removeItem(id: string) {
    if (data.items.length <= 1) return
    onChange({ ...data, items: data.items.filter((item) => item.id !== id) })
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-end">
        <Button type="button" variant="outline" size="sm" onClick={onResetRequest}>
          <RotateCcw className="size-4" />
          초기화
        </Button>
      </div>

      <Accordion
        type="multiple"
        defaultValue={["parties", "items", "period", "payment", "delivery"]}
        className="space-y-4"
      >
        <AccordionItem value="parties" className={cn(cardClass, "border px-0")}>
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-base font-semibold">1. 당사자 정보</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-5 px-6 pb-5">
            <PartyFields
              title="공급자"
              party={data.supplier}
              onUpdate={updateSupplier}
              onSelectProfile={handleSelectProfile}
            />
            <PartyFields title="구매자" party={data.buyer} onUpdate={updateBuyer} />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="items" className={cn(cardClass, "border px-0")}>
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-base font-semibold">2. 공급 물품</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 px-6 pb-5">
            <div className="flex justify-end">
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="size-4" />
                행 추가
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table className="min-w-[960px]">
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-28">납품기한</TableHead>
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
                        <TableCell>
                          <Input
                            type="date"
                            value={item.deliveryDeadline}
                            onChange={(e) =>
                              updateItem(item.id, "deliveryDeadline", e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
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
                            className={calculatorSelectClassName}
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
                        <TableCell className="text-right text-sm tabular-nums">
                          {supply ? formatKRW(supply) : "-"}
                        </TableCell>
                        <TableCell className="text-right text-sm tabular-nums">
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
                <span>{formatKRW(totals.supplyAmount)}원</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">총 부가세</span>
                <span>{formatKRW(totals.vat)}원</span>
              </div>
              <div className="flex justify-between border-t border-border/60 pt-2 font-bold text-primary">
                <span>총 계약금액</span>
                <span>{formatKRW(totals.total)}원</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="period" className={cn(cardClass, "border px-0")}>
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-base font-semibold">3. 계약 기간 및 해지</span>
          </AccordionTrigger>
          <AccordionContent className="grid gap-4 px-6 pb-5 sm:grid-cols-2">
            <FormField
              label="계약 시작일"
              type="date"
              value={data.contractPeriod.startDate}
              onChange={(v) =>
                onChange({
                  ...data,
                  contractPeriod: { ...data.contractPeriod, startDate: v },
                })
              }
            />
            <FormField
              label="계약 종료일"
              type="date"
              value={data.contractPeriod.endDate}
              onChange={(v) =>
                onChange({
                  ...data,
                  contractPeriod: { ...data.contractPeriod, endDate: v },
                })
              }
            />
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">자동 연장</label>
              <select
                value={data.contractPeriod.autoRenewal ? "yes" : "no"}
                onChange={(e) =>
                  onChange({
                    ...data,
                    contractPeriod: {
                      ...data.contractPeriod,
                      autoRenewal: e.target.value === "yes",
                    },
                  })
                }
                className={calculatorSelectClassName}
              >
                <option value="yes">자동연장</option>
                <option value="no">자동연장 안 함</option>
              </select>
              <p className="text-xs text-muted-foreground">
                {getAutoRenewalText(data.contractPeriod.autoRenewal)}
              </p>
            </div>
            <FormField
              label="해지 통보 기한"
              value={data.contractPeriod.terminationNoticeDays}
              onChange={(v) =>
                onChange({
                  ...data,
                  contractPeriod: {
                    ...data.contractPeriod,
                    terminationNoticeDays: v,
                  },
                })
              }
              placeholder="30일 전"
            />
            <FormField
              label="계약 해지 가능 사유"
              value={data.contractPeriod.terminationReasons}
              onChange={(v) =>
                onChange({
                  ...data,
                  contractPeriod: {
                    ...data.contractPeriod,
                    terminationReasons: v,
                  },
                })
              }
              className="sm:col-span-2"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payment" className={cn(cardClass, "border px-0")}>
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-base font-semibold">4. 대금 지급 조건</span>
          </AccordionTrigger>
          <AccordionContent className="grid gap-4 px-6 pb-5 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">지급 방식</label>
              <select
                value={data.paymentTerms.method}
                onChange={(e) =>
                  onChange({
                    ...data,
                    paymentTerms: {
                      ...data.paymentTerms,
                      method: e.target.value as PaymentMethod,
                    },
                  })
                }
                className={calculatorSelectClassName}
              >
                {(Object.keys(PAYMENT_METHOD_LABEL) as PaymentMethod[]).map(
                  (key) => (
                    <option key={key} value={key}>
                      {PAYMENT_METHOD_LABEL[key]}
                    </option>
                  )
                )}
              </select>
            </div>
            <FormField
              label="계약금 비율 (%)"
              value={String(data.paymentTerms.depositRatio)}
              onChange={(v) =>
                onChange({
                  ...data,
                  paymentTerms: {
                    ...data.paymentTerms,
                    depositRatio: Number(v) || 0,
                  },
                })
              }
            />
            <FormField
              label="잔금 비율 (%)"
              value={String(data.paymentTerms.balanceRatio)}
              onChange={(v) =>
                onChange({
                  ...data,
                  paymentTerms: {
                    ...data.paymentTerms,
                    balanceRatio: Number(v) || 0,
                  },
                })
              }
            />
            <FormField
              label="지급기한"
              value={data.paymentTerms.paymentDeadline}
              onChange={(v) =>
                onChange({
                  ...data,
                  paymentTerms: { ...data.paymentTerms, paymentDeadline: v },
                })
              }
              className="sm:col-span-2"
            />
            <FormField
              label="입금 계좌"
              value={data.paymentTerms.bankAccount}
              onChange={(v) =>
                onChange({
                  ...data,
                  paymentTerms: { ...data.paymentTerms, bankAccount: v },
                })
              }
              placeholder="국민은행 123-456-789012 (주)사장만"
              className="sm:col-span-2"
            />
            <label className="flex items-center gap-2 sm:col-span-2">
              <input
                type="checkbox"
                checked={data.paymentTerms.issueTaxInvoice}
                onChange={(e) =>
                  onChange({
                    ...data,
                    paymentTerms: {
                      ...data.paymentTerms,
                      issueTaxInvoice: e.target.checked,
                    },
                  })
                }
                className="size-4 accent-primary"
              />
              <span className="text-sm">세금계산서 발행</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={data.paymentTerms.lateInterest}
                onChange={(e) =>
                  onChange({
                    ...data,
                    paymentTerms: {
                      ...data.paymentTerms,
                      lateInterest: e.target.checked,
                    },
                  })
                }
                className="size-4 accent-primary"
              />
              <span className="text-sm">지연이자 적용</span>
            </label>
            {data.paymentTerms.lateInterest && (
              <FormField
                label="지연이자율 (%)"
                value={String(data.paymentTerms.lateInterestRate)}
                onChange={(v) =>
                  onChange({
                    ...data,
                    paymentTerms: {
                      ...data.paymentTerms,
                      lateInterestRate: Number(v) || 0,
                    },
                  })
                }
              />
            )}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="delivery" className={cn(cardClass, "border px-0")}>
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-base font-semibold">5. 물품 인도 및 검수</span>
          </AccordionTrigger>
          <AccordionContent className="grid gap-4 px-6 pb-5 sm:grid-cols-2">
            <FormField
              label="납품 장소"
              value={data.deliveryTerms.location}
              onChange={(v) =>
                onChange({
                  ...data,
                  deliveryTerms: { ...data.deliveryTerms, location: v },
                })
              }
              className="sm:col-span-2"
            />
            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-sm font-medium">운송 비용 부담</label>
              <select
                value={data.deliveryTerms.shippingCostBearer}
                onChange={(e) =>
                  onChange({
                    ...data,
                    deliveryTerms: {
                      ...data.deliveryTerms,
                      shippingCostBearer: e.target.value as ShippingCostBearer,
                    },
                  })
                }
                className={calculatorSelectClassName}
              >
                {(Object.keys(SHIPPING_COST_LABEL) as ShippingCostBearer[]).map(
                  (key) => (
                    <option key={key} value={key}>
                      {SHIPPING_COST_LABEL[key]}
                    </option>
                  )
                )}
              </select>
            </div>
            <FormField
              label="검수 기한"
              value={data.inspectionTerms.inspectionDeadline}
              onChange={(v) =>
                onChange({
                  ...data,
                  inspectionTerms: {
                    ...data.inspectionTerms,
                    inspectionDeadline: v,
                  },
                })
              }
            />
            <FormField
              label="소유권 이전 시점"
              value={data.inspectionTerms.ownershipTransferTiming}
              onChange={(v) =>
                onChange({
                  ...data,
                  inspectionTerms: {
                    ...data.inspectionTerms,
                    ownershipTransferTiming: v,
                  },
                })
              }
            />
            <FormField
              label="불량·하자 처리"
              value={data.inspectionTerms.defectHandling}
              onChange={(v) =>
                onChange({
                  ...data,
                  inspectionTerms: {
                    ...data.inspectionTerms,
                    defectHandling: v,
                  },
                })
              }
              className="sm:col-span-2"
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="legal" className={cn(cardClass, "border px-0")}>
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-base font-semibold">6. 비밀유지 및 지식재산권</span>
          </AccordionTrigger>
          <AccordionContent className="space-y-3 px-6 pb-5">
            {(
              [
                ["confidentiality", "비밀유지 조항 포함"],
                ["intellectualProperty", "지식재산권 조항 포함"],
                ["resaleRestriction", "재판매 제한 조항 포함"],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={data.legalOptions[key]}
                  onChange={(e) =>
                    onChange({
                      ...data,
                      legalOptions: {
                        ...data.legalOptions,
                        [key]: e.target.checked,
                      },
                    })
                  }
                  className="mt-0.5 size-4 accent-primary"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="special" className={cn(cardClass, "border px-0")}>
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-base font-semibold">7. 특약사항</span>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-5">
            <FormTextarea
              value={data.specialTerms}
              onChange={(v) => onChange({ ...data, specialTerms: v })}
              placeholder="샘플 확인 후 본 생산 진행 등"
              rows={5}
            />
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="signing" className={cn(cardClass, "border px-0")}>
          <AccordionTrigger className="px-6 py-4 hover:no-underline">
            <span className="text-base font-semibold">8. 계약 체결 정보</span>
          </AccordionTrigger>
          <AccordionContent className="grid gap-5 px-6 pb-5 sm:grid-cols-2">
            <FormField
              label="계약 작성일"
              type="date"
              value={data.signing.writtenDate}
              onChange={(v) =>
                onChange({
                  ...data,
                  signing: { ...data.signing, writtenDate: v },
                })
              }
            />
            <FormField
              label="계약 체결 장소"
              value={data.signing.place}
              onChange={(v) =>
                onChange({
                  ...data,
                  signing: { ...data.signing, place: v },
                })
              }
            />
            <div className="sm:col-span-2">
              <SealUploadControls
                label="공급자 직인"
                sealUrl={supplierSealUrl}
                onSealChange={onSupplierSealChange}
              />
            </div>
            <div className="sm:col-span-2">
              <SealUploadControls
                label="구매자 직인"
                sealUrl={buyerSealUrl}
                onSealChange={onBuyerSealChange}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
