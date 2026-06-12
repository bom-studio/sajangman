export type ResultStatus = "good" | "medium" | "warning"

export const RESULT_STATUS_LABEL: Record<ResultStatus, string> = {
  good: "좋음",
  medium: "보통",
  warning: "주의",
}

export const RESULT_STATUS_CARD_CLASS: Record<ResultStatus, string> = {
  good: "border-emerald-200 bg-emerald-50/40",
  medium: "border-amber-200 bg-amber-50/40",
  warning: "border-red-200 bg-red-50/40",
}

export const RESULT_STATUS_VALUE_CLASS: Record<ResultStatus, string> = {
  good: "text-emerald-700",
  medium: "text-amber-700",
  warning: "text-red-700",
}

export const RESULT_STATUS_BADGE_CLASS: Record<ResultStatus, string> = {
  good: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-800",
  warning: "bg-red-100 text-red-800",
}

/** 원가율 30% 이하 좋음, 30~40% 보통, 40% 이상 주의 */
export function getCostRateStatus(costRate: number): ResultStatus {
  if (costRate <= 30) return "good"
  if (costRate < 40) return "medium"
  return "warning"
}

/** 손익분기점 판매수량 100개 이하 좋음, 300개 이상 주의 */
export function getBreakEvenQuantityStatus(quantity: number): ResultStatus {
  if (quantity <= 100) return "good"
  if (quantity < 300) return "medium"
  return "warning"
}
