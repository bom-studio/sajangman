"use client"

import { useRef, useState } from "react"
import { AlertCircle } from "lucide-react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorModeToggle } from "@/components/calculators/calculator-mode-toggle"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import {
  WEEKLY_PAY_FAQ_ITEMS,
  WEEKLY_PAY_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/weekly-pay-faq"
import { Input } from "@/components/ui/input"
import {
  calculateDailyWeeklyPay,
  calculateSimpleWeeklyPay,
  createDefaultDailyHours,
  DAILY_HOUR_KEYS,
  DAILY_HOUR_LABELS,
  DEFAULT_CALCULATION_MODE,
  DEFAULT_SIMPLE_INPUT,
  formatAmount,
  formatHours,
  parseAmountInput,
  parsePositiveNumber,
  WEEKLY_HOLIDAY_MIN_HOURS,
  type DailyHours,
  type WeeklyPayCalculationMode,
  type WeeklyPayResult,
} from "@/lib/weekly-pay"

const CALCULATION_MODES: { id: WeeklyPayCalculationMode; label: string }[] = [
  { id: "simple", label: "간단 계산" },
  { id: "byDay", label: "요일별 계산" },
]

export function WeeklyPayCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [mode, setMode] = useState<WeeklyPayCalculationMode>(
    DEFAULT_CALCULATION_MODE
  )
  const [hourlyWage, setHourlyWage] = useState(DEFAULT_SIMPLE_INPUT.hourlyWage)
  const [daysPerWeek, setDaysPerWeek] = useState(DEFAULT_SIMPLE_INPUT.daysPerWeek)
  const [hoursPerDay, setHoursPerDay] = useState(DEFAULT_SIMPLE_INPUT.hoursPerDay)
  const [dailyHours, setDailyHours] = useState<DailyHours>(
    createDefaultDailyHours()
  )
  const [result, setResult] = useState<WeeklyPayResult | null>(null)

  function handleCalculate() {
    if (mode === "simple") {
      setResult(
        calculateSimpleWeeklyPay({
          hourlyWage,
          daysPerWeek,
          hoursPerDay,
        })
      )
    } else {
      setResult(
        calculateDailyWeeklyPay({
          hourlyWage,
          dailyHours,
        })
      )
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setMode(DEFAULT_CALCULATION_MODE)
    setHourlyWage(DEFAULT_SIMPLE_INPUT.hourlyWage)
    setDaysPerWeek(DEFAULT_SIMPLE_INPUT.daysPerWeek)
    setHoursPerDay(DEFAULT_SIMPLE_INPUT.hoursPerDay)
    setDailyHours(createDefaultDailyHours())
    setResult(null)
  }

  function updateDailyHour(key: keyof DailyHours, value: number) {
    setDailyHours((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/weekly-pay"
      resultRef={resultsRef}
      resultId="weekly-pay-results"
      input={
        <CalculatorInputCard
          title="근무 조건"
          description="시급과 근무 일정을 입력하면 주휴수당과 예상 주급을 계산합니다."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              계산 방식
            </label>
            <CalculatorModeToggle
              modes={CALCULATION_MODES}
              value={mode}
              onChange={setMode}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              시급 (원)
            </label>
            <Input
              inputMode="numeric"
              value={hourlyWage > 0 ? formatAmount(hourlyWage) : ""}
              onChange={(e) => setHourlyWage(parseAmountInput(e.target.value))}
              placeholder="10,030"
            />
          </div>

          {mode === "simple" ? (
            <>
              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  주 근무일수
                </label>
                <Input
                  type="number"
                  min={0}
                  step={1}
                  value={daysPerWeek || ""}
                  onChange={(e) =>
                    setDaysPerWeek(parsePositiveNumber(e.target.value))
                  }
                  placeholder="5"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium text-foreground">
                  일 근무시간
                </label>
                <Input
                  type="number"
                  min={0}
                  step={0.5}
                  value={hoursPerDay || ""}
                  onChange={(e) =>
                    setHoursPerDay(parsePositiveNumber(e.target.value))
                  }
                  placeholder="8"
                />
              </div>
            </>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">
                요일별 근무시간
              </p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {DAILY_HOUR_KEYS.map((key) => (
                  <div key={key} className="space-y-1.5">
                    <label className="text-sm text-muted-foreground">
                      {DAILY_HOUR_LABELS[key]}
                    </label>
                    <Input
                      type="number"
                      min={0}
                      step={0.5}
                      value={dailyHours[key] || ""}
                      onChange={(e) =>
                        updateDailyHour(
                          key,
                          parsePositiveNumber(e.target.value)
                        )
                      }
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </CalculatorInputCard>
      }
      result={
        <CalculatorResultCard
          description="시급과 근무시간 기준 주휴수당·예상 주급입니다."
          items={
            result
              ? [
                  {
                    label: "주 근무시간",
                    value: formatHours(result.weeklyTotalHours),
                  },
                  {
                    label: "시급",
                    value: `${formatAmount(hourlyWage)}원`,
                  },
                  {
                    label: "주휴수당",
                    value: `${formatAmount(result.weeklyHolidayPay)}원`,
                    highlight: result.isHolidayPayEligible,
                  },
                  {
                    label: "예상 주급",
                    value: `${formatAmount(result.estimatedWeeklyPay)}원`,
                    highlight: true,
                  },
                ]
              : undefined
          }
          footer={
            result ? (
              <div className="space-y-3 pt-2">
                {!result.isHolidayPayEligible && (
                  <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <p>
                      주 총 근무시간이 {WEEKLY_HOLIDAY_MIN_HOURS}시간 미만이면
                      주휴수당 지급 대상이 아닙니다.
                    </p>
                  </div>
                )}
                <div className="flex gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-relaxed text-muted-foreground">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p>
                    실제 지급 여부는 근로계약 및 근로기준법 적용 여부에 따라
                    달라질 수 있습니다.
                  </p>
                </div>
              </div>
            ) : undefined
          }
        />
      }
      seo={
        <CalculatorFaq
          description={WEEKLY_PAY_GUIDE_DESCRIPTION}
          items={WEEKLY_PAY_FAQ_ITEMS}
        />
      }
    />
  )
}
