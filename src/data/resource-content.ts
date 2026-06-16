import { RESOURCE_CONTENT_BATCH_1 } from "./resource-content/batch-1"
import { RESOURCE_CONTENT_BATCH_2 } from "./resource-content/batch-2"
import { RESOURCE_CONTENT_BATCH_3 } from "./resource-content/batch-3"
import { parseResourceMarkdown } from "@/lib/resources/markdown"
import type { ResourceSection } from "@/lib/resources/types"

export interface ResourceContentEntry {
  slug: string
  content: string
}

export const RESOURCE_CONTENT: ResourceContentEntry[] = [
  ...RESOURCE_CONTENT_BATCH_1,
  ...RESOURCE_CONTENT_BATCH_2,
  ...RESOURCE_CONTENT_BATCH_3,
]

export const RESOURCE_CONTENT_MAP: Record<string, string> = Object.fromEntries(
  RESOURCE_CONTENT.map((entry) => [entry.slug, entry.content])
)

export function getResourceContentBySlug(slug: string): string | undefined {
  return RESOURCE_CONTENT_MAP[slug]
}

export function getResourceSectionsFromContent(
  slug: string
): ResourceSection[] | undefined {
  const content = getResourceContentBySlug(slug)
  if (!content) return undefined

  return parseResourceMarkdown(content)
}
