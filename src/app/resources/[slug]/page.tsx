import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Calendar, ChevronLeft, Clock } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { ResourceArticleBody } from "@/components/resources/resource-article-body"
import { ResourceArticleSchemas } from "@/components/resources/resource-article-schemas"
import { ResourceDetailRelatedSections } from "@/components/resources/resource-detail-related-sections"
import { ResourceTableOfContents } from "@/components/resources/resource-table-of-contents"
import { SiteLayout } from "@/components/site-layout"
import {
  RESOURCE_CATEGORY_BADGE_CLASS,
  RESOURCE_CATEGORY_MAP,
} from "@/data/resources/categories"
import {
  getAllResourceArticles,
  getResourceArticleBySlug,
} from "@/data/resources"
import { getResourceSectionsFromContent } from "@/data/resource-content"
import {
  getMappedRelatedAiTools,
  getMappedRelatedCalculators,
  getMappedRelatedResources,
} from "@/lib/resources/related"
import { buildResourceArticleMetadata } from "@/lib/resources/metadata"
import { cn } from "@/lib/utils"

interface ResourceDetailPageProps {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllResourceArticles().map((article) => ({
    slug: article.slug,
  }))
}

export async function generateMetadata({
  params,
}: ResourceDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = getResourceArticleBySlug(slug)

  if (!article) {
    return {
      title: "자료를 찾을 수 없습니다",
    }
  }

  return buildResourceArticleMetadata(article)
}

function formatPublishedDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default async function ResourceDetailPage({
  params,
}: ResourceDetailPageProps) {
  const { slug } = await params
  const article = getResourceArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const category = RESOURCE_CATEGORY_MAP[article.category]
  const readingMinutes = article.readTime
  const sections =
    getResourceSectionsFromContent(slug) ?? article.sections
  const relatedCalculators = getMappedRelatedCalculators(slug)
  const relatedResources = getMappedRelatedResources(slug)
  const relatedAiTools = getMappedRelatedAiTools(slug)

  return (
    <SiteLayout>
      <ResourceArticleSchemas article={article} />
      <PageHeader
        title={article.title}
        description={article.description}
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/resources"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="size-4" />
          자료실 목록
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span
            className={cn(
              "inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium",
              RESOURCE_CATEGORY_BADGE_CLASS[article.category]
            )}
          >
            {category.label}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-4" />
            {formatPublishedDate(article.publishedAt)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" />
            예상 읽기 {readingMinutes}분
          </span>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_240px]">
          <div className="min-w-0 space-y-10">
            <ResourceArticleBody sections={sections} />
          </div>
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <ResourceTableOfContents sections={sections} />
          </aside>
        </div>

        <div className="mt-16">
          <ResourceDetailRelatedSections
            calculators={relatedCalculators}
            resources={relatedResources}
            aiTools={relatedAiTools}
          />
        </div>
      </div>
    </SiteLayout>
  )
}
