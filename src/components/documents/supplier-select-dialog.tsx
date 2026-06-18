"use client"

import { Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useBusinessProfiles } from "@/hooks/use-business-profiles"
import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import { cn } from "@/lib/utils"

interface SupplierSelectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelect: (profile: BusinessProfile) => void
}

export function SupplierSelectDialog({
  open,
  onOpenChange,
  onSelect,
}: SupplierSelectDialogProps) {
  const { profiles, loading, error, reload } = useBusinessProfiles(open)

  function handleSelect(profile: BusinessProfile) {
    onSelect(profile)
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        onOpenChange(nextOpen)
        if (nextOpen) reload()
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>공급자 선택</DialogTitle>
          <DialogDescription>
            저장된 공급자 정보를 선택하면 현재 문서에 반영됩니다.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="space-y-3 py-4">
            {[1, 2].map((key) => (
              <div
                key={key}
                className="h-28 animate-pulse rounded-xl border border-border/60 bg-muted/40"
              />
            ))}
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-destructive" role="alert">
            {error}
          </p>
        ) : profiles.length === 0 ? (
          <p className="py-6 text-center text-sm leading-relaxed text-muted-foreground">
            공급자 관리에서 먼저 공급자를 등록해주세요.
          </p>
        ) : (
          <ul className="space-y-3">
            {profiles.map((profile) => (
              <li key={profile.id}>
                <article
                  className={cn(
                    "rounded-xl border p-4",
                    profile.isDefault
                      ? "border-primary/40 bg-primary/5"
                      : "border-border/70 bg-card"
                  )}
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold text-foreground">
                          {profile.companyName}
                        </h3>
                        {profile.isDefault ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                            <Star className="size-3 fill-current" />
                            기본 공급자
                          </span>
                        ) : null}
                      </div>

                      <dl className="grid gap-1 text-sm sm:grid-cols-2">
                        {profile.representativeName ? (
                          <>
                            <dt className="text-muted-foreground">대표자</dt>
                            <dd className="text-foreground">
                              {profile.representativeName}
                            </dd>
                          </>
                        ) : null}
                        {profile.businessNumber ? (
                          <>
                            <dt className="text-muted-foreground">사업자번호</dt>
                            <dd className="text-foreground">
                              {profile.businessNumber}
                            </dd>
                          </>
                        ) : null}
                        {profile.phone ? (
                          <>
                            <dt className="text-muted-foreground">전화번호</dt>
                            <dd className="text-foreground">{profile.phone}</dd>
                          </>
                        ) : null}
                        {profile.email ? (
                          <>
                            <dt className="text-muted-foreground">이메일</dt>
                            <dd className="text-foreground">{profile.email}</dd>
                          </>
                        ) : null}
                        {profile.address ? (
                          <>
                            <dt className="text-muted-foreground sm:col-span-1">
                              주소
                            </dt>
                            <dd className="text-foreground sm:col-span-1">
                              {profile.address}
                            </dd>
                          </>
                        ) : null}
                      </dl>
                    </div>

                    <Button
                      type="button"
                      size="sm"
                      className="shrink-0"
                      onClick={() => handleSelect(profile)}
                    >
                      선택
                    </Button>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        )}
      </DialogContent>
    </Dialog>
  )
}
