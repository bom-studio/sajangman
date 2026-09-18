import Link from "next/link"
import { ArrowRight, ThumbsUp } from "lucide-react"

import {
  RequestCategoryBadge,
  RequestStatusBadge,
} from "@/components/requests/request-badges"
import { VoteButton } from "@/components/requests/vote-button"
import type { FeatureRequestRow } from "@/lib/supabase/database.types"
import { cn } from "@/lib/utils"

interface RequestCardProps {
  request: FeatureRequestRow
  voted?: boolean
}

export function RequestCard({ request, voted = false }: RequestCardProps) {
  const isCompleted = request.status === "completed"

  return (
    <article
      className={cn(
        "group flex h-full flex-col rounded-[18px] border border-[#E5E7EB] bg-white p-6 transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-[0_10px_30px_rgba(37,99,235,0.08)]"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <RequestCategoryBadge category={request.category} />
        <RequestStatusBadge status={request.status} />
      </div>

      <h3 className="mt-4 text-lg font-bold leading-snug tracking-tight text-foreground">
        <Link
          href={`/requests/${request.id}`}
          className="transition-colors hover:text-primary"
        >
          {request.title}
        </Link>
      </h3>

      <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-muted-foreground">
        {request.content}
      </p>

      {isCompleted ? (
        <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3">
          <p className="text-sm font-medium text-emerald-800">
            요청해주신 기능이 추가되었습니다!
          </p>
          {request.result_url ? (
            <Link
              href={request.result_url}
              className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 hover:underline"
            >
              기능 사용하기
              <ArrowRight className="size-3.5" />
            </Link>
          ) : null}
        </div>
      ) : null}

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <VoteButton
          requestId={request.id}
          initialCount={request.vote_count}
          initialVoted={voted}
          variant="card"
        />
        <Link
          href={`/requests/${request.id}`}
          className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors group-hover:text-primary"
        >
          자세히 보기
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </article>
  )
}

/** Compact vote display for SSR list when client vote not yet hydrated - unused helper */
export function VoteCountDisplay({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
      <ThumbsUp className="size-4" />
      {count}
    </span>
  )
}
