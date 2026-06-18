import type { Metadata } from "next"
import Link from "next/link"

import { MypagePageHeader } from "@/components/auth/mypage-page-header"
import { DOCUMENT_MANAGEMENT_HREF } from "@/lib/site-nav"

export const metadata: Metadata = {
  title: "이용 안내 | 마이페이지 | 사장만",
  description: "사장만 마이페이지 이용 방법을 안내합니다.",
}

const GUIDE_ITEMS = [
  {
    title: "공급자 정보 등록",
    description:
      "공급자 관리 메뉴에서 상호명, 사업자번호, 연락처를 등록하면 견적서·거래명세서·영수증·발주서 작성 시 자동으로 입력됩니다.",
    href: "/mypage/suppliers",
  },
  {
    title: "문서 작성기 이용",
    description:
      "계산기와 문서 작성기는 회원가입 없이도 이용할 수 있습니다. 로그인 시 공급자 정보가 자동으로 채워집니다.",
    href: "/documents",
  },
  {
    title: "문서 저장 기능",
    description:
      "작성한 문서를 클라우드에 저장하고 불러오는 기능은 준비 중입니다. 헤더의 문서관리 메뉴에서 곧 이용하실 수 있습니다.",
    href: DOCUMENT_MANAGEMENT_HREF,
  },
] as const

export default function GuidePage() {
  return (
    <div>
      <MypagePageHeader
        title="이용 안내"
        description="사장만 마이페이지 주요 기능과 이용 방법을 안내합니다."
      />

      <div className="space-y-4">
        {GUIDE_ITEMS.map((item) => (
          <div
            key={item.title}
            className="rounded-xl border border-border/60 bg-slate-50/60 p-5"
          >
            <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            <Link
              href={item.href}
              className="mt-3 inline-block text-sm font-medium text-primary hover:underline"
            >
              바로가기 →
            </Link>
          </div>
        ))}
      </div>
    </div>
  )
}
