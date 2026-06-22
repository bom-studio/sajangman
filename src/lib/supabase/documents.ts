import type {
  DocumentRow,
  DocumentType,
  SavedDocument,
  SupplierSnapshot,
} from "@/types/documents"

export function mapDocumentRow(row: DocumentRow): SavedDocument {
  return {
    id: row.id,
    userId: row.user_id,
    documentType: row.document_type as DocumentType,
    documentNumber: row.document_number ?? "",
    title: row.title ?? "",
    customerName: row.customer_name ?? "",
    totalAmount: Number(row.total_amount) || 0,
    supplierSnapshot: row.supplier_snapshot ?? {},
    customerSnapshot: row.customer_snapshot,
    documentData: row.document_data ?? {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export function getSupplierDisplayName(snapshot: SupplierSnapshot): string {
  return (
    snapshot.companyName ||
    (typeof snapshot.representative === "string" ? snapshot.representative : "") ||
    (typeof snapshot.representativeName === "string"
      ? snapshot.representativeName
      : "") ||
    "-"
  )
}
