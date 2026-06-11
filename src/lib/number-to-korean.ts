const DIGITS = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"] as const
const SMALL_UNITS = ["", "십", "백", "천"] as const
const LARGE_UNITS = ["", "만", "억", "조"] as const

function convertUnder10000(value: number): string {
  if (value === 0) return ""

  let result = ""
  const padded = value.toString().padStart(4, "0")

  for (let index = 0; index < 4; index += 1) {
    const digit = Number(padded[index])
    if (digit === 0) continue

    const position = 3 - index

    result += DIGITS[digit] + SMALL_UNITS[position]
  }

  return result
}

/** 원 단위 정수 금액을 한글 금액 문자열로 변환한다. */
export function numberToKorean(amount: number): string {
  if (!Number.isFinite(amount) || amount < 0) return "영"

  const value = Math.floor(amount)
  if (value === 0) return "영"

  let result = ""
  let remaining = value
  let unitIndex = 0

  while (remaining > 0 && unitIndex < LARGE_UNITS.length) {
    const chunk = remaining % 10000

    if (chunk > 0) {
      result = convertUnder10000(chunk) + LARGE_UNITS[unitIndex] + result
    }

    remaining = Math.floor(remaining / 10000)
    unitIndex += 1
  }

  return result || "영"
}
