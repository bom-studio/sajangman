import {
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SupplierSelectorButton } from "@/components/documents/supplier-selector-button"
import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import { cn } from "@/lib/utils"

interface SupplierSectionHeaderProps {
  title?: string
  description: string
  className?: string
  onSelectProfile: (profile: BusinessProfile) => void
}

export function SupplierSectionHeader({
  title = "공급자 정보",
  description,
  className,
  onSelectProfile,
}: SupplierSectionHeaderProps) {
  return (
    <CardHeader
      className={cn(
        "flex flex-row items-start justify-between gap-4 space-y-0",
        className
      )}
    >
      <div className="min-w-0 flex-1 space-y-1.5">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </div>
      <SupplierSelectorButton onSelect={onSelectProfile} />
    </CardHeader>
  )
}
