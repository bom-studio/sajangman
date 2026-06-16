import type { ResourceSection } from "@/lib/resources/types"
import { renderInlineMarkdown } from "@/lib/resources/markdown"

interface ResourceArticleBodyProps {
  sections: ResourceSection[]
}

function renderParagraph(paragraph: string) {
  const lines = paragraph.split("\n")

  return (
    <div className="space-y-3">
      {lines.map((line, index) => (
        <p
          key={index}
          className="text-base leading-8 text-muted-foreground"
          dangerouslySetInnerHTML={{ __html: renderInlineMarkdown(line) }}
        />
      ))}
    </div>
  )
}

export function ResourceArticleBody({ sections }: ResourceArticleBodyProps) {
  return (
    <article className="space-y-12">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            {section.title}
          </h2>
          <div className="mt-4 space-y-4">
            {section.paragraphs.map((paragraph, index) => (
              <div key={`${section.id}-${index}`}>{renderParagraph(paragraph)}</div>
            ))}
          </div>
        </section>
      ))}
    </article>
  )
}
