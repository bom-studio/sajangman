"use client"

import { useEffect, useState, useTransition } from "react"
import { ThumbsUp } from "lucide-react"

import {
  hasVisitorVotedAction,
  toggleFeatureRequestVoteAction,
} from "@/lib/requests/actions"
import { getVisitorId } from "@/lib/requests/visitor"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface VoteButtonProps {
  requestId: string
  initialCount: number
  initialVoted?: boolean
  variant?: "card" | "detail"
  className?: string
}

export function VoteButton({
  requestId,
  initialCount,
  initialVoted = false,
  variant = "card",
  className,
}: VoteButtonProps) {
  const [count, setCount] = useState(initialCount)
  const [voted, setVoted] = useState(initialVoted)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  useEffect(() => {
    const visitorId = getVisitorId()
    if (!visitorId) return

    let cancelled = false
    hasVisitorVotedAction(requestId, visitorId).then((result) => {
      if (!cancelled) setVoted(result)
    })

    return () => {
      cancelled = true
    }
  }, [requestId])

  function handleToggle() {
    setError(null)
    const visitorId = getVisitorId()
    if (!visitorId) {
      setError("브라우저 저장소를 사용할 수 없습니다.")
      return
    }

    startTransition(async () => {
      const result = await toggleFeatureRequestVoteAction(requestId, visitorId)
      if (!result.ok) {
        setError(result.error)
        return
      }
      setVoted(result.voted)
      setCount(result.voteCount)
    })
  }

  if (variant === "card") {
    return (
      <button
        type="button"
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          handleToggle()
        }}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-sm font-medium transition-colors",
          voted
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground hover:bg-muted hover:text-foreground",
          className
        )}
        aria-pressed={voted}
      >
        <ThumbsUp className={cn("size-4", voted && "fill-current")} />
        <span>{voted ? "필요해요" : "나도 필요해요"}</span>
        <span className="tabular-nums">{count}</span>
      </button>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <Button
        type="button"
        size="lg"
        onClick={handleToggle}
        disabled={pending}
        variant={voted ? "secondary" : "default"}
        className="h-12 rounded-xl px-6 text-base"
      >
        <ThumbsUp className={cn("size-4", voted && "fill-current")} />
        {voted ? "필요해요 표시됨" : "나도 필요해요"}
        <span className="tabular-nums">{count}</span>
      </Button>
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  )
}
