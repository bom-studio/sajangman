"use client"

import { useId, useRef, useState } from "react"
import { ImagePlus } from "lucide-react"

import { BusinessSealEditorDialog } from "@/components/suppliers/business-seal-editor-dialog"
import { Button } from "@/components/ui/button"
import { validateSealImageFile } from "@/lib/business-seal-storage"
import { readFileAsDataUrl } from "@/lib/seal-image"
import { cn } from "@/lib/utils"

interface SealUploadFieldProps {
  previewUrl: string | null
  representativeName?: string
  onFileSelect: (file: File, previewUrl: string) => void
  onValidationError: (message: string) => void
  onRemove: () => void
  disabled?: boolean
  className?: string
}

export function SealUploadField({
  previewUrl,
  representativeName,
  onFileSelect,
  onValidationError,
  onRemove,
  disabled = false,
  className,
}: SealUploadFieldProps) {
  const inputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorSource, setEditorSource] = useState<string | null>(null)

  async function openEditorWithFile(file: File) {
    const validationError = validateSealImageFile(file)
    if (validationError) {
      onValidationError(validationError)
      return
    }

    try {
      const dataUrl = await readFileAsDataUrl(file)
      setEditorSource(dataUrl)
      setEditorOpen(true)
    } catch {
      onValidationError("이미지를 불러오지 못했습니다.")
    }
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    void openEditorWithFile(file)
  }

  function handleEditExisting() {
    if (!previewUrl) return
    setEditorSource(previewUrl)
    setEditorOpen(true)
  }

  function handleEditorSave(file: File, previewUrl: string) {
    onFileSelect(file, previewUrl)
    setEditorOpen(false)
    setEditorSource(null)
  }

  return (
    <>
      <div className={cn("space-y-3", className)}>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">직인 등록</p>
          <p className="text-xs text-muted-foreground">
            PNG, JPG, WEBP 업로드 가능 · 최대 5MB · 배경 자동 제거
          </p>
        </div>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          className="hidden"
          disabled={disabled}
          onChange={handleFileChange}
        />

        {previewUrl ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="flex size-24 items-center justify-center overflow-hidden rounded-xl border border-border/70 bg-muted/20 p-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt="직인 미리보기"
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={disabled}
                onClick={handleEditExisting}
              >
                직인 변경
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-destructive hover:text-destructive"
                disabled={disabled}
                onClick={onRemove}
              >
                직인 삭제
              </Button>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-border/80 bg-muted/20 px-4 py-6 text-center">
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              직인 등록
            </Button>
          </div>
        )}
      </div>

      <BusinessSealEditorDialog
        open={editorOpen}
        onOpenChange={(nextOpen) => {
          setEditorOpen(nextOpen)
          if (!nextOpen) setEditorSource(null)
        }}
        sourceImage={editorSource}
        representativeName={representativeName}
        onSave={(file, previewUrl) => handleEditorSave(file, previewUrl)}
      />
    </>
  )
}
