import {
  Bike,
  Briefcase,
  CalendarCheck,
  CalendarDays,
  Clock,
  CreditCard,
  FileText,
  Package,
  Percent,
  PiggyBank,
  Scale,
  Shield,
  Split,
  Target,
  Ticket,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Wallet,
  type LucideIcon,
} from "lucide-react"

import type { ResourceCategoryId } from "@/lib/resources/types"

export type CalculatorBadge = "popular" | "recommended" | "new"

export interface CalculatorListItem {
  title: string
  description: string
  href: string
  icon: LucideIcon
  category: ResourceCategoryId
  badge?: CalculatorBadge
  estimatedTime: string
  isPopular: boolean
}

export const CALCULATOR_BADGE_LABEL: Record<CalculatorBadge, string> = {
  popular: "🔥 인기",
  recommended: "⭐ 추천",
  new: "🆕 신규",
}

export const CALCULATORS: CalculatorListItem[] = [
  {
    title: "배달 마진 계산기",
    description:
      "배민·쿠팡이츠·요기요 주문 1건당 실제 남는 순이익과 마진율을 확인하세요.",
    href: "/calculators/delivery-margin",
    icon: Bike,
    category: "delivery",
    badge: "popular",
    estimatedTime: "2분",
    isPopular: true,
  },
  {
    title: "배달 쿠폰 손익 계산기",
    description:
      "할인쿠폰 적용 시 사장 부담금과 실제 순이익, 필요한 추가 주문 수를 계산하세요.",
    href: "/calculators/delivery-coupon-profit",
    icon: Ticket,
    category: "delivery",
    badge: "new",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "주휴수당 계산기",
    description:
      "시급·근무시간만 입력하면 주휴수당과 주급 예상액을 바로 확인하세요.",
    href: "/calculators/weekly-pay",
    icon: CalendarDays,
    category: "labor",
    estimatedTime: "30초",
    isPopular: true,
  },
  {
    title: "최저임금 계산기",
    description:
      "시급·근무시간으로 최저임금 충족 여부와 월 예상 급여를 확인하세요.",
    href: "/calculators/minimum-wage",
    icon: Scale,
    category: "labor",
    badge: "new",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "부가세 계산기",
    description:
      "공급가액 또는 합계 금액으로 납부·환급 부가세를 즉시 계산하세요.",
    href: "/calculators/vat",
    icon: Percent,
    category: "tax",
    estimatedTime: "30초",
    isPopular: true,
  },
  {
    title: "카드 수수료 계산기",
    description:
      "카드 매출과 수수료율로 실제 정산금액·건당 수수료를 계산하세요.",
    href: "/calculators/card-fee",
    icon: CreditCard,
    category: "tax",
    badge: "new",
    estimatedTime: "30초",
    isPopular: false,
  },
  {
    title: "간이·일반과세 비교 계산기",
    description:
      "연간 매출·매입으로 간이과세와 일반과세 예상 부가세를 비교하세요.",
    href: "/calculators/vat-type-compare",
    icon: Split,
    category: "tax",
    badge: "new",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "종합소득세 계산기",
    description:
      "연간 매출·비용·공제를 입력해 예상 종합소득세를 간편히 계산하세요.",
    href: "/calculators/income-tax",
    icon: FileText,
    category: "tax",
    badge: "new",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "손익분기점 계산기",
    description:
      "월 고정비 기준 손익분기 매출과 하루 필요 판매량을 파악하세요.",
    href: "/calculators/break-even",
    icon: TrendingUp,
    category: "startup",
    badge: "recommended",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "목표 매출 계산기",
    description:
      "원하는 월 순이익을 달성하려면 필요한 매출·일 매출·객수를 계산하세요.",
    href: "/calculators/sales-goal",
    icon: Target,
    category: "startup",
    badge: "new",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "투자금 회수기간 계산기",
    description:
      "창업비용과 월 순이익으로 투자금을 회수하는 데 걸리는 기간을 계산하세요.",
    href: "/calculators/payback-period",
    icon: Clock,
    category: "startup",
    badge: "new",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "퇴직금 계산기",
    description:
      "근속기간·평균임금으로 퇴사 시 받을 예상 퇴직금을 확인하세요.",
    href: "/calculators/severance-pay",
    icon: Wallet,
    category: "labor",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "실업급여 계산기",
    description:
      "퇴사 전 평균임금·근속기간으로 예상 실업급여와 지급일수를 확인하세요.",
    href: "/calculators/unemployment-benefit",
    icon: Briefcase,
    category: "labor",
    badge: "new",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "급여 실수령액 계산기",
    description:
      "월급에서 4대보험·세금을 뺀 손에 쥐는 실수령액을 계산하세요.",
    href: "/calculators/net-salary",
    icon: PiggyBank,
    category: "labor",
    estimatedTime: "30초",
    isPopular: false,
  },
  {
    title: "4대보험 계산기",
    description:
      "월급 기준 사업주·근로자 4대보험 부담금을 한눈에 비교하세요.",
    href: "/calculators/social-insurance",
    icon: Shield,
    category: "labor",
    estimatedTime: "30초",
    isPopular: false,
  },
  {
    title: "연차수당 계산기",
    description:
      "미사용 연차 일수로 지급해야 할 연차수당 예상액을 계산하세요.",
    href: "/calculators/annual-leave-pay",
    icon: CalendarCheck,
    category: "labor",
    badge: "new",
    estimatedTime: "30초",
    isPopular: false,
  },
  {
    title: "원가율 계산기",
    description:
      "메뉴 판매가 대비 원가율·마진율을 확인해 수익성을 점검하세요.",
    href: "/calculators/cost-rate",
    icon: Percent,
    category: "sales",
    estimatedTime: "30초",
    isPopular: false,
  },
  {
    title: "재고 회전율 계산기",
    description:
      "매출원가와 재고액으로 재고 회전율·보유일수·관리 상태를 확인하세요.",
    href: "/calculators/inventory-turnover",
    icon: Package,
    category: "sales",
    badge: "new",
    estimatedTime: "1분",
    isPopular: false,
  },
  {
    title: "메뉴 가격 계산기",
    description:
      "원가와 목표 마진율로 적정 판매가를 제안받으세요.",
    href: "/calculators/menu-price",
    icon: UtensilsCrossed,
    category: "sales",
    estimatedTime: "30초",
    isPopular: false,
  },
  {
    title: "객단가 계산기",
    description:
      "매출과 고객 수로 평균 객단가와 목표 달성에 필요한 고객 수를 확인하세요.",
    href: "/calculators/customer-unit-price",
    icon: Users,
    category: "sales",
    badge: "new",
    estimatedTime: "30초",
    isPopular: false,
  },
]

export function getCalculatorByHref(
  href: string
): CalculatorListItem | undefined {
  return CALCULATORS.find((item) => item.href === href)
}

export function getPopularCalculators(): CalculatorListItem[] {
  return CALCULATORS.filter((item) => item.isPopular)
}

export function getCalculatorsByCategory(
  category: ResourceCategoryId
): CalculatorListItem[] {
  return CALCULATORS.filter((item) => item.category === category)
}
