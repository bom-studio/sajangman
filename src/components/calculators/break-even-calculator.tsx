"use client"

import { useMemo, useRef, useState } from "react"
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceDot,
  ReferenceLine,
  XAxis,
  YAxis,
} from "recharts"

import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import {
  calculatorCardClass,
  calculatorCardContentClass,
  calculatorCardHeaderClass,
  calculatorHighlightClass,
  calculatorResultRowClass,
} from "@/components/calculators/calculator-styles"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Input } from "@/components/ui/input"
import {
  buildBreakEvenChartData,
  calculateBreakEven,
  DEFAULT_BREAK_EVEN_INPUT,
  formatAmount,
  formatPercent,
  formatQuantity,
  formatWon,
  parseAmountInput,
  parsePositiveNumber,
  type BreakEvenResult,
} from "@/lib/calculators/break-even"
import {
  BREAK_EVEN_FAQ_ITEMS,
  BREAK_EVEN_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/break-even-faq"
import { getBreakEvenQuantityStatus } from "@/lib/calculators/result-status"
import { cn } from "@/lib/utils"

const chartConfig = {
  revenue: {
    label: "매출",
    color: "#2563eb",
  },
  totalCost: {
    label: "총비용",
    color: "#f97316",
  },
} satisfies ChartConfig

interface MoneyFieldProps {
  label: string
  description: string
  value: number
  onChange: (value: number) => void
  placeholder: string
}

function MoneyField({
  label,
  description,
  value,
  onChange,
  placeholder,
}: MoneyFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {description}
      </p>
      <Input
        inputMode="numeric"
        value={value > 0 ? formatAmount(value) : ""}
        onChange={(e) => onChange(parseAmountInput(e.target.value))}
        placeholder={placeholder}
      />
    </div>
  )
}

