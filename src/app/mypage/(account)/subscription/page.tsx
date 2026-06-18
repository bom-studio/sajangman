import type { Metadata } from "next"

import { MypagePageHeader } from "@/components/auth/mypage-page-header"
import { ComingSoon } from "@/components/coming-soon"

export const metadata: Metadata = {
  title: "구독 관리 | 마이페이지 | 사장만",
  description: "사장만 구독 및 결제 정보를 관리하세요.",
}

export default function SubscriptionPage() {
  return (
    <div>
      <MypagePageHeader
        title="구독 관리"
        description="유료 구독 및 결제 정보를 확인하고 관리할 수 있습니다."
      />
      <ComingSoon message="구독 관리 기능은 곧 제공될 예정입니다." />
    </div>
  )
}
