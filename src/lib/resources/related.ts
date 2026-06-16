import { getAiToolById } from "@/data/ai/tools"
import { getCalculatorByHref } from "@/data/calculators"
import { getResourceArticleBySlug } from "@/data/resources"
import {
  RESOURCE_RELATED_MAPPINGS,
  type ResourceRelatedMapping,
} from "@/data/resources/related-mappings"
import type { AiTool } from "@/lib/ai/types"
import type { CalculatorListItem } from "@/data/calculators"
import type { ResourceArticleMeta } from "@/lib/resources/types"
import { AI_FEATURES_ENABLED } from "@/lib/features"
import { toArticleMeta } from "@/lib/resources/utils"

export function getResourceRelatedMapping(
  slug: string
): ResourceRelatedMapping | undefined {
  return RESOURCE_RELATED_MAPPINGS[slug]
}

export function getMappedRelatedCalculators(
  slug: string
): CalculatorListItem[] {
  const mapping = getResourceRelatedMapping(slug)
  if (!mapping) return []

  return mapping.calculatorHrefs
    .map((href) => getCalculatorByHref(href))
    .filter((item): item is CalculatorListItem => Boolean(item))
}

export function getMappedRelatedResources(
  slug: string
): ResourceArticleMeta[] {
  const mapping = getResourceRelatedMapping(slug)
  if (!mapping) return []

  return mapping.resourceSlugs
    .map((relatedSlug) => getResourceArticleBySlug(relatedSlug))
    .filter((item): item is NonNullable<typeof item> => Boolean(item))
    .map(toArticleMeta)
}

export function getMappedRelatedAiTools(slug: string): AiTool[] {
  if (!AI_FEATURES_ENABLED) return []

  const mapping = getResourceRelatedMapping(slug)
  if (!mapping) return []

  return mapping.aiToolIds
    .map((id) => getAiToolById(id))
    .filter((item): item is AiTool => Boolean(item))
}
