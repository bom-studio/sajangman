"use client"

import { useEffect, useId, useRef, useState } from "react"
import { ImagePlus, Loader2 } from "lucide-react"

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
  processSealImage,
  readFileAsDataUrl,
} from "@/lib/seal-image"
import { cn } from "@/lib/utils"

export interface SealEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentImage?: string
  onApply: (imageBase64: string) => void
}

export function SealEditorDialog({
  open,
  onOpenChange,
  currentImage,
  onApply,
}: SealEditorDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const cropId = useId()
  const backgroundId = useId()

  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [crop1x1, setCrop1x1] = useState(false)
  const [removeBackground, setRemoveBackground] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    if (!open) return
    setUploadedImage(currentImage ?? null)
    setCrop1x1(false)
    setRemoveBackground(false)
    setPreviewUrl(currentImage ?? null)
  }, [open, currentImage])

  useEffect(() => {
    if (!uploadedImage) {
      setPreviewUrl(null)
      return
    }

    let cancelled = false
    setIsProcessing(true)

    processSealImage(uploadedImage, { crop1x1, removeBackground })
      .then((result) => {
        if (!cancelled) setPreviewUrl(result)
      })
      .catch(() => {
        if (!cancelled) setPreviewUrl(uploadedImage)
      })
      .finally(() => {
        if (!cancelled) setIsProcessing(false)
      })

    return () => {
      cancelled = true
    }
  }, [uploadedImage, crop1x1, removeBackground])

  async function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const dataUrl = await readFileAsDataUrl(file)
      setUploadedImage(dataUrl)
    } catch {
      setUploadedImage(null)
    } finally {
      event.target.value = ""
    }
  }

  async function handleApply() {
    if (!uploadedImage || !previewUrl) return

    setIsApplying(true)
    try {
      const finalImage = await processSealImage(uploadedImage, {
        crop1x1,
        removeBackground,
      })
      onApply(finalImage)
      onOpenChange(false)
    } finally {
      setIsApplying(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-html2canvas-ignore="true"
        className="gap-5 sm:max-w-lg"
      >
        <DialogHeader>
          <DialogTitle>직인 이미지 삽입</DialogTitle>
          <DialogDescription>
            PNG 또는 JPG 이미지를 업로드해주세요.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          <div
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border bg-muted/20 px-4 py-8"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              className="hidden"
              data-html2canvas-ignore="true"
              onChange={handleFileSelect}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => inputRef.current?.click()}
            >
              <ImagePlus className="size-4" />
              이미지 선택
            </Button>
          </div>

          <div className="mx-auto w-full max-w-[320px]">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl border border-border bg-white">
              {previewUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="직인 미리보기"
                  className="size-full object-contain p-3"
                />
              ) : (
                <div className="flex size-full items-center justify-center text-sm text-muted-foreground">
                  업로드한 이미지가 여기에 표시됩니다.
                </div>
              )}
              {isProcessing && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                  <Loader2 className="size-5 animate-spin text-primary" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 rounded-xl border border-border/70 bg-muted/20 p-4">
            <label
              htmlFor={cropId}
              className="flex cursor-pointer items-start gap-3 text-sm"
            >
              <input
                id={cropId}
                type="checkbox"
                checked={crop1x1}
                onChange={(event) => setCrop1x1(event.target.checked)}
                className="mt-0.5 size-4 rounded border-input accent-primary"
              />
              <span>
                <span className="font-medium text-foreground">1:1 이미지 자르기</span>
                <span className="mt-0.5 block text-muted-foreground">
                  이미지 중앙을 기준으로 정사각형으로 잘라냅니다.
                </span>
              </span>
            </label>

            <label
              htmlFor={backgroundId}
              className="flex cursor-pointer items-start gap-3 text-sm"
            >
              <input
                id={backgroundId}
                type="checkbox"
                checked={removeBackground}
                onChange={(event) => setRemoveBackground(event.target.checked)}
                className="mt-0.5 size-4 rounded border-input accent-primary"
              />
              <span>
                <span className="font-medium text-foreground">배경 제거</span>
                <span className="mt-0.5 block text-muted-foreground">
                  밝은 배경(흰색 계열)을 투명하게 처리합니다.
                </span>
              </span>
            </label>
          </div>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleApply}
            disabled={!uploadedImage || !previewUrl || isProcessing || isApplying}
          >
            {isApplying ? "적용 중..." : "견적서에 삽입"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
