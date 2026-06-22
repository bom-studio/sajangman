"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Copy, Eye, FileText, Pencil, Trash2 } from "lucide-react"

import { DocumentListSearch } from "@/components/documents/document-list-search"
import { DocumentViewDialog } from "@/components/documents/document-view-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatKRW } from "@/lib/estimate"
import {
  copyDocument,
  deleteDocument,
  fetchDocumentsByType,
  searchDocumentsByType,
} from "@/lib/documents"
import { getSupplierDisplayName } from "@/lib/supabase/documents"
import {
  DOCUMENT_TYPE_CONFIG_MAP,
  type DocumentSearchField,
  type DocumentType,
  type SavedDocument,
} from "@/types/documents"

interface DocumentListProps {
  documentType: DocumentType
}

function formatListDate(value: string): string {
  if (!value) return "-"
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value.slice(0, 10)
  return date.toLocaleDateString("ko-KR")
}

export function DocumentList({ documentType }: DocumentListProps) {
  const router = useRouter()
  const config = DOCUMENT_TYPE_CONFIG_MAP[documentType]
  const [documents, setDocuments] = useState<SavedDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchInput, setSearchInput] = useState("")
  const [searchFieldInput, setSearchFieldInput] =
    useState<DocumentSearchField>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchField, setSearchField] = useState<DocumentSearchField>("all")
  const [hasSavedDocuments, setHasSavedDocuments] = useState(false)
  const [viewDocument, setViewDocument] = useState<SavedDocument | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<SavedDocument | null>(null)
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null)

  const loadDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)

    const result = searchQuery
      ? await searchDocumentsByType(documentType, searchQuery, searchField)
      : await fetchDocumentsByType(documentType)

    setDocuments(result.data)
    setError(result.error)

    if (!searchQuery) {
      setHasSavedDocuments(result.data.length > 0)
    }

    setLoading(false)
  }, [documentType, searchField, searchQuery])

  useEffect(() => {
    loadDocuments()
  }, [loadDocuments])

  async function handleCopy(document: SavedDocument) {
    setActionLoadingId(document.id)
    const result = await copyDocument(document)
    setActionLoadingId(null)

    if (result.error) {
      setError(result.error)
      return
    }

    await loadDocuments()
  }

  async function handleDelete() {
    if (!deleteTarget) return

    setActionLoadingId(deleteTarget.id)
    const result = await deleteDocument(deleteTarget.id)
    setActionLoadingId(null)
    setDeleteTarget(null)

    if (result.error) {
      setError(result.error)
      return
    }

    await loadDocuments()
  }

  function handleEdit(document: SavedDocument) {
    router.push(`${config.editorHref}?docId=${document.id}`)
  }

  function handleSearch() {
    const trimmed = searchInput.trim()
    setSearchQuery(trimmed)
    setSearchField(searchFieldInput)
  }

  function handleSearchReset() {
    setSearchInput("")
    setSearchFieldInput("all")
    setSearchQuery("")
    setSearchField("all")
  }

  const showSearch =
    hasSavedDocuments ||
    searchInput.length > 0 ||
    searchQuery.length > 0 ||
    searchFieldInput !== "all"
  const isSearchActive = searchQuery.length > 0

  const searchBar = showSearch ? (
    <DocumentListSearch
      value={searchInput}
      searchField={searchFieldInput}
      onChange={setSearchInput}
      onSearchFieldChange={setSearchFieldInput}
      onSearch={handleSearch}
      onReset={handleSearchReset}
      isSearching={isSearchActive}
    />
  ) : null

  if (loading) {
    return (
      <div className="space-y-4">
        {searchBar}
        <div className="space-y-3">
          {[1, 2, 3].map((key) => (
            <div
              key={key}
              className="h-14 animate-pulse rounded-xl border border-border/60 bg-muted/40"
            />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        {searchBar}
        <p className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </p>
      </div>
    )
  }

  if (documents.length === 0 && !isSearchActive) {
    return (
      <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
        <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <FileText className="size-7" />
        </div>
        <p className="mt-4 text-base font-semibold text-foreground">
          저장된 문서가 없습니다.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          문서작성에서 문서를 작성하고 저장해보세요.
        </p>
        <Button asChild className="mt-6">
          <Link href={config.editorHref}>문서 작성하러 가기</Link>
        </Button>
      </div>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {searchBar}

        {documents.length === 0 && isSearchActive ? (
          <div className="rounded-2xl border border-border/70 bg-card px-6 py-16 text-center shadow-sm">
            <p className="text-base font-semibold text-foreground">
              검색 결과가 없습니다.
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              다른 검색어를 입력해보세요.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-border/70 bg-card shadow-sm">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>문서번호</TableHead>
                  <TableHead>제목</TableHead>
                  <TableHead>고객명</TableHead>
                  <TableHead>공급자명</TableHead>
                  <TableHead>작성일</TableHead>
                  <TableHead className="text-right">총액</TableHead>
                  <TableHead className="text-right">관리</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((document) => (
                  <TableRow key={document.id}>
                    <TableCell className="font-medium whitespace-nowrap">
                      {document.documentNumber || "-"}
                    </TableCell>
                    <TableCell className="max-w-[160px] truncate">
                      {document.title || "-"}
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate">
                      {document.customerName || "-"}
                    </TableCell>
                    <TableCell className="max-w-[120px] truncate">
                      {getSupplierDisplayName(document.supplierSnapshot)}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatListDate(document.createdAt)}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {formatKRW(document.totalAmount)}원
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => setViewDocument(document)}
                          disabled={actionLoadingId === document.id}
                        >
                          <Eye className="size-3.5" />
                          보기
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(document)}
                          disabled={actionLoadingId === document.id}
                        >
                          <Pencil className="size-3.5" />
                          수정
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(document)}
                          disabled={actionLoadingId === document.id}
                        >
                          <Copy className="size-3.5" />
                          복사
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive"
                          onClick={() => setDeleteTarget(document)}
                          disabled={actionLoadingId === document.id}
                        >
                          <Trash2 className="size-3.5" />
                          삭제
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      <DocumentViewDialog
        document={viewDocument}
        open={viewDocument !== null}
        onOpenChange={(open) => {
          if (!open) setViewDocument(null)
        }}
      />

      <Dialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>문서 삭제</DialogTitle>
            <DialogDescription>
              &apos;{deleteTarget?.title || deleteTarget?.documentNumber}&apos;
              문서를 삭제할까요? 이 작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              취소
            </Button>
            <Button type="button" variant="destructive" onClick={handleDelete}>
              삭제
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
