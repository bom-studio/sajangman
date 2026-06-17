"use client"

import { useRef, useState } from "react"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorModeToggle } from "@/components/calculators/calculator-mode-toggle"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import {
  calculatorCardClass,
  calculatorCardContentClass,
  calculatorCardHeaderClass,
  calculatorHighlightClass,
  calculatorResultRowClass,
  calculatorSelectClassName,
} from "@/components/calculators/calculator-styles"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  MINIMUM_WAGE_FAQ_ITEMS,
  MINIMUM_WAGE_GUIDE_DESCRIPTION,
  MINIMUM_WAGE_GUIDE_ITEMS,
} from "@/lib/calculators/faq/minimum-wage-faq"
import {
  calculateMinimumWage,
  DEFAULT_MINIMUM_WAGE_INPUT,
  formatAmount,
  formatWon,
  getMinimumWageTableRows,
  MINIMUM_WAGE_YEARS,
  parseAmountInput,
  parsePositiveNumber,
  type MinimumWageResult,
  type MinimumWageYear,
  type MonthlyConversionBasis,
} from "@/lib/calculators/minimum-wage"
import { getMinimumWageComplianceStatus } from "@/lib/calculators/result-status"
import { cn } from "@/lib/utils"

const MONTHLY_BASIS_OPTIONS: {
  id: MonthlyConversionBasis
  label: string
}[] = [
  { id: "weekly", label: "주급 기준" },
  { id: "monthly", label: "월급 기준" },
]

