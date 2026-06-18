import { MypageMobileNav } from "@/components/auth/mypage-mobile-nav"
import { MypageSidebar } from "@/components/auth/mypage-sidebar"

interface MypageShellProps {
  children: React.ReactNode
}

export function MypageShell({ children }: MypageShellProps) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <MypageSidebar />
        </div>
      </aside>

      <MypageMobileNav />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
