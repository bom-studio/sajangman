"use client"

import { useEffect, useMemo, useState, type ReactNode } from "react"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { calculatorCardClass } from "@/components/calculators/calculator-styles"
import { cn } from "@/lib/utils"

export interface CalculatorFaqItem {
  title: string
  paragraphs?: string[]
  content?: ReactNode
  /** FAQPage JSON-LD용 plain-text 답변 (content 전용 항목에 사용) */
  schemaAnswer?: string
}

export const CALCULATOR_GUIDE_TITLE = "계산기 가이드"

export interface CalculatorFaqProps {
  title?: string
  description?: string
  items: CalculatorFaqItem[]
  className?: string
  defaultOpenFirst?: boolean
}

function faqItemId(title: string, index: number): string {
  return `faq-${index}-${encodeURIComponent(title).slice(0, 48)}`
}

function FaqItemBody({ item }: { item: CalculatorFaqItem }) {
  if (item.content) {
    return <div className="space-y-3">{item.content}</div>
  }

  if (item.paragraphs?.length) {
    return (
      <div className="space-y-3">
        {item.paragraphs.map((paragraph) => (
          <p key={paragraph.slice(0, 48)}>{paragraph}</p>
        ))}
      </div>
    )
  }

  return null
}

export function CalculatorFaq({
  title = CALCULATOR_GUIDE_TITLE,
  description,
  items,
  className,
  defaultOpenFirst = true,
}: CalculatorFaqProps) {
  const itemIds = useMemo(
    () => items.map((item, index) => faqItemId(item.title, index)),
    [items]
  )

  const [openValues, setOpenValues] = useState<string[]>(() =>
    defaultOpenFirst && itemIds[0] ? [itemIds[0]] : []
  )

  useEffect(() => {
    const hash = window.location.hash.slice(1)
    if (!hash) return

    const matchedIndex = itemIds.findIndex((id) => id === hash)
    if (matchedIndex === -1) return

    setOpenValues((prev) =>
      prev.includes(hash) ? prev : [...prev, hash]
    )

    window.setTimeout(() => {
      document.getElementById(hash)?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }, 100)
  }, [itemIds])

  return (
    <section
      className={cn("mt-16 border-t border-slate-200 pt-12", className)}
      id="faq"
    >
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground sm:text-base">
          {description}
        </p>
      )}
      <Card className={cn("mt-8", calculatorCardClass)}>
        <CardContent className="px-6 py-2">
          <Accordion
            type="multiple"
            value={openValues}
            onValueChange={setOpenValues}
            className="w-full"
          >
            {items.map((item, index) => {
              const id = itemIds[index]

              return (
                <AccordionItem key={id} value={id} id={id} className="scroll-mt-24">
                  <AccordionTrigger className="text-base font-semibold hover:no-underline sm:text-lg">
                    {item.title}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <FaqItemBody item={item} />
                  </AccordionContent>
                </AccordionItem>
              )
            })}
          </Accordion>
        </CardContent>
      </Card>
    </section>
  )
}
