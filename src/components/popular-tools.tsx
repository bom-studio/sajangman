import {
  Bike,
  CalendarDays,
  MessageSquare,
  Percent,
  TrendingUp,
} from "lucide-react"

import { ToolCard, type ToolTag } from "@/components/tool-card"

type PopularTool = {
  title: string
  description: string
  href: string
  tag: ToolTag
  icon: typeof CalendarDays
}

const popularCalculators: PopularTool[] = [
  {
    title: "주휴수당 계산기",
    description:
      "시급과 근무시간을 입력하면 주휴수당과 예상 주급을 계산합니다.",
    href: "/calculators/weekly-pay",
    tag: "계산" as const,
    icon: CalendarDays,
  },
  {
    title: "부가세 계산기",
    description:
      "공급가액 또는 부가세 포함 금액을 입력하면 부가세를 자동 계산합니다.",
    href: "/calculators/vat",
    tag: "계산" as const,
    icon: Percent,
  },
  {
    title: "배달 마진 계산기",
    description:
      "판매가와 비용을 입력하면 배달 플랫폼별 예상 정산금액과 마진을 계산합니다.",
    href: "/calculators/delivery-margin",
    tag: "인기" as const,
    icon: Bike,
  },
  {
    title: "손익분기점 계산기",
    description:
      "고정비, 판매가, 변동비를 입력하여 손익분기점과 예상 수익을 계산합니다.",
    href: "/calculators/break-even",
    tag: "계산" as const,
    icon: TrendingUp,
  },
]

const popularAiTools: PopularTool[] = [
  {
    title: "리뷰 답글 생성기",
    description: "고객 리뷰에 맞는 친절한 답글을 AI로 빠르게 생성합니다.",
    href: "/ai/review-reply",
    tag: "AI" as const,
    icon: MessageSquare,
  },
]

function ToolSection({
  title,
  description,
  tools,
}: {
  title: string
  description: string
  tools: PopularTool[]
}) {
  return (
    <div>
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {tools.map((tool) => (
          <ToolCard key={tool.href} {...tool} />
        ))}
      </div>
    </div>
  )
}

export function PopularTools() {
  return (
    <section className="bg-slate-50/60 py-20 sm:py-24">
      <div className="mx-auto max-w-6xl space-y-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            사장님을 위한 실무 도구
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            계산기와 AI 도구로 매일 반복되는 업무를 더 빠르게 처리하세요.
          </p>
        </div>

        <ToolSection
          title="인기 계산기"
          description="급여, 세금, 마진, 손익분기점까지 자영업에 필요한 계산을 한곳에서."
          tools={popularCalculators}
        />

        <ToolSection
          title="인기 AI 도구"
          description="고객 응대와 콘텐츠 작성을 AI로 더 쉽게."
          tools={popularAiTools}
        />
      </div>
    </section>
  )
}
