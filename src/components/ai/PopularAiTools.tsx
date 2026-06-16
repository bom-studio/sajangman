"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { getPopularAiTools } from "@/data/ai/tools"

export function PopularAiTools() {
  const tools = getPopularAiTools()

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground sm:text-xl">
          인기 AI 도구
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          사장님이 가장 많이 찾는 AI 도구를 빠르게 시작하세요.
        </p>
      </div>
      <div className="-mx-4 flex gap-4 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {tools.map((tool) => {
          const Icon = tool.icon

          return (
            <Link
              key={tool.href}
              href={tool.href}
              className="group block h-full min-w-[280px] flex-1"
            >
              <Card className="h-full border-0 py-0 shadow-sm ring-1 ring-border/80 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:ring-primary/20">
                <CardContent className="flex h-full items-center gap-4 p-5">
                  <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-semibold text-foreground group-hover:text-primary sm:text-base">
                      {tool.popularEmoji ? `${tool.popularEmoji} ` : ""}
                      {tool.title}
                    </h3>
                    <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                      {tool.description}
                    </p>
                  </div>
                  <ArrowRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
                </CardContent>
              </Card>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
