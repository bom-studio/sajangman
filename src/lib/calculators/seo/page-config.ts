import type { CalculatorFaqItem } from "@/components/calculators/calculator-faq"
import { ANNUAL_LEAVE_PAY_FAQ_ITEMS } from "@/lib/calculators/faq/annual-leave-pay-faq"
import { BREAK_EVEN_FAQ_ITEMS } from "@/lib/calculators/faq/break-even-faq"
import { CUSTOMER_UNIT_PRICE_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/customer-unit-price-faq"
import { CARD_FEE_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/card-fee-faq"
import { COST_RATE_FAQ_ITEMS } from "@/lib/calculators/faq/cost-rate-faq"
import { DELIVERY_COUPON_PROFIT_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/delivery-coupon-profit-faq"
import { DELIVERY_MARGIN_FAQ_ITEMS } from "@/lib/calculators/faq/delivery-margin-faq"
import { INVENTORY_TURNOVER_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/inventory-turnover-faq"
import { MENU_PRICE_FAQ_ITEMS } from "@/lib/calculators/faq/menu-price-faq"
import { MINIMUM_WAGE_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/minimum-wage-faq"
import { NET_SALARY_FAQ_ITEMS } from "@/lib/calculators/faq/net-salary-faq"
import { PAYBACK_PERIOD_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/payback-period-faq"
import { SALES_GOAL_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/sales-goal-faq"
import { SEVERANCE_PAY_FAQ_ITEMS } from "@/lib/calculators/faq/severance-pay-faq"
import { SOCIAL_INSURANCE_FAQ_ITEMS } from "@/lib/calculators/faq/social-insurance-faq"
import { INCOME_TAX_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/income-tax-faq"
import { UNEMPLOYMENT_BENEFIT_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/unemployment-benefit-faq"
import { VAT_TYPE_COMPARE_SEO_FAQ_ITEMS } from "@/lib/calculators/faq/vat-type-compare-faq"
import { VAT_FAQ_ITEMS } from "@/lib/calculators/faq/vat-faq"
import { WEEKLY_PAY_FAQ_ITEMS } from "@/lib/calculators/faq/weekly-pay-faq"

import type { HowToSchemaInput } from "./schema"
import {
  BREAK_EVEN_HOW_TO,
  COST_RATE_HOW_TO,
  MENU_PRICE_HOW_TO,
  VAT_HOW_TO,
  WEEKLY_PAY_HOW_TO,
} from "./howto"

export interface CalculatorSeoPageConfig {
  name: string
  href: string
  faqItems: CalculatorFaqItem[]
  howTo?: HowToSchemaInput
}

export const CALCULATOR_SEO_CONFIG: Record<string, CalculatorSeoPageConfig> = {
  "/calculators/weekly-pay": {
    name: "주휴수당 계산기",
    href: "/calculators/weekly-pay",
    faqItems: WEEKLY_PAY_FAQ_ITEMS,
    howTo: WEEKLY_PAY_HOW_TO,
  },
  "/calculators/minimum-wage": {
    name: "최저임금 계산기",
    href: "/calculators/minimum-wage",
    faqItems: MINIMUM_WAGE_SEO_FAQ_ITEMS,
  },
  "/calculators/vat": {
    name: "부가세 계산기",
    href: "/calculators/vat",
    faqItems: VAT_FAQ_ITEMS,
    howTo: VAT_HOW_TO,
  },
  "/calculators/card-fee": {
    name: "카드 수수료 계산기",
    href: "/calculators/card-fee",
    faqItems: CARD_FEE_SEO_FAQ_ITEMS,
  },
  "/calculators/vat-type-compare": {
    name: "간이과세자 일반과세자 비교 계산기",
    href: "/calculators/vat-type-compare",
    faqItems: VAT_TYPE_COMPARE_SEO_FAQ_ITEMS,
  },
  "/calculators/income-tax": {
    name: "종합소득세 계산기",
    href: "/calculators/income-tax",
    faqItems: INCOME_TAX_SEO_FAQ_ITEMS,
  },
  "/calculators/delivery-margin": {
    name: "배달 마진 계산기",
    href: "/calculators/delivery-margin",
    faqItems: DELIVERY_MARGIN_FAQ_ITEMS,
  },
  "/calculators/delivery-coupon-profit": {
    name: "배달 쿠폰 손익 계산기",
    href: "/calculators/delivery-coupon-profit",
    faqItems: DELIVERY_COUPON_PROFIT_SEO_FAQ_ITEMS,
  },
  "/calculators/break-even": {
    name: "손익분기점 계산기",
    href: "/calculators/break-even",
    faqItems: BREAK_EVEN_FAQ_ITEMS,
    howTo: BREAK_EVEN_HOW_TO,
  },
  "/calculators/sales-goal": {
    name: "목표 매출 계산기",
    href: "/calculators/sales-goal",
    faqItems: SALES_GOAL_SEO_FAQ_ITEMS,
  },
  "/calculators/payback-period": {
    name: "투자금 회수기간 계산기",
    href: "/calculators/payback-period",
    faqItems: PAYBACK_PERIOD_SEO_FAQ_ITEMS,
  },
  "/calculators/severance-pay": {
    name: "퇴직금 계산기",
    href: "/calculators/severance-pay",
    faqItems: SEVERANCE_PAY_FAQ_ITEMS,
  },
  "/calculators/unemployment-benefit": {
    name: "실업급여 계산기",
    href: "/calculators/unemployment-benefit",
    faqItems: UNEMPLOYMENT_BENEFIT_SEO_FAQ_ITEMS,
  },
  "/calculators/net-salary": {
    name: "급여 실수령액 계산기",
    href: "/calculators/net-salary",
    faqItems: NET_SALARY_FAQ_ITEMS,
  },
  "/calculators/social-insurance": {
    name: "4대보험 계산기",
    href: "/calculators/social-insurance",
    faqItems: SOCIAL_INSURANCE_FAQ_ITEMS,
  },
  "/calculators/annual-leave-pay": {
    name: "연차수당 계산기",
    href: "/calculators/annual-leave-pay",
    faqItems: ANNUAL_LEAVE_PAY_FAQ_ITEMS,
  },
  "/calculators/cost-rate": {
    name: "원가율 계산기",
    href: "/calculators/cost-rate",
    faqItems: COST_RATE_FAQ_ITEMS,
    howTo: COST_RATE_HOW_TO,
  },
  "/calculators/inventory-turnover": {
    name: "재고 회전율 계산기",
    href: "/calculators/inventory-turnover",
    faqItems: INVENTORY_TURNOVER_SEO_FAQ_ITEMS,
  },
  "/calculators/menu-price": {
    name: "메뉴 가격 계산기",
    href: "/calculators/menu-price",
    faqItems: MENU_PRICE_FAQ_ITEMS,
    howTo: MENU_PRICE_HOW_TO,
  },
  "/calculators/customer-unit-price": {
    name: "객단가 계산기",
    href: "/calculators/customer-unit-price",
    faqItems: CUSTOMER_UNIT_PRICE_SEO_FAQ_ITEMS,
  },
}

export function getCalculatorSeoConfig(href: string): CalculatorSeoPageConfig {
  const config = CALCULATOR_SEO_CONFIG[href]
  if (!config) {
    throw new Error(`Missing SEO config for calculator: ${href}`)
  }
  return config
}
