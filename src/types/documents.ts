export const DOCUMENT_TYPES = [
  "estimate",
  "quote_request",
  "statement",
  "purchase_order",
  "delivery_note",
  "supply_contract",
  "receipt",
  "transaction_confirmation",
] as const

export type DocumentType = (typeof DOCUMENT_TYPES)[number]

export const DOCUMENT_SEARCH_FIELDS = [
  "all",
  "title",
  "customer_name",
  "supplier_name",
] as const

export type DocumentSearchField = (typeof DOCUMENT_SEARCH_FIELDS)[number]

export interface DocumentTypeConfig {
  type: DocumentType
  label: string
  listHref: string
  editorHref: string
}

export const DOCUMENT_TYPE_CONFIGS: DocumentTypeConfig[] = [
  {
    type: "estimate",
    label: "견적서",
    listHref: "/mypage/documents/estimates",
    editorHref: "/documents/estimate",
  },
  {
    type: "quote_request",
    label: "견적 요청서",
    listHref: "/mypage/documents/quote-requests",
    editorHref: "/documents/quote-request",
  },
  {
    type: "statement",
    label: "거래명세서",
    listHref: "/mypage/documents/statements",
    editorHref: "/documents/statement",
  },
  {
    type: "purchase_order",
    label: "발주서",
    listHref: "/mypage/documents/purchase-orders",
    editorHref: "/documents/purchase-order",
  },
  {
    type: "delivery_note",
    label: "납품서",
    listHref: "/mypage/documents/delivery-notes",
    editorHref: "/documents/delivery-note",
  },
  {
    type: "supply_contract",
    label: "물품공급계약서",
    listHref: "/mypage/documents/supply-contracts",
    editorHref: "/documents/supply-contract",
  },
  {
    type: "receipt",
    label: "영수증",
    listHref: "/mypage/documents/receipts",
    editorHref: "/documents/receipt",
  },
  {
    type: "transaction_confirmation",
    label: "거래확인서",
    listHref: "/mypage/documents/transaction-confirmations",
    editorHref: "/documents/transaction-confirmation",
  },
]

export const DOCUMENT_TYPE_CONFIG_MAP = Object.fromEntries(
  DOCUMENT_TYPE_CONFIGS.map((config) => [config.type, config])
) as Record<DocumentType, DocumentTypeConfig>

export interface SupplierSnapshot {
  companyName: string
  representative?: string
  representativeName?: string
  businessNumber?: string
  phone?: string
  email?: string
  address?: string
  sealUrl?: string | null
  [key: string]: unknown
}

export interface SavedDocument {
  id: string
  userId: string
  documentType: DocumentType
  documentNumber: string
  title: string
  customerName: string
  totalAmount: number
  supplierSnapshot: SupplierSnapshot
  customerSnapshot: Record<string, unknown> | null
  documentData: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export interface DocumentSaveInput {
  documentType: DocumentType
  documentData: Record<string, unknown>
  supplierSnapshot: SupplierSnapshot
  customerSnapshot?: Record<string, unknown> | null
  documentNumber?: string
  title?: string
  customerName?: string
  totalAmount?: number
}

export interface DocumentRow {
  id: string
  user_id: string
  document_type: string
  document_number: string | null
  title: string | null
  customer_name: string | null
  total_amount: number | string
  supplier_snapshot: SupplierSnapshot
  customer_snapshot: Record<string, unknown> | null
  document_data: Record<string, unknown>
  created_at: string
  updated_at: string
}
