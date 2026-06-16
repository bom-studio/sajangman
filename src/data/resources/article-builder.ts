import type {
  ResourceArticle,
  ResourceCategoryId,
} from "@/lib/resources/types"

interface BuildResourceArticleInput {
  id: string
  slug: string
  title: string
  excerpt: string
  category: ResourceCategoryId
  readTime: number
  featured: boolean
  publishedAt: string
  calculatorHref: string
  relatedSlugs: string[]
  sections: Array<{ title: string; paragraphs: string[] }>
}

export function buildResourceArticle(
  input: BuildResourceArticleInput
): ResourceArticle {
  return {
    id: input.id,
    slug: input.slug,
    title: input.title,
    excerpt: input.excerpt,
    description: input.excerpt,
    category: input.category,
    readTime: input.readTime,
    featured: input.featured,
    publishedAt: input.publishedAt,
    calculatorHref: input.calculatorHref,
    relatedSlugs: input.relatedSlugs,
    sections: input.sections.map((section, index) => ({
      id: `${input.slug}-section-${index + 1}`,
      title: section.title,
      paragraphs: section.paragraphs,
    })),
  }
}
