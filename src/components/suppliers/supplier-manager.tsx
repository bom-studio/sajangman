"use client"

import { useEffect, useState } from "react"
import { Plus, Store } from "lucide-react"

import { EstimateToast } from "@/components/estimate/estimate-toast"
import { SupplierCard } from "@/components/suppliers/supplier-card"
import { SupplierFormDialog } from "@/components/suppliers/supplier-form-dialog"
import { Button } from "@/components/ui/button"
import {
  type BusinessProfile,
  fetchBusinessProfiles,
} from "@/lib/business-profiles"

export function SupplierManager() {
  const [profiles, setProfiles] = useState<BusinessProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editingProfile, setEditingProfile] = useState<BusinessProfile | null>(
    null
  )
  const [toast, setToast] = useState<{
    message: string
    variant: "error" | "success"
  } | null>(null)

  async function loadProfiles() {
    setLoading(true)
    const { data, error } = await fetchBusinessProfiles()
    setProfiles(data)
    setLoading(false)

    if (error) {
      setToast({ message: error, variant: "error" })
    }
  }

  useEffect(() => {
    loadProfiles()
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(timer)
  }, [toast])

  function handleAddClick() {
    setEditingProfile(null)
    setFormOpen(true)
  }

  function handleEditClick(profile: BusinessProfile) {
    setEditingProfile(profile)
    setFormOpen(true)
  }

  function handleFormSuccess(message: string) {
    setFormOpen(false)
    setEditingProfile(null)
    setToast({ message, variant: "success" })
    loadProfiles()
  }

  function handleActionError(message: string) {
    setToast({ message, variant: "error" })
  }

  function handleActionSuccess(message: string) {
    setToast({ message, variant: "success" })
    loadProfiles()
  }

  const isFirstProfile = profiles.length === 0

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-end">
          <Button type="button" onClick={handleAddClick} className="shrink-0">
            <Plus className="size-4" />
            공급자 추가
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((key) => (
              <div
                key={key}
                className="h-36 animate-pulse rounded-2xl border border-border/60 bg-muted/40"
              />
            ))}
          </div>
        ) : profiles.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border/80 bg-muted/20 px-6 py-16 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Store className="size-7" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">
              등록된 공급자가 없습니다
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              상호명, 사업자번호, 연락처 등 공급자 정보를 등록하면 문서 작성 시
              매번 입력할 필요가 없습니다.
            </p>
            <Button type="button" onClick={handleAddClick} className="mt-6">
              <Plus className="size-4" />
              첫 공급자 등록하기
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {profiles.map((profile) => (
              <li key={profile.id}>
                <SupplierCard
                  profile={profile}
                  onEdit={() => handleEditClick(profile)}
                  onDeleted={() =>
                    handleActionSuccess("공급자가 삭제되었습니다.")
                  }
                  onDefaultSet={() =>
                    handleActionSuccess("기본 공급자로 설정되었습니다.")
                  }
                  onError={handleActionError}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      <SupplierFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        profile={editingProfile}
        isFirstProfile={isFirstProfile}
        onSuccess={handleFormSuccess}
      />

      {toast && <EstimateToast message={toast.message} variant={toast.variant} />}
    </>
  )
}
