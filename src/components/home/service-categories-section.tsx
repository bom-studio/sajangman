import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { HomeSectionHeader } from "@/components/home/home-section-header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { getHomeServiceCategories } from "@/data/home"

export function ServiceCategoriesSection() {
  const categories = getHomeServiceCategories()

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <HomeSectionHeader title="사장만에서 할 수 있는 일" />
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
          {categories.map((category) => {
            const Icon = category.icon

            return (
              <Card
                key={category.href}
                className="h-full border-0 py-0 shadow-sm ring-1 ring-border/80"
              >
                <CardContent className="flex h-full flex-col p-6 sm:p-8">
                  <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-6" />
                  </div>
                  <h3 className="mt-5 text-xl font-semibold text-foreground">
                    {category.title}
                  </h3>
                  <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {category.description}
                  </p>
                  <Button asChild className="mt-6 w-full sm:w-auto">
                    <Link href={category.href}>
                      {category.buttonLabel}
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
