import type { Metadata } from "next"

import { MypagePageHeader } from "@/components/auth/mypage-page-header"
import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = {
  title: "저장된 영수증 | 마이페이지 | 사장만",
  description: "저장된 영수증을 확인하고 관리하세요.",
}

export default function SavedReceiptsPage() {
  return (
    <div>
      <MypagePageHeader
        title="저장된 영수증"
        description="클라우드에 저장한 영수증을 불러오고 관리할 수 있습니다."
      />
      <ComingSoon message="저장된 영수증 기능은 곧 제공될 예정입니다." />
    </div>
  )
}
