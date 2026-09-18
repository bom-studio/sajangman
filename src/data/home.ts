import {
  BookOpen,
  Calculator,
  FileText,
  Sparkles,
  type LucideIcon,
} from "lucide-react"

import { getAiToolById } from "@/data/ai/tools"
import {
  getCalculatorByHref,
  type CalculatorListItem,
} from "@/data/calculators"
import { getResourceArticleBySlug } from "@/data/resources"
import type { ResourceArticleMeta } from "@/lib/resources/types"
import { AI_FEATURES_ENABLED } from "@/lib/features"
import { toArticleMeta } from "@/lib/resources/utils"

export interface HomeQuickStartItem {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

export interface HomeServiceCategory {
  title: string
  description: string
  href: string
  buttonLabel: string
  icon: LucideIcon
}

const HOME_QUICK_START_CONFIG = [
  {
    kind: "calculator" as const,
    href: "/calculators/vat",
    description: "공급가액과 부가세 포함 금액을 바로 계산",
  },
  {
    kind: "calculator" as const,
    href: "/calculators/delivery-margin",
    description: "배민·쿠팡이츠·요기요 주문별 순이익 확인",
  },
  {
    kind: "document" as const,
    href: "/documents/estimate",
    title: "견적서 생성기",
    description: "거래처에 보낼 견적서를 PDF로 작성",
  },
  {
    kind: "ai" as const,
    id: "review-reply",
    description: "고객 리뷰에 맞는 답글 문구 생성",
  },
] as const

export const HOME_FEATURED_CALCULATOR_HREFS = [
  "/calculators/weekly-pay",
  "/calculators/vat",
  "/calculators/delivery-margin",
  "/calculators/break-even",
  "/calculators/net-salary",
  "/calculators/social-insurance",
] as const

export const HOME_FEATURED_RESOURCE_SLUGS = [
  "weekly-pay-guide",
  "vat-filing-guide",
  "simplified-vs-general-vat",
  "delivery-app-fees-comparison",
  "restaurant-cost-rate-management",
  "break-even-calculation-guide",
] as const

export function getHomeQuickStartItems(): HomeQuickStartItem[] {
  return HOME_QUICK_START_CONFIG.filter(
    (item) => AI_FEATURES_ENABLED || item.kind !== "ai"
  ).map((item) => {
    if (item.kind === "calculator") {
      const calculator = getCalculatorByHref(item.href)
      if (!calculator) {
        throw new Error(`Quick start calculator not found: ${item.href}`)
      }

      return {
        title: calculator.title,
        description: item.description,
        href: calculator.href,
        icon: calculator.icon,
      }
    }

    if (item.kind === "document") {
      return {
        title: item.title,
        description: item.description,
        href: item.href,
        icon: FileText,
      }
    }

    const tool = getAiToolById(item.id)
    if (!tool) {
      throw new Error(`Quick start AI tool not found: ${item.id}`)
    }

    return {
      title: tool.title,
      description: item.description,
      href: tool.href,
      icon: tool.icon,
    }
  })
}

export function getHomeFeaturedCalculators(): CalculatorListItem[] {
  return HOME_FEATURED_CALCULATOR_HREFS.map((href) => getCalculatorByHref(href)).filter(
    (item): item is CalculatorListItem => Boolean(item)
  )
}

export function getHomeFeaturedResources(): ResourceArticleMeta[] {
  return HOME_FEATURED_RESOURCE_SLUGS.map((slug) => getResourceArticleBySlug(slug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map(toArticleMeta)
}

export function getHomeServiceCategories(): HomeServiceCategory[] {
  return [
    {
      title: "계산기",
      description:
        "부가세, 주휴수당, 퇴직금, 4대보험, 원가율 등 사업 운영 계산",
      href: "/calculators",
      buttonLabel: "계산기 보기",
      icon: Calculator,
    },
    {
      title: "문서작성",
      description:
        "견적서, 거래명세서, 발주서, 영수증 등 업무 문서를 PDF로 작성",
      href: "/documents",
      buttonLabel: "문서작성 보기",
      icon: FileText,
    },
    {
      title: "AI 생성기",
      description:
        "리뷰 답글, 공지사항, 이벤트 문구, 메뉴 소개 문구 작성",
      href: "/ai",
      buttonLabel: "AI 생성기 보기",
      icon: Sparkles,
    },
    {
      title: "자료실",
      description: "세금, 노무, 배달, 창업, 매출관리 가이드 제공",
      href: "/resources",
      buttonLabel: "자료실 보기",
      icon: BookOpen,
    },
  ].filter((category) => AI_FEATURES_ENABLED || category.href !== "/ai")
}
