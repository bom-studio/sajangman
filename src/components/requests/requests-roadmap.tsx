import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { RequestCategoryBadge } from "@/components/requests/request-badges"
import type { FeatureRequestRow } from "@/lib/supabase/database.types"

interface RequestsRoadmapProps {
  planned: FeatureRequestRow[]
  developing: FeatureRequestRow[]
  completed: FeatureRequestRow[]
}

function RoadmapColumn({
  title,
  items,
  emptyLabel,
  showLink,
}: {
  title: string
  items: FeatureRequestRow[]
  emptyLabel: string
  showLink?: boolean
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-white p-5">
      <h3 className="text-base font-bold text-foreground">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.length === 0 ? (
          <li className="rounded-xl bg-slate-50 px-4 py-5 text-sm text-muted-foreground">
            {emptyLabel}
          </li>
        ) : (
          items.map((item) => (
            <li
              key={item.id}
              className="rounded-xl border border-border/60 px-4 py-3 transition-colors hover:border-primary/30"
            >
              <div className="mb-2">
                <RequestCategoryBadge category={item.category} />
              </div>
              <Link
                href={`/requests/${item.id}`}
                className="text-sm font-semibold leading-snug text-foreground hover:text-primary"
              >
                {item.title}
              </Link>
              {showLink && item.result_url ? (
                <Link
                  href={item.result_url}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-primary"
                >
                  바로가기
                  <ArrowRight className="size-3" />
                </Link>
              ) : null}
            </li>
          ))
        )}
      </ul>
    </div>
  )
}

export function RequestsRoadmap({
  planned,
  developing,
  completed,
}: RequestsRoadmapProps) {
  return (
    <section id="roadmap" className="scroll-mt-24">
      <div className="mb-6 max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          사장만 개발 로드맵
        </h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          사장님들의 요청을 검토해 필요한 기능을 순차적으로 추가하고 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <RoadmapColumn
          title="개발예정"
          items={planned}
          emptyLabel="아직 개발예정 항목이 없습니다."
        />
        <RoadmapColumn
          title="개발중"
          items={developing}
          emptyLabel="현재 개발 중인 항목이 없습니다."
        />
        <RoadmapColumn
          title="최근 반영"
          items={completed}
          emptyLabel="최근 반영된 기능이 없습니다."
          showLink
        />
      </div>
    </section>
  )
}
