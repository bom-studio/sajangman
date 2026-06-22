"use client"

import Link from "next/link"
import {
  Archive,
  Cloud,
  FileText,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

const SAVE_BENEFITS: {
  icon: LucideIcon
  title: string
  description: string
}[] = [
  {
    icon: FileText,
    title: "작성한 문서 다시 불러오기",
    description:
      "견적서, 거래명세서, 발주서 등을 언제든 수정할 수 있습니다.",
  },
  {
    icon: Users,
    title: "고객 정보 관리",
    description:
      "고객명과 거래 내용을 저장해 반복 작성 시간을 줄일 수 있습니다.",
  },
  {
    icon: Search,
    title: "문서 검색 및 조회",
    description:
      "제목, 고객명, 공급자명으로 빠르게 원하는 문서를 찾을 수 있습니다.",
  },
  {
    icon: Archive,
    title: "문서 이력 관리",
    description:
      "예전에 발행한 문서를 삭제하지 않고 보관할 수 있습니다.",
  },
  {
    icon: Cloud,
    title: "안전한 클라우드 저장",
    description:
      "PC를 바꾸거나 브라우저 데이터를 삭제해도 문서를 다시 확인할 수 있습니다.",
  },
]

interface SaveDocumentLoginDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaveDocumentLoginDialog({
  open,
  onOpenChange,
}: SaveDocumentLoginDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] gap-0 overflow-y-auto p-0 sm:max-w-lg">
        <DialogHeader className="space-y-2 px-6 pt-6 pb-4">
          <DialogTitle className="text-left text-xl font-bold leading-snug sm:text-2xl">
            문서를 저장하고 편하게 관리하세요
          </DialogTitle>
          <DialogDescription className="text-left text-sm leading-relaxed">
            무료 회원가입 후 작성한 문서를 클라우드에 저장할 수 있습니다.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 px-6 pb-4">
          {SAVE_BENEFITS.map((benefit) => (
            <div
              key={benefit.title}
              className={cn(
                "flex gap-3 rounded-xl border border-border/70 bg-muted/30 p-3.5"
              )}
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <benefit.icon className="size-4" aria-hidden />
              </div>
              <div className="min-w-0 space-y-0.5">
                <p className="text-sm font-semibold text-foreground">
                  {benefit.title}
                </p>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {benefit.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter className="flex-col gap-2 border-t border-border/60 px-6 py-4 sm:flex-col sm:items-stretch">
          <Button asChild className="w-full">
            <Link href="/signup">무료 회원가입</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/login">로그인</Link>
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            나중에 하기
          </Button>
          <p className="pt-1 text-center text-xs text-muted-foreground">
            PDF 다운로드는 회원가입 없이도 이용 가능합니다.
          </p>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
