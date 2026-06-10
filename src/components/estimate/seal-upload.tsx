"use client"

import { useState } from "react"

import { SealEditorDialog } from "@/components/estimate/seal-editor-dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SealUploadProps {
  sealUrl: string | null
  onSealChange: (url: string | null) => void
}

export function SealUpload({ sealUrl, onSealChange }: SealUploadProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex flex-col items-end gap-2">
        <div
          className={cn(
            "flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-300 bg-white"
          )}
        >
          {sealUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={sealUrl}
              alt="회사 직인"
              className="max-h-full max-w-full object-contain p-1.5"
            />
          ) : (
            <span className="text-sm font-medium text-slate-400">직인</span>
          )}
        </div>

        <div
          data-html2canvas-ignore
          className="flex items-center gap-2 print:hidden"
        >
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
          >
            삽입
          </Button>
          {sealUrl && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="text-destructive hover:text-destructive"
              onClick={() => onSealChange(null)}
            >
              삭제
            </Button>
          )}
        </div>
      </div>

      <SealEditorDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        currentImage={sealUrl ?? undefined}
        onApply={onSealChange}
      />
    </>
  )
}
