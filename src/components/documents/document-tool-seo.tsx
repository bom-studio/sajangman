import Link from "next/link"

import {
  DOCUMENTS,
  getDocumentsByGroup,
  type DocumentListItem,
} from "@/data/documents"

const DOC_INTRO: Record<
  string,
  { when: string; items: string[]; notes: string[] }
> = {
  "/documents/estimate": {
    when: "거래처에 공급 단가·수량을 제안하거나 견적을 회신할 때 사용합니다.",
    items: ["공급자·고객 정보", "품목·단가·수량", "유효기간·결제 조건"],
    notes: [
      "견적서는 계약서가 아닙니다. 최종 거래 조건은 별도 합의가 필요할 수 있습니다.",
      "세금계산서·거래명세서와 금액이 맞는지 확인하세요.",
    ],
  },
  "/documents/statement": {
    when: "납품·거래 내역을 정리해 거래처에 증빙으로 전달할 때 사용합니다.",
    items: ["거래 당사자", "품목·금액", "거래일자"],
    notes: [
      "세무·회계 증빙 요건은 업종·거래 형태에 따라 다를 수 있습니다.",
      "필요 시 세금계산서·영수증과 함께 보관하세요.",
    ],
  },
  "/documents/supply-contract": {
    when: "사업자 간 물품 공급 조건(기간·대금·납품·검수)을 문서로 남길 때 사용합니다.",
    items: ["공급자·구매자", "공급 물품", "계약기간·대금지급", "납품·검수 조건"],
    notes: [
      "본 양식은 참고용 작성 도구이며 법률 자문을 대체하지 않습니다.",
      "중요 계약은 전문가 검토를 권장합니다.",
    ],
  },
  "/documents/quote-request": {
    when: "여러 거래처에 동일 조건으로 견적을 요청(RFQ)할 때 사용합니다.",
    items: ["요청자 정보", "요청 품목", "희망 납기·조건"],
    notes: ["회신 견적과 조건을 비교한 뒤 발주·계약으로 이어가세요."],
  },
  "/documents/purchase-order": {
    when: "확정된 발주 내용을 거래처에 공식 전달할 때 사용합니다.",
    items: ["발주·공급자", "품목·수량", "납품 희망일"],
    notes: ["발주서와 실제 납품·세금계산서 내역을 대조하세요."],
  },
  "/documents/delivery-note": {
    when: "물품 납품 사실을 확인하고 인수 증빙이 필요할 때 사용합니다.",
    items: ["납품·인수 당사자", "품목·수량", "납품일"],
    notes: ["검수 이상 시 즉시 기록해 두는 것이 좋습니다."],
  },
  "/documents/receipt": {
    when: "대금 수령을 간단히 증명할 때 사용합니다.",
    items: ["발행·수령자", "금액", "내역"],
    notes: ["현금영수증·세금계산서 의무 여부는 거래 유형에 따라 다릅니다."],
  },
  "/documents/transaction-confirmation": {
    when: "일정 기간 거래 내역을 확인해 상호 확인할 때 사용합니다.",
    items: ["당사자", "거래 기간·내역", "합계 금액"],
    notes: ["회계·세무 자료와 금액이 일치하는지 확인하세요."],
  },
}

function RelatedDocs({ currentHref }: { currentHref: string }) {
  const current = DOCUMENTS.find((d) => d.href === currentHref)
  const group = current?.group ?? "quote-trade"
  const related = getDocumentsByGroup(group)
    .filter((d) => d.href !== currentHref)
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <div>
      <h2 className="text-xl font-bold text-foreground">관련 문서</h2>
      <ul className="mt-3 space-y-2">
        {related.map((doc: DocumentListItem) => (
          <li key={doc.href}>
            <Link
              href={doc.href}
              className="text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              {doc.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DocumentToolSeo({ href }: { href: string }) {
  const intro = DOC_INTRO[href]
  if (!intro) return null

  return (
    <section className="mx-auto max-w-6xl border-t border-slate-200 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-10">
        <div>
          <h2 className="text-xl font-bold text-foreground">언제 사용하나요?</h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
            {intro.when}
          </p>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">작성에 필요한 항목</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground sm:text-base">
            {intro.items.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="text-xl font-bold text-foreground">작성 시 참고</h2>
          <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted-foreground sm:text-base">
            {intro.notes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <RelatedDocs currentHref={href} />
      </div>
    </section>
  )
}
