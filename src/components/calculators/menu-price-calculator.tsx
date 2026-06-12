"use client"

import { useMemo, useRef, useState } from "react"

import { CalculatorDonutChart } from "@/components/calculators/calculator-donut-chart"
import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import { CalculatorInputCard } from "@/components/calculators/calculator-input-card"
import { CalculatorPageLayout } from "@/components/calculators/calculator-page-layout"
import { CalculatorResultCard } from "@/components/calculators/calculator-result-card"
import { Input } from "@/components/ui/input"
import {
  MENU_PRICE_FAQ_ITEMS,
  MENU_PRICE_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/menu-price-faq"
import {
  formatAmount,
  formatPercent,
  formatWon,
  parseAmountInput,
  parsePositiveNumber,
} from "@/lib/calculators/format"
import {
  calculateMenuPrice,
  DEFAULT_MENU_PRICE_INPUT,
} from "@/lib/calculators/menuPrice"
import { getCostRateStatus } from "@/lib/calculators/result-status"

export function MenuPriceCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [cost, setCost] = useState(DEFAULT_MENU_PRICE_INPUT.cost)
  const [targetMarginRate, setTargetMarginRate] = useState(
    DEFAULT_MENU_PRICE_INPUT.targetMarginRate
  )
  const [submitted, setSubmitted] = useState(false)

  const result = useMemo(() => {
    if (!submitted) return null
    return calculateMenuPrice({ cost, targetMarginRate })
  }, [submitted, cost, targetMarginRate])

  const message = useMemo(() => {
    if (!submitted) return null
    if (cost <= 0) return "0보다 큰 원가를 입력해주세요."
    if (targetMarginRate <= 0 || targetMarginRate >= 100)
      return "목표 마진율은 0% 초과 100% 미만이어야 합니다."
    return null
  }, [submitted, cost, targetMarginRate])

  function handleCalculate() {
    setSubmitted(true)
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setCost(DEFAULT_MENU_PRICE_INPUT.cost)
    setTargetMarginRate(DEFAULT_MENU_PRICE_INPUT.targetMarginRate)
    setSubmitted(false)
  }

  const costRateStatus = result
    ? getCostRateStatus(result.expectedCostRate)
    : undefined

  const pdfRows = result
    ? [
        { label: "원가", value: formatWon(result.cost) },
        { label: "목표 마진율", value: formatPercent(result.targetMarginRate) },
        { label: "권장 판매가", value: formatWon(result.recommendedPrice) },
        { label: "예상 마진액", value: formatWon(result.expectedMarginAmount) },
        { label: "예상 원가율", value: formatPercent(result.expectedCostRate) },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/menu-price"
      resultRef={resultsRef}
      resultId="menu-price-results"
      input={
        <CalculatorInputCard
          title="메뉴 정보 입력"
          description="원가와 목표 마진율을 입력하세요."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">원가</label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              재료비·원재료비 등
            </p>
            <Input
              inputMode="numeric"
              value={cost > 0 ? formatAmount(cost) : ""}
              onChange={(e) => setCost(parseAmountInput(e.target.value))}
              placeholder="3,500"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              목표 마진율 (%)
            </label>
            <Input
              inputMode="decimal"
              value={targetMarginRate > 0 ? String(targetMarginRate) : ""}
              onChange={(e) =>
                setTargetMarginRate(parsePositiveNumber(e.target.value))
              }
              placeholder="65"
            />
          </div>
        </CalculatorInputCard>
      }
      result={
        <CalculatorResultCard
          description="목표 마진율 기준 권장 판매가입니다."
          message={message}
          shareContext={
            result ? `원가 ${formatWon(result.cost)} · 목표 마진율 ${formatPercent(result.targetMarginRate)}` : undefined
          }
          showPdf={Boolean(result)}
          pdfTitle="메뉴 가격 계산 결과"
          pdfSubtitle="사장만 메뉴 가격 계산기"
          pdfFilename="메뉴가격_계산결과"
          pdfRows={pdfRows}
          items={
            result
              ? [
                  {
                    label: "원가",
                    value: formatWon(result.cost),
                  },
                  {
                    label: "목표 마진율",
                    value: formatPercent(result.targetMarginRate),
                  },
                  {
                    label: "권장 판매가",
                    value: formatWon(result.recommendedPrice),
                    highlight: true,
                  },
                  {
                    label: "예상 원가율",
                    value: formatPercent(result.expectedCostRate),
                    status: costRateStatus,
                  },
                ]
              : undefined
          }
          visualization={
            result ? (
              <CalculatorDonutChart
                title="권장 판매가 구성"
                centerValue={formatWon(result.recommendedPrice)}
                centerLabel="권장 판매가"
                segments={[
                  {
                    key: "cost",
                    label: "원가",
                    value: result.cost,
                    color: "#f97316",
                  },
                  {
                    key: "margin",
                    label: "예상 마진",
                    value: result.expectedMarginAmount,
                    color: "#2563eb",
                  },
                ]}
              />
            ) : undefined
          }
        />
      }
      seo={
        <CalculatorFaq
          description={MENU_PRICE_GUIDE_DESCRIPTION}
          items={MENU_PRICE_FAQ_ITEMS}
        />
      }
    />
  )
}
