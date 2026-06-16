import type { Metadata } from "next"

import { SITE_NAME, SITE_URL } from "@/lib/site-config"

export const HOME_METADATA: Metadata = {
  title: "사장만 | 자영업자를 위한 무료 계산기·문서작성·자료실",
  description:
    "부가세 계산기, 주휴수당 계산기, 배달 마진 계산기, 견적서 생성기, 거래명세서 생성기를 무료로 이용하세요. 사장님을 위한 업무 도구 모음입니다.",
  keywords: [
    "사장만",
    "자영업자 계산기",
    "부가세 계산기",
    "주휴수당 계산기",
    "배달 마진 계산기",
    "견적서 생성기",
    "거래명세서 생성기",
    "소상공인 업무 도구",
    "자영업자 자료실",
  ],
  openGraph: {
    title: `사장만 | 자영업자를 위한 무료 계산기·문서작성·자료실`,
    description:
      "부가세 계산기, 주휴수당 계산기, 배달 마진 계산기, 견적서 생성기, 거래명세서 생성기를 무료로 이용하세요.",
    url: SITE_URL,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `사장만 | 자영업자를 위한 무료 업무 도구`,
    description:
      "계산기, 문서작성, 자료실을 한곳에서 무료로 이용하세요.",
  },
}
