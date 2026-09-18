import type { Metadata } from "next"
import Link from "next/link"
import { Calendar, ChevronLeft } from "lucide-react"

import { LegalDocumentBody } from "@/components/legal/legal-document-body"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { PRIVACY_EFFECTIVE_DATE, PRIVACY_SECTIONS } from "@/data/legal/privacy"

export const metadata: Metadata = {
  title: "사장만 개인정보처리방침",
  description:
    "사장만의 개인정보 처리 기준, 쿠키·Analytics·AdSense 이용 안내와 문의 방법을 안내합니다.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "사장만 개인정보처리방침",
    description:
      "개인정보 처리 기준과 쿠키·광고 관련 안내입니다.",
    url: "/privacy",
    type: "website",
  },
}

function formatEffectiveDate(date: string): string {
  const [year, month, day] = date.split("-").map(Number)
  return new Date(year, month - 1, day).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function PrivacyPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="개인정보처리방침"
        description="사장만 서비스의 개인정보 처리 기준과 이용자 권리에 관한 안내입니다."
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
            시행일 {formatEffectiveDate(PRIVACY_EFFECTIVE_DATE)}
          </span>
        </div>

        <div className="mx-auto mt-10 max-w-3xl">
          <LegalDocumentBody sections={PRIVACY_SECTIONS} />
        </div>
      </div>
    </SiteLayout>
  )
}
