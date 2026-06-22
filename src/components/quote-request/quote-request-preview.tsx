"use client"

import type { ReactNode } from "react"

import { SealMark } from "@/components/estimate/seal-signature"
import { Card, CardContent } from "@/components/ui/card"
import { formatPhoneNumber } from "@/lib/format-kr"
import { QUOTE_REQUEST_DOCUMENT_ID } from "@/lib/quote-request-pdf"
import {
  DEFAULT_ESTIMATE_UNIT,
  formatDisplayDate,
  getActiveConditionLabels,
  getActiveCriteriaLabels,
  type QuoteRequestData,
} from "@/lib/quote-request"
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
  borderStrong: "#1e293b",
} as const

interface QuoteRequestPreviewProps {
  data: QuoteRequestData
  sealUrl?: string | null
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
      <span className="w-16 shrink-0" style={{ color: DOC.textMuted }}>
        {label}
      </span>
      <span className="font-medium" style={{ color: DOC.text }}>
        {value}
      </span>
    </div>
  )
}

function SectionBlock({
  title,
  children,
}: {
  title: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <p
        className="text-xs font-semibold uppercase tracking-wide"
        style={{ color: DOC.primary }}
      >
        {title}
      </p>
      <div
        className="rounded-lg border p-4"
        style={{
          borderColor: DOC.border,
          backgroundColor: DOC.bgMutedSoft,
        }}
      >
        {children}
      </div>
    </div>
  )
}

function CheckboxList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm" style={{ color: DOC.textLight }}>
        -
      </p>
    )
  }

  return (
    <ul className="space-y-1 text-sm" style={{ color: DOC.textBody }}>
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span style={{ color: DOC.primary }}>✓</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export function QuoteRequestPreview({
  data,
  sealUrl = null,
  className,
}: QuoteRequestPreviewProps) {
  const filledItems = data.items.filter(
    (item) => item.name || item.spec || item.quantity || item.note
  )
  const displayItems = filledItems.length > 0 ? filledItems : data.items

  const conditionLabels = getActiveConditionLabels(data.conditions)
  const criteriaLabels = getActiveCriteriaLabels(data.selectionCriteria)

  const formattedPhone = data.requester.phone
    ? formatPhoneNumber(data.requester.phone)
    : ""

  const recipientLine = data.target.companyName
    ? `${data.target.companyName} 귀하`
    : "업체명 귀하"

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
            id={QUOTE_REQUEST_DOCUMENT_ID}
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
                className="text-2xl font-bold tracking-[0.25em] sm:text-3xl"
                style={{ color: DOC.text }}
              >
                견 적 요 청 서
              </h2>
              <p
                className="mt-2 text-sm"
                style={{ color: DOC.textMuted }}
              >
                (Request For Quotation)
              </p>
            </div>

            <div
              className="mb-6 flex flex-wrap gap-x-8 gap-y-2 border-b pb-3 text-sm"
              style={{ borderColor: DOC.border }}
            >
              <div>
                <p style={{ color: DOC.textMuted }}>요청번호</p>
                <p className="font-medium" style={{ color: DOC.text }}>
                  {data.request.number || "-"}
                </p>
              </div>
              <div>
                <p style={{ color: DOC.textMuted }}>작성일</p>
                <p className="font-medium" style={{ color: DOC.text }}>
                  {formatDisplayDate(data.request.writtenDate)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-base font-semibold" style={{ color: DOC.text }}>
                수신 {recipientLine}
              </p>
              <p
                className="mt-4 text-sm leading-relaxed"
                style={{ color: DOC.textBody }}
              >
                아래와 같이 견적을 요청하오니 검토 후 견적서를 회신해 주시기
                바랍니다.
              </p>
            </div>

            <div className="mb-6">
              <SectionBlock title="요청자 정보">
                <PreviewField label="회사명" value={data.requester.companyName} />
                <PreviewField label="담당자" value={data.requester.contactName} />
                <PreviewField label="연락처" value={formattedPhone} />
                <PreviewField label="이메일" value={data.requester.email} />
              </SectionBlock>
            </div>

            <div className="mb-6 overflow-visible">
              <p
                className="mb-2 text-xs font-semibold uppercase tracking-wide"
                style={{ color: DOC.primary }}
              >
                견적 요청 품목
              </p>
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
                      className="w-16 px-1 py-2.5 text-center font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      규격
                    </th>
                    <th
                      className="w-14 px-1 py-2.5 text-center font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      수량
                    </th>
                    <th
                      className="w-12 px-1 py-2.5 text-center font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      단위
                    </th>
                    <th
                      className="w-24 px-1 py-2.5 text-left font-semibold"
                      style={{ color: DOC.textDark }}
                    >
                      요청사항
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
                        {item.quantity || "-"}
                      </td>
                      <td
                        className="px-1 py-2.5 text-center"
                        style={{ color: DOC.textBody }}
                      >
                        {item.unit || DEFAULT_ESTIMATE_UNIT}
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

            <div
              className="mb-6 grid gap-3 text-sm sm:grid-cols-2"
              style={{ color: DOC.textBody }}
            >
              {data.request.desiredDeliveryDate && (
                <p>
                  <span style={{ color: DOC.textMuted }}>희망 납기일 </span>
                  <span className="font-medium" style={{ color: DOC.text }}>
                    {formatDisplayDate(data.request.desiredDeliveryDate)}
                  </span>
                </p>
              )}
              {data.request.submissionDeadline && (
                <p>
                  <span style={{ color: DOC.textMuted }}>견적 제출 마감일 </span>
                  <span className="font-medium" style={{ color: DOC.text }}>
                    {formatDisplayDate(data.request.submissionDeadline)}
                  </span>
                </p>
              )}
            </div>

            <div className="mb-6 grid gap-5 sm:grid-cols-2">
              <SectionBlock title="요청 조건">
                <CheckboxList items={conditionLabels} />
              </SectionBlock>
              <SectionBlock title="업체 선정 기준">
                <CheckboxList items={criteriaLabels} />
              </SectionBlock>
            </div>

            {data.details.trim() && (
              <div className="mb-6">
                <SectionBlock title="세부 요청사항">
                  <p
                    className="whitespace-pre-line text-sm leading-relaxed"
                    style={{ color: DOC.textBody }}
                  >
                    {data.details}
                  </p>
                </SectionBlock>
              </div>
            )}

            {data.attachments.length > 0 && (
              <div className="mb-6">
                <SectionBlock title="첨부자료">
                  <ul className="space-y-1 text-sm" style={{ color: DOC.textBody }}>
                    {data.attachments.map((file) => (
                      <li key={file.id}>· {file.name}</li>
                    ))}
                  </ul>
                </SectionBlock>
              </div>
            )}

            <div
              className="mt-10 flex flex-col items-end gap-1 text-sm"
              style={{ color: DOC.textBody }}
            >
              <p>
                <span style={{ color: DOC.textMuted }}>요청자명 </span>
                <span className="font-medium" style={{ color: DOC.text }}>
                  {data.requester.companyName || "-"}
                </span>
              </p>
              <p>
                <span style={{ color: DOC.textMuted }}>담당자명 </span>
                <span className="font-medium" style={{ color: DOC.text }}>
                  {data.requester.contactName || "-"}
                  <SealMark sealUrl={sealUrl ?? null} />
                </span>
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
