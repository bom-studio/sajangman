import Link from "next/link"

import { SiteLayout } from "@/components/site-layout"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <SiteLayout>
      <div className="mx-auto flex max-w-lg flex-col items-center px-4 py-24 text-center sm:px-6 lg:px-8">
        <p className="text-sm font-medium text-primary">404</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="mt-4 text-base leading-relaxed text-muted-foreground">
          주소가 바뀌었거나 삭제된 페이지일 수 있습니다. 아래 메뉴에서 필요한
          도구로 이동해 보세요.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild>
            <Link href="/">홈으로</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/calculators">계산기</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/documents">문서작성</Link>
          </Button>
        </div>
      </div>
    </SiteLayout>
  )
}
