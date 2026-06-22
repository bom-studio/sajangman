import { buildCopyDocumentInput, buildDocumentMetadata } from "@/lib/document-metadata"
import { createClient } from "@/lib/supabase/client"
import { getSupplierDisplayName, mapDocumentRow } from "@/lib/supabase/documents"
import type {
  DocumentSaveInput,
  DocumentSearchField,
  DocumentType,
  DocumentRow,
  SavedDocument,
} from "@/types/documents"

function getDocumentErrorMessage(
  error: { code?: string; message?: string },
  fallback: string
): string {
  if (error.code === "23505") {
    return "문서 저장 중 충돌이 발생했습니다. 잠시 후 다시 시도해주세요."
  }
  return fallback
}

async function getAuthenticatedUserId(): Promise<{
  userId: string | null
  error: string | null
}> {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { userId: null, error: "로그인이 필요합니다." }
  }

  return { userId: user.id, error: null }
}

/** PostgREST .or() 필터에서 쉼표 등이 깨지지 않도록 정리 */
export function sanitizeDocumentSearchTerm(term: string): string {
  return term.trim().replace(/[,()]/g, " ")
}

export function toDocumentIlikePattern(term: string): string {
  const sanitized = sanitizeDocumentSearchTerm(term)
  if (!sanitized) return ""

  const escaped = sanitized.replace(/[%_\\]/g, "\\$&")
  return `%${escaped}%`
}

function filterDocumentsClientSide(
  documents: SavedDocument[],
  searchTerm: string,
  field: DocumentSearchField = "all"
): SavedDocument[] {
  const lower = sanitizeDocumentSearchTerm(searchTerm).toLowerCase()
  if (!lower) return documents

  return documents.filter((doc) => {
    const titleMatch = doc.title.toLowerCase().includes(lower)
    const customerMatch = doc.customerName.toLowerCase().includes(lower)
    const supplierMatch = getSupplierDisplayName(doc.supplierSnapshot)
      .toLowerCase()
      .includes(lower)

    switch (field) {
      case "title":
        return titleMatch
      case "customer_name":
        return customerMatch
      case "supplier_name":
        return supplierMatch
      default:
        return titleMatch || customerMatch || supplierMatch
    }
  })
}

function buildSearchQuery(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  documentType: DocumentType,
  pattern: string,
  field: DocumentSearchField
) {
  let query = supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .eq("document_type", documentType)

  switch (field) {
    case "title":
      return query.ilike("title", pattern)
    case "customer_name":
      return query.ilike("customer_name", pattern)
    case "supplier_name":
      return query.filter("supplier_snapshot->>companyName", "ilike", pattern)
    default:
      return query.or(
        [
          `title.ilike.${pattern}`,
          `customer_name.ilike.${pattern}`,
          `supplier_snapshot->>companyName.ilike.${pattern}`,
        ].join(",")
      )
  }
}

export async function fetchDocumentsByType(
  documentType: DocumentType
): Promise<{ data: SavedDocument[]; error: string | null }> {
  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { data: [], error: authError }
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("user_id", userId)
    .eq("document_type", documentType)
    .order("created_at", { ascending: false })

  if (error) {
    return {
      data: [],
      error: getDocumentErrorMessage(error, "저장된 문서를 불러오지 못했습니다."),
    }
  }

  return {
    data: (data as DocumentRow[]).map(mapDocumentRow),
    error: null,
  }
}

export async function searchDocumentsByType(
  documentType: DocumentType,
  searchTerm: string,
  field: DocumentSearchField = "all"
): Promise<{ data: SavedDocument[]; error: string | null }> {
  const trimmed = sanitizeDocumentSearchTerm(searchTerm)
  if (!trimmed) {
    return fetchDocumentsByType(documentType)
  }

  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { data: [], error: authError }
  }

  const pattern = toDocumentIlikePattern(trimmed)
  const supabase = createClient()

  const { data, error } = await buildSearchQuery(
    supabase,
    userId,
    documentType,
    pattern,
    field
  ).order("created_at", { ascending: false })

  if (error) {
    const fallback = await fetchDocumentsByType(documentType)
    if (fallback.error) {
      return {
        data: [],
        error: getDocumentErrorMessage(
          error,
          "문서 검색에 실패했습니다."
        ),
      }
    }

    return {
      data: filterDocumentsClientSide(fallback.data, trimmed, field),
      error: null,
    }
  }

  return {
    data: (data as DocumentRow[]).map(mapDocumentRow),
    error: null,
  }
}

export async function fetchDocumentById(
  id: string
): Promise<{ data: SavedDocument | null; error: string | null }> {
  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { data: null, error: authError }
  }

  const supabase = createClient()
  const { data, error } = await supabase
    .from("documents")
    .select("*")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle()

  if (error) {
    return {
      data: null,
      error: getDocumentErrorMessage(error, "문서를 불러오지 못했습니다."),
    }
  }

  if (!data) {
    return { data: null, error: "문서를 찾을 수 없습니다." }
  }

  return { data: mapDocumentRow(data as DocumentRow), error: null }
}

export async function saveDocument(
  input: DocumentSaveInput,
  documentId?: string | null
): Promise<{ data: SavedDocument | null; error: string | null }> {
  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { data: null, error: authError }
  }

  const metadata = buildDocumentMetadata(input)
  const supabase = createClient()
  const row = {
    document_type: input.documentType,
    document_number: metadata.documentNumber || null,
    title: metadata.title || null,
    customer_name: metadata.customerName || null,
    total_amount: metadata.totalAmount,
    supplier_snapshot: input.supplierSnapshot,
    customer_snapshot: input.customerSnapshot ?? null,
    document_data: input.documentData,
  }

  if (documentId) {
    const { data, error } = await supabase
      .from("documents")
      .update(row)
      .eq("id", documentId)
      .eq("user_id", userId)
      .select("*")
      .single()

    if (error) {
      return {
        data: null,
        error: getDocumentErrorMessage(error, "문서 수정에 실패했습니다."),
      }
    }

    return { data: mapDocumentRow(data as DocumentRow), error: null }
  }

  const { data, error } = await supabase
    .from("documents")
    .insert({ user_id: userId, ...row })
    .select("*")
    .single()

  if (error) {
    return {
      data: null,
      error: getDocumentErrorMessage(error, "문서 저장에 실패했습니다."),
    }
  }

  return { data: mapDocumentRow(data as DocumentRow), error: null }
}

export async function copyDocument(
  source: SavedDocument
): Promise<{ data: SavedDocument | null; error: string | null }> {
  const input = buildCopyDocumentInput(source)
  return saveDocument(input)
}

export async function deleteDocument(
  id: string
): Promise<{ error: string | null }> {
  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { error: authError }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from("documents")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    return {
      error: getDocumentErrorMessage(error, "문서 삭제에 실패했습니다."),
    }
  }

  return { error: null }
}
