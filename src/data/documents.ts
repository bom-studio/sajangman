import {
  ClipboardList,
  FileCheck,
  FileSignature,
  FileText,
  Mail,
  Package,
  Receipt,
  ReceiptText,
  type LucideIcon,
} from "lucide-react"

export type DocumentGroupId = "quote-trade" | "order-contract"

export interface DocumentListItem {
  title: string
  description: string
  href: string
  icon: LucideIcon
  group: DocumentGroupId
}

export const DOCUMENTS: DocumentListItem[] = [
  {
    title: "무료 견적서 생성기",
    description:
      "거래처와 품목을 입력하면 견적서를 PDF로 만들 수 있습니다.",
    href: "/documents/estimate",
    icon: FileText,
    group: "quote-trade",
  },
  {
    title: "견적 요청서 생성기",
    description:
      "거래처에 견적을 요청하는 RFQ를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/quote-request",
    icon: Mail,
    group: "quote-trade",
  },
  {
    title: "무료 거래명세서 생성기",
    description: "공급자와 품목 정보를 입력해 거래명세서를 작성합니다.",
    href: "/documents/statement",
    icon: Receipt,
    group: "quote-trade",
  },
  {
    title: "영수증 생성기",
    description:
      "거래처·고객용 영수증을 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/receipt",
    icon: ReceiptText,
    group: "quote-trade",
  },
  {
    title: "거래확인서 생성기",
    description:
      "거래 내역을 정리하여 거래확인서를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/transaction-confirmation",
    icon: FileCheck,
    group: "quote-trade",
  },
  {
    title: "발주서 생성기",
    description: "거래처 발주서를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/purchase-order",
    icon: ClipboardList,
    group: "order-contract",
  },
  {
    title: "물품공급계약서 생성기",
    description:
      "B2B 물품 공급 계약서를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/supply-contract",
    icon: FileSignature,
    group: "order-contract",
  },
  {
    title: "납품서 생성기",
    description: "거래처 납품서를 작성하고 PDF로 저장할 수 있습니다.",
    href: "/documents/delivery-note",
    icon: Package,
    group: "order-contract",
  },
]

export const DOCUMENT_GROUPS: {
  id: DocumentGroupId
  label: string
}[] = [
  { id: "quote-trade", label: "견적·거래" },
  { id: "order-contract", label: "발주·계약" },
]

export function getDocumentsByGroup(group: DocumentGroupId): DocumentListItem[] {
  return DOCUMENTS.filter((item) => item.group === group)
}
