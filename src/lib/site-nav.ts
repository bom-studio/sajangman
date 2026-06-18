export interface SiteNavItem {
  label: string
  href: string
  isActive: (pathname: string) => boolean
}

export const DOCUMENT_MANAGEMENT_HREF = "/mypage/documents/estimates"

const allNavItems: SiteNavItem[] = [
  {
    label: "홈",
    href: "/",
    isActive: (pathname) => pathname === "/",
  },
  {
    label: "계산기",
    href: "/calculators",
    isActive: (pathname) =>
      pathname === "/calculators" || pathname.startsWith("/calculators/"),
  },
  {
    label: "문서작성",
    href: "/documents",
    isActive: (pathname) =>
      pathname === "/documents" || pathname.startsWith("/documents/"),
  },
  {
    label: "문서관리",
    href: DOCUMENT_MANAGEMENT_HREF,
    isActive: (pathname) => pathname.startsWith("/mypage/documents"),
  },
  {
    label: "자료실",
    href: "/resources",
    isActive: (pathname) =>
      pathname === "/resources" || pathname.startsWith("/resources/"),
  },
  {
    label: "AI 생성기",
    href: "/ai",
    isActive: (pathname) => pathname === "/ai" || pathname.startsWith("/ai/"),
  },
]

export function getSiteNavItems(aiEnabled: boolean): SiteNavItem[] {
  return aiEnabled
    ? allNavItems
    : allNavItems.filter((item) => item.href !== "/ai")
}

export function isMypageAccountPath(pathname: string): boolean {
  if (!pathname.startsWith("/mypage")) return false
  if (pathname.startsWith("/mypage/documents")) return false
  return true
}
