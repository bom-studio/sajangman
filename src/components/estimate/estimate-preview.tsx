"use client"

import { forwardRef } from "react"

import { SealUpload } from "@/components/estimate/seal-upload"
import { Card, CardContent } from "@/components/ui/card"
import {
  calculateEstimate,
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
      <span className="w-20 shrink-0 text-slate-500">{label}</span>
      <span className="font-medium text-slate-900">{value}</span>
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
    <div className="mt-6 rounded-lg border border-slate-200 bg-slate-50/50 p-4 text-sm text-slate-700">
      <p className="mb-2 font-semibold text-slate-900">비고</p>
      <ul className="space-y-1">
        {lines.map((line) => (
          <li key={line} className="flex gap-2">
            <span className="text-slate-400">•</span>
            <span className="leading-relaxed">{line}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const EstimatePreview = forwardRef<HTMLDivElement, EstimatePreviewProps>(
  function EstimatePreview({ data, sealUrl, onSealChange, className }, ref) {
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
            ref={ref}
            id="estimate-document"
            className="bg-white p-6 sm:p-8 md:p-10"
          >
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold tracking-[0.35em] text-slate-900 sm:text-3xl">
                견 적 서
              </h2>
            </div>

            <div className="mb-6 flex flex-col gap-6 sm:flex-row sm:justify-between">
              <div className="flex-1 space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-primary">
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
                    <p className="text-sm text-slate-400">-</p>
                  )}
              </div>

              <div className="flex-1 space-y-2 rounded-lg border border-slate-200 bg-slate-50/50 p-4">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                  수신
                </p>
                <PreviewField label="고객명" value={data.customer.name} />
                <PreviewField label="회사명" value={data.customer.companyName} />
                {!data.customer.name && !data.customer.companyName && (
                  <p className="text-sm text-slate-400">-</p>
                )}
              </div>
            </div>

            <div className="mb-6 flex flex-wrap gap-x-8 gap-y-3 border-y border-slate-200 py-3 text-sm">
              <div>
                <p className="text-slate-500">견적번호</p>
                <p className="font-medium text-slate-900">
                  {data.estimate.number || "-"}
                </p>
              </div>
              <div>
                <p className="text-slate-500">작성일</p>
                <p className="font-medium text-slate-900">
                  {formatDisplayDate(data.estimate.date)}
                </p>
              </div>
              <div>
                <p className="text-slate-500">유효기간</p>
                <p className="font-medium text-slate-900">
                  {formatDisplayDate(data.estimate.validUntil)}
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[480px] border-collapse text-sm">
                <thead>
                  <tr className="border-y-2 border-slate-800 bg-slate-50">
                    <th className="w-10 px-2 py-2.5 text-center font-semibold text-slate-800">
                      No
                    </th>
                    <th className="px-3 py-2.5 text-left font-semibold text-slate-800">
                      품목명
                    </th>
                    <th className="w-16 px-2 py-2.5 text-center font-semibold text-slate-800">
                      수량
                    </th>
                    <th className="w-28 px-2 py-2.5 text-right font-semibold text-slate-800">
                      단가
                    </th>
                    <th className="w-28 px-2 py-2.5 text-right font-semibold text-slate-800">
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
                        className="border-b border-slate-200 last:border-b-0"
                      >
                        <td className="px-2 py-3 text-center text-slate-600">
                          {index + 1}
                        </td>
                        <td className="px-3 py-3 text-slate-900">
                          {item.name || "-"}
                        </td>
                        <td className="px-2 py-3 text-center text-slate-700">
                          {item.quantity ? formatKRW(item.quantity) : "-"}
                        </td>
                        <td className="px-2 py-3 text-right text-slate-700">
                          {item.unitPrice ? formatKRW(item.unitPrice) : "-"}
                        </td>
                        <td className="px-2 py-3 text-right font-medium text-slate-900">
                          {amount ? formatKRW(amount) : "-"}
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="mt-6 flex justify-end">
              <div className="w-full max-w-xs space-y-2 border border-slate-200 bg-slate-50/80 p-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-600">공급가액</span>
                  <span className="font-medium text-slate-900">
                    {formatKRW(totals.supplyAmount)}원
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">부가세 (10%)</span>
                  <span className="font-medium text-slate-900">
                    {formatKRW(totals.vat)}원
                  </span>
                </div>
                <div className="flex justify-between border-t border-slate-300 pt-2 text-base">
                  <span className="font-bold text-slate-900">합계</span>
                  <span className="font-bold text-primary">
                    {formatKRW(totals.total)}원
                  </span>
                </div>
              </div>
            </div>

            <RemarksSection data={data} />

            <p className="mt-8 text-center text-xs text-slate-400">
              위와 같이 견적합니다.
            </p>

            <div className="mt-6 flex items-center justify-between gap-4 border-t border-slate-100 pt-6">
              <p className="text-sm font-medium text-slate-900">
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
)
