import type { Metadata } from "next"

import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { ToolLinkCard } from "@/components/tool-link-card"
import { DOCUMENTS } from "@/data/documents"

export const metadata: Metadata = {
  title: "문서작성 | 견적서·거래명세서·영수증 PDF | 사장만",
  description:
    "견적서, 거래명세서, 발주서, 영수증 등 사장님 업무 문서를 작성하고 PDF로 저장하세요.",
  alternates: { canonical: "/documents" },
  openGraph: {
    title: "문서작성 | 사장만",
    description:
      "견적서, 거래명세서, 발주서, 영수증 등 업무 문서를 무료로 작성하세요.",
    url: "/documents",
    type: "website",
  },
}

export default function DocumentsPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="문서작성"
        description="견적서, 거래명세서 등 사장님 업무에 필요한 문서를 빠르게 작성하세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {DOCUMENTS.map((item) => (
            <ToolLinkCard
              key={item.href}
              title={item.title}
              description={item.description}
              href={item.href}
              icon={item.icon}
            />
          ))}
        </div>
      </div>
    </SiteLayout>
  )
}
