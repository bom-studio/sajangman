"use client"

import { useRef, useState, type ReactNode } from "react"

import { CalculatorDonutChart } from "@/components/calculators/calculator-donut-chart"
import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import { Input } from "@/components/ui/input"
import {
  calculateCostRate,
  DEFAULT_COST_RATE_INPUT,
} from "@/lib/calculators/costRate"
import {
  COST_RATE_FAQ_ITEMS,
  COST_RATE_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/cost-rate-faq"
import {
  formatAmount,
  formatPercent,
  formatWon,
  parseAmountInput,
} from "@/lib/calculators/format"
import { getCostRateStatus } from "@/lib/calculators/result-status"

export function CostRateCalculator({
  seoArticles,
}: {
  seoArticles?: ReactNode
} = {}) {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [sellingPrice, setSellingPrice] = useState(
    DEFAULT_COST_RATE_INPUT.sellingPrice
  )
  const [cost, setCost] = useState(DEFAULT_COST_RATE_INPUT.cost)
  const [result, setResult] = useState<ReturnType<
    typeof calculateCostRate
  > | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    if (sellingPrice <= 0) {
      setResult(null)
      setMessage("0보다 큰 판매가를 입력해주세요.")
    } else {
      setResult(calculateCostRate({ sellingPrice, cost }))
      setMessage(null)
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setSellingPrice(DEFAULT_COST_RATE_INPUT.sellingPrice)
    setCost(DEFAULT_COST_RATE_INPUT.cost)
    setResult(null)
    setMessage(null)
  }

  const costRateStatus = result ? getCostRateStatus(result.costRate) : undefined

  const pdfRows = result
    ? [
        { label: "판매가", value: formatWon(result.sellingPrice) },
        { label: "원가", value: formatWon(result.cost) },
        { label: "원가율", value: formatPercent(result.costRate) },
        { label: "마진율", value: formatPercent(result.marginRate) },
        { label: "마진액", value: formatWon(result.marginAmount) },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/cost-rate"
      resultRef={resultsRef}
      resultId="cost-rate-results"
      input={
        <CalculatorInputCard
          title="가격 정보 입력"
          description="판매가와 원가를 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">판매가</label>
            <Input
              inputMode="numeric"
              value={sellingPrice > 0 ? formatAmount(sellingPrice) : ""}
              onChange={(e) => setSellingPrice(parseAmountInput(e.target.value))}
              placeholder="10,000"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">원가</label>
            <Input
              inputMode="numeric"
              value={cost > 0 ? formatAmount(cost) : ""}
              onChange={(e) => setCost(parseAmountInput(e.target.value))}
              placeholder="3,500"
            />
          </div>
        </CalculatorInputCard>
      }
      result={
        <CalculatorResultCard
          description="원가율과 마진을 확인하세요."
          message={message}
          shareContext={
            result
              ? `판매가 ${formatWon(result.sellingPrice)} 기준`
              : undefined
          }
          showPdf={Boolean(result)}
          pdfTitle="원가율 계산 결과"
          pdfSubtitle="사장만 원가율 계산기"
          pdfFilename="원가율_계산결과"
          pdfRows={pdfRows}
          items={
            result
              ? [
                  {
                    label: "판매가",
                    value: formatWon(result.sellingPrice),
                  },
                  {
                    label: "원가",
                    value: formatWon(result.cost),
                  },
                  {
                    label: "원가율",
                    value: formatPercent(result.costRate),
                    highlight: true,
                    status: costRateStatus,
                  },
                  {
                    label: "마진율",
                    value: formatPercent(result.marginRate),
                    highlight: true,
                  },
                ]
              : undefined
          }
          visualization={
            result ? (
              <CalculatorDonutChart
                title="원가율 vs 마진율"
                centerValue={formatPercent(result.costRate)}
                centerLabel="원가율"
                segments={[
                  {
                    key: "cost",
                    label: "원가",
                    value: result.cost,
                    color: "#f97316",
                  },
                  {
                    key: "margin",
                    label: "마진",
                    value: result.marginAmount,
                    color: "#2563eb",
                  },
                ]}
              />
            ) : undefined
          }
        />
      }
      seo={
        <>
          {seoArticles}
          <CalculatorFaq
            description={COST_RATE_GUIDE_DESCRIPTION}
            items={COST_RATE_FAQ_ITEMS}
          />
        </>
      }
    />
  )
}