function MinimumWageDetailCard({ result }: { result: MinimumWageResult }) {
  const rows = [
    { label: "입력 시급", value: formatWon(result.hourlyWage) },
    { label: "기준 최저임금", value: formatWon(result.minimumWage), highlight: true },
    {
      label: "주 근무시간",
      value: `${formatAmount(result.weeklyHours)}시간`,
    },
    {
      label: "주휴수당",
      value: result.includeWeeklyHoliday
        ? formatWon(result.weeklyHolidayPay)
        : "미포함 (0원)",
    },
    { label: "예상 주급", value: formatWon(result.weeklyPay), highlight: true },
    { label: "예상 월급", value: formatWon(result.monthlyPay), highlight: true },
  ]

  return (
    <Card className={calculatorCardClass}>
      <CardContent className="px-0 py-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="detail" className="border-0">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline sm:text-lg">
              상세 계산 내역
            </AccordionTrigger>
            <AccordionContent className="px-6 pb-5">
              <dl className="space-y-3">
                {rows.map((row) => (
                  <div key={row.label} className={calculatorResultRowClass}>
                    <dt className="text-sm text-muted-foreground">
                      {row.label}
                    </dt>
                    <dd
                      className={cn(
                        "text-base font-bold text-foreground",
                        row.highlight && calculatorHighlightClass
                      )}
                    >
                      {row.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

function MinimumWageReferenceTable() {
  const rows = getMinimumWageTableRows()

  return (
    <Card className={calculatorCardClass}>
      <CardHeader className={calculatorCardHeaderClass}>
        <CardTitle>최저임금 기준표</CardTitle>
        <CardDescription>
          연도별 최저임금 시급 기준입니다. 실제 고시 변경 시 업데이트될 수
          있습니다.
        </CardDescription>
      </CardHeader>
      <CardContent
        className={cn("overflow-x-auto", calculatorCardContentClass)}
      >
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>적용 연도</TableHead>
              <TableHead>최저임금 (시급)</TableHead>
              <TableHead>비고</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.year}>
                <TableCell className="font-medium">{row.year}년</TableCell>
                <TableCell>{formatWon(row.hourly)}</TableCell>
                <TableCell className="text-muted-foreground">
                  {row.year === 2026 ? "현행 기준" : "과거 기준"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export function MinimumWageCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [year, setYear] = useState<MinimumWageYear>(
    DEFAULT_MINIMUM_WAGE_INPUT.year
  )
  const [hourlyWage, setHourlyWage] = useState(
    DEFAULT_MINIMUM_WAGE_INPUT.hourlyWage
  )
  const [daysPerWeek, setDaysPerWeek] = useState(
    DEFAULT_MINIMUM_WAGE_INPUT.daysPerWeek
  )
  const [hoursPerDay, setHoursPerDay] = useState(
    DEFAULT_MINIMUM_WAGE_INPUT.hoursPerDay
  )
  const [includeWeeklyHoliday, setIncludeWeeklyHoliday] = useState(
    DEFAULT_MINIMUM_WAGE_INPUT.includeWeeklyHoliday
  )
  const [monthlyConversionBasis, setMonthlyConversionBasis] =
    useState<MonthlyConversionBasis>(
      DEFAULT_MINIMUM_WAGE_INPUT.monthlyConversionBasis
    )
  const [result, setResult] = useState<MinimumWageResult | null>(null)

  function handleCalculate() {
    setResult(
      calculateMinimumWage({
        year,
        hourlyWage,
        daysPerWeek,
        hoursPerDay,
        includeWeeklyHoliday,
        monthlyConversionBasis,
      })
    )
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setYear(DEFAULT_MINIMUM_WAGE_INPUT.year)
    setHourlyWage(DEFAULT_MINIMUM_WAGE_INPUT.hourlyWage)
    setDaysPerWeek(DEFAULT_MINIMUM_WAGE_INPUT.daysPerWeek)
    setHoursPerDay(DEFAULT_MINIMUM_WAGE_INPUT.hoursPerDay)
    setIncludeWeeklyHoliday(DEFAULT_MINIMUM_WAGE_INPUT.includeWeeklyHoliday)
    setMonthlyConversionBasis(DEFAULT_MINIMUM_WAGE_INPUT.monthlyConversionBasis)
    setResult(null)
  }

  const complianceStatus = result
    ? getMinimumWageComplianceStatus(result.isCompliant)
    : undefined

  const resultItems = result
    ? [
        {
          label: "최저임금 충족 여부",
          value: result.isCompliant ? "충족" : "미충족",
          highlight: true,
          status: complianceStatus,
          valueClassName: result.isCompliant
            ? calculatorHighlightClass
            : "text-red-700",
        },
        {
          label: "주급",
          value: formatWon(result.weeklyPay),
          highlight: result.monthlyConversionBasis === "weekly",
          description:
            result.includeWeeklyHoliday && result.weeklyHolidayPay > 0
              ? `주휴수당 ${formatWon(result.weeklyHolidayPay)} 포함`
              : undefined,
        },
        {
          label: "월 예상 급여",
          value: formatWon(result.monthlyPay),
          highlight: result.monthlyConversionBasis === "monthly",
          description: "주급 × 4.345",
        },
        {
          label: "부족 시급",
          value: result.isCompliant
            ? "0원"
            : formatWon(result.shortfallHourly),
          valueClassName: result.isCompliant ? undefined : "text-red-700",
        },
        {
          label: "부족 월급여",
          value: result.isCompliant
            ? "0원"
            : formatWon(result.shortfallMonthly),
          valueClassName: result.isCompliant ? undefined : "text-red-700",
          className: "sm:col-span-2",
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        { label: "적용 연도", value: `${result.year}년` },
        { label: "입력 시급", value: formatWon(result.hourlyWage) },
        { label: "기준 최저임금", value: formatWon(result.minimumWage) },
        {
          label: "최저임금 충족 여부",
          value: result.isCompliant ? "충족" : "미충족",
        },
        { label: "주급", value: formatWon(result.weeklyPay) },
        { label: "월 예상 급여", value: formatWon(result.monthlyPay) },
        {
          label: "부족 시급",
          value: result.isCompliant ? "0원" : formatWon(result.shortfallHourly),
        },
        {
          label: "부족 월급여",
          value: result.isCompliant
            ? "0원"
            : formatWon(result.shortfallMonthly),
        },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/minimum-wage"
      resultRef={resultsRef}
      resultId="minimum-wage-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="시급과 근무 일정을 입력하면 최저임금 충족 여부를 확인합니다."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              적용 연도
            </label>
            <select
              value={year}
              onChange={(e) =>
                setYear(Number(e.target.value) as MinimumWageYear)
              }
              className={calculatorSelectClassName}
            >
              {MINIMUM_WAGE_YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}년
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">시급</label>
            <Input
              inputMode="numeric"
              value={hourlyWage > 0 ? formatAmount(hourlyWage) : ""}
              onChange={(e) => setHourlyWage(parseAmountInput(e.target.value))}
              placeholder="10,030"
            />
          </div>

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

          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <input
              type="checkbox"
              checked={includeWeeklyHoliday}
              onChange={(e) => setIncludeWeeklyHoliday(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-foreground">
                주휴수당 포함
              </span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                주 15시간 이상 근무 시 주휴수당을 주급·월급에 반영합니다.
              </span>
            </span>
          </label>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              월 환산 기준
            </label>
            <CalculatorModeToggle
              modes={MONTHLY_BASIS_OPTIONS}
              value={monthlyConversionBasis}
              onChange={setMonthlyConversionBasis}
            />
            <p className="text-xs leading-relaxed text-muted-foreground">
              월 예상 급여는 주급 × 4.345로 계산하며, 강조 표시 기준만
              선택합니다.
            </p>
          </div>
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description="시급과 근무시간 기준 최저임금 충족 여부입니다."
            items={resultItems}
            shareContext="최저임금 계산 결과"
            showPdf
            pdfTitle="최저임금 계산 결과"
            pdfSubtitle="사장만 최저임금 계산기"
            pdfFilename="최저임금_계산결과"
            pdfRows={pdfRows}
          />
          {result && <MinimumWageDetailCard result={result} />}
        </>
      }
      extensions={
        <div className="mt-10">
          <MinimumWageReferenceTable />
        </div>
      }
      seo={
        <>
          <CalculatorFaq
            description={MINIMUM_WAGE_GUIDE_DESCRIPTION}
            items={MINIMUM_WAGE_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={MINIMUM_WAGE_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
