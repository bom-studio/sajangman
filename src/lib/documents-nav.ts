import {
  DOCUMENT_TYPE_CONFIGS,
  type DocumentType,
} from "@/types/documents"

export interface DocumentsNavItem {
  label: string
  href: string
  documentType: DocumentType
}

export const DOCUMENTS_NAV_ITEMS: DocumentsNavItem[] = DOCUMENT_TYPE_CONFIGS.map(
  (config) => ({
    label: config.label,
    href: config.listHref,
    documentType: config.type,
  })
)

export function isDocumentsNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export function getDocumentsNavLabel(pathname: string): string {
  const matched = DOCUMENTS_NAV_ITEMS.find((item) =>
    isDocumentsNavActive(pathname, item.href)
  )
  return matched?.label ?? "문서관리"
}

export function getDocumentTypeFromPathname(
  pathname: string
): DocumentType | null {
  const matched = DOCUMENTS_NAV_ITEMS.find((item) =>
    isDocumentsNavActive(pathname, item.href)
  )
  return matched?.documentType ?? null
}
