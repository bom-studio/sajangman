import type { Metadata } from "next"

import type { AiTool } from "@/lib/ai/types"
import { SITE_NAME } from "@/lib/site-config"

export const AI_DISABLED_METADATA: Metadata = {
  title: `AI 생성기 | ${SITE_NAME}`,
  description: "AI 생성기 기능을 준비 중입니다.",
  robots: {
    index: false,
    follow: false,
  },
}

export function buildAiToolMetadata(tool: AiTool): Metadata {
  return {
    title: `${tool.title} | ${SITE_NAME}`,
    description: tool.description,
    openGraph: {
      title: `${tool.title} | ${SITE_NAME}`,
      description: tool.description,
      url: tool.href,
      type: "website",
    },
  }
}

export const AI_HUB_METADATA: Metadata = {
  title: "AI 생성기 | 사장만",
  description:
    "사장님을 위한 무료 AI 업무 도구 모음. 리뷰 답글 생성기, 공지사항 생성기, 이벤트 문구 생성기, 메뉴 소개 문구 생성기를 무료로 이용하세요.",
  keywords: [
    "AI 생성기",
    "리뷰 답글 생성기",
    "공지사항 생성기",
    "이벤트 문구 생성기",
    "사장님 AI",
    "소상공인 AI",
    "매장 운영 AI",
  ],
  openGraph: {
    title: `AI 생성기 | ${SITE_NAME}`,
    description:
      "사장님을 위한 무료 AI 업무 도구 모음. 리뷰 답글, 공지사항, 이벤트 문구를 몇 초 만에 생성하세요.",
    url: "/ai",
    type: "website",
  },
}
