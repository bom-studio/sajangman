"use client"

import type { ReactNode } from "react"

import { SealMark } from "@/components/estimate/seal-signature"
import { Card, CardContent } from "@/components/ui/card"
import { numberToKorean } from "@/lib/number-to-korean"
import {
  formatBusinessNumber,
  formatPhoneNumber,
} from "@/lib/format-kr"
import { SUPPLY_CONTRACT_DOCUMENT_ID } from "@/lib/supply-contract-pdf"
import {
  calculateSupplyContract,
  DEFAULT_ESTIMATE_UNIT,
  ENTITY_TYPE_LABEL,
  formatDisplayDate,
  formatKRW,
  getAutoRenewalText,
  getLineSupplyAmount,
  getLineTotal,
  getLineVat,
  PAYMENT_METHOD_LABEL,
  SHIPPING_COST_LABEL,
  type SupplyContractData,
} from "@/lib/supply-contract"
import { cn } from "@/lib/utils"

const DOC = {
  text: "#0f172a",
  textMuted: "#64748b",
  textBody: "#334155",
  textLight: "#94a3b8",
  primary: "#2563eb",
  bg: "#ffffff",
  bgMuted: "#f8fafc",
  border: "#e2e8f0",
  borderStrong: "#1e293b",
} as const

interface SupplyContractPreviewProps {
  data: SupplyContractData
  supplierSealUrl: string | null
  buyerSealUrl: string | null
  className?: string
}

function Article({
  number,
  title,
  children,
}: {
  number: number
  title: string
  children: ReactNode
}) {
  return (
    <section className="mb-5">
      <h3
        className="mb-2 text-sm font-bold"
        style={{ color: DOC.text }}
      >
        제{number}조 ({title})
      </h3>
      <div
        className="space-y-2 text-xs leading-relaxed sm:text-sm"
        style={{ color: DOC.textBody }}
      >
        {children}
      </div>
    </section>
  )
}

function SignatureBlock({
  title,
  companyName,
  representative,
  address,
  phone,
  sealUrl,
}: {
  title: string
  companyName: string
  representative: string
  address: string
  phone: string
  sealUrl: string | null
}) {
  return (
    <div
      className="flex-1 space-y-2 rounded-lg border p-4 text-sm"
      style={{ borderColor: DOC.border, backgroundColor: DOC.bgMuted }}
    >
      <p className="font-semibold" style={{ color: DOC.text }}>
        {title}
      </p>
      <p>상호: {companyName || "-"}</p>
      <p className="flex items-center gap-1">
        <span>대표자: {representative || "-"}</span>
        <SealMark sealUrl={sealUrl} />
      </p>
      <p>주소: {address || "-"}</p>
      <p>연락처: {phone || "-"}</p>
    </div>
  )
}

