import { cn } from "@/lib/utils"

interface HomeSectionHeaderProps {
  title: string
  description?: string
  align?: "left" | "center"
  className?: string
}

export function HomeSectionHeader({
  title,
  description,
  align = "left",
  className,
}: HomeSectionHeaderProps) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  )
}
