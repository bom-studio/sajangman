"use client"

import { useEffect, useState } from "react"

import { FormField } from "@/components/estimate/form-field"
import { FormTextarea } from "@/components/estimate/form-textarea"
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
  businessProfileToInput,
  createBusinessProfile,
  createEmptyBusinessProfileInput,
  updateBusinessProfile,
  type BusinessProfile,
  type BusinessProfileInput,
} from "@/lib/business-profiles"
import { formatBusinessNumber, formatPhoneNumber } from "@/lib/format-kr"

interface SupplierFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  profile: BusinessProfile | null
  isFirstProfile: boolean
  onSuccess: (message: string) => void
}

export function SupplierFormDialog({
  open,
  onOpenChange,
  profile,
  isFirstProfile,
  onSuccess,
}: SupplierFormDialogProps) {
  const [form, setForm] = useState<BusinessProfileInput>(
    createEmptyBusinessProfileInput()
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditing = profile !== null

  useEffect(() => {
    if (!open) return

    if (profile) {
      setForm(businessProfileToInput(profile))
    } else {
      setForm(createEmptyBusinessProfileInput(isFirstProfile))
    }
    setError(null)
  }, [open, profile, isFirstProfile])

  function updateField<K extends keyof BusinessProfileInput>(
    field: K,
    value: BusinessProfileInput[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)

    const result = isEditing
      ? await updateBusinessProfile(profile.id, form)
      : await createBusinessProfile(form)

    setSaving(false)

    if (result.error) {
      setError(result.error)
      return
    }

    onSuccess(isEditing ? "공급자 정보가 수정되었습니다." : "공급자가 등록되었습니다.")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{isEditing ? "공급자 수정" : "공급자 추가"}</DialogTitle>
          <DialogDescription>
            문서 작성 시 자동으로 입력될 공급자(사업자) 정보를 등록합니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="상호명 *"
            value={form.companyName}
            onChange={(value) => updateField("companyName", value)}
            placeholder="(주)사장만"
          />
          <FormField
            label="대표자명"
            value={form.representativeName}
            onChange={(value) => updateField("representativeName", value)}
            placeholder="홍길동"
          />
          <FormField
            label="사업자번호"
            value={form.businessNumber}
            onChange={(value) =>
              updateField("businessNumber", formatBusinessNumber(value))
            }
            placeholder="123-45-67890"
          />
          <FormField
            label="전화번호"
            value={form.phone}
            onChange={(value) => updateField("phone", formatPhoneNumber(value))}
            placeholder="010-1234-5678"
          />
          <FormField
            label="이메일"
            value={form.email}
            onChange={(value) => updateField("email", value)}
            placeholder="contact@example.com"
            type="email"
          />
          <FormTextarea
            label="주소"
            value={form.address}
            onChange={(value) => updateField("address", value)}
            placeholder="서울특별시 ..."
            rows={2}
          />
          <FormField
            label="직인 이미지 URL"
            value={form.sealUrl}
            onChange={(value) => updateField("sealUrl", value)}
            placeholder="https://... (추후 업로드 기능 예정)"
          />

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-border/60 bg-muted/20 p-4">
            <input
              type="checkbox"
              checked={form.isDefault || isFirstProfile}
              disabled={isFirstProfile}
              onChange={(event) => updateField("isDefault", event.target.checked)}
              className="mt-0.5 size-4 rounded border-border"
            />
            <span className="space-y-1">
              <span className="block text-sm font-medium text-foreground">
                기본 공급자로 설정
              </span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                {isFirstProfile
                  ? "첫 공급자는 자동으로 기본 공급자로 등록됩니다."
                  : "문서 작성 시 이 공급자 정보가 자동으로 입력됩니다."}
              </span>
            </span>
          </label>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={saving}
            >
              취소
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "저장 중..." : isEditing ? "수정하기" : "등록하기"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
