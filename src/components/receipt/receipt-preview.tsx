"use client"

import { SealMark } from "@/components/estimate/seal-signature"
import { Card, CardContent } from "@/components/ui/card"
import { formatBusinessNumber, formatPhoneNumber } from "@/lib/format-kr"
import { numberToKorean } from "@/lib/number-to-korean"
import { RECEIPT_DOCUMENT_ID } from "@/lib/receipt-pdf"
import {
  calculateReceipt,
  DEFAULT_ESTIMATE_UNIT,
  formatDisplayDate,
  formatKRW,
  getLineAmounts,
  PAYMENT_METHOD_LABEL,
  RECEIPT_COPY_TYPE_OPTIONS,
  type ReceiptData,
  type ReceiptStyle,
} from "@/lib/receipt"
import { cn } from "@/lib/utils"

const STYLE_PRESETS: Record<
  ReceiptStyle,
  {
    border: string
    borderStrong: string
    accent: string
    bg: string
    bgMuted: string
    text: string
    textMuted: string
    textBody: string
  }
> = {
  default: {
    border: "#cbd5e1",
    borderStrong: "#2563eb",
    accent: "#2563eb",
    bg: "#ffffff",
    bgMuted: "#f8fafc",
    text: "#0f172a",
    textMuted: "#64748b",
    textBody: "#334155",
  },
  ledger_red: {
    border: "#fca5a5",
    borderStrong: "#dc2626",
    accent: "#dc2626",
    bg: "#fffbfb",
    bgMuted: "#fef2f2",
    text: "#1c1917",
    textMuted: "#78716c",
    textBody: "#44403c",
  },
}

interface ReceiptPreviewProps {
  data: ReceiptData
  sealUrl: string | null
  className?: string
}

function InfoRow({ label, value }: { label: string; value: string }) {
  if (!value) return null

  return (
    <tr>
      <th
        className="w-[34%] border px-2 py-1.5 text-left text-xs font-semibold"
        style={{ borderColor: "inherit" }}
      >
        {label}
      </th>
      <td className="border px-2 py-1.5 text-xs" style={{ borderColor: "inherit" }}>
        {value}
      </td>
    </tr>
  )
}

