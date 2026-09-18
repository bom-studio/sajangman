export const SITE_NAME = "사장만"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sajangman.vercel.app"

/** 사이트 제작·운영 주체 */
export const OPERATOR_NAME = "BOM STUDIO"

/**
 * BOM STUDIO 공식 홈페이지 URL.
 * 확인된 URL이 없으면 null로 두고 Footer/소개 페이지에서는 링크 없이 표시합니다.
 */
export const BOM_STUDIO_URL: string | null = null

/**
 * 서비스 문의 이메일.
 * 운영자가 확인한 주소로 교체하세요. null이면 문의 페이지에 안내만 표시합니다.
 */
export const CONTACT_EMAIL: string | null = null
