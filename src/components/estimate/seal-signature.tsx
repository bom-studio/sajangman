"use client"

import { useState } from "react"

import { SealEditorDialog } from "@/components/estimate/seal-editor-dialog"
import { Button } from "@/components/ui/button"

/** html2canvas와 브라우저가 동일하게 계산하도록 고정 px 사용 */
const SEAL_PX = 68

interface SealMarkProps {
  sealUrl: string | null
}

/**
 * 대표자명 옆 (인) + 직인 이미지 겹침.
 * PDF 캡처 안정성을 위해 transform/translate 없이 inline-grid로 겹친다.
 */
export function SealMark({ sealUrl }: SealMarkProps) {
  if (!sealUrl) {
    return (
      <span className="ml-1 align-middle" style={{ verticalAlign: "middle" }}>
        (인)
      </span>
    )
  }

  return (
    <span
      data-seal-mark="true"
      className="ml-1 inline-grid shrink-0 place-items-center align-middle"
      style={{
        width: `${SEAL_PX}px`,
        height: `${SEAL_PX}px`,
        verticalAlign: "middle",
      }}
    >
      <span
        style={{
          gridArea: "1 / 1",
          fontSize: "0.875rem",
          lineHeight: 1,
        }}
      >
        (인)
      </span>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={sealUrl}
        alt="회사 직인"
        data-seal-image="true"
        style={{
          gridArea: "1 / 1",
          width: `${SEAL_PX}px`,
          height: `${SEAL_PX}px`,
          objectFit: "contain",
          opacity: 0.95,
          display: "block",
        }}
      />
    </span>
  )
}

interface SealSignatureProps {
  representativeName: string
  sealUrl: string | null
  labelColor?: string
  textColor?: string
}

/** 공급자 정보 박스 내 대표자 행 */
export function SealSignature({
  representativeName,
  sealUrl,
  labelColor = "#64748b",
  textColor = "#0f172a",
}: SealSignatureProps) {
  const displayName = representativeName || "-"

  return (
    <div className="text-sm leading-relaxed">
      <span className="inline-block w-20 align-top" style={{ color: labelColor }}>
        대표자
      </span>
      <span
        className="inline align-top font-medium"
        style={{ color: textColor }}
      >
        {displayName}
        <SealMark sealUrl={sealUrl} />
      </span>
    </div>
  )
}

interface SealControlsProps {
  sealUrl: string | null
  onSealChange: (url: string | null) => void
}

/** 입력 폼 공급자 정보 영역용 직인 등록/수정 컨트롤 */
export function SealControls({ sealUrl, onSealChange }: SealControlsProps) {
  const [dialogOpen, setDialogOpen] = useState(false)

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setDialogOpen(true)}
        >
          {sealUrl ? "직인 수정" : "직인 등록"}
        </Button>
        {sealUrl ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive"
            onClick={() => onSealChange(null)}
          >
            직인 삭제
          </Button>
        ) : null}
        {sealUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={sealUrl}
            alt="등록된 직인 미리보기"
            className="ml-1 size-10 rounded border object-contain p-0.5"
            style={{ borderColor: "#e2e8f0" }}
          />
        ) : null}
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