function BreakEvenChart({
  result,
}: {
  result: ReturnType<typeof calculateBreakEven>
}) {
  const chartData = useMemo(
    () => buildBreakEvenChartData(result),
    [result]
  )

  if (!result.canBreakEven || result.breakEvenQuantity === null) {
    return (
      <Card className={calculatorCardClass}>
        <CardHeader className={calculatorCardHeaderClass}>
          <CardTitle>매출 vs 총비용 비교</CardTitle>
        </CardHeader>
        <CardContent className={calculatorCardContentClass}>
          <p className="text-sm text-muted-foreground">
            판매가가 변동비보다 커야 차트를 표시할 수 있습니다.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={calculatorCardClass}>
      <CardHeader className={calculatorCardHeaderClass}>
        <CardTitle>매출 vs 총비용 (손익분기점)</CardTitle>
      </CardHeader>
      <CardContent className={cn("min-w-0", calculatorCardContentClass)}>
        <p className="mb-4 text-xs text-muted-foreground">
          X축: 판매수량 · Y축: 금액 · 교차점이 손익분기점입니다.
        </p>
        <div className="w-full min-w-0 overflow-x-auto">
          <ChartContainer
            config={chartConfig}
            className="h-[280px] w-full min-w-[320px] sm:aspect-[4/3] sm:h-auto sm:min-w-0"
          >
          <LineChart
            data={chartData}
            margin={{ top: 32, right: 12, left: 4, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="quantity"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value}개`}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              width={72}
              tickFormatter={(value) => formatAmount(value)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => `판매수량 ${value}개`}
                  formatter={(value, name) => {
                    const label =
                      name === "revenue"
                        ? "매출"
                        : name === "totalCost"
                          ? "총비용"
                          : String(name)
                    return (
                      <span className="font-medium">
                        {label}: {formatWon(Number(value))}
                      </span>
                    )
                  }}
                />
              }
            />
            <ChartLegend content={<ChartLegendContent />} />
            <ReferenceLine
              x={result.breakEvenQuantity}
              stroke="#2563eb"
              strokeWidth={2}
              strokeDasharray="6 4"
              label={{
                value: `손익분기점 ${formatQuantity(result.breakEvenQuantity)}`,
                position: "insideTop",
                fill: "#2563eb",
                fontSize: 12,
                fontWeight: 700,
              }}
            />
            {result.breakEvenRevenue !== null && (
              <ReferenceDot
                x={result.breakEvenQuantity}
                y={result.breakEvenRevenue}
                r={7}
                fill="#2563eb"
                stroke="#ffffff"
                strokeWidth={2}
              />
            )}
            <Line
              type="monotone"
              dataKey="revenue"
              name="revenue"
              stroke="var(--color-revenue)"
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="totalCost"
              name="totalCost"
              stroke="var(--color-totalCost)"
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}

function BreakEvenDetailCard({
  result,
}: {
  result: ReturnType<typeof calculateBreakEven>
}) {
  const rows = [
    { label: "고정비", value: formatWon(result.fixedCost) },
    { label: "판매가", value: formatWon(result.sellingPrice) },
    { label: "변동비", value: formatWon(result.variableCost) },
    {
      label: "기여이익",
      value: formatWon(result.contributionPerUnit),
      highlight: true,
    },
    {
      label: "손익분기점 판매수량",
      value: result.canBreakEven
        ? formatQuantity(result.breakEvenQuantity!)
        : "계산 불가",
    },
    {
      label: "손익분기점 매출",
      value: result.breakEvenRevenue
        ? formatWon(result.breakEvenRevenue)
        : "계산 불가",
    },
    { label: "예상 매출", value: formatWon(result.expectedRevenue) },
    {
      label: "예상 순이익",
      value: formatWon(result.expectedNetProfit),
      highlight: true,
    },
  ]

  return (
    <Card className={calculatorCardClass}>
      <CardContent className="px-0 py-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="detail" className="border-0">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline sm:text-lg">
              상세 계산 과정 보기
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

export function BreakEvenCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [fixedCost, setFixedCost] = useState(DEFAULT_BREAK_EVEN_INPUT.fixedCost)
  const [sellingPrice, setSellingPrice] = useState(
    DEFAULT_BREAK_EVEN_INPUT.sellingPrice
  )
  const [variableCost, setVariableCost] = useState(
    DEFAULT_BREAK_EVEN_INPUT.variableCost
  )
  const [expectedQuantity, setExpectedQuantity] = useState(
    DEFAULT_BREAK_EVEN_INPUT.expectedQuantity
  )

  const [result, setResult] = useState<BreakEvenResult | null>(null)

  function handleCalculate() {
    setResult(
      calculateBreakEven({
        fixedCost,
        sellingPrice,
        variableCost,
        expectedQuantity,
      })
    )
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setFixedCost(DEFAULT_BREAK_EVEN_INPUT.fixedCost)
    setSellingPrice(DEFAULT_BREAK_EVEN_INPUT.sellingPrice)
    setVariableCost(DEFAULT_BREAK_EVEN_INPUT.variableCost)
    setExpectedQuantity(DEFAULT_BREAK_EVEN_INPUT.expectedQuantity)
    setResult(null)
  }

  const breakEvenWarning =
    result && !result.canBreakEven && result.sellingPrice > 0
      ? "판매가가 변동비보다 커야 손익분기점을 계산할 수 있습니다."
      : null

  const bepStatus =
    result?.canBreakEven && result.breakEvenQuantity !== null
      ? getBreakEvenQuantityStatus(result.breakEvenQuantity)
      : undefined

  const resultItems = result
    ? [
        {
          label: "손익분기점 판매수량",
          description: "손익분기를 넘기기 위해 필요한 최소 판매 수량",
          value: result.canBreakEven
            ? formatQuantity(result.breakEvenQuantity!)
            : "계산 불가",
          highlight: result.canBreakEven,
          status: bepStatus,
        },
        {
          label: "손익분기점 매출",
          value: result.breakEvenRevenue
            ? formatWon(result.breakEvenRevenue)
            : "계산 불가",
          highlight: result.canBreakEven,
        },
        {
          label: "예상 순이익",
          value: formatWon(result.expectedNetProfit),
          highlight: true,
          valueClassName:
            result.expectedNetProfit >= 0
              ? calculatorHighlightClass
              : "text-amber-700",
        },
        {
          label: "기여이익률",
          value: formatPercent(result.contributionMarginRate),
          highlight: true,
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        { label: "월 고정비", value: formatWon(result.fixedCost) },
        { label: "판매가", value: formatWon(result.sellingPrice) },
        { label: "변동비", value: formatWon(result.variableCost) },
        {
          label: "손익분기점 판매수량",
          value: result.canBreakEven
            ? formatQuantity(result.breakEvenQuantity!)
            : "계산 불가",
        },
        {
          label: "손익분기점 매출",
          value: result.breakEvenRevenue
            ? formatWon(result.breakEvenRevenue)
            : "계산 불가",
        },
        { label: "예상 순이익", value: formatWon(result.expectedNetProfit) },
        {
          label: "기여이익률",
          value: formatPercent(result.contributionMarginRate),
        },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/break-even"
      resultRef={resultsRef}
      resultId="break-even-results"
      input={
        <CalculatorInputCard
          title="비용 정보 입력"
          description="고정비, 판매가격, 변동비, 예상 판매수량을 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <MoneyField
            label="월 고정비"
            description="임대료, 인건비, 관리비 등"
            value={fixedCost}
            onChange={setFixedCost}
            placeholder="2,000,000"
          />
          <MoneyField
            label="상품 판매가"
            description="1개 판매 가격"
            value={sellingPrice}
            onChange={setSellingPrice}
            placeholder="50,000"
          />
          <MoneyField
            label="상품 변동비"
            description="재료비, 포장비, 수수료 등"
            value={variableCost}
            onChange={setVariableCost}
            placeholder="20,000"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              예상 판매수량
            </label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              월 예상 판매 수량
            </p>
            <Input
              type="number"
              min={0}
              step={1}
              value={expectedQuantity || ""}
              onChange={(e) =>
                setExpectedQuantity(parsePositiveNumber(e.target.value))
              }
              placeholder="100"
            />
          </div>
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            message={breakEvenWarning}
            items={resultItems}
            shareContext="손익분기점 계산 결과"
            showPdf
            pdfTitle="손익분기점 계산 결과"
            pdfSubtitle="사장만 손익분기점 계산기"
            pdfFilename="손익분기점_계산결과"
            pdfRows={pdfRows}
          />

          {result && <BreakEvenChart result={result} />}
          {result && <BreakEvenDetailCard result={result} />}
        </>
      }
      seo={
        <CalculatorFaq
          description={BREAK_EVEN_GUIDE_DESCRIPTION}
          items={BREAK_EVEN_FAQ_ITEMS}
        />
      }
    />
  )
}
