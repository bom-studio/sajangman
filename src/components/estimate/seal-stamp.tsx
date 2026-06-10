import { cn } from "@/lib/utils"

interface SealStampProps {
  sealUrl: string | null
  className?: string
}

export function SealStamp({ sealUrl, className }: SealStampProps) {
  return (
    <div
      className={cn(
        "flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-slate-300 bg-white",
        className
      )}
    >
      {sealUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={sealUrl}
          alt="회사 직인"
          className="max-h-full max-w-full object-contain p-1.5"
        />
      ) : (
        <span className="text-sm font-medium text-slate-400">직인</span>
      )}
    </div>
  )
}
