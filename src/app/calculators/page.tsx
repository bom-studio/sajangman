import type { Metadata } from "next"
import { Bike, CalendarDays, Percent, TrendingUp } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { ToolLinkCard } from "@/components/tool-link-card"

export const metadata: Metadata = {
  title: "계산기 | 사장만",
  description:
    "배달 마진, 주휴수당, 부가세, 손익분기점 등 사장님을 위한 무료 계산기.",
}

const calculators = [
  {
    title: "배달 마진 계산기",
    description:
      "판매가와 비용을 입력하면 배달 플랫폼별 예상 정산금액과 마진을 계산합니다.",
    href: "/calculators/delivery-margin",
    icon: Bike,
  },
  {
    title: "주휴수당 계산기",
    description:
      "시급과 근무시간을 입력하면 주휴수당과 예상 주급을 계산합니다.",
    href: "/calculators/weekly-pay",
    icon: CalendarDays,
  },
  {
    title: "부가세 계산기",
    description:
      "공급가액 또는 부가세 포함 금액을 입력하면 부가세를 자동 계산합니다.",
    href: "/calculators/vat",
    icon: Percent,
  },
  {
    title: "손익분기점 계산기",
    description:
      "고정비, 판매가, 변동비를 입력하여 손익분기점과 예상 수익을 계산합니다.",
    href: "/calculators/break-even",
    icon: TrendingUp,
  },
]

export default function CalculatorsPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="계산기"
        description="배달 마진, 주휴수당, 부가세, 손익분기점 등 사장님 업무에 필요한 계산을 빠르게 해결하세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {calculators.map((item) => (
            <ToolLinkCard key={item.href} {...item} />
          ))}
        </div>
      </div>
    </SiteLayout>
  )
}
