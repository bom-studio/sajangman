import type { Metadata } from "next"

import { StatementGenerator } from "@/components/statement/statement-generator"
import { PageHeader } from "@/components/page-header"
import { SiteLayout } from "@/components/site-layout"

export const metadata: Metadata = {
  title: "거래명세서 생성기 | 무료 PDF 작성 | 사장만",
  description:
    "거래처와 품목 내역을 입력해 거래명세서를 작성하고 PDF로 저장하세요. 업무 참고용 문서를 빠르게 만들 수 있습니다.",
  alternates: { canonical: "/documents/statement" },
  openGraph: {
    title: "거래명세서 생성기 | 사장만",
    description:
      "거래처·품목을 입력해 거래명세서를 만들고 PDF로 다운로드하세요.",
    url: "/documents/statement",
    type: "website",
  },
}

export default function StatementPage() {
  return (
    <SiteLayout>
      <PageHeader
        title="무료 거래명세서 생성기"
        description="거래처와 품목 정보를 입력하고 회사 직인을 넣어 거래명세서를 PDF로 다운로드하세요."
      />
      <StatementGenerator />
    </SiteLayout>
  )
}
