"use client"

import { SealUpload } from "@/components/estimate/seal-upload"
import { Card, CardContent } from "@/components/ui/card"
import { numberToKorean } from "@/lib/number-to-korean"
import {
  formatBusinessNumber,
  formatPhoneNumber,
} from "@/lib/format-kr"
import {
  calculateStatement,
  DEFAULT_ESTIMATE_UNIT,
  formatDisplayDate,
  formatKRW,
  getLineSupplyAmount,
  getLineVat,
  type StatementData,
} from "@/lib/statement"
import { cn } from "@/lib/utils"

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
  borderLight: "#f1f5f9",
  borderStrong: "#1e293b",
} as const

interface StatementPreviewProps {
  data: StatementData
  sealUrl: string | null
  onSealChange: (url: string | null) => void
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

export function StatementPreview({
  data,
  sealUrl,
  onSealChange,
  className,
}: StatementPreviewProps) {
  const totals = calculateStatement(data.items)
  const filledItems = data.items.filter(
    (item) =>
      item.name ||
      item.spec ||
      item.quantity ||
      item.unitPrice ||
      item.note
  )
  const displayItems = filledItems.length > 0 ? filledItems : data.items

  const formattedBusinessNumber = data.supplier.businessNumber
    ? formatBusinessNumber(data.supplier.businessNumber)
    : ""
  const formattedSupplierPhone = data.supplier.phone
    ? formatPhoneNumber(data.supplier.phone)
    : ""
  const formattedRecipientPhone = data.recipient.phone
    ? formatPhoneNumber(data.recipient.phone)
    : ""

  const hasBankInfo =
    data.bankAccount.bankName ||
    data.bankAccount.accountHolder ||
    data.bankAccount.accountNumber

  return (
    <Card
      className={cn(
        "border-0 py-0 shadow-md ring-1 ring-border/80 lg:sticky lg:top-20",
        className
      )}
    >
      <CardContent className="p-0">
        <div
          id="statement-document"
          className="border p-6 sm:p-8 md:p-10"
          style={{
            backgroundColor: DOC.bg,
            color: DOC.text,
            borderColor: DOC.border,
            boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
          }}
        >
          <div className="mb-6 text-center">
            <h2
              className="text-2xl font-bold tracking-[0.2em] sm:text-3xl"
              style={{ color: DOC.text }}
            >
              거 래 명 세 서
            </h2>
          </div>

          <div
            className="mb-7 flex flex-wrap gap-x-8 gap-y-3 border-y py-3 text-sm"
            style={{ borderColor: DOC.border }}
          >
            <div>
              <p style={{ color: DOC.textMuted }}>거래번호</p>
              <p className="font-medium" style={{ color: DOC.text }}>
                {data.transaction.number || "-"}
              </p>
            </div>
            <div>
              <p style={{ color: DOC.textMuted }}>작성일</p>
              <p className="font-medium" style={{ color: DOC.text }}>
                {formatDisplayDate(data.transaction.date)}
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
                style={{ color: DOC.textMuted }}
              >
                수신
              </p>
              <PreviewField
                label="거래처명"
                value={data.recipient.companyName}
              />
              <PreviewField label="담당자" value={data.recipient.contactName} />
              <PreviewField label="전화번호" value={formattedRecipientPhone} />
              {!data.recipient.companyName &&
                !data.recipient.contactName &&
                !formattedRecipientPhone && (
                  <p className="text-sm" style={{ color: DOC.textLight }}>
                    -
                  </p>
                )}
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
                style={{ color: DOC.primary }}
              >
                공급자
              </p>
              <PreviewField label="상호명" value={data.supplier.companyName} />
              <PreviewField
                label="대표자"
                value={data.supplier.representative}
              />
              <PreviewField
                label="사업자번호"
                value={formattedBusinessNumber}
              />
              <PreviewField label="전화" value={formattedSupplierPhone} />
              <PreviewField label="이메일" value={data.supplier.email} />
              <PreviewField label="주소" value={data.supplier.address} />
              {!data.supplier.companyName &&
                !data.supplier.representative &&
                !formattedBusinessNumber &&
                !formattedSupplierPhone &&
                !data.supplier.email &&
                !data.supplier.address && (
                  <p className="text-sm" style={{ color: DOC.textLight }}>
                    -
                  </p>
                )}
            </div>
          </div>

          <div
            className="mb-7 flex items-center justify-between gap-4 border-y py-3.5 text-sm"
            style={{
              borderColor: DOC.border,
              backgroundColor: DOC.bgMuted,
            }}
          >
            <span
              className="shrink-0 font-semibold"
              style={{ color: DOC.textDark }}
            >
              합계금액
            </span>
            <span
              className="text-right font-medium leading-relaxed"
              style={{ color: DOC.text }}
            >
              일금 {numberToKorean(totals.total)}원정
              <br />
              (₩{formatKRW(totals.total)})
            </span>
          </div>

          <div className="overflow-x-auto overflow-y-visible">
            <table className="w-full min-w-[640px] border-collapse text-xs">
              <thead>
                <tr
                  className="border-y-2"
                  style={{
                    borderColor: DOC.borderStrong,
                    backgroundColor: DOC.bgMuted,
                  }}
                >
                  {[
                    { label: "No", className: "w-8 text-center" },
                    { label: "품목명", className: "min-w-0 text-left" },
                    { label: "규격", className: "w-14 text-center" },
                    { label: "수량", className: "w-12 text-center" },
                    { label: "단위", className: "w-10 text-center" },
                    { label: "단가", className: "w-20 text-right" },
                    { label: "공급가액", className: "w-20 text-right" },
                    { label: "부가세", className: "w-16 text-right" },
                    { label: "비고", className: "w-20 text-left" },
                  ].map((col) => (
                    <th
                      key={col.label}
                      className={cn(
                        "px-1.5 py-2 font-semibold",
                        col.className
                      )}
                      style={{ color: DOC.textDark }}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item, index) => {
                  const supplyAmount = getLineSupplyAmount(item)
                  const lineVat = getLineVat(item)
                  const hasContent =
                    item.name ||
                    item.spec ||
                    item.quantity ||
                    item.unitPrice ||
                    item.note

                  return (
                    <tr
                      key={item.id}
                      className="border-b last:border-b-0"
                      style={{ borderColor: DOC.border }}
                    >
                      <td
                        className="px-1.5 py-2 text-center"
                        style={{ color: DOC.textSecondary }}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="min-w-0 px-1.5 py-2"
                        style={{ color: DOC.text }}
                      >
                        {item.name || "-"}
                      </td>
                      <td
                        className="px-1.5 py-2 text-center"
                        style={{ color: DOC.textBody }}
                      >
                        {item.spec || "-"}
                      </td>
                      <td
                        className="px-1.5 py-2 text-center"
                        style={{ color: DOC.textBody }}
                      >
                        {item.quantity ? formatKRW(item.quantity) : "-"}
                      </td>
                      <td
                        className="px-1.5 py-2 text-center"
                        style={{ color: DOC.textBody }}
                      >
                        {hasContent ? item.unit || DEFAULT_ESTIMATE_UNIT : "-"}
                      </td>
                      <td
                        className="px-1.5 py-2 text-right"
                        style={{ color: DOC.textBody }}
                      >
                        {item.unitPrice ? formatKRW(item.unitPrice) : "-"}
                      </td>
                      <td
                        className="px-1.5 py-2 text-right"
                        style={{ color: DOC.text }}
                      >
                        {supplyAmount ? formatKRW(supplyAmount) : "-"}
                      </td>
                      <td
                        className="px-1.5 py-2 text-right"
                        style={{ color: DOC.textBody }}
                      >
                        {lineVat ? formatKRW(lineVat) : "-"}
                      </td>
                      <td
                        className="px-1.5 py-2"
                        style={{ color: DOC.textBody }}
                      >
                        {item.note || "-"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex justify-end">
            <div
              className="w-full max-w-xs space-y-2 border p-4 text-sm"
              style={{
                borderColor: DOC.border,
                backgroundColor: DOC.bgMutedStrong,
              }}
            >
              <div className="flex justify-between">
                <span style={{ color: DOC.textSecondary }}>수량</span>
                <span className="font-medium" style={{ color: DOC.text }}>
                  {formatKRW(totals.quantitySum)}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: DOC.textSecondary }}>공급가액</span>
                <span className="font-medium" style={{ color: DOC.text }}>
                  {formatKRW(totals.supplyAmount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: DOC.textSecondary }}>VAT</span>
                <span className="font-medium" style={{ color: DOC.text }}>
                  {formatKRW(totals.vat)}
                </span>
              </div>
              <div
                className="flex justify-between border-t pt-2 text-base"
                style={{ borderColor: DOC.borderMid }}
              >
                <span className="font-bold" style={{ color: DOC.text }}>
                  합계
                </span>
                <span className="font-bold" style={{ color: DOC.primary }}>
                  {formatKRW(totals.total)}
                </span>
              </div>
            </div>
          </div>

          {hasBankInfo && (
            <div
              className="mt-6 rounded-lg border p-4 text-sm leading-relaxed"
              style={{
                borderColor: DOC.border,
                backgroundColor: DOC.bgMutedSoft,
              }}
            >
              <p style={{ color: DOC.text }}>
                입금 계좌번호 :{" "}
                {[data.bankAccount.bankName, data.bankAccount.accountNumber]
                  .filter(Boolean)
                  .join(" ") || "-"}
              </p>
              {data.bankAccount.accountHolder && (
                <p className="mt-1" style={{ color: DOC.text }}>
                  예금주 {data.bankAccount.accountHolder}
                </p>
              )}
            </div>
          )}

          <div
            className="mt-6 flex items-center justify-between gap-4 border-t pt-6"
            style={{ borderColor: DOC.borderLight }}
          >
            <p className="text-sm font-medium" style={{ color: DOC.text }}>
              공급자:{" "}
              <span className="font-semibold">
                {data.supplier.companyName || "(상호명)"}
              </span>
            </p>
            <SealUpload sealUrl={sealUrl} onSealChange={onSealChange} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
