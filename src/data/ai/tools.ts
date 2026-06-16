import {
  CalendarOff,
  Megaphone,
  MessageSquare,
  PartyPopper,
  ShieldAlert,
  UtensilsCrossed,
} from "lucide-react"

import type { AiCategoryId, AiTool } from "@/lib/ai/types"

export const AI_TOOLS: AiTool[] = [
  {
    id: "review-reply",
    title: "리뷰 답글 생성기",
    description: "고객 리뷰에 맞는 친절한 답글을 생성합니다.",
    href: "/ai/review-reply",
    category: "customer",
    icon: MessageSquare,
    isPopular: true,
    popularEmoji: "🔥",
    inputLabel: "고객 리뷰 내용",
    inputPlaceholder:
      "예: 음식은 맛있었는데 배달이 조금 늦었어요. 포장은 깔끔했습니다.",
    resultLabel: "생성된 답글",
    emptyResultMessage: "리뷰 내용을 입력하고 생성 버튼을 눌러주세요.",
  },
  {
    id: "notice-generator",
    title: "공지사항 생성기",
    description: "휴무, 가격 인상, 운영시간 변경 공지를 작성합니다.",
    href: "/ai/notice-generator",
    category: "operations",
    icon: Megaphone,
    isPopular: true,
    popularEmoji: "📢",
    inputLabel: "공지 내용 요약",
    inputPlaceholder:
      "예: 7월 1일부터 대표 메뉴 500원 인상, 평일 운영시간 11:00~22:00 변경",
    resultLabel: "생성된 공지사항",
    emptyResultMessage: "공지할 내용을 입력하고 생성 버튼을 눌러주세요.",
  },
  {
    id: "event-copy",
    title: "이벤트 문구 생성기",
    description: "할인 행사 및 이벤트 홍보 문구를 생성합니다.",
    href: "/ai/event-copy",
    category: "marketing",
    icon: PartyPopper,
    isPopular: true,
    popularEmoji: "🎉",
    inputLabel: "이벤트 정보",
    inputPlaceholder:
      "예: 오픈 1주년 기념 전 메뉴 20% 할인, 6월 15일~30일, 인스타 공유 시 음료 증정",
    resultLabel: "생성된 이벤트 문구",
    emptyResultMessage: "이벤트 정보를 입력하고 생성 버튼을 눌러주세요.",
  },
  {
    id: "menu-description",
    title: "메뉴 소개 문구 생성기",
    description: "메뉴 특징을 매력적으로 소개하는 문구를 작성합니다.",
    href: "/ai/menu-description",
    category: "marketing",
    icon: UtensilsCrossed,
    isPopular: false,
    inputLabel: "메뉴 정보",
    inputPlaceholder:
      "예: 한우 불고기 정식, 국내산 한우, 직화 구이, 밑반찬 5종 포함, 14,900원",
    resultLabel: "생성된 메뉴 소개",
    emptyResultMessage: "메뉴 정보를 입력하고 생성 버튼을 눌러주세요.",
  },
  {
    id: "apology",
    title: "사과문 생성기",
    description:
      "컴플레인 대응 및 서비스 문제 발생 시 사과문을 생성합니다.",
    href: "/ai/apology",
    category: "customer",
    icon: ShieldAlert,
    isPopular: false,
    inputLabel: "상황 설명",
    inputPlaceholder:
      "예: 배달 지연으로 음식이 식어 도착했고, 고객이 환불을 요청했습니다.",
    resultLabel: "생성된 사과문",
    emptyResultMessage: "상황을 입력하고 생성 버튼을 눌러주세요.",
  },
  {
    id: "holiday-notice",
    title: "휴무 안내문 생성기",
    description: "정기휴무, 임시휴무, 명절휴무 안내문을 생성합니다.",
    href: "/ai/holiday-notice",
    category: "operations",
    icon: CalendarOff,
    isPopular: false,
    inputLabel: "휴무 정보",
    inputPlaceholder:
      "예: 추석 연휴 9월 16일~18일 휴무, 19일 정상 영업, 배달은 19일부터 재개",
    resultLabel: "생성된 휴무 안내문",
    emptyResultMessage: "휴무 정보를 입력하고 생성 버튼을 눌러주세요.",
  },
]

export function getAiToolById(id: string): AiTool | undefined {
  return AI_TOOLS.find((tool) => tool.id === id)
}

export function getAiToolByHref(href: string): AiTool | undefined {
  return AI_TOOLS.find((tool) => tool.href === href)
}

export function getPopularAiTools(): AiTool[] {
  return AI_TOOLS.filter((tool) => tool.isPopular)
}

export function getAiToolsByCategory(category: AiCategoryId): AiTool[] {
  return AI_TOOLS.filter((tool) => tool.category === category)
}
