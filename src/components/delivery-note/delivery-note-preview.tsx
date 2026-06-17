"use client"

import { SealMark } from "@/components/estimate/seal-signature"
import { Card, CardContent } from "@/components/ui/card"
import { DELIVERY_NOTE_DOCUMENT_ID } from "@/lib/delivery-note-pdf"
import {
  calculateDeliveryNote,
  DEFAULT_ESTIMATE_UNIT,
  formatDisplayDate,
  formatKRW,
  SHIPPING_METHOD_LABEL,
  type DeliveryNoteData,
} from "@/lib/delivery-note"
import { formatBusinessNumber } from "@/lib/format-kr"
import { numberToKorean } from "@/lib/number-to-korean"
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
  border: "#e2e8f0",
  borderMid: "#cbd5e1",
  borderStrong: "#1e293b",
} as const

interface DeliveryNotePreviewProps {
  data: DeliveryNoteData
  sealUrl: string | null
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
      <p
        className="mt-1 whitespace-pre-line leading-relaxed"
        style={{ color: DOC.textBody }}
      >
        {value}
      </p>
    </div>
  )
}

export function DeliveryNotePreview({
  data,
  sealUrl,
  className,
}: DeliveryNotePreviewProps) {
  const totals = calculateDeliveryNote(data.items)
  const filledItems = data.items.filter(
    (item) => item.name || item.spec || item.quantity || item.amount || item.note
  )
  const displayItems = filledItems.length > 0 ? filledItems : data.items

  const formattedBusinessNumber = data.supplier.businessNumber
    ? formatBusinessNumber(data.supplier.businessNumber)
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
            id={DELIVERY_NOTE_DOCUMENT_ID}
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
                납 품 서
              </h2>
            </div>

            <div className="mb-7 flex flex-col gap-6 sm:flex-row sm:justify-between">
              <div className="text-sm">
                <p style={{ color: DOC.textMuted }}>납품일자</p>
                <p className="mt-1 font-medium" style={{ color: DOC.text }}>
                  {formatDisplayDate(data.delivery.date)}
                </p>
                {data.delivery.number && (
                  <p
                    className="mt-3 text-xs"
                    style={{ color: DOC.textSecondary }}
                  >
                    납품번호 {data.delivery.number}
                  </p>
                )}
              </div>

              <div
                className="w-full max-w-sm space-y-1.5 rounded-lg border p-4 sm:w-auto"
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
                <PreviewField
                  label="사업자번호"
                  value={formattedBusinessNumber}
                />
                <PreviewField label="상호" value={data.supplier.companyName} />
                <PreviewField
                  label="대표자"
                  value={data.supplier.representative}
                />
                <PreviewField label="업태" value={data.supplier.businessType} />
                <PreviewField label="종목" value={data.supplier.businessItem} />
                <PreviewField
                  label="담당자"
                  value={data.supplier.contactPerson}
                />
              </div>
            </div>

            <div className="mb-6">
              <p className="text-base font-semibold" style={{ color: DOC.text }}>
                수신{" "}
                <span className="underline decoration-1 underline-offset-4">
                  {data.recipient.companyName || "거래처명"}
                </span>{" "}
                귀하
              </p>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: DOC.textBody }}
              >
                안녕하세요.
                <br />
                아래와 같이 납품 드립니다.
              </p>
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
                      품명
                    </th>
                    <th
                      className="w-14 px-1 py-2.5 text-center font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      규격
                    </th>
                    <th
                      className="w-16 px-1 py-2.5 text-center font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      수량
                    </th>
                    <th
                      className="w-20 px-1 py-2.5 text-right font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      금액
                    </th>
                    <th
                      className="w-20 px-1 py-2.5 text-left font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      비고
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item, index) => (
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
                        {item.amount ? formatKRW(item.amount) : "-"}
                      </td>
                      <td
                        className="px-1 py-2.5"
                        style={{ color: DOC.textBody }}
                      >
                        {item.note || "-"}
                      </td>
                    </tr>
                  ))}
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
                <p style={{ color: DOC.textMuted }}>총 수량</p>
                <p
                  className="mt-1 text-xl font-bold"
                  style={{ color: DOC.text }}
                >
                  {formatKRW(totals.quantitySum)}
                </p>
              </div>

              <div
                className="w-full max-w-xs space-y-2 border p-4 text-sm sm:w-auto"
                style={{
                  borderColor: DOC.border,
                  backgroundColor: DOC.bgMutedSoft,
                }}
              >
                <div className="flex justify-between">
                  <span style={{ color: DOC.textSecondary }}>총 금액</span>
                  <span className="font-bold" style={{ color: DOC.primary }}>
                    {formatKRW(totals.totalAmount)}원
                  </span>
                </div>
                {totals.totalAmount > 0 && (
                  <p
                    className="border-t pt-2 text-xs leading-relaxed"
                    style={{
                      borderColor: DOC.borderMid,
                      color: DOC.textSecondary,
                    }}
                  >
                    일금 {numberToKorean(totals.totalAmount)}원정
                  </p>
                )}
              </div>
            </div>

            <div
              className="mt-6 space-y-4 rounded-lg border p-4"
              style={{
                borderColor: DOC.border,
                backgroundColor: DOC.bgMutedSoft,
              }}
            >
              <FooterField label="납품장소" value={data.delivery.location} />
              <FooterField
                label="운송방법"
                value={SHIPPING_METHOD_LABEL[data.delivery.shippingMethod]}
              />
              <FooterField label="비고" value={data.remarks} />
            </div>

            <div
              className="mt-8 flex flex-col items-end gap-2 text-sm"
              style={{ color: DOC.textBody }}
            >
              <p className="font-semibold" style={{ color: DOC.textMuted }}>
                공급자
              </p>
              <p>
                <span style={{ color: DOC.textMuted }}>상호 </span>
                <span className="font-medium" style={{ color: DOC.text }}>
                  {data.supplier.companyName || "-"}
                </span>
              </p>
              <p>
                <span style={{ color: DOC.textMuted }}>대표자 </span>
                <span className="font-medium" style={{ color: DOC.text }}>
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
