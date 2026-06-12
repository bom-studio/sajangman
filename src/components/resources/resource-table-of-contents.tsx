import type { ResourceSection } from "@/lib/resources/types"
import { cn } from "@/lib/utils"

interface ResourceTableOfContentsProps {
  sections: ResourceSection[]
  className?: string
}

export function ResourceTableOfContents({
  sections,
  className,
}: ResourceTableOfContentsProps) {
  if (sections.length === 0) return null

  return (
    <nav
      aria-label="목차"
      className={cn(
        "rounded-xl border border-border bg-muted/30 p-5 sm:p-6",
        className
      )}
    >
      <h2 className="text-sm font-semibold tracking-wide text-foreground uppercase">
        목차
      </h2>
      <ol className="mt-4 space-y-2">
        {sections.map((section, index) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className="flex gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              <span className="font-medium text-foreground/70">
                {index + 1}.
              </span>
              <span>{section.title}</span>
            </a>
          </li>
        ))}
      </ol>
    </nav>
  )
}
