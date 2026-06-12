"use client"

import { useMemo, useState } from "react"

import { CalculatorCopyButton } from "@/components/calculators/calculator-copy-button"
import { CalculatorFaq } from "@/components/calculators/calculator-faq"
import {
  CALCULATOR_RESULT_EMPTY_MESSAGE,
  type CalculatorResultItem,
  ResultStatEmptyState,
  ResultStatGrid,
  ResultStatMessage,
} from "@/components/calculators/calculator-result-card"
import { calculatorCardClass } from "@/components/calculators/calculator-styles"
import { RelatedCalculators } from "@/components/calculators/related-calculators"
import { ResultStatCard } from "@/components/calculators/result-stat-card"
import {
  VAT_FAQ_ITEMS,
  VAT_GUIDE_DESCRIPTION,
} from "@/lib/calculators/faq/vat-faq"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  calculateVatFromSupply,
  calculateVatFromTotal,
  formatAmount,
  formatWon,
  parseAmountInput,
  type VatResult,
} from "@/lib/calculators/vat"
import { cn } from "@/lib/utils"

const INVALID_AMOUNT_MESSAGE = "0보다 큰 금액을 입력해주세요."

function buildVatResultItems(result: VatResult): CalculatorResultItem[] {
  return [
    {
      label: "공급가액",
      value: formatWon(result.supplyAmount),
    },
    {
      label: "부가세",
      value: formatWon(result.vatAmount),
    },
    {
      label: "합계금액",
      value: formatWon(result.totalAmount),
      highlight: true,
      className: "sm:col-span-2",
    },
  ]
}

interface VatCalculationCardProps {
  title: string
  inputLabel: string
  placeholder: string
  onCalculate: (amount: number) => VatResult | null
}

function VatCalculationCard({
  title,
  inputLabel,
  placeholder,
  onCalculate,
}: VatCalculationCardProps) {
  const [amount, setAmount] = useState(0)
  const [result, setResult] = useState<VatResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const resultItems = useMemo(
    () => (result ? buildVatResultItems(result) : undefined),
    [result]
  )

  function handleCalculate() {
    if (amount <= 0) {
      setResult(null)
      setMessage(INVALID_AMOUNT_MESSAGE)
      return
    }

    const calculated = onCalculate(amount)
    if (!calculated) {
      setResult(null)
      setMessage(INVALID_AMOUNT_MESSAGE)
      return
    }

    setResult(calculated)
    setMessage(null)
  }

  function handleReset() {
    setAmount(0)
    setResult(null)
    setMessage(null)
  }

  return (
    <Card className={cn(calculatorCardClass, "rounded-xl")}>
      <CardHeader className="border-b border-slate-200 px-6 py-4 !pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5 px-6 py-5">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-foreground">
            {inputLabel}
          </label>
          <Input
            inputMode="numeric"
            value={amount > 0 ? formatAmount(amount) : ""}
            onChange={(e) => setAmount(parseAmountInput(e.target.value))}
            placeholder={placeholder}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Button type="button" onClick={handleCalculate}>
            계산하기
          </Button>
          <Button type="button" variant="outline" onClick={handleReset}>
            초기화
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-base font-semibold text-foreground">계산 결과</p>
            {resultItems && (
              <CalculatorCopyButton items={resultItems} title={title} />
            )}
          </div>

          {message ? (
            <ResultStatMessage message={message} />
          ) : resultItems ? (
            <ResultStatGrid>
              {resultItems.map((item) => (
                <ResultStatCard key={item.label} {...item} />
              ))}
            </ResultStatGrid>
          ) : (
            <ResultStatEmptyState message={CALCULATOR_RESULT_EMPTY_MESSAGE} />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function VatCalculator() {
  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-8 pt-6 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <VatCalculationCard
          title="합계금액 기준 계산"
          inputLabel="합계금액"
          placeholder="1,100,000"
          onCalculate={calculateVatFromTotal}
        />
        <VatCalculationCard
          title="공급가액 기준 계산"
          inputLabel="공급가액"
          placeholder="1,000,000"
          onCalculate={calculateVatFromSupply}
        />
      </div>

      <CalculatorFaq
        description={VAT_GUIDE_DESCRIPTION}
        items={VAT_FAQ_ITEMS}
      />

      <RelatedCalculators excludeHref="/calculators/vat" className="mt-16" />
    </div>
  )
}
