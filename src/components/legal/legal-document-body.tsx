import type { LegalSection } from "@/lib/legal/types"

interface LegalDocumentBodyProps {
  sections: LegalSection[]
}

export function LegalDocumentBody({ sections }: LegalDocumentBodyProps) {
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
                key={`${section.id}-p-${index}`}
                className="text-base leading-8 text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
            {section.listItems && section.listItems.length > 0 ? (
              <ul className="list-disc space-y-2 pl-5 text-base leading-8 text-muted-foreground">
                {section.listItems.map((item, index) => (
                  <li key={`${section.id}-li-${index}`}>{item}</li>
                ))}
              </ul>
            ) : null}
          </div>
        </section>
      ))}
    </article>
  )
}
