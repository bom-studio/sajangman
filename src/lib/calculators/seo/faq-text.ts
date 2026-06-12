import type { CalculatorFaqItem } from "@/components/calculators/calculator-faq"

export function getFaqAnswerText(item: CalculatorFaqItem): string {
  if (item.schemaAnswer?.trim()) {
    return item.schemaAnswer.trim()
  }

  if (item.paragraphs?.length) {
    return item.paragraphs.join(" ")
  }

  return item.title
}

export function faqItemsToSchemaEntries(items: CalculatorFaqItem[]) {
  return items.map((item) => ({
    question: item.title,
    answer: getFaqAnswerText(item),
  }))
}
