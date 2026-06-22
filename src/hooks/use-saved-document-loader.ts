"use client"

import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "next/navigation"

import { fetchDocumentById } from "@/lib/documents"
import type { DocumentType, SavedDocument } from "@/types/documents"

interface UseSavedDocumentLoaderOptions {
  documentType: DocumentType
  onLoad: (document: SavedDocument) => void
}

export function useSavedDocumentLoader({
  documentType,
  onLoad,
}: UseSavedDocumentLoaderOptions) {
  const searchParams = useSearchParams()
  const onLoadRef = useRef(onLoad)
  const [documentId, setDocumentId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    onLoadRef.current = onLoad
  }, [onLoad])

  useEffect(() => {
    const docId = searchParams.get("docId")
    if (!docId) return

    let cancelled = false
    setLoading(true)

    fetchDocumentById(docId).then(({ data, error }) => {
      if (cancelled) return

      if (data && data.documentType === documentType) {
        onLoadRef.current(data)
        setDocumentId(data.id)
      } else if (error) {
        console.error(error)
      }

      setLoading(false)
    })

    return () => {
      cancelled = true
    }
  }, [searchParams, documentType])

  return { documentId, setDocumentId, loading }
}
