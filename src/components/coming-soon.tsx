import { Construction } from "lucide-react"

interface ComingSoonProps {
  message?: string
}

export function ComingSoon({
  message = "이 기능은 곧 제공될 예정입니다.",
}: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-20 text-center">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <Construction className="size-7" />
      </div>
      <p className="mt-5 text-base text-muted-foreground">{message}</p>
    </div>
  )
}
