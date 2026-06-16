import type { LucideIcon } from "lucide-react"

export type AiCategoryId = "customer" | "operations" | "marketing"

export interface AiCategory {
  id: AiCategoryId
  label: string
}

export interface AiTool {
  id: string
  title: string
  description: string
  href: string
  category: AiCategoryId
  icon: LucideIcon
  isPopular: boolean
  popularEmoji?: string
  inputLabel: string
  inputPlaceholder: string
  resultLabel: string
  emptyResultMessage: string
}
