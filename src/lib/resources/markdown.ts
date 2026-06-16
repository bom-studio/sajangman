import type { ResourceSection } from "@/lib/resources/types"

const HEADING_PATTERN = /^# (.+)$/m

export function parseResourceMarkdown(content: string): ResourceSection[] {
  const chunks = content.split(HEADING_PATTERN).filter((chunk) => chunk.trim())

  const sections: ResourceSection[] = []

  for (let index = 0; index < chunks.length; index += 2) {
    const title = chunks[index]?.trim()
    const body = chunks[index + 1]?.trim()

    if (!title || !body) continue

    sections.push({
      id: slugifyHeading(title),
      title,
      paragraphs: splitParagraphs(body),
    })
  }

  return sections
}

function slugifyHeading(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w가-힣\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

function splitParagraphs(body: string): string[] {
  return body
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block) =>
      block
        .split("\n")
        .map((line) => line.trim())
        .join("\n")
    )
}

export function renderInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
}
