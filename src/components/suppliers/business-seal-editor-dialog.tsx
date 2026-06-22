"use client"

import { useCallback, useEffect, useState } from "react"
import Cropper, { type Area } from "react-easy-crop"
import "react-easy-crop/react-easy-crop.css"
import { Loader2 } from "lucide-react"

import { SealMark } from "@/components/estimate/seal-signature"
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
  buildSealPngFile,
  buildSealPreviewFromCrop,
  tryRemoveBackground,
} from "@/lib/seal-crop"
import { cn } from "@/lib/utils"

interface BusinessSealEditorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sourceImage: string | null
  representativeName?: string
  onSave: (file: File, previewUrl: string) => void
}

export function BusinessSealEditorDialog({
  open,
  onOpenChange,
  sourceImage,
  representativeName = "홍길동",
  onSave,
}: BusinessSealEditorDialogProps) {
  const [cropImage, setCropImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open || !sourceImage) return

    let cancelled = false
    setIsProcessing(true)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setPreviewUrl(null)
    setCroppedAreaPixels(null)
    setError(null)

    tryRemoveBackground(sourceImage)
      .then((processed) => {
        if (!cancelled) setCropImage(processed)
      })
      .finally(() => {
        if (!cancelled) setIsProcessing(false)
      })

    return () => {
      cancelled = true
    }
  }, [open, sourceImage])

  const updatePreview = useCallback(
    async (imageSrc: string, area: Area) => {
      try {
        const nextPreview = await buildSealPreviewFromCrop(imageSrc, area)
        setPreviewUrl(nextPreview)
      } catch {
        setPreviewUrl(null)
      }
    },
    []
  )

  const onCropComplete = useCallback(
    (_croppedArea: Area, croppedPixels: Area) => {
      setCroppedAreaPixels(croppedPixels)
      if (!cropImage) return
      void updatePreview(cropImage, croppedPixels)
    },
    [cropImage, updatePreview]
  )

  async function handleSave() {
    if (!cropImage || !croppedAreaPixels) return

    setIsSaving(true)
    setError(null)

    try {
      const preview = await buildSealPreviewFromCrop(
        cropImage,
        croppedAreaPixels
      )
      const file = await buildSealPngFile(preview)
      onSave(file, preview)
      onOpenChange(false)
    } catch {
      setError("직인 저장 중 오류가 발생했습니다. 다시 시도해주세요.")
    } finally {
      setIsSaving(false)
    }
  }

  const zoomPercent = Math.round(zoom * 100)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        data-html2canvas-ignore="true"
        className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-3xl"
      >
        <DialogHeader className="space-y-2 px-6 pt-6 pb-4">
          <DialogTitle>직인 편집</DialogTitle>
          <DialogDescription>
            문서에 표시될 직인을 조정하세요. 배경이 자동으로 제거되며 512×512
            PNG로 저장됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-6 px-6 pb-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <div className="relative h-[280px] overflow-hidden rounded-xl border border-border/70 bg-muted/30 sm:h-[320px]">
              {isProcessing || !cropImage ? (
                <div className="flex h-full items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="size-4 animate-spin" />
                  배경을 제거하는 중...
                </div>
              ) : (
                <Cropper
                  image={cropImage}
                  crop={crop}
                  zoom={zoom}
                  aspect={1}
                  cropShape="rect"
                  showGrid
                  minZoom={0.5}
                  maxZoom={3}
                  onCropChange={setCrop}
                  onZoomChange={setZoom}
                  onCropComplete={onCropComplete}
                />
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>축소</span>
                <span className="font-medium text-foreground">{zoomPercent}%</span>
                <span>확대</span>
              </div>
              <input
                type="range"
                min={50}
                max={300}
                step={1}
                value={zoomPercent}
                disabled={isProcessing || !cropImage}
                onChange={(event) => setZoom(Number(event.target.value) / 100)}
                className="h-2 w-full cursor-pointer accent-primary"
                aria-label="직인 확대/축소"
              />
              <p className="text-xs text-muted-foreground">
                이미지를 드래그해 위치를 조정하고, 슬라이더로 크기를 맞춰주세요.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">문서 미리보기</p>
            <div
              className={cn(
                "rounded-xl border border-border/70 bg-white p-5 shadow-sm"
              )}
            >
              <p className="text-sm leading-relaxed text-foreground">
                <span className="text-muted-foreground">대표자 </span>
                <span className="font-medium">
                  {representativeName || "홍길동"}
                  <SealMark sealUrl={previewUrl} />
                </span>
              </p>
              {!previewUrl && (
                <p className="mt-3 text-xs text-muted-foreground">
                  크롭 영역을 조정하면 미리보기가 표시됩니다.
                </p>
              )}
            </div>
          </div>
        </div>

        {error ? (
          <p className="px-6 pb-2 text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : null}

        <DialogFooter className="border-t border-border/60 px-6 py-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSaving}
          >
            취소
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isProcessing || isSaving || !previewUrl}
          >
            {isSaving ? "저장 중..." : "저장"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
