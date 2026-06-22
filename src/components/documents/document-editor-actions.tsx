"use client"

import { Download } from "lucide-react"

import { SaveDocumentButton } from "@/components/documents/save-document-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DocumentEditorActionsProps {
  onSave: () => Promise<{ error: string | null }>
  onPdfDownload: () => void | Promise<void>
  isPdfDownloading?: boolean
  pdfDisabled?: boolean
  className?: string
  variant?: "desktop" | "mobile"
}

export function DocumentEditorActions({
  onSave,
  onPdfDownload,
  isPdfDownloading = false,
  pdfDisabled = false,
  className,
  variant = "desktop",
}: DocumentEditorActionsProps) {
  const isMobile = variant === "mobile"

  return (
    <div
      className={cn(
        "flex flex-col items-end gap-2",
        isMobile && "w-full items-stretch",
        className
      )}
    >
      <div
        className={cn(
          "flex items-center gap-2",
          isMobile && "w-full flex-col sm:flex-row"
        )}
      >
        <SaveDocumentButton
          onSave={onSave}
          className={cn(isMobile && "w-full sm:w-auto")}
        />
        <Button
          type="button"
          onClick={onPdfDownload}
          disabled={isPdfDownloading || pdfDisabled}
          className={cn(isMobile && "w-full sm:w-auto")}
        >
          <Download className="size-4" />
          {isPdfDownloading ? "PDF 생성 중..." : "PDF 다운로드"}
        </Button>
      </div>
    </div>
  )
}
