import Link from "next/link"
import { ArrowRight, Clock } from "lucide-react"

import { getHomeFeaturedResources } from "@/data/home"
import {
  RESOURCE_CATEGORY_BADGE_CLASS,
  RESOURCE_CATEGORY_MAP,
} from "@/data/resources/categories"
import { cn } from "@/lib/utils"

export function HomeLatestResourcesSection() {
  const articles = getHomeFeaturedResources().slice(0, 4)

  return (
    <section className="bg-[#F8FAFC] py-14 sm:py-16">
      <div className="mx-auto max-w-[1200px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-[#0F172A] sm:text-[28px]">
              사장님이 알아두면 좋은 자료
            </h2>
            <p className="mt-1.5 text-sm text-[#64748B]">
              세금부터 노무까지, 필요한 내용만 쉽게 정리했습니다.
            </p>
          </div>
          <Link
            href="/resources"
            className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            자료실 전체 보기
            <ArrowRight className="size-4" />
          </Link>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {articles.map((article) => {
            const category = RESOURCE_CATEGORY_MAP[article.category]
            return (
              <Link
                key={article.slug}
                href={`/resources/${article.slug}`}
                className="group flex h-full flex-col rounded-2xl border border-[#E2E8F0] bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:shadow-[0_10px_28px_rgba(15,23,42,0.06)]"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold",
                      RESOURCE_CATEGORY_BADGE_CLASS[article.category]
                    )}
                  >
                    {category.label}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#64748B]">
                    <Clock className="size-3" />
                    {article.readingMinutes}분
                  </span>
                </div>
                <h3 className="mt-4 text-[15px] font-bold leading-snug text-[#0F172A] group-hover:text-primary">
                  {article.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-[#64748B]">
                  {article.excerpt}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary">
                  자세히 보기
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
