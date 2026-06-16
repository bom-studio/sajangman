import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { AiToolCard } from "@/components/ai/AiToolCard"
import { HomeSectionHeader } from "@/components/home/home-section-header"
import { Button } from "@/components/ui/button"
import { getPopularAiTools } from "@/data/ai/tools"

export function HomePopularAiSection() {
  const tools = getPopularAiTools()

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <HomeSectionHeader title="반복 업무를 줄여주는 AI 도구" />
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href="/ai">
              AI 생성기 보기
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <AiToolCard key={tool.href} tool={tool} />
          ))}
        </div>
      </div>
    </section>
  )
}
