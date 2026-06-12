import { CALCULATORS, type CalculatorListItem } from "@/data/calculators"

export type CalculatorRegistryItem = CalculatorListItem

export const CALCULATOR_REGISTRY = CALCULATORS

export const RELATED_CALCULATOR_HREFS: Record<string, string[]> = {
  "/calculators/delivery-margin": [
    "/calculators/menu-price",
    "/calculators/cost-rate",
    "/calculators/break-even",
    "/calculators/vat",
    "/calculators/weekly-pay",
  ],
  "/calculators/weekly-pay": [
    "/calculators/net-salary",
    "/calculators/social-insurance",
    "/calculators/annual-leave-pay",
    "/calculators/severance-pay",
    "/calculators/cost-rate",
  ],
  "/calculators/vat": [
    "/calculators/cost-rate",
    "/calculators/break-even",
    "/calculators/delivery-margin",
    "/calculators/menu-price",
    "/calculators/net-salary",
  ],
  "/calculators/break-even": [
    "/calculators/cost-rate",
    "/calculators/menu-price",
    "/calculators/delivery-margin",
    "/calculators/vat",
    "/calculators/weekly-pay",
  ],
  "/calculators/severance-pay": [
    "/calculators/net-salary",
    "/calculators/social-insurance",
    "/calculators/annual-leave-pay",
    "/calculators/weekly-pay",
    "/calculators/cost-rate",
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
    "/calculators/delivery-margin",
    "/calculators/break-even",
    "/calculators/vat",
    "/calculators/weekly-pay",
  ],
  "/calculators/menu-price": [
    "/calculators/cost-rate",
    "/calculators/delivery-margin",
    "/calculators/break-even",
    "/calculators/vat",
    "/calculators/net-salary",
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
