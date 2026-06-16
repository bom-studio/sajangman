import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HomeSectionHeader } from "@/components/home/home-section-header"
import { Card, CardContent } from "@/components/ui/card"
import { getHomeQuickStartItems } from "@/data/home"

export function QuickStartSection() {
  const items = getHomeQuickStartItems()

  return (
    <section className="bg-slate-50/60 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader title="지금 바로 많이 쓰는 도구" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon

            return (
              <Link
                key={item.href}
                href={item.href}
                className="group block h-full"
              >
                <Card className="h-full border-0 py-0 shadow-sm ring-1 ring-border/80 transition-all duration-200 hover:-translate-y-1 hover:shadow-md hover:ring-primary/20">
                  <CardContent className="flex h-full flex-col p-6">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="size-5" />
                    </div>
                    <h3 className="mt-4 text-base font-semibold text-foreground group-hover:text-primary">
                      {item.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                    <div className="mt-4 flex items-center gap-1 text-sm font-medium text-primary">
                      바로가기
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
