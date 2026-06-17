export interface ResourceRelatedMapping {
  calculatorHrefs: string[]
  resourceSlugs: string[]
  aiToolIds: string[]
}

export const RESOURCE_RELATED_MAPPINGS: Record<string, ResourceRelatedMapping> = {
  "weekly-pay-guide": {
    calculatorHrefs: [
      "/calculators/weekly-pay",
      "/calculators/annual-leave-pay",
    ],
    resourceSlugs: [
      "annual-leave-pay-guide",
      "overtime-pay-guide",
      "payslip-issuance-guide",
    ],
    aiToolIds: [],
  },
  "vat-filing-guide": {
    calculatorHrefs: ["/calculators/vat", "/calculators/net-salary"],
    resourceSlugs: [
      "simplified-vs-general-vat",
      "tax-invoice-issuance-guide",
      "income-tax-filing-guide",
    ],
    aiToolIds: [],
  },
  "simplified-vs-general-vat": {
    calculatorHrefs: ["/calculators/vat"],
    resourceSlugs: [
      "vat-filing-guide",
      "income-tax-filing-guide",
      "cash-receipt-card-sales-guide",
    ],
    aiToolIds: [],
  },
  "delivery-app-fees-comparison": {
    calculatorHrefs: [
      "/calculators/delivery-margin",
      "/calculators/menu-price",
    ],
    resourceSlugs: [
      "delivery-menu-pricing-strategy",
      "delivery-vs-dine-in-profit",
      "promotion-profitability-guide",
    ],
    aiToolIds: [],
  },
  "restaurant-cost-rate-management": {
    calculatorHrefs: [
      "/calculators/cost-rate",
      "/calculators/menu-price",
    ],
    resourceSlugs: [
      "menu-pricing-strategy",
      "inventory-ordering-guide",
      "cost-ratio-target-setting",
    ],
    aiToolIds: ["menu-description"],
  },
  "break-even-calculation-guide": {
    calculatorHrefs: [
      "/calculators/break-even",
      "/calculators/cost-rate",
    ],
    resourceSlugs: [
      "restaurant-startup-cost-guide",
      "cost-ratio-target-setting",
      "restaurant-cost-rate-management",
    ],
    aiToolIds: [],
  },
  "employer-social-insurance-guide": {
    calculatorHrefs: [
      "/calculators/social-insurance",
      "/calculators/net-salary",
    ],
    resourceSlugs: [
      "payslip-issuance-guide",
      "severance-pay-guide",
      "minimum-wage-2026-guide",
    ],
    aiToolIds: [],
  },
  "severance-pay-guide": {
    calculatorHrefs: [
      "/calculators/severance-pay",
      "/calculators/net-salary",
    ],
    resourceSlugs: [
      "annual-leave-pay-guide",
      "employer-social-insurance-guide",
      "payslip-issuance-guide",
    ],
    aiToolIds: [],
  },
  "annual-leave-pay-guide": {
    calculatorHrefs: [
      "/calculators/annual-leave-pay",
      "/calculators/weekly-pay",
    ],
    resourceSlugs: [
      "weekly-pay-guide",
      "overtime-pay-guide",
      "severance-pay-guide",
    ],
    aiToolIds: [],
  },
  "menu-pricing-strategy": {
    calculatorHrefs: [
      "/calculators/menu-price",
      "/calculators/cost-rate",
    ],
    resourceSlugs: [
      "restaurant-cost-rate-management",
      "delivery-menu-pricing-strategy",
      "promotion-profitability-guide",
    ],
    aiToolIds: ["menu-description", "event-copy"],
  },
  "income-tax-filing-guide": {
    calculatorHrefs: [
      "/calculators/income-tax",
      "/calculators/vat",
      "/calculators/net-salary",
    ],
    resourceSlugs: [
      "vat-filing-guide",
      "basic-bookkeeping-guide",
      "tax-invoice-issuance-guide",
    ],
    aiToolIds: [],
  },
  "cash-receipt-card-sales-guide": {
    calculatorHrefs: ["/calculators/vat"],
    resourceSlugs: [
      "vat-filing-guide",
      "tax-invoice-issuance-guide",
      "basic-bookkeeping-guide",
    ],
    aiToolIds: [],
  },
  "tax-invoice-issuance-guide": {
    calculatorHrefs: ["/calculators/vat"],
    resourceSlugs: [
      "vat-filing-guide",
      "income-tax-filing-guide",
      "cash-receipt-card-sales-guide",
    ],
    aiToolIds: [],
  },
  "minimum-wage-2026-guide": {
    calculatorHrefs: [
      "/calculators/minimum-wage",
      "/calculators/weekly-pay",
      "/calculators/net-salary",
    ],
    resourceSlugs: [
      "part-time-contract-guide",
      "overtime-pay-guide",
      "payslip-issuance-guide",
    ],
    aiToolIds: [],
  },
  "part-time-contract-guide": {
    calculatorHrefs: [
      "/calculators/weekly-pay",
      "/calculators/annual-leave-pay",
    ],
    resourceSlugs: [
      "minimum-wage-2026-guide",
      "payslip-issuance-guide",
      "overtime-pay-guide",
    ],
    aiToolIds: [],
  },
  "payslip-issuance-guide": {
    calculatorHrefs: [
      "/calculators/net-salary",
      "/calculators/social-insurance",
    ],
    resourceSlugs: [
      "employer-social-insurance-guide",
      "weekly-pay-guide",
      "minimum-wage-2026-guide",
    ],
    aiToolIds: [],
  },
  "employee-vs-freelancer-tax": {
    calculatorHrefs: [
      "/calculators/net-salary",
      "/calculators/weekly-pay",
    ],
    resourceSlugs: [
      "payslip-issuance-guide",
      "part-time-contract-guide",
      "employer-social-insurance-guide",
    ],
    aiToolIds: [],
  },
  "overtime-pay-guide": {
    calculatorHrefs: [
      "/calculators/weekly-pay",
      "/calculators/net-salary",
    ],
    resourceSlugs: [
      "annual-leave-pay-guide",
      "minimum-wage-2026-guide",
      "payslip-issuance-guide",
    ],
    aiToolIds: [],
  },
  "delivery-menu-pricing-strategy": {
    calculatorHrefs: [
      "/calculators/delivery-margin",
      "/calculators/menu-price",
    ],
    resourceSlugs: [
      "delivery-app-fees-comparison",
      "menu-pricing-strategy",
      "promotion-profitability-guide",
    ],
    aiToolIds: ["menu-description"],
  },
  "delivery-review-management": {
    calculatorHrefs: ["/calculators/delivery-margin"],
    resourceSlugs: [
      "delivery-app-fees-comparison",
      "delivery-vs-dine-in-profit",
      "delivery-menu-pricing-strategy",
    ],
    aiToolIds: ["review-reply", "apology"],
  },
  "delivery-vs-dine-in-profit": {
    calculatorHrefs: [
      "/calculators/delivery-margin",
      "/calculators/break-even",
    ],
    resourceSlugs: [
      "delivery-app-fees-comparison",
      "delivery-menu-pricing-strategy",
      "restaurant-cost-rate-management",
    ],
    aiToolIds: [],
  },
  "restaurant-startup-cost-guide": {
    calculatorHrefs: [
      "/calculators/break-even",
      "/calculators/cost-rate",
    ],
    resourceSlugs: [
      "location-analysis-guide",
      "break-even-calculation-guide",
      "small-business-loan-guide",
    ],
    aiToolIds: [],
  },
  "location-analysis-guide": {
    calculatorHrefs: ["/calculators/break-even"],
    resourceSlugs: [
      "restaurant-startup-cost-guide",
      "break-even-calculation-guide",
      "delivery-vs-dine-in-profit",
    ],
    aiToolIds: [],
  },
  "small-business-loan-guide": {
    calculatorHrefs: ["/calculators/break-even"],
    resourceSlugs: [
      "restaurant-startup-cost-guide",
      "food-safety-license-checklist",
      "basic-bookkeeping-guide",
    ],
    aiToolIds: [],
  },
  "food-safety-license-checklist": {
    calculatorHrefs: ["/calculators/break-even"],
    resourceSlugs: [
      "restaurant-startup-cost-guide",
      "small-business-loan-guide",
      "location-analysis-guide",
    ],
    aiToolIds: ["notice-generator", "holiday-notice"],
  },
  "inventory-ordering-guide": {
    calculatorHrefs: [
      "/calculators/cost-rate",
      "/calculators/menu-price",
    ],
    resourceSlugs: [
      "restaurant-cost-rate-management",
      "pos-sales-data-guide",
      "cost-ratio-target-setting",
    ],
    aiToolIds: [],
  },
  "basic-bookkeeping-guide": {
    calculatorHrefs: ["/calculators/vat", "/calculators/cost-rate"],
    resourceSlugs: [
      "income-tax-filing-guide",
      "tax-invoice-issuance-guide",
      "pos-sales-data-guide",
    ],
    aiToolIds: [],
  },
  "promotion-profitability-guide": {
    calculatorHrefs: [
      "/calculators/menu-price",
      "/calculators/delivery-margin",
    ],
    resourceSlugs: [
      "menu-pricing-strategy",
      "delivery-menu-pricing-strategy",
      "cost-ratio-target-setting",
    ],
    aiToolIds: ["event-copy"],
  },
  "pos-sales-data-guide": {
    calculatorHrefs: [
      "/calculators/cost-rate",
      "/calculators/break-even",
    ],
    resourceSlugs: [
      "inventory-ordering-guide",
      "basic-bookkeeping-guide",
      "restaurant-cost-rate-management",
    ],
    aiToolIds: [],
  },
  "cost-ratio-target-setting": {
    calculatorHrefs: [
      "/calculators/cost-rate",
      "/calculators/menu-price",
      "/calculators/break-even",
    ],
    resourceSlugs: [
      "restaurant-cost-rate-management",
      "menu-pricing-strategy",
      "inventory-ordering-guide",
    ],
    aiToolIds: [],
  },
}
