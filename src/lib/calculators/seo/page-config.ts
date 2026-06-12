import type { CalculatorFaqItem } from "@/components/calculators/calculator-faq"
import { ANNUAL_LEAVE_PAY_FAQ_ITEMS } from "@/lib/calculators/faq/annual-leave-pay-faq"
import { BREAK_EVEN_FAQ_ITEMS } from "@/lib/calculators/faq/break-even-faq"
import { COST_RATE_FAQ_ITEMS } from "@/lib/calculators/faq/cost-rate-faq"
import { DELIVERY_MARGIN_FAQ_ITEMS } from "@/lib/calculators/faq/delivery-margin-faq"
import { MENU_PRICE_FAQ_ITEMS } from "@/lib/calculators/faq/menu-price-faq"
import { NET_SALARY_FAQ_ITEMS } from "@/lib/calculators/faq/net-salary-faq"
import { SEVERANCE_PAY_FAQ_ITEMS } from "@/lib/calculators/faq/severance-pay-faq"
import { SOCIAL_INSURANCE_FAQ_ITEMS } from "@/lib/calculators/faq/social-insurance-faq"
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
  "/calculators/vat": {
    name: "부가세 계산기",
    href: "/calculators/vat",
    faqItems: VAT_FAQ_ITEMS,
    howTo: VAT_HOW_TO,
  },
  "/calculators/delivery-margin": {
    name: "배달 마진 계산기",
    href: "/calculators/delivery-margin",
    faqItems: DELIVERY_MARGIN_FAQ_ITEMS,
  },
  "/calculators/break-even": {
    name: "손익분기점 계산기",
    href: "/calculators/break-even",
    faqItems: BREAK_EVEN_FAQ_ITEMS,
    howTo: BREAK_EVEN_HOW_TO,
  },
  "/calculators/severance-pay": {
    name: "퇴직금 계산기",
    href: "/calculators/severance-pay",
    faqItems: SEVERANCE_PAY_FAQ_ITEMS,
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
  "/calculators/menu-price": {
    name: "메뉴 가격 계산기",
    href: "/calculators/menu-price",
    faqItems: MENU_PRICE_FAQ_ITEMS,
    howTo: MENU_PRICE_HOW_TO,
  },
}

export function getCalculatorSeoConfig(href: string): CalculatorSeoPageConfig {
  const config = CALCULATOR_SEO_CONFIG[href]
  if (!config) {
    throw new Error(`Missing SEO config for calculator: ${href}`)
  }
  return config
}
