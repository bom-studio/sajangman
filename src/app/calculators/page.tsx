import type { Metadata } from "next"
import { Bike, Briefcase, CalendarDays } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { ToolLinkCard } from "@/components/tool-link-card"

export const metadata: Metadata = {
  title: "계산기 | 사장만",
  description: "배달 마진, 퇴직금, 주휴수당 등 사장님을 위한 무료 계산기.",
}

const calculators = [
  {
    title: "배달 마진 계산기",
    description:
      "판매가와 비용을 입력하면 배달 주문의 순이익과 마진율을 계산합니다.",
    href: "/calculators/delivery-margin",
    icon: Bike,
  },
  {
    title: "퇴직금 계산기",
    description: "근무 기간과 임금을 입력하면 예상 퇴직금을 계산합니다.",
    href: "/calculators/severance-pay",
    icon: Briefcase,
  },
  {
    title: "주휴수당 계산기",
    description: "시급과 근무시간을 입력하면 주휴수당과 예상 주급을 계산합니다.",
    href: "/calculators/weekly-pay",
    icon: CalendarDays,
  },
]

export default function CalculatorsPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="계산기"
        description="배달 마진, 퇴직금, 주휴수당 등 사장님 업무에 필요한 계산을 빠르게 해결하세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {calculators.map((item) => (
            <ToolLinkCard key={item.href} {...item} />
          ))}
        </div>
      </div>
    </SiteLayout>
  )
}