export function ReceiptPreview({
  data,
  sealUrl,
  className,
}: ReceiptPreviewProps) {
  const theme = STYLE_PRESETS[data.receipt.style]
  const totals = calculateReceipt(data.items, data.receipt.vatMode)
  const filledItems = data.items.filter(
    (item) =>
      item.name || item.spec || item.quantity || item.unitPrice || item.note
  )
  const displayItems = filledItems.length > 0 ? filledItems : data.items

  const copyLabel =
    RECEIPT_COPY_TYPE_OPTIONS.find((o) => o.value === data.receipt.copyType)
      ?.label ?? ""

  const formattedBusinessNumber = data.supplier.businessNumber
    ? formatBusinessNumber(data.supplier.businessNumber)
    : ""
  const formattedPhone = data.supplier.phone
    ? formatPhoneNumber(data.supplier.phone)
    : ""

  const recipientLine = data.recipient.showHonorific
    ? `${data.recipient.name || "수신자"} 귀하`
    : data.recipient.name || "수신자"

  return (
    <Card
      className={cn(
        "border-0 py-0 shadow-md ring-1 ring-border/80 lg:sticky lg:top-20",
        className
      )}
    >
      <CardContent className="flex justify-center p-0">
        <div className="w-full max-w-[420px]">
          <div
            id={RECEIPT_DOCUMENT_ID}
            className="border-2 p-5 sm:p-6"
            style={{
              backgroundColor: theme.bg,
              borderColor: theme.borderStrong,
              color: theme.text,
              boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.08)",
            }}
          >
            <div className="relative mb-5 text-center">
              {copyLabel && (
                <p
                  className="absolute top-0 right-0 text-[10px] font-medium"
                  style={{ color: theme.textMuted }}
                >
                  {copyLabel}
                </p>
              )}
              <h2
                className="text-xl font-bold tracking-[0.4em] sm:text-2xl"
                style={{ color: theme.text }}
              >
                영 수 증
              </h2>
              {data.receipt.purpose && (
                <p
                  className="mt-2 text-xs"
                  style={{ color: theme.textMuted }}
                >
                  ({data.receipt.purpose})
                </p>
              )}
            </div>

            <div
              className="mb-4 space-y-1 border-b pb-3 text-xs"
              style={{ borderColor: theme.border }}
            >
              <p>
                <span style={{ color: theme.textMuted }}>No. </span>
                <span className="font-medium">{data.receipt.number || "-"}</span>
              </p>
              <p className="font-medium">{recipientLine}</p>
              <p>
                <span style={{ color: theme.textMuted }}>발행일자 </span>
                {formatDisplayDate(data.receipt.issueDate)}
              </p>
              <p>
                <span style={{ color: theme.textMuted }}>결제수단 </span>
                {PAYMENT_METHOD_LABEL[data.receipt.paymentMethod]}
              </p>
            </div>

            <table
              className="mb-4 w-full border-collapse text-xs"
              style={{ borderColor: theme.border }}
            >
              <tbody>
                <InfoRow
                  label="사업자등록번호"
                  value={formattedBusinessNumber}
                />
                <InfoRow label="상호" value={data.supplier.companyName} />
                <InfoRow
                  label="성명/대표자"
                  value={data.supplier.representative}
                />
                <InfoRow label="사업장 주소" value={data.supplier.address} />
                <InfoRow label="업태" value={data.supplier.businessType} />
                <InfoRow label="종목" value={data.supplier.businessItem} />
                <InfoRow label="연락처" value={formattedPhone} />
              </tbody>
            </table>

            <div className="overflow-visible">
              <table
                className="w-full border-collapse text-[11px] sm:text-xs"
                style={{ borderColor: theme.border }}
              >
                <thead>
                  <tr style={{ backgroundColor: theme.bgMuted }}>
                    <th
                      className="border px-1 py-1.5 font-semibold"
                      style={{ borderColor: theme.border }}
                    >
                      일자
                    </th>
                    <th
                      className="border px-1 py-1.5 text-left font-semibold"
                      style={{ borderColor: theme.border }}
                    >
                      품목
                    </th>
                    <th
                      className="border px-1 py-1.5 font-semibold"
                      style={{ borderColor: theme.border }}
                    >
                      수량
                    </th>
                    <th
                      className="border px-1 py-1.5 text-right font-semibold"
                      style={{ borderColor: theme.border }}
                    >
                      단가
                    </th>
                    <th
                      className="border px-1 py-1.5 text-right font-semibold"
                      style={{ borderColor: theme.border }}
                    >
                      공급가액
                    </th>
                    <th
                      className="border px-1 py-1.5 font-semibold"
                      style={{ borderColor: theme.border }}
                    >
                      비고
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item) => {
                    const amounts = getLineAmounts(
                      item,
                      data.receipt.vatMode
                    )

                    return (
                      <tr key={item.id}>
                        <td
                          className="border px-1 py-1.5 text-center"
                          style={{ borderColor: theme.border, color: theme.textBody }}
                        >
                          {item.date
                            ? formatDisplayDate(item.date).replace(/\./g, "/")
                            : "-"}
                        </td>
                        <td
                          className="border px-1 py-1.5"
                          style={{ borderColor: theme.border, color: theme.text }}
                        >
                          {item.name || "-"}
                          {item.spec ? (
                            <span
                              className="block text-[10px]"
                              style={{ color: theme.textMuted }}
                            >
                              {item.spec}
                            </span>
                          ) : null}
                        </td>
                        <td
                          className="border px-1 py-1.5 text-center"
                          style={{ borderColor: theme.border, color: theme.textBody }}
                        >
                          {item.quantity
                            ? `${formatKRW(item.quantity)}${item.unit || DEFAULT_ESTIMATE_UNIT}`
                            : "-"}
                        </td>
                        <td
                          className="border px-1 py-1.5 text-right"
                          style={{ borderColor: theme.border, color: theme.textBody }}
                        >
                          {item.unitPrice ? formatKRW(item.unitPrice) : "-"}
                        </td>
                        <td
                          className="border px-1 py-1.5 text-right font-medium"
                          style={{ borderColor: theme.border, color: theme.text }}
                        >
                          {amounts.supplyAmount
                            ? formatKRW(amounts.supplyAmount)
                            : "-"}
                        </td>
                        <td
                          className="border px-1 py-1.5"
                          style={{ borderColor: theme.border, color: theme.textBody }}
                        >
                          {item.note || "-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div
              className="mt-4 space-y-1.5 border-t-2 pt-3 text-xs"
              style={{ borderColor: theme.borderStrong }}
            >
              <div className="flex justify-between">
                <span style={{ color: theme.textMuted }}>총 공급가액</span>
                <span className="font-medium">
                  {formatKRW(totals.supplyAmount)}원
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: theme.textMuted }}>부가세</span>
                <span className="font-medium">{formatKRW(totals.vat)}원</span>
              </div>
              <div
                className="flex justify-between border-t pt-2 text-sm"
                style={{ borderColor: theme.border }}
              >
                <span className="font-bold">합계금액</span>
                <span className="font-bold" style={{ color: theme.accent }}>
                  ₩{formatKRW(totals.total)}
                </span>
              </div>
              {totals.total > 0 && (
                <p
                  className="text-right text-[11px]"
                  style={{ color: theme.textMuted }}
                >
                  {numberToKorean(totals.total)}원 정
                </p>
              )}
            </div>

            {data.remarks.trim() && (
              <p
                className="mt-4 whitespace-pre-line text-center text-xs leading-relaxed"
                style={{ color: theme.textBody }}
              >
                {data.remarks}
              </p>
            )}

            <p
              className="mt-4 text-center text-xs font-medium"
              style={{ color: theme.textBody }}
            >
              위 금액을 정히 영수함.
            </p>

            <div
              className="mt-6 flex flex-col items-end gap-1 text-xs"
              style={{ color: theme.textBody }}
            >
              <p className="font-semibold" style={{ color: theme.textMuted }}>
                공급자
              </p>
              <p>
                <span style={{ color: theme.textMuted }}>상호 </span>
                <span className="font-medium" style={{ color: theme.text }}>
                  {data.supplier.companyName || "-"}
                </span>
              </p>
              <p>
                <span style={{ color: theme.textMuted }}>대표자 </span>
                <span className="font-medium" style={{ color: theme.text }}>
                  {data.supplier.representative || "-"}
                </span>
                <SealMark sealUrl={sealUrl} />
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
