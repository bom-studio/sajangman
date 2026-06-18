import { MypageShell } from "@/components/auth/mypage-shell"

export default function MypageAccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MypageShell>{children}</MypageShell>
}
