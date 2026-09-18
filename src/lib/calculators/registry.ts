import { CALCULATORS, type CalculatorListItem } from "@/data/calculators"

export type CalculatorRegistryItem = CalculatorListItem

export const CALCULATOR_REGISTRY = CALCULATORS

export const RELATED_CALCULATOR_HREFS: Record<string, string[]> = {
  "/calculators/delivery-margin": [
    "/calculators/delivery-coupon-profit",
    "/calculators/menu-price",
    "/calculators/cost-rate",
    "/calculators/break-even",
    "/calculators/vat",
  ],
  "/calculators/delivery-coupon-profit": [
    "/calculators/delivery-margin",
    "/calculators/menu-price",
    "/calculators/cost-rate",
    "/calculators/break-even",
  ],
  "/calculators/weekly-pay": [
    "/calculators/minimum-wage",
    "/calculators/net-salary",
    "/calculators/social-insurance",
    "/calculators/annual-leave-pay",
    "/calculators/severance-pay",
  ],
  "/calculators/minimum-wage": [
    "/calculators/weekly-pay",
    "/calculators/net-salary",
    "/calculators/social-insurance",
    "/calculators/annual-leave-pay",
  ],
  "/calculators/vat": [
    "/calculators/vat-type-compare",
    "/calculators/card-fee",
    "/calculators/income-tax",
    "/calculators/cost-rate",
    "/calculators/break-even",
  ],
  "/calculators/vat-type-compare": [
    "/calculators/vat",
    "/calculators/income-tax",
    "/calculators/card-fee",
    "/calculators/break-even",
  ],
  "/calculators/card-fee": [
    "/calculators/vat",
    "/calculators/vat-type-compare",
    "/calculators/cost-rate",
    "/calculators/sales-goal",
    "/calculators/break-even",
  ],
  "/calculators/income-tax": [
    "/calculators/vat",
    "/calculators/vat-type-compare",
    "/calculators/cost-rate",
    "/calculators/break-even",
    "/calculators/sales-goal",
  ],
  "/calculators/break-even": [
    "/calculators/payback-period",
    "/calculators/sales-goal",
    "/calculators/customer-unit-price",
    "/calculators/cost-rate",
  ],
  "/calculators/sales-goal": [
    "/calculators/payback-period",
    "/calculators/customer-unit-price",
    "/calculators/cost-rate",
    "/calculators/break-even",
  ],
  "/calculators/payback-period": [
    "/calculators/break-even",
    "/calculators/sales-goal",
    "/calculators/cost-rate",
    "/calculators/menu-price",
  ],
  "/calculators/customer-unit-price": [
    "/calculators/sales-goal",
    "/calculators/menu-price",
    "/calculators/cost-rate",
    "/calculators/break-even",
  ],
  "/calculators/severance-pay": [
    "/calculators/unemployment-benefit",
    "/calculators/net-salary",
    "/calculators/social-insurance",
    "/calculators/weekly-pay",
  ],
  "/calculators/unemployment-benefit": [
    "/calculators/severance-pay",
    "/calculators/net-salary",
    "/calculators/social-insurance",
    "/calculators/weekly-pay",
  ],
  "/calculators/net-salary": [
    "/calculators/social-insurance",
    "/calculators/severance-pay",
    "/calculators/annual-leave-pay",
    "/calculators/weekly-pay",
    "/calculators/vat",
  ],
  "/calculators/social-insurance": [
    "/calculators/net-salary",
    "/calculators/severance-pay",
    "/calculators/weekly-pay",
    "/calculators/annual-leave-pay",
    "/calculators/cost-rate",
  ],
  "/calculators/annual-leave-pay": [
    "/calculators/weekly-pay",
    "/calculators/severance-pay",
    "/calculators/net-salary",
    "/calculators/social-insurance",
    "/calculators/break-even",
  ],
  "/calculators/cost-rate": [
    "/calculators/menu-price",
    "/calculators/break-even",
    "/calculators/delivery-margin",
    "/calculators/customer-unit-price",
    "/calculators/sales-goal",
  ],
  "/calculators/inventory-turnover": [
    "/calculators/cost-rate",
    "/calculators/sales-goal",
    "/calculators/break-even",
    "/calculators/menu-price",
  ],
  "/calculators/menu-price": [
    "/calculators/customer-unit-price",
    "/calculators/sales-goal",
    "/calculators/cost-rate",
    "/calculators/break-even",
  ],
}

export function getRelatedCalculators(excludeHref: string, limit = 6) {
  const relatedHrefs = RELATED_CALCULATOR_HREFS[excludeHref]

  if (relatedHrefs?.length) {
    return relatedHrefs
      .slice(0, limit)
      .map((href) => CALCULATOR_REGISTRY.find((item) => item.href === href))
      .filter((item): item is CalculatorRegistryItem => Boolean(item))
  }

  return CALCULATOR_REGISTRY.filter((item) => item.href !== excludeHref).slice(
    0,
    limit
  )
}
