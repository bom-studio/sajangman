import {
  Bike,
  CalendarCheck,
  CalendarDays,
  Percent,
  PiggyBank,
  Shield,
  TrendingUp,
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
    title: "메뉴 가격 계산기",
    description:
      "원가와 목표 마진율로 적정 판매가를 제안받으세요.",
    href: "/calculators/menu-price",
    icon: UtensilsCrossed,
    category: "sales",
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
