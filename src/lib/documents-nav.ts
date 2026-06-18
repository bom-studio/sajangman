export interface DocumentsNavItem {
  label: string
  href: string
}

export const DOCUMENTS_NAV_ITEMS: DocumentsNavItem[] = [
  { label: "저장된 견적서", href: "/mypage/documents/estimates" },
  { label: "저장된 거래명세서", href: "/mypage/documents/statements" },
  { label: "저장된 영수증", href: "/mypage/documents/receipts" },
  { label: "저장된 발주서", href: "/mypage/documents/purchase-orders" },
]

export function isDocumentsNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function getDocumentsNavLabel(pathname: string): string {
  const matched = DOCUMENTS_NAV_ITEMS.find((item) =>
    isDocumentsNavActive(pathname, item.href)
  )
  return matched?.label ?? "문서관리"
}
