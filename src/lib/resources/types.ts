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
  slug: string
  title: string
  description: string
  category: ResourceCategoryId
  publishedAt: string
  calculatorHref: string
  relatedSlugs: string[]
  sections: ResourceSection[]
}

export interface ResourceArticleMeta
  extends Pick<
    ResourceArticle,
    | "slug"
    | "title"
    | "description"
    | "category"
    | "publishedAt"
    | "calculatorHref"
    | "relatedSlugs"
  > {
  readingMinutes: number
}
