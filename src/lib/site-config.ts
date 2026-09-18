import { SITE_KEY } from "@/lib/site-key"

export const SITE_NAME = "사장만"

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://sajangman.vercel.app"

/** 사이트 제작·운영 주체 */
export const OPERATOR_NAME = "BOM STUDIO"

/** BOM STUDIO 공식 홈페이지 URL */
export const BOM_STUDIO_URL = "https://bomstudio.kr"

/** BOM STUDIO 무료 시안 신청 페이지 */
export const BOM_STUDIO_FREE_PREVIEW_URL = "https://bomstudio.kr/free-preview"

/** 서비스 문의 이메일 */
export const CONTACT_EMAIL: string | null = "bomstudio22@gmail.com"

/**
 * Per-site display baselines for shared bomstudio-clients-db.
 * visitBaseCount is display-only — never seed fake rows into site_visitors.
 *
 * Calibrated so current display = 1000:
 *   visitBaseCount = 1000 - current SUM(visit_count) for SITE_KEY
 *   (sajangman SUM = 0 at calibration → base 1000)
 */
export const SITE_CONFIG = {
  sajangman: {
    visitBaseCount: 1000,
  },
} as const

export type ConfiguredSiteKey = keyof typeof SITE_CONFIG

export function getVisitBaseCount(siteKey: string = SITE_KEY): number {
  if (siteKey in SITE_CONFIG) {
    return SITE_CONFIG[siteKey as ConfiguredSiteKey].visitBaseCount
  }
  return 0
}

/** Display visits = site baseline + live SUM(visit_count) from DB. */
export function getDisplayVisitCount(
  totalVisitCount: number,
  siteKey: string = SITE_KEY
): number {
  return getVisitBaseCount(siteKey) + totalVisitCount
}
