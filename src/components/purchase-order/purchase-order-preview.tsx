"use client"

import { Card, CardContent } from "@/components/ui/card"
import {
  calculatePurchaseOrder,
  DEFAULT_ESTIMATE_UNIT,
  formatDisplayDate,
  formatKRW,
  getLineSupplyAmount,
  getLineTotal,
  getLineVat,
  type PurchaseOrderData,
} from "@/lib/purchase-order"
import {
  formatBusinessNumber,
  formatPhoneNumber,
} from "@/lib/format-kr"
import { cn } from "@/lib/utils"
import { PURCHASE_ORDER_DOCUMENT_ID } from "@/lib/purchase-order-pdf"

const DOC = {
  text: "#0f172a",
  textMuted: "#64748b",
  textSecondary: "#475569",
  textBody: "#334155",
  textLight: "#94a3b8",
  textDark: "#1e293b",
  primary: "#2563eb",
  bg: "#ffffff",
  bgMuted: "#f8fafc",
  bgMutedSoft: "rgba(248, 250, 252, 0.5)",
  bgMutedStrong: "rgba(248, 250, 252, 0.8)",
  border: "#e2e8f0",
  borderMid: "#cbd5e1",
  borderStrong: "#1e293b",
} as const

interface PurchaseOrderPreviewProps {
  data: PurchaseOrderData
  className?: string
}

function PreviewField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  if (!value) return null

  return (
    <div className="flex gap-2 text-sm leading-relaxed">
      <span className="w-20 shrink-0" style={{ color: DOC.textMuted }}>
        {label}
      </span>
      <span className="font-medium" style={{ color: DOC.text }}>
        {value}
      </span>
    </div>
  )
}

function FooterField({
  label,
  value,
}: {
  label: string
  value: string
}) {
  if (!value) return null

  return (
    <div className="text-sm">
      <p className="font-semibold" style={{ color: DOC.textMuted }}>
        {label}
      </p>
      <p className="mt-1 leading-relaxed" style={{ color: DOC.textBody }}>
        {value}
      </p>
    </div>
  )
}

function RemarksSection({ remarks }: { remarks: string }) {
  const lines = remarks
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return null

  return (
    <FooterField label="비고" value={lines.join("\n")} />
  )
}

