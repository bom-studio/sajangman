import type { Metadata } from "next"

import { MypagePageHeader } from "@/components/auth/mypage-page-header"
import { SupplierManager } from "@/components/suppliers/supplier-manager"

export const metadata: Metadata = {
  title: "공급자 관리 | 마이페이지 | 사장만",
  description: "공급자 정보를 등록하고 문서 작성 시 자동으로 입력하세요.",
}

export default function SuppliersPage() {
  return (
    <div>
      <MypagePageHeader
        title="공급자 관리"
        description="등록한 공급자 정보는 견적서·거래명세서·영수증·발주서 작성 시 기본값으로 자동 입력됩니다."
      />
      <SupplierManager />
    </div>
  )
}
