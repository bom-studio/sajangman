export type ResourceCategoryId =
  | "tax"
  | "labor"
  | "delivery"
  | "startup"
  | "sales"

export interface ResourceCategory {
  id: ResourceCategoryId
  label: string
}

export interface ResourceSection {
  id: string
  title: string
  paragraphs: string[]
}

export interface ResourceArticle {
  id: string
  slug: string
  title: string
  excerpt: string
  description: string
  category: ResourceCategoryId
  readTime: number
  featured: boolean
  publishedAt: string
  calculatorHref: string
  relatedSlugs: string[]
  sections: ResourceSection[]
}

export interface ResourceArticleMeta {
  id: string
  slug: string
  title: string
  excerpt: string
  description: string
  category: ResourceCategoryId
  readTime: number
  readingMinutes: number
  featured: boolean
  publishedAt: string
  calculatorHref: string
  relatedSlugs: string[]
}