export function PurchaseOrderPreview({
  data,
  className,
}: PurchaseOrderPreviewProps) {
  const totals = calculatePurchaseOrder(data.items)
  const filledItems = data.items.filter(
    (item) => item.name || item.spec || item.quantity || item.unitPrice
  )
  const displayItems = filledItems.length > 0 ? filledItems : data.items

  const formattedBusinessNumber = data.supplier.businessNumber
    ? formatBusinessNumber(data.supplier.businessNumber)
    : ""
  const formattedSupplierPhone = data.supplier.phone
    ? formatPhoneNumber(data.supplier.phone)
    : ""
  const formattedVendorPhone = data.vendor.phone
    ? formatPhoneNumber(data.vendor.phone)
    : ""

  return (
    <Card
      className={cn(
        "border-0 py-0 shadow-md ring-1 ring-border/80 lg:sticky lg:top-20",
        className
      )}
    >
      <CardContent className="p-0">
        <div className="mx-auto w-full max-w-[210mm]">
          <div
            id={PURCHASE_ORDER_DOCUMENT_ID}
            className="min-h-[297mm] border p-6 sm:p-8 md:p-10"
            style={{
              backgroundColor: DOC.bg,
              color: DOC.text,
              borderColor: DOC.border,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
            }}
          >
            <div className="mb-6 text-center">
              <h2
                className="text-2xl font-bold tracking-[0.35em] sm:text-3xl"
                style={{ color: DOC.text }}
              >
                발 주 서
              </h2>
            </div>

            <div
              className="mb-7 flex flex-wrap gap-x-8 gap-y-3 border-y py-3 text-sm"
              style={{ borderColor: DOC.border }}
            >
              <div>
                <p style={{ color: DOC.textMuted }}>발주번호</p>
                <p className="font-medium" style={{ color: DOC.text }}>
                  {data.order.number || "-"}
                </p>
              </div>
              <div>
                <p style={{ color: DOC.textMuted }}>발주일자</p>
                <p className="font-medium" style={{ color: DOC.text }}>
                  {formatDisplayDate(data.order.date)}
                </p>
              </div>
            </div>

            <div className="mb-7 flex flex-col gap-6 sm:flex-row sm:justify-between">
              <div
                className="flex-1 space-y-2 rounded-lg border p-4"
                style={{
                  borderColor: DOC.border,
                  backgroundColor: DOC.bgMutedSoft,
                }}
              >
                <p
                  className="mb-2 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: DOC.primary }}
                >
                  공급자
                </p>
                <PreviewField label="상호" value={data.supplier.companyName} />
                <PreviewField
                  label="대표자"
                  value={data.supplier.representative}
                />
                <PreviewField
                  label="사업자번호"
                  value={formattedBusinessNumber}
                />
                <PreviewField label="주소" value={data.supplier.address} />
                <PreviewField
                  label="담당자"
                  value={data.supplier.contactPerson}
                />
                <PreviewField label="연락처" value={formattedSupplierPhone} />
                <PreviewField label="이메일" value={data.supplier.email} />
              </div>

              <div
                className="flex-1 space-y-2 rounded-lg border p-4"
                style={{
                  borderColor: DOC.border,
                  backgroundColor: DOC.bgMutedSoft,
                }}
              >
                <p
                  className="mb-2 text-xs font-semibold uppercase tracking-wide"
                  style={{ color: DOC.textMuted }}
                >
                  발주처
                </p>
                <PreviewField label="상호" value={data.vendor.companyName} />
                <PreviewField label="담당자" value={data.vendor.contactName} />
                <PreviewField label="연락처" value={formattedVendorPhone} />
                <PreviewField label="이메일" value={data.vendor.email} />
                <PreviewField label="주소" value={data.vendor.address} />
                {!data.vendor.companyName && (
                  <p className="text-sm" style={{ color: DOC.textLight }}>
                    -
                  </p>
                )}
              </div>
            </div>

            <div className="overflow-visible">
              <table className="w-full border-collapse text-xs sm:text-sm">
                <thead>
                  <tr
                    className="border-y-2"
                    style={{
                      borderColor: DOC.borderStrong,
                      backgroundColor: DOC.bgMuted,
                    }}
                  >
                    <th
                      className="w-8 px-1 py-2.5 text-center font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      NO
                    </th>
                    <th
                      className="min-w-0 px-2 py-2.5 text-left font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      품목명
                    </th>
                    <th
                      className="w-14 px-1 py-2.5 text-center font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      규격
                    </th>
                    <th
                      className="w-10 px-1 py-2.5 text-center font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      수량
                    </th>
                    <th
                      className="w-20 px-1 py-2.5 text-right font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      단가
                    </th>
                    <th
                      className="w-20 px-1 py-2.5 text-right font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      공급가액
                    </th>
                    <th
                      className="w-16 px-1 py-2.5 text-right font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      부가세
                    </th>
                    <th
                      className="w-20 px-1 py-2.5 text-right font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      합계
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item, index) => {
                    const supply = getLineSupplyAmount(item)
                    const vat = getLineVat(item)
                    const total = getLineTotal(item)

                    return (
                      <tr
                        key={item.id}
                        className="border-b last:border-b-0"
                        style={{ borderColor: DOC.border }}
                      >
                        <td
                          className="px-1 py-2.5 text-center"
                          style={{ color: DOC.textSecondary }}
                        >
                          {index + 1}
                        </td>
                        <td
                          className="min-w-0 px-2 py-2.5"
                          style={{ color: DOC.text }}
                        >
                          {item.name || "-"}
                        </td>
                        <td
                          className="px-1 py-2.5 text-center"
                          style={{ color: DOC.textBody }}
                        >
                          {item.spec || "-"}
                        </td>
                        <td
                          className="px-1 py-2.5 text-center"
                          style={{ color: DOC.textBody }}
                        >
                          {item.quantity
                            ? `${formatKRW(item.quantity)}${item.unit || DEFAULT_ESTIMATE_UNIT}`
                            : "-"}
                        </td>
                        <td
                          className="px-1 py-2.5 text-right"
                          style={{ color: DOC.textBody }}
                        >
                          {item.unitPrice ? formatKRW(item.unitPrice) : "-"}
                        </td>
                        <td
                          className="px-1 py-2.5 text-right"
                          style={{ color: DOC.textBody }}
                        >
                          {supply ? formatKRW(supply) : "-"}
                        </td>
                        <td
                          className="px-1 py-2.5 text-right"
                          style={{ color: DOC.textBody }}
                        >
                          {vat ? formatKRW(vat) : "-"}
                        </td>
                        <td
                          className="px-1 py-2.5 text-right font-medium"
                          style={{ color: DOC.text }}
                        >
                          {total ? formatKRW(total) : "-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div
                className="rounded-lg border px-4 py-3 text-sm"
                style={{
                  borderColor: DOC.border,
                  backgroundColor: DOC.bgMuted,
                }}
              >
                <p style={{ color: DOC.textMuted }}>총 발주금액</p>
                <p
                  className="mt-1 text-2xl font-bold tracking-tight"
                  style={{ color: DOC.primary }}
                >
                  ₩{formatKRW(totals.total)}
                </p>
              </div>

              <div
                className="w-full max-w-xs space-y-2 border p-4 text-sm sm:w-auto"
                style={{
                  borderColor: DOC.border,
                  backgroundColor: DOC.bgMutedStrong,
                }}
              >
                <div className="flex justify-between">
                  <span style={{ color: DOC.textSecondary }}>총 공급가액</span>
                  <span className="font-medium" style={{ color: DOC.text }}>
                    {formatKRW(totals.supplyAmount)}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span style={{ color: DOC.textSecondary }}>총 부가세</span>
                  <span className="font-medium" style={{ color: DOC.text }}>
                    {formatKRW(totals.vat)}원
                  </span>
                </div>
                <div
                  className="flex justify-between border-t pt-2 text-base"
                  style={{ borderColor: DOC.borderMid }}
                >
                  <span className="font-bold" style={{ color: DOC.text }}>
                    총 발주금액
                  </span>
                  <span className="font-bold" style={{ color: DOC.primary }}>
                    {formatKRW(totals.total)}원
                  </span>
                </div>
              </div>
            </div>

            <div
              className="mt-6 space-y-4 rounded-lg border p-4"
              style={{
                borderColor: DOC.border,
                backgroundColor: DOC.bgMutedSoft,
              }}
            >
              <FooterField
                label="납기일"
                value={
                  data.order.deliveryDate
                    ? formatDisplayDate(data.order.deliveryDate)
                    : ""
                }
              />
              <FooterField
                label="납품장소"
                value={data.order.deliveryLocation}
              />
              <FooterField label="결제조건" value={data.order.paymentTerms} />
              <RemarksSection remarks={data.remarks} />
            </div>

            <p
              className="mt-8 text-center text-xs"
              style={{ color: DOC.textLight }}
            >
              위와 같이 발주합니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
