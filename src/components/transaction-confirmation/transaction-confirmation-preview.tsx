"use client"

import { SealMark } from "@/components/estimate/seal-signature"
import { Card, CardContent } from "@/components/ui/card"
import { formatBusinessNumber, formatPhoneNumber } from "@/lib/format-kr"
import { numberToKorean } from "@/lib/number-to-korean"
import { TRANSACTION_CONFIRMATION_DOCUMENT_ID } from "@/lib/transaction-confirmation-pdf"
import {
  calculateTransactionConfirmation,
  formatDisplayDate,
  formatKRW,
  getLineSupplyAmount,
  getLineVat,
  type TransactionConfirmationData,
  type TransactionParty,
} from "@/lib/transaction-confirmation"
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

interface TransactionConfirmationPreviewProps {
  data: TransactionConfirmationData
  supplierSealUrl: string | null
  className?: string
}

function PartyTable({
  title,
  party,
}: {
  title: string
  party: TransactionParty
}) {
  const formattedBusinessNumber = party.businessNumber
    ? formatBusinessNumber(party.businessNumber)
    : ""
  const formattedPhone = party.phone ? formatPhoneNumber(party.phone) : ""

  const rows = [
    { label: "업체명", value: party.companyName },
    { label: "대표자", value: party.representative },
    { label: "사업자등록번호", value: formattedBusinessNumber },
    { label: "연락처", value: formattedPhone },
    { label: "주소", value: party.address },
  ]

  return (
    <div>
      <p
        className="mb-2 text-xs font-semibold uppercase tracking-wide"
        style={{ color: DOC.primary }}
      >
        {title}
      </p>
      <table
        className="w-full border-collapse text-xs sm:text-sm"
        style={{ borderColor: DOC.border }}
      >
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-b" style={{ borderColor: DOC.border }}>
              <th
                className="w-[38%] border px-2 py-2 text-left font-medium"
                style={{
                  borderColor: DOC.border,
                  backgroundColor: DOC.bgMuted,
                  color: DOC.textMuted,
                }}
              >
                {row.label}
              </th>
              <td
                className="border px-2 py-2"
                style={{ borderColor: DOC.border, color: DOC.text }}
              >
                {row.value || "-"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function SignatureDisplay({ sealUrl }: { sealUrl: string | null }) {
  return (
    <span className="ml-2 inline-flex items-center gap-1 align-middle">
      <SealMark sealUrl={sealUrl} />
    </span>
  )
}

function PartySignatureBlock({
  title,
  party,
  sealUrl,
  footerLabel,
}: {
  title: string
  party: TransactionParty
  sealUrl: string | null
  footerLabel?: string
}) {
  return (
    <div
      className="w-full max-w-xs rounded-lg border p-4 sm:w-auto"
      style={{
        borderColor: DOC.border,
        backgroundColor: DOC.bgMutedSoft,
      }}
    >
      <p
        className="mb-3 text-xs font-semibold"
        style={{ color: DOC.textMuted }}
      >
        {title}
      </p>
      <p className="text-sm" style={{ color: DOC.textBody }}>
        <span style={{ color: DOC.textMuted }}>상호명 </span>
        <span className="font-medium" style={{ color: DOC.text }}>
          {party.companyName || "-"}
        </span>
      </p>
      <p className="mt-2 text-sm" style={{ color: DOC.textBody }}>
        <span style={{ color: DOC.textMuted }}>대표자명 </span>
        <span className="font-medium" style={{ color: DOC.text }}>
          {party.representative || "-"}
        </span>
        <SignatureDisplay sealUrl={sealUrl} />
      </p>
      {footerLabel ? (
        <p className="mt-2 text-[11px]" style={{ color: DOC.textLight }}>
          {footerLabel}
        </p>
      ) : null}
    </div>
  )
}

export function TransactionConfirmationPreview({
  data,
  supplierSealUrl,
  className,
}: TransactionConfirmationPreviewProps) {
  const totals = calculateTransactionConfirmation(data.items)
  const filledItems = data.items.filter(
    (item) =>
      item.name ||
      item.spec ||
      item.quantity ||
      item.unitPrice ||
      item.note
  )
  const displayItems = filledItems.length > 0 ? filledItems : data.items

  const periodLabel =
    data.transaction.periodStart && data.transaction.periodEnd
      ? `${formatDisplayDate(data.transaction.periodStart)} ~ ${formatDisplayDate(data.transaction.periodEnd)}`
      : data.transaction.periodStart || data.transaction.periodEnd
        ? formatDisplayDate(
            data.transaction.periodStart || data.transaction.periodEnd
          )
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
            id={TRANSACTION_CONFIRMATION_DOCUMENT_ID}
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
                className="text-xl font-bold tracking-[0.15em] sm:text-2xl"
                style={{ color: DOC.text }}
              >
                거 래 사 실 확 인 서
              </h2>
            </div>

            <div
              className="mb-5 flex flex-wrap gap-x-6 gap-y-2 border-b pb-3 text-sm"
              style={{ borderColor: DOC.border }}
            >
              <p>
                <span style={{ color: DOC.textMuted }}>No. </span>
                <span className="font-medium">{data.transaction.number || "-"}</span>
              </p>
              {periodLabel && (
                <p>
                  <span style={{ color: DOC.textMuted }}>거래기간 </span>
                  <span className="font-medium">{periodLabel}</span>
                </p>
              )}
            </div>

            <div className="mb-6 grid gap-5 sm:grid-cols-2">
              <PartyTable title="공급자" party={data.supplier} />
              <PartyTable title="공급받는자" party={data.recipient} />
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
                      순번
                    </th>
                    <th
                      className="w-24 px-1 py-2.5 text-center font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      거래일자
                    </th>
                    <th
                      className="min-w-0 px-2 py-2.5 text-left font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      품목명
                    </th>
                    <th
                      className="w-12 px-1 py-2.5 text-center font-semibold"
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
                      className="w-20 px-1 py-2.5 text-left font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      비고
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item, index) => {
                    const supply = getLineSupplyAmount(item)
                    const vat = getLineVat(item)

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
                          className="px-1 py-2.5 text-center text-[11px] sm:text-xs"
                          style={{ color: DOC.textBody }}
                        >
                          {item.transactionDate
                            ? formatDisplayDate(item.transactionDate)
                            : "-"}
                        </td>
                        <td
                          className="min-w-0 px-2 py-2.5"
                          style={{ color: DOC.text }}
                        >
                          {item.name || "-"}
                          {item.spec ? (
                            <span
                              className="block text-[10px]"
                              style={{ color: DOC.textMuted }}
                            >
                              {item.spec}
                            </span>
                          ) : null}
                        </td>
                        <td
                          className="px-1 py-2.5 text-center"
                          style={{ color: DOC.textBody }}
                        >
                          {item.quantity ? formatKRW(item.quantity) : "-"}
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
                          className="px-1 py-2.5"
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

            <div
              className="mt-6 space-y-2 rounded-lg border p-4 text-sm"
              style={{
                borderColor: DOC.border,
                backgroundColor: DOC.bgMuted,
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
                  총 거래금액
                </span>
                <span className="font-bold" style={{ color: DOC.primary }}>
                  {formatKRW(totals.total)}원
                </span>
              </div>
              {totals.total > 0 && (
                <p
                  className="text-right text-xs"
                  style={{ color: DOC.textMuted }}
                >
                  {numberToKorean(totals.total)}원 정
                </p>
              )}
            </div>

            {data.confirmationText.trim() && (
              <p
                className="mt-6 text-center text-sm leading-relaxed"
                style={{ color: DOC.textBody }}
              >
                {data.confirmationText}
              </p>
            )}

            <p
              className="mt-6 text-center text-sm"
              style={{ color: DOC.textMuted }}
            >
              작성일 {formatDisplayDate(data.transaction.writtenDate)}
            </p>

            <div className="mt-8 flex justify-end">
              <PartySignatureBlock
                title="공급자"
                party={data.supplier}
                sealUrl={supplierSealUrl}
                footerLabel="직인"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