export function SupplyContractPreview({
  data,
  supplierSealUrl,
  buyerSealUrl,
  className,
}: SupplyContractPreviewProps) {
  const totals = calculateSupplyContract(data.items)
  const filledItems = data.items.filter((item) => item.name.trim())
  const displayItems = filledItems.length > 0 ? filledItems : data.items

  const supplierName = data.supplier.companyName || "공급자"
  const buyerName = data.buyer.companyName || "구매자"

  let articleNumber = 1

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
            id={SUPPLY_CONTRACT_DOCUMENT_ID}
            className="min-h-[297mm] border p-6 sm:p-8 md:p-10"
            style={{
              backgroundColor: DOC.bg,
              color: DOC.text,
              borderColor: DOC.border,
            }}
          >
            <div className="mb-6 text-center">
              <h2
                className="text-xl font-bold tracking-[0.2em] sm:text-2xl"
                style={{ color: DOC.text }}
              >
                물품공급계약서
              </h2>
            </div>

            <p
              className="mb-6 text-sm leading-relaxed"
              style={{ color: DOC.textBody }}
            >
              공급자 <strong>{supplierName}</strong>와 구매자{" "}
              <strong>{buyerName}</strong>는 아래와 같이 물품공급계약을
              체결한다.
            </p>

            <Article number={articleNumber++} title="목적">
              <p>
                본 계약은 공급자가 구매자에게 물품을 공급하고, 구매자가 이에
                대한 대금을 지급함에 있어 필요한 권리와 의무를 정함을 목적으로
                한다.
              </p>
            </Article>

            <Article number={articleNumber++} title="공급 물품">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-[10px] sm:text-xs">
                  <thead>
                    <tr style={{ backgroundColor: DOC.bgMuted }}>
                      <th className="border px-1 py-1.5">NO</th>
                      <th className="border px-1 py-1.5">납품기한</th>
                      <th className="border px-1 py-1.5">품목명</th>
                      <th className="border px-1 py-1.5">규격</th>
                      <th className="border px-1 py-1.5">수량</th>
                      <th className="border px-1 py-1.5">단가</th>
                      <th className="border px-1 py-1.5">공급가액</th>
                      <th className="border px-1 py-1.5">부가세</th>
                      <th className="border px-1 py-1.5">합계</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayItems.map((item, index) => (
                      <tr key={item.id}>
                        <td className="border px-1 py-1.5 text-center">
                          {index + 1}
                        </td>
                        <td className="border px-1 py-1.5 text-center">
                          {item.deliveryDeadline
                            ? formatDisplayDate(item.deliveryDeadline)
                            : "-"}
                        </td>
                        <td className="border px-1 py-1.5">{item.name || "-"}</td>
                        <td className="border px-1 py-1.5 text-center">
                          {item.spec || "-"}
                        </td>
                        <td className="border px-1 py-1.5 text-center">
                          {item.quantity
                            ? `${formatKRW(item.quantity)}${item.unit || DEFAULT_ESTIMATE_UNIT}`
                            : "-"}
                        </td>
                        <td className="border px-1 py-1.5 text-right">
                          {item.unitPrice ? formatKRW(item.unitPrice) : "-"}
                        </td>
                        <td className="border px-1 py-1.5 text-right">
                          {getLineSupplyAmount(item)
                            ? formatKRW(getLineSupplyAmount(item))
                            : "-"}
                        </td>
                        <td className="border px-1 py-1.5 text-right">
                          {getLineVat(item) ? formatKRW(getLineVat(item)) : "-"}
                        </td>
                        <td className="border px-1 py-1.5 text-right">
                          {getLineTotal(item) ? formatKRW(getLineTotal(item)) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Article>

            <Article number={articleNumber++} title="계약금액">
              <p>총 공급가액: {formatKRW(totals.supplyAmount)}원</p>
              <p>부가세: {formatKRW(totals.vat)}원</p>
              <p className="font-semibold" style={{ color: DOC.primary }}>
                총 계약금액: {formatKRW(totals.total)}원 (일금{" "}
                {numberToKorean(totals.total)}원정)
              </p>
            </Article>

            <Article number={articleNumber++} title="계약 기간">
              <p>
                계약기간: {formatDisplayDate(data.contractPeriod.startDate)} ~{" "}
                {formatDisplayDate(data.contractPeriod.endDate)}
              </p>
              <p>{getAutoRenewalText(data.contractPeriod.autoRenewal)}</p>
            </Article>

            <Article number={articleNumber++} title="납품 및 인도">
              <p>납품 장소: {data.deliveryTerms.location || "-"}</p>
              <p>
                운비 부담:{" "}
                {SHIPPING_COST_LABEL[data.deliveryTerms.shippingCostBearer]}
              </p>
            </Article>

            <Article number={articleNumber++} title="검수">
              <p>검수 기한: {data.inspectionTerms.inspectionDeadline}</p>
              <p>{data.inspectionTerms.defectHandling}</p>
              <p>
                구매자는 물품을 인도받은 날로부터 지정된 기간 내에 검수를
                완료해야 하며, 이의가 없는 경우 검수에 합격한 것으로 본다.
              </p>
              <p>
                소유권 이전: {data.inspectionTerms.ownershipTransferTiming}
              </p>
            </Article>

            <Article number={articleNumber++} title="대금 지급">
              <p>지급 방식: {PAYMENT_METHOD_LABEL[data.paymentTerms.method]}</p>
              <p>
                계약금 {data.paymentTerms.depositRatio}% / 잔금{" "}
                {data.paymentTerms.balanceRatio}%
              </p>
              <p>지급기한: {data.paymentTerms.paymentDeadline}</p>
              {data.paymentTerms.bankAccount && (
                <p>입금 계좌: {data.paymentTerms.bankAccount}</p>
              )}
              <p>
                세금계산서 발행:{" "}
                {data.paymentTerms.issueTaxInvoice ? "발행" : "미발행"}
              </p>
            </Article>

            <Article number={articleNumber++} title="지연 및 손해배상">
              <p>
                대금 지급 지연 또는 납품 지연 시 상대방에게 통지하고 협의하여
                해결한다.
              </p>
              {data.paymentTerms.lateInterest && (
                <p>
                  대금 지급 지연 시 연 {data.paymentTerms.lateInterestRate}%
                  의 비율로 지연이자를 적용할 수 있다.
                </p>
              )}
            </Article>

            {data.legalOptions.confidentiality && (
              <Article number={articleNumber++} title="비밀유지">
                <p>
                  당사자는 본 계약과 관련하여 알게 된 상대방의 영업상, 기술상
                  정보를 제3자에게 누설해서는 안 된다.
                </p>
              </Article>
            )}

            {data.legalOptions.intellectualProperty && (
              <Article number={articleNumber++} title="지식재산권">
                <p>
                  본 계약에 따른 설계, 샘플, 자료 등 지식재산권의 귀속 및
                  사용 범위는 당사자 간 별도 합의에 따른다.
                </p>
                {data.legalOptions.resaleRestriction && (
                  <p>
                    구매자는 공급 물품을 공급자의 사전 서면 동의 없이 제3자에게
                    재판매할 수 없다.
                  </p>
                )}
              </Article>
            )}

            {!data.legalOptions.intellectualProperty &&
              data.legalOptions.resaleRestriction && (
                <Article number={articleNumber++} title="재판매 제한">
                  <p>
                    구매자는 공급 물품을 공급자의 사전 서면 동의 없이 제3자에게
                    재판매할 수 없다.
                  </p>
                </Article>
              )}

            <Article number={articleNumber++} title="계약 해지">
              <p>
                당사자는 계약 해지 {data.contractPeriod.terminationNoticeDays}
                일 전까지 서면 통보로 본 계약을 해지할 수 있다.
              </p>
              <p>해지 사유: {data.contractPeriod.terminationReasons}</p>
            </Article>

            {data.specialTerms.trim() && (
              <Article number={articleNumber++} title="특약사항">
                {data.specialTerms.split("\n").map((line) => (
                  <p key={line}>{line}</p>
                ))}
              </Article>
            )}

            <Article number={articleNumber++} title="분쟁 해결">
              <p>
                본 계약과 관련하여 분쟁이 발생한 경우 당사자 간 협의로
                해결하며, 협의가 이루어지지 않을 경우 관련 법령에 따른 관할
                법원을 따른다.
              </p>
            </Article>

            <div className="mt-8 border-t pt-6" style={{ borderColor: DOC.border }}>
              <p className="mb-4 text-sm" style={{ color: DOC.textMuted }}>
                계약 작성일: {formatDisplayDate(data.signing.writtenDate)}
                {data.signing.place ? ` · ${data.signing.place}` : ""}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <SignatureBlock
                  title="공급자"
                  companyName={data.supplier.companyName}
                  representative={data.supplier.representative}
                  address={data.supplier.address}
                  phone={
                    data.supplier.phone
                      ? formatPhoneNumber(data.supplier.phone)
                      : ""
                  }
                  sealUrl={supplierSealUrl}
                />
                <SignatureBlock
                  title="구매자"
                  companyName={data.buyer.companyName}
                  representative={data.buyer.representative}
                  address={data.buyer.address}
                  phone={
                    data.buyer.phone ? formatPhoneNumber(data.buyer.phone) : ""
                  }
                  sealUrl={buyerSealUrl}
                />
              </div>
            </div>

            <p
              className="mt-6 text-center text-[10px]"
              style={{ color: DOC.textLight }}
            >
              본 문서는 참고용 계약서 작성 보조 도구로 생성되었습니다.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
