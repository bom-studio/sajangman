import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, ChevronLeft } from "lucide-react"

import { LegalDocumentBody } from "@/components/legal/legal-document-body"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { TERMS_EFFECTIVE_DATE, TERMS_SECTIONS } from "@/data/legal/terms"

export const metadata: Metadata = {
  title: "사장만 이용약관",
  description: "사장만 서비스 이용약관 안내",
}

function formatEffectiveDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function TermsPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="이용약관"
        description="사장만 서비스 이용과 관련한 권리·의무 및 책임 사항을 안내합니다."
      />
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ChevronLeft className="size-4" />
          홈으로
        </Link>

        <div className="mt-6 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <Calendar className="size-4" />
            시행일 {formatEffectiveDate(TERMS_EFFECTIVE_DATE)}
          </span>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <LegalDocumentBody sections={TERMS_SECTIONS} />
        </div>
      </div>
    </SiteLayout>
  )
}
