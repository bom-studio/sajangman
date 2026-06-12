import type { ResourceSection } from "@/lib/resources/types"

interface ResourceArticleBodyProps {
  sections: ResourceSection[]
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
              <p
                key={`${section.id}-${index}`}
                className="text-base leading-8 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </section>
      ))}
    </article>
  )
}
