import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

import { RequestForm } from "@/components/requests/request-form"
import { SiteLayout } from "@/components/site-layout"
import { SITE_NAME } from "@/lib/site-config"

export const metadata: Metadata = {
  title: `기능 요청하기 | ${SITE_NAME}`,
  description: "사장만에 필요한 기능을 요청해보세요.",
  robots: { index: false, follow: true },
}

export default function NewRequestPage() {
  return (
    <SiteLayout>
      <div className="border-b border-border/60 bg-[#F5F8FF]">
        <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
          <Link
            href="/requests"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="size-4" />
            요청 목록
          </Link>
          <h1 className="mt-4 text-3xl font-black tracking-tight text-foreground sm:text-4xl">
            어떤 기능이 필요하세요?
          </h1>
          <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
            사장만에 있었으면 하는 기능을 편하게 알려주세요.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-2xl border border-border/70 bg-white p-6 shadow-sm sm:p-8">
          <RequestForm />
        </div>
      </div>
    </SiteLayout>
  )
}
