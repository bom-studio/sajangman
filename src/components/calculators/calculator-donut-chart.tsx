"use client"

import { useMemo } from "react"
import { Cell, Label, Pie, PieChart } from "recharts"

import {
  calculatorCardClass,
  calculatorCardContentClass,
  calculatorCardHeaderClass,
} from "@/components/calculators/calculator-styles"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { formatPercent } from "@/lib/calculators/format"
import { cn } from "@/lib/utils"

export interface DonutChartSegment {
  key: string
  label: string
  value: number
  color: string
}

interface CalculatorDonutChartProps {
  title?: string
  segments: DonutChartSegment[]
  centerLabel?: string
  centerValue?: string
  className?: string
}

export function CalculatorDonutChart({
  title = "비율 시각화",
  segments,
  centerLabel,
  centerValue,
  className,
}: CalculatorDonutChartProps) {
  const filtered = segments.filter((segment) => segment.value > 0)
  const total = filtered.reduce((sum, segment) => sum + segment.value, 0)

  const chartConfig = useMemo(() => {
    return filtered.reduce<ChartConfig>((config, segment) => {
      config[segment.key] = { label: segment.label, color: segment.color }
      return config
    }, {})
  }, [filtered])

  if (total <= 0) return null

  const chartData = filtered.map((segment) => ({
    ...segment,
    fill: segment.color,
    percent: (segment.value / total) * 100,
  }))

  return (
    <Card className={cn(calculatorCardClass, className)}>
      <CardHeader className={calculatorCardHeaderClass}>
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className={calculatorCardContentClass}>
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
          <ChartContainer
            config={chartConfig}
            className="mx-auto aspect-square h-[220px] w-full max-w-[240px]"
          >
            <PieChart>
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value, name) => {
                      const segment = chartData.find((item) => item.key === name)
                      const percent = segment
                        ? formatPercent(segment.percent)
                        : ""
                      return (
                        <span className="font-medium">
                          {segment?.label}: {percent}
                        </span>
                      )
                    }}
                  />
                }
              />
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="key"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={2}
                strokeWidth={2}
                stroke="#ffffff"
              >
                {chartData.map((segment) => (
                  <Cell key={segment.key} fill={segment.color} />
                ))}
                {(centerLabel || centerValue) && (
                  <Label
                    content={({ viewBox }) => {
                      if (!viewBox || !("cx" in viewBox) || !("cy" in viewBox)) {
                        return null
                      }
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          {centerValue && (
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) - 4}
                              fill="#0f172a"
                              fontSize={16}
                              fontWeight={700}
                            >
                              {centerValue}
                            </tspan>
                          )}
                          {centerLabel && (
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy ?? 0) + 16}
                              fill="#64748b"
                              fontSize={11}
                            >
                              {centerLabel}
                            </tspan>
                          )}
                        </text>
                      )
                    }}
                  />
                )}
              </Pie>
            </PieChart>
          </ChartContainer>

          <ul className="grid w-full gap-3 sm:max-w-xs">
            {chartData.map((segment) => (
              <li
                key={segment.key}
                className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50/60 px-3 py-2.5"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="size-3 shrink-0 rounded-full"
                    style={{ backgroundColor: segment.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {segment.label}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {formatPercent(segment.percent)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
