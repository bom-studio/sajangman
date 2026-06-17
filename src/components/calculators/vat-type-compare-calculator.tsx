"use client"

import { useRef, useState } from "react"
import { AlertCircle } from "lucide-react"

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
  VAT_TYPE_COMPARE_FAQ_ITEMS,
  VAT_TYPE_COMPARE_GUIDE_DESCRIPTION,
  VAT_TYPE_COMPARE_GUIDE_ITEMS,
} from "@/lib/calculators/faq/vat-type-compare-faq"
import { formatAmount, parseAmountInput } from "@/lib/calculators/format"
import {
  calculateVatTypeCompare,
  DEFAULT_VAT_TYPE_COMPARE_INPUT,
  formatDifferenceAmount,
  formatRatePercent,
  formatVatIncludedLabel,
  formatWon,
  VAT_INDUSTRY_TYPES,
  type VatTypeCompareResult,
  type VatTypeDetail,
} from "@/lib/calculators/vat-type-compare"
import { cn } from "@/lib/utils"

function MoneyField({
  label,
  description,
  value,
  onChange,
  placeholder,
}: {
  label: string
  description?: string
  value: number
  onChange: (value: number) => void
  placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      {description && (
        <p className="text-xs leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      <Input
        inputMode="numeric"
        value={value > 0 ? formatAmount(value) : ""}
        onChange={(e) => onChange(parseAmountInput(e.target.value))}
        placeholder={placeholder}
      />
    </div>
  )
}

function CompareTypeCard({
  detail,
  isFavorable,
}: {
  detail: VatTypeDetail
  isFavorable: boolean
}) {
  const rows = [
    {
      label: "예상 납부세액",
      value: formatWon(detail.calculatedTax),
      emphasis: true,
    },
    {
      label: "매입세액 공제",
      value:
        detail.purchaseDeduction > 0
          ? formatWon(detail.purchaseDeduction)
          : "불가 (제한)",
    },
    {
      label: "세금계산서 발급",
      value: detail.taxInvoiceIssuance,
    },
    {
      label: "적합한 사업자 유형",
      value: detail.suitableBusinessType,
    },
  ]

  return (
    <Card
      className={cn(
        calculatorCardClass,
        "transition-all duration-200",
        isFavorable && "border-blue-600 ring-2 ring-blue-600"
      )}
    >
      <CardHeader className={calculatorCardHeaderClass}>
        <div className="flex items-start justify-between gap-2">
          <div>
            <CardTitle>{detail.typeLabel}</CardTitle>
            {detail.type === "simplified" && (
              <CardDescription>
                업종별 부가가치율 {formatRatePercent(detail.valueAddedRate)} 적용
              </CardDescription>
            )}
            {detail.type === "general" && (
              <CardDescription>매출세액 − 매입세액 공제</CardDescription>
            )}
          </div>
          {isFavorable && (
            <span className="inline-flex shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
              유리
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className={cn("space-y-3", calculatorCardContentClass)}>
        {rows.map((row) => (
          <div
            key={row.label}
            className={cn(
              calculatorResultRowClass,
              row.emphasis && "border-0 pb-0"
            )}
          >
            <span className="text-sm text-muted-foreground">{row.label}</span>
            <span
              className={cn(
                "text-right text-sm font-medium text-foreground",
                row.emphasis && cn("text-base font-bold", calculatorHighlightClass)
              )}
            >
              {row.value}
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function VatTypeCompareDetailCard({ result }: { result: VatTypeCompareResult }) {
  const sections = [
    {
      title: "간이과세자",
      rows: [
        { label: "매출세액 (산출)", value: formatWon(result.simplified.salesVat) },
        {
          label: "매입세액",
          value: formatWon(result.simplified.purchaseVat),
          description: "공제 미적용",
        },
        {
          label: "업종별 부가율",
          value: formatRatePercent(result.simplified.valueAddedRate),
        },
        {
          label: "예상 납부세액",
          value: formatWon(result.simplified.calculatedTax),
          highlight: true,
        },
      ],
    },
    {
      title: "일반과세자",
      rows: [
        { label: "매출세액", value: formatWon(result.general.salesVat) },
        { label: "매입세액", value: formatWon(result.general.purchaseVat) },
        {
          label: "매입세액 공제",
          value: formatWon(result.general.purchaseDeduction),
        },
        {
          label: "예상 납부세액",
          value: formatWon(result.general.calculatedTax),
          highlight: true,
        },
      ],
    },
  ]

  return (
    <Card className={calculatorCardClass}>
      <CardContent className="px-0 py-0">
        <Accordion type="single" collapsible>
          <AccordionItem value="detail" className="border-0">
            <AccordionTrigger className="px-6 py-4 text-base font-semibold hover:no-underline sm:text-lg">
              상세 계산 내역
            </AccordionTrigger>
            <AccordionContent className="space-y-6 px-6 pb-5">
              <div className="rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm">
                <div className={calculatorResultRowClass}>
                  <span className="text-muted-foreground">과세표준 (공급가액)</span>
                  <span className="font-semibold">{formatWon(result.supplyAmount)}</span>
                </div>
                <div className={calculatorResultRowClass}>
                  <span className="text-muted-foreground">매입 공급가액</span>
                  <span className="font-semibold">
                    {formatWon(result.purchaseSupplyAmount)}
                  </span>
                </div>
                <div className={calculatorResultRowClass}>
                  <span className="text-muted-foreground">업종</span>
                  <span className="font-semibold">{result.industryLabel}</span>
                </div>
              </div>
              {sections.map((section) => (
                <div key={section.title}>
                  <p className="mb-3 text-sm font-semibold text-foreground">
                    {section.title}
                  </p>
                  <dl className="space-y-3">
                    {section.rows.map((row) => (
                      <div key={row.label} className={calculatorResultRowClass}>
                        <dt className="text-sm text-muted-foreground">
                          {row.label}
                          {"description" in row && row.description && (
                            <span className="mt-0.5 block text-xs font-normal">
                              {row.description}
                            </span>
                          )}
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
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}

export function VatTypeCompareCalculator() {
  const resultsRef = useRef<HTMLDivElement>(null)
  const [annualSales, setAnnualSales] = useState(
    DEFAULT_VAT_TYPE_COMPARE_INPUT.annualSales
  )
  const [purchaseCost, setPurchaseCost] = useState(
    DEFAULT_VAT_TYPE_COMPARE_INPUT.purchaseCost
  )
  const [industryId, setIndustryId] = useState(
    DEFAULT_VAT_TYPE_COMPARE_INPUT.industryId
  )
  const [vatIncluded, setVatIncluded] = useState(
    DEFAULT_VAT_TYPE_COMPARE_INPUT.vatIncluded
  )
  const [purchaseDeductionEligible, setPurchaseDeductionEligible] = useState(
    DEFAULT_VAT_TYPE_COMPARE_INPUT.purchaseDeductionEligible
  )
  const [result, setResult] = useState<VatTypeCompareResult | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  function handleCalculate() {
    const calculated = calculateVatTypeCompare({
      annualSales,
      purchaseCost,
      industryId,
      vatIncluded,
      purchaseDeductionEligible,
    })

    if (!calculated.canCalculate) {
      setResult(null)
      setMessage(calculated.errorMessage)
    } else {
      setResult(calculated)
      setMessage(null)
    }
    resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  function handleReset() {
    setAnnualSales(DEFAULT_VAT_TYPE_COMPARE_INPUT.annualSales)
    setPurchaseCost(DEFAULT_VAT_TYPE_COMPARE_INPUT.purchaseCost)
    setIndustryId(DEFAULT_VAT_TYPE_COMPARE_INPUT.industryId)
    setVatIncluded(DEFAULT_VAT_TYPE_COMPARE_INPUT.vatIncluded)
    setPurchaseDeductionEligible(
      DEFAULT_VAT_TYPE_COMPARE_INPUT.purchaseDeductionEligible
    )
    setResult(null)
    setMessage(null)
  }

  const resultItems = result
    ? [
        {
          label: "간이과세 예상 부가세",
          value: formatWon(result.simplifiedTax),
          description: `${result.industryLabel} · 부가가치율 ${formatRatePercent(result.simplified.valueAddedRate)}`,
        },
        {
          label: "일반과세 예상 부가세",
          value: formatWon(result.generalTax),
          description: purchaseDeductionEligible
            ? "매입세액 공제 반영"
            : "매입세액 공제 미반영",
          highlight: true,
        },
        {
          label: "차이 금액",
          value: formatDifferenceAmount(result.differenceAmount),
          description: "일반과세 − 간이과세 (양수면 일반과세가 더 많음)",
          valueClassName:
            result.differenceAmount > 0 ? "text-red-700" : "text-emerald-700",
        },
        {
          label: "유리한 과세유형",
          value: result.favorableTypeLabel,
          emphasized: true,
        },
      ]
    : undefined

  const pdfRows = result
    ? [
        { label: "간이과세 예상 부가세", value: formatWon(result.simplifiedTax) },
        { label: "일반과세 예상 부가세", value: formatWon(result.generalTax) },
        { label: "차이 금액", value: formatDifferenceAmount(result.differenceAmount) },
        { label: "유리한 과세유형", value: result.favorableTypeLabel },
      ]
    : []

  return (
    <CalculatorPageLayout
      excludeHref="/calculators/vat-type-compare"
      resultRef={resultsRef}
      resultId="vat-type-compare-results"
      input={
        <CalculatorInputCard
          title="계산 조건"
          description="연간 매출과 매입 비용을 입력하면 과세유형별 예상 부가세를 비교합니다."
          onCalculate={handleCalculate}
          onReset={handleReset}
        >
          <MoneyField
            label="연간 예상 매출"
            description="연간 카드·현금 등 합산 매출"
            value={annualSales}
            onChange={setAnnualSales}
            placeholder="60,000,000"
          />
          <MoneyField
            label="매입 비용"
            description="연간 식자재·임대료·설비 등 매입 합계"
            value={purchaseCost}
            onChange={setPurchaseCost}
            placeholder="24,000,000"
          />
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground">
              업종 선택
            </label>
            <p className="text-xs leading-relaxed text-muted-foreground">
              간이과세 업종별 부가가치율·공제율 적용
            </p>
            <select
              value={industryId}
              onChange={(e) => setIndustryId(e.target.value)}
              className={calculatorSelectClassName}
            >
              {VAT_INDUSTRY_TYPES.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <input
              type="checkbox"
              checked={vatIncluded}
              onChange={(e) => setVatIncluded(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-foreground">
                부가세 포함
              </span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                체크 시 입력한 매출·매입 금액에 부가세가 포함된 것으로
                계산합니다.
              </span>
            </span>
          </label>
          <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/80 px-4 py-3">
            <input
              type="checkbox"
              checked={purchaseDeductionEligible}
              onChange={(e) => setPurchaseDeductionEligible(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 rounded border-input accent-primary"
            />
            <span className="space-y-0.5">
              <span className="block text-sm font-medium text-foreground">
                매입세액 공제 가능
              </span>
              <span className="block text-xs leading-relaxed text-muted-foreground">
                일반과세 계산 시 세금계산서 등 적격 증빙 매입세액 공제를
                반영합니다. 간이과세는 공제가 적용되지 않습니다.
              </span>
            </span>
          </label>
        </CalculatorInputCard>
      }
      result={
        <>
          <CalculatorResultCard
            title="계산 결과"
            description={`${formatVatIncludedLabel(vatIncluded)} 기준 과세유형별 예상 부가세 비교입니다.`}
            message={message}
            items={resultItems}
            shareContext="간이·일반과세 비교 계산 결과"
            showPdf
            pdfTitle="간이·일반과세 비교 계산 결과"
            pdfSubtitle="사장만 간이과세자 일반과세자 비교 계산기"
            pdfFilename="과세유형비교_계산결과"
            pdfRows={pdfRows}
            footer={
              result ? (
                <div className="space-y-3">
                  <div className="flex gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-relaxed text-amber-950">
                    <AlertCircle className="mt-0.5 size-4 shrink-0" />
                    <div className="space-y-2">
                      <p className="font-medium">주의사항</p>
                      <ul className="list-inside list-disc space-y-1">
                        {result.cautionNotes.map((note) => (
                          <li key={note}>{note}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ) : undefined
            }
          />
          {result && (
            <>
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground">
                  비교 결과
                </h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <CompareTypeCard
                    detail={result.simplified}
                    isFavorable={result.favorableType === "simplified"}
                  />
                  <CompareTypeCard
                    detail={result.general}
                    isFavorable={result.favorableType === "general"}
                  />
                </div>
              </div>
              <VatTypeCompareDetailCard result={result} />
            </>
          )}
        </>
      }
      seo={
        <>
          <CalculatorFaq
            description={VAT_TYPE_COMPARE_GUIDE_DESCRIPTION}
            items={VAT_TYPE_COMPARE_GUIDE_ITEMS}
          />
          <CalculatorFaq
            title="자주 묻는 질문"
            items={VAT_TYPE_COMPARE_FAQ_ITEMS}
            defaultOpenFirst={false}
            className="mt-12"
          />
        </>
      }
    />
  )
}
