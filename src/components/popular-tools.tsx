import {
  Bike,
  Briefcase,
  CalendarDays,
  FileText,
  MessageSquare,
  Receipt,
} from "lucide-react"

import { ToolCard, type ToolTag } from "@/components/tool-card"

const tools: {
  title: string
  description: string
  href: string
  tag: ToolTag
  icon: typeof FileText
}[] = [
  {
    title: "견적서 생성기",
    description:
      "거래처와 품목을 입력하면 견적서를 PDF로 만들 수 있습니다.",
    href: "/documents/estimate",
    tag: "인기",
    icon: FileText,
  },
  {
    title: "거래명세서 생성기",
    description:
      "공급자와 품목 정보를 입력해 거래명세서를 작성합니다.",
    href: "/documents/statement",
    tag: "문서",
    icon: Receipt,
  },
  {
    title: "배달 마진 계산기",
    description:
      "판매가와 비용을 입력하면 배달 주문의 순이익과 마진율을 계산합니다.",
    href: "/calculators/delivery-margin",
    tag: "인기",
    icon: Bike,
  },
  {
    title: "퇴직금 계산기",
    description:
      "근무 기간과 임금을 입력하면 예상 퇴직금을 계산합니다.",
    href: "/calculators/severance-pay",
    tag: "계산",
    icon: Briefcase,
  },
  {
    title: "주휴수당 계산기",
    description:
      "시급과 근무시간을 입력하면 주휴수당과 예상 주급을 계산합니다.",
    href: "/calculators/weekly-pay",
    tag: "계산",
    icon: CalendarDays,
  },
  {
    title: "리뷰 답글 생성기",
    description: "고객 리뷰에 맞는 친절한 답글을 생성합니다.",
    href: "/ai/review-reply",
    tag: "AI",
    icon: MessageSquare,
  },
]

export function PopularTools() {
  return (
    <section className="bg-slate-50/60 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            오늘 가장 많이 사용하는 도구
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            사장님들이 지금 바로 사용하는 인기 도구를 바로 실행해 보세요.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
          {tools.map((tool) => (
            <ToolCard key={tool.href} {...tool} />
          ))}
        </div>
      </div>
    </section>
  )
}
