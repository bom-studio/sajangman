import type { Metadata } from "next"

import { SITE_NAME, SITE_URL } from "@/lib/site-config"

export const HOME_METADATA: Metadata = {
  title: `${SITE_NAME} | 자영업자·소상공인을 위한 무료 실무 도구`,
  description:
    "원가율·객단가·배달 마진·부가세 등 자영업자 계산기와 견적서·계약서 작성, 운영 가이드까지. 회원가입 없이 바로 쓰는 사장만 업무 도구입니다.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: `${SITE_NAME} | 자영업자·소상공인을 위한 무료 실무 도구`,
    description:
      "계산기, 문서작성, 자료실로 사업 운영에 필요한 숫자와 정보를 빠르게 확인하세요.",
    url: SITE_URL,
    type: "website",
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | 무료 실무 도구`,
    description:
      "계산기, 문서작성, 자료실을 한곳에서 무료로 이용하세요.",
  },
}
