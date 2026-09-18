import type { Metadata } from "next"
import { ClipboardList, FileCheck, FileSignature, FileText, Mail, Package, Receipt, ReceiptText } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { ToolLinkCard } from "@/components/tool-link-card"

export const metadata: Metadata = {
  title: "문서작성 | 견적서·거래명세서·영수증 PDF | 사장만",
  description:
    "견적서, 거래명세서, 발주서, 영수증 등 사장님 업무 문서를 작성하고 PDF로 저장하세요.",
  alternates: { canonical: "/documents" },
  openGraph: {
    title: "문서작성 | 사장만",
    description:
      "견적서, 거래명세서, 발주서, 영수증 등 업무 문서를 무료로 작성하세요.",
    url: "/documents",
    type: "website",
  },
}

const documents = [
  {
    title: "무료 견적서 생성기",
    description:
      "거래처와 품목을 입력하면 견적서를 PDF로 만들 수 있습니다.",
    href: "/documents/estimate",
    icon: FileText,
  },
  {
    title: "견적 요청서 생성기",
    description:
      "거래처에 견적을 요청하는 RFQ를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/quote-request",
    icon: Mail,
  },
  {
    title: "무료 거래명세서 생성기",
    description: "공급자와 품목 정보를 입력해 거래명세서를 작성합니다.",
    href: "/documents/statement",
    icon: Receipt,
  },
  {
    title: "발주서 생성기",
    description:
      "거래처 발주서를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/purchase-order",
    icon: ClipboardList,
  },
  {
    title: "물품공급계약서 생성기",
    description:
      "B2B 물품 공급 계약서를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/supply-contract",
    icon: FileSignature,
  },
  {
    title: "납품서 생성기",
    description:
      "거래처 납품서를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/delivery-note",
    icon: Package,
  },
  {
    title: "영수증 생성기",
    description:
      "거래처·고객용 영수증을 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/receipt",
    icon: ReceiptText,
  },
  {
    title: "거래확인서 생성기",
    description:
      "거래 내역을 정리하여 거래확인서를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/transaction-confirmation",
    icon: FileCheck,
  },
]

export default function DocumentsPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="문서작성"
        description="견적서, 거래명세서 등 사장님 업무에 필요한 문서를 빠르게 작성하세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {documents.map((item) => (
            <ToolLinkCard key={item.href} {...item} />
          ))}
        </div>
      </div>
    </SiteLayout>
  )
}
