"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ArrowLeft,
  Cloud,
  FileText,
  FolderOpen,
  Pencil,
  Rocket,
  Search,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { cn } from "@/lib/utils"

const DOCUMENT_MANAGEMENT_BENEFITS: {
  icon: LucideIcon
  label: string
}[] = [
  { icon: FileText, label: "저장한 문서 다시 불러오기" },
  { icon: Pencil, label: "저장한 문서 수정 및 재발행" },
  { icon: Search, label: "제목, 고객명, 공급자명 검색" },
  { icon: Users, label: "고객 정보 관리" },
  { icon: Cloud, label: "클라우드 자동 저장" },
  {
    icon: Rocket,
    label: "향후 견적서 → 거래명세서 자동 변환 지원 예정",
  },
]

export function DocumentManagementLoginPrompt() {
  const router = useRouter()

  return (
    <div className="flex justify-center py-6 sm:py-10">
      <Card className="w-full max-w-[600px]">
        <CardHeader className="items-center text-center">
          <div className="mx-auto mb-2 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FolderOpen className="size-7" aria-hidden />
          </div>
          <CardTitle className="text-xl font-bold sm:text-2xl">
            문서관리는 로그인 후 이용할 수 있습니다
          </CardTitle>
          <CardDescription className="max-w-md text-sm leading-relaxed">
            저장한 문서를 조회·수정·복사·관리하려면
            <br className="hidden sm:block" />
            무료 회원가입이 필요합니다.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <ul className="space-y-2.5">
            {DOCUMENT_MANAGEMENT_BENEFITS.map((benefit) => (
              <li
                key={benefit.label}
                className={cn(
                  "flex items-start gap-3 rounded-lg border border-border/60 bg-muted/20 px-3.5 py-3"
                )}
              >
                <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <benefit.icon className="size-4" aria-hidden />
                </div>
                <span className="pt-1 text-sm font-medium text-foreground">
                  {benefit.label}
                </span>
              </li>
            ))}
          </ul>
        </CardContent>

        <CardFooter className="flex-col gap-2 sm:flex-col">
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
            onClick={() => router.back()}
          >
            <ArrowLeft className="size-4" />
            뒤로가기
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
