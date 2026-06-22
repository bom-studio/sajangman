"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Download } from "lucide-react"

import { SavedDocumentPreview } from "@/components/documents/saved-document-preview"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { downloadSavedDocumentPdf } from "@/lib/saved-document-pdf"
import {
  DOCUMENT_TYPE_CONFIG_MAP,
  type SavedDocument,
} from "@/types/documents"

interface DocumentViewDialogProps {
  document: SavedDocument | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentViewDialog({
  document,
  open,
  onOpenChange,
}: DocumentViewDialogProps) {
  const router = useRouter()
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!document) return null

  const config = DOCUMENT_TYPE_CONFIG_MAP[document.documentType]

  function handleEdit() {
    onOpenChange(false)
    router.push(`${config.editorHref}?docId=${document!.id}`)
  }

  async function handlePdfDownload() {
    setIsDownloading(true)
    setError(null)

    const result = await downloadSavedDocumentPdf(document!)
    setIsDownloading(false)

    if (result.error) {
      setError(result.error)
    }
  }

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setError(null)
      setIsDownloading(false)
    }
    onOpenChange(nextOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex max-h-[92vh] w-full max-w-6xl flex-col gap-0 overflow-hidden p-0 sm:max-w-6xl">
        <DialogHeader className="shrink-0 border-b border-border/60 px-6 py-4">
          <DialogTitle>{config.label} 미리보기</DialogTitle>
          <DialogDescription>
            저장 당시 문서 내용을 기준으로 표시됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-y-auto bg-muted/30 px-4 py-6 sm:px-6">
          <div className="mx-auto flex justify-center">
            <SavedDocumentPreview document={document} />
          </div>
        </div>

        {error && (
          <p className="shrink-0 border-t border-destructive/20 bg-destructive/10 px-6 py-3 text-sm text-destructive">
            {error}
          </p>
        )}

        <DialogFooter className="shrink-0 border-t border-border/60 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleOpenChange(false)}
          >
            닫기
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={handlePdfDownload}
            disabled={isDownloading}
          >
            <Download className="size-4" />
            {isDownloading ? "PDF 생성 중..." : "PDF 다운로드"}
          </Button>
          <Button type="button" onClick={handleEdit}>
            수정하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
