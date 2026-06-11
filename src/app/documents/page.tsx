import type { Metadata } from "next"
import { FileText, Receipt } from "lucide-react"

import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"
import { ToolLinkCard } from "@/components/tool-link-card"

export const metadata: Metadata = {
  title: "문서작성 | 사장만",
  description: "견적서, 거래명세서 등 사장님 업무에 필요한 문서를 무료로 작성하세요.",
}

const documents = [
  {
    title: "무료 견적서 생성기",
    description:
      "거래처와 품목을 입력하면 견적서를 PDF로 만들 수 있습니다.",
    href: "/documents/estimate",
    icon: FileText,
  },
  {
    title: "무료 거래명세서 생성기",
    description: "공급자와 품목 정보를 입력해 거래명세서를 작성합니다.",
    href: "/documents/statement",
    icon: Receipt,
  },
]

export default function DocumentsPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="문서작성"
        description="견적서, 거래명세서 등 사장님 업무에 필요한 문서를 빠르게 작성하세요."
      />
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {documents.map((item) => (
            <ToolLinkCard key={item.href} {...item} />
          ))}
        </div>
      </div>
    </SiteLayout>
  )
}
