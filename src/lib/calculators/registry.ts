import { Bike, CalendarDays, Percent, TrendingUp, type LucideIcon } from "lucide-react"

export interface CalculatorRegistryItem {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export const CALCULATOR_REGISTRY: CalculatorRegistryItem[] = [
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

export function getRelatedCalculators(excludeHref: string) {
  return CALCULATOR_REGISTRY.filter((item) => item.href !== excludeHref)
}
