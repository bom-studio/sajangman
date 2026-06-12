import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  calculatorCardClass,
  calculatorCardContentClass,
  calculatorCardHeaderClass,
} from "@/components/calculators/calculator-styles"
import { cn } from "@/lib/utils"

interface CalculatorInputCardProps {
  title: string
  description?: string
  children: ReactNode
  onCalculate?: () => void
  onReset?: () => void
  showActions?: boolean
  className?: string
}

export function CalculatorInputCard({
  title,
  description,
  children,
  onCalculate,
  onReset,
  showActions = true,
  className,
}: CalculatorInputCardProps) {
  return (
    <Card className={cn(calculatorCardClass, className)}>
      <CardHeader className={calculatorCardHeaderClass}>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className={cn("space-y-5", calculatorCardContentClass)}>
        {children}
        {showActions && onCalculate && onReset && (
          <div className="grid grid-cols-2 gap-3 pt-1">
            <Button type="button" onClick={onCalculate}>
              계산하기
            </Button>
            <Button type="button" variant="outline" onClick={onReset}>
              초기화
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
