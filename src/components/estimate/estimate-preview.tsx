"use client"

import { SealUpload } from "@/components/estimate/seal-upload"
import { Card, CardContent } from "@/components/ui/card"
import {
  calculateEstimate,
  DEFAULT_ESTIMATE_UNIT,
  formatDisplayDate,
  formatKRW,
  getLineAmount,
  type EstimateData,
} from "@/lib/estimate"
import {
  formatBusinessNumber,
  formatPhoneNumber,
} from "@/lib/format-kr"
import { cn } from "@/lib/utils"

/** PDF 캡처용 hex 색상 (html2canvas oklch/lab 미지원) */
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

interface EstimatePreviewProps {
  data: EstimateData
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

function RemarksSection({ data }: { data: EstimateData }) {
  const lines = data.remarks
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  if (lines.length === 0) return null

  return (
    <div
      className="mt-6 rounded-lg border p-4 text-sm"
      style={{
        borderColor: DOC.border,
        backgroundColor: DOC.bgMutedSoft,
        color: DOC.textBody,
      }}
    >
      <p className="mb-2 font-semibold" style={{ color: DOC.text }}>
        비고
      </p>
      <ul className="space-y-1">
        {lines.map((line) => (
          <li key={line} className="flex gap-2">
            <span style={{ color: DOC.textLight }}>•</span>
            <span className="leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function EstimatePreview({
  data,
  sealUrl,
  onSealChange,
  className,
}: EstimatePreviewProps) {
  const totals = calculateEstimate(data.items)
  const filledItems = data.items.filter(
    (item) => item.name || item.quantity || item.unitPrice
  )
  const displayItems = filledItems.length > 0 ? filledItems : data.items

  const formattedBusinessNumber = data.supplier.businessNumber
    ? formatBusinessNumber(data.supplier.businessNumber)
    : ""
  const formattedPhone = data.supplier.phone
    ? formatPhoneNumber(data.supplier.phone)
    : ""

  return (
    <Card
      className={cn(
        "border-0 py-0 shadow-md ring-1 ring-border/80 lg:sticky lg:top-20",
        className
      )}
    >
      <CardContent className="p-0">
        <div
          id="estimate-document"
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
              className="text-2xl font-bold tracking-[0.35em] sm:text-3xl"
              style={{ color: DOC.text }}
            >
              견 적 서
            </h2>
          </div>

          <div
            className="mb-7 flex flex-wrap gap-x-8 gap-y-3 border-y py-3 text-sm"
            style={{ borderColor: DOC.border }}
          >
            <div>
              <p style={{ color: DOC.textMuted }}>견적번호</p>
              <p className="font-medium" style={{ color: DOC.text }}>
                {data.estimate.number || "-"}
              </p>
            </div>
            <div>
              <p style={{ color: DOC.textMuted }}>작성일</p>
              <p className="font-medium" style={{ color: DOC.text }}>
                {formatDisplayDate(data.estimate.date)}
              </p>
            </div>
            <div>
              <p style={{ color: DOC.textMuted }}>유효기간</p>
              <p className="font-medium" style={{ color: DOC.text }}>
                {formatDisplayDate(data.estimate.validUntil)}
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
              <PreviewField label="전화" value={formattedPhone} />
              <PreviewField label="이메일" value={data.supplier.email} />
              <PreviewField label="주소" value={data.supplier.address} />
              {!data.supplier.companyName &&
                !data.supplier.representative &&
                !formattedBusinessNumber &&
                !formattedPhone &&
                !data.supplier.email &&
                !data.supplier.address && (
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
                style={{ color: DOC.textMuted }}
              >
                수신
              </p>
              <PreviewField label="고객명" value={data.customer.name} />
              <PreviewField label="회사명" value={data.customer.companyName} />
              {!data.customer.name && !data.customer.companyName && (
                <p className="text-sm" style={{ color: DOC.textLight }}>
                  -
                </p>
              )}
            </div>
          </div>

          <div className="overflow-visible">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr
                  className="border-y-2"
                  style={{
                    borderColor: DOC.borderStrong,
                    backgroundColor: DOC.bgMuted,
                  }}
                >
                  <th
                    className="w-10 px-2 py-2.5 text-center font-semibold"
                    style={{ color: DOC.textDark }}
                  >
                    No
                  </th>
                  <th
                    className="min-w-0 px-3 py-2.5 text-left font-semibold"
                    style={{ color: DOC.textDark }}
                  >
                    품목명
                  </th>
                  <th
                    className="w-14 px-2 py-2.5 text-center font-semibold"
                    style={{ color: DOC.textDark }}
                  >
                    수량
                  </th>
                  <th
                    className="w-12 px-2 py-2.5 text-center font-semibold"
                    style={{ color: DOC.textDark }}
                  >
                    단위
                  </th>
                  <th
                    className="w-24 px-2 py-2.5 text-right font-semibold"
                    style={{ color: DOC.textDark }}
                  >
                    단가
                  </th>
                  <th
                    className="w-28 px-2 py-2.5 text-right font-semibold"
                    style={{ color: DOC.textDark }}
                  >
                    금액
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item, index) => {
                  const amount = getLineAmount(item)
                  return (
                    <tr
                      key={item.id}
                      className="border-b last:border-b-0"
                      style={{ borderColor: DOC.border }}
                    >
                      <td
                        className="px-2 py-3 text-center"
                        style={{ color: DOC.textSecondary }}
                      >
                        {index + 1}
                      </td>
                      <td
                        className="min-w-0 px-3 py-3"
                        style={{ color: DOC.text }}
                      >
                        {item.name || "-"}
                      </td>
                      <td
                        className="px-2 py-3 text-center"
                        style={{ color: DOC.textBody }}
                      >
                        {item.quantity ? formatKRW(item.quantity) : "-"}
                      </td>
                      <td
                        className="px-2 py-3 text-center"
                        style={{ color: DOC.textBody }}
                      >
                        {item.name || item.quantity || item.unitPrice
                          ? item.unit || DEFAULT_ESTIMATE_UNIT
                          : "-"}
                      </td>
                      <td
                        className="px-2 py-3 text-right"
                        style={{ color: DOC.textBody }}
                      >
                        {item.unitPrice ? formatKRW(item.unitPrice) : "-"}
                      </td>
                      <td
                        className="px-2 py-3 text-right font-medium"
                        style={{ color: DOC.text }}
                      >
                        {amount ? formatKRW(amount) : "-"}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex justify-end">
            <div
              className="w-full max-w-xs space-y-2 border p-4 text-sm"
              style={{
                borderColor: DOC.border,
                backgroundColor: DOC.bgMutedStrong,
              }}
            >
              <div className="flex justify-between">
                <span style={{ color: DOC.textSecondary }}>공급가액</span>
                <span className="font-medium" style={{ color: DOC.text }}>
                  {formatKRW(totals.supplyAmount)}원
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: DOC.textSecondary }}>부가세 (10%)</span>
                <span className="font-medium" style={{ color: DOC.text }}>
                  {formatKRW(totals.vat)}원
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
                  {formatKRW(totals.total)}원
                </span>
              </div>
            </div>
          </div>

          <RemarksSection data={data} />

          <p
            className="mt-8 text-center text-xs"
            style={{ color: DOC.textLight }}
          >
            위와 같이 견적합니다.
          </p>

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
