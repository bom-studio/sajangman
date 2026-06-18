"use client"

import { useState } from "react"
import { MapPin, Pencil, Phone, Star, Trash2 } from "lucide-react"

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
  deleteBusinessProfile,
  setDefaultBusinessProfile,
  type BusinessProfile,
} from "@/lib/business-profiles"
import { cn } from "@/lib/utils"

interface SupplierCardProps {
  profile: BusinessProfile
  onEdit: () => void
  onDeleted: () => void
  onDefaultSet: () => void
  onError: (message: string) => void
}

export function SupplierCard({
  profile,
  onEdit,
  onDeleted,
  onDefaultSet,
  onError,
}: SupplierCardProps) {
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [settingDefault, setSettingDefault] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const { error } = await deleteBusinessProfile(profile.id)
    setDeleting(false)

    if (error) {
      onError(error)
      return
    }

    setDeleteOpen(false)
    onDeleted()
  }

  async function handleSetDefault() {
    if (profile.isDefault) return

    setSettingDefault(true)
    const { error } = await setDefaultBusinessProfile(profile.id)
    setSettingDefault(false)

    if (error) {
      onError(error)
      return
    }

    onDefaultSet()
  }

  return (
    <>
      <article
        className={cn(
          "rounded-2xl border bg-card p-5 shadow-sm transition-colors sm:p-6",
          profile.isDefault
            ? "border-primary/40 ring-1 ring-primary/20"
            : "border-border/70"
        )}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {profile.companyName}
              </h3>
              {profile.isDefault && (
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  <Star className="size-3 fill-current" />
                  기본 공급자
                </span>
              )}
            </div>

            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              {profile.representativeName && (
                <>
                  <dt className="text-muted-foreground">대표자</dt>
                  <dd className="font-medium text-foreground">
                    {profile.representativeName}
                  </dd>
                </>
              )}
              {profile.businessNumber && (
                <>
                  <dt className="text-muted-foreground">사업자번호</dt>
                  <dd className="font-medium text-foreground">
                    {profile.businessNumber}
                  </dd>
                </>
              )}
              {profile.phone && (
                <>
                  <dt className="flex items-center gap-1 text-muted-foreground">
                    <Phone className="size-3.5" />
                    전화번호
                  </dt>
                  <dd className="font-medium text-foreground">{profile.phone}</dd>
                </>
              )}
              {profile.email && (
                <>
                  <dt className="text-muted-foreground">이메일</dt>
                  <dd className="font-medium text-foreground">{profile.email}</dd>
                </>
              )}
              {profile.address && (
                <>
                  <dt className="flex items-center gap-1 text-muted-foreground sm:col-span-1">
                    <MapPin className="size-3.5" />
                    주소
                  </dt>
                  <dd className="font-medium text-foreground sm:col-span-1">
                    {profile.address}
                  </dd>
                </>
              )}
            </dl>
          </div>

          <div className="flex flex-wrap gap-2 sm:shrink-0 sm:flex-col">
            {!profile.isDefault && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleSetDefault}
                disabled={settingDefault}
                className="w-full sm:w-auto"
              >
                {settingDefault ? "설정 중..." : "기본으로 설정"}
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onEdit}
              className="w-full sm:w-auto"
            >
              <Pencil className="size-3.5" />
              수정
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setDeleteOpen(true)}
              className="w-full text-destructive hover:text-destructive sm:w-auto"
            >
              <Trash2 className="size-3.5" />
              삭제
            </Button>
          </div>
        </div>
      </article>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>공급자 삭제</DialogTitle>
            <DialogDescription>
              &apos;{profile.companyName}&apos; 공급자 정보를 삭제할까요? 이
              작업은 되돌릴 수 없습니다.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteOpen(false)}
              disabled={deleting}
            >
              취소
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "삭제 중..." : "삭제"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
