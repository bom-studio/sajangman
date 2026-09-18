import { Check, Users } from "lucide-react"

export type HomeStatMetric = {
  key: "totalVisits" | "uniqueVisitors" | "calculatorUses" | "documentCreates"
  label: string
  unit: "회" | "명"
  /** Real computed/display value only — omit or null to hide (never hardcode). */
  value: number | null
}

type HomeStatsBarProps = {
  visitCount: number | null
  /** Optional future metrics — only rendered when value is a number. */
  metrics?: HomeStatMetric[]
}

const FEATURE_BADGES = [
  "무료 이용",
  "가입 없이 이용",
  "계속 업데이트",
] as const

function formatCount(value: number): string {
  return value.toLocaleString("ko-KR")
}

function Divider() {
  return (
    <div
      className="mx-3 hidden h-10 w-px shrink-0 bg-[#E5EAF2] lg:mx-4 lg:block"
      aria-hidden
    />
  )
}

/**
 * Floating stats card bridging Hero and the next white section.
 * Extensible via metrics; currently emphasizes total visit sessions.
 */
export function HomeStatsBar({ visitCount, metrics }: HomeStatsBarProps) {
  const resolved: HomeStatMetric[] =
    metrics ??
    (typeof visitCount === "number"
      ? [
          {
            key: "totalVisits",
            label: "누적 방문",
            unit: "회",
            value: visitCount,
          },
        ]
      : [])

  const visible = resolved.filter(
    (m): m is HomeStatMetric & { value: number } => typeof m.value === "number"
  )

  if (visible.length === 0) return null

  const primary = visible[0]

  return (
    <div className="relative z-10 -mt-[46px] px-4 sm:-mt-[52px] sm:px-6 lg:-mt-[56px] lg:px-8">
      <div className="mx-auto max-w-[1200px]">
        <div className="flex min-h-[92px] flex-col justify-center gap-3 rounded-[20px] border border-[#E5EAF2] bg-white px-5 py-4 shadow-[0_8px_28px_rgba(15,23,42,0.06)] sm:min-h-[96px] sm:px-7 sm:py-4 lg:min-h-[100px] lg:flex-row lg:items-center lg:gap-0 lg:px-8">
          {/* Left — live stat */}
          <div className="flex min-w-0 items-center gap-3.5 lg:w-[28%] lg:shrink-0 lg:gap-4">
            <div
              className="flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
              aria-hidden
            >
              <Users className="size-5" strokeWidth={2.25} />
            </div>
            <div className="min-w-0">
              <p className="text-[12px] font-medium tracking-wide text-[#64748B]">
                {primary.label}
              </p>
              <p className="mt-0.5 text-[26px] font-extrabold leading-none tracking-tight text-primary sm:text-[28px]">
                {formatCount(primary.value)}
                <span className="ml-0.5 text-[17px] font-bold sm:text-[18px]">
                  {primary.unit}
                </span>
              </p>
            </div>
          </div>

          <Divider />

          {/* Center — service copy (desktop+) */}
          <div className="hidden min-w-0 lg:block lg:w-[32%] lg:shrink-0">
            <p className="text-[15px] font-semibold leading-snug text-[#0F172A]">
              사장님을 위한 무료 업무 도구
            </p>
            <p className="mt-1 text-[12px] leading-snug text-[#94A3B8]">
              계산 · 문서작성 · 운영정보
            </p>
          </div>

          <Divider />

          {/* Right — feature badges */}
          <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5 lg:w-[40%] lg:justify-end lg:gap-x-2.5">
            {FEATURE_BADGES.map((label) => (
              <span
                key={label}
                className="inline-flex items-center gap-1 rounded-full bg-[#F5F8FF] px-2.5 py-1 text-[12px] font-medium text-[#334155]"
              >
                <Check
                  className="size-3.5 shrink-0 text-primary"
                  strokeWidth={2.5}
                  aria-hidden
                />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
