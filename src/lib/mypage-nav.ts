export interface MypageNavItem {
  label: string
  href: string
}

export interface MypageNavSection {
  title: string
  items: MypageNavItem[]
}

export const MYPAGE_NAV_SECTIONS: MypageNavSection[] = [
  {
    title: "계정 관리",
    items: [
      { label: "내 정보", href: "/mypage" },
      { label: "공급자 관리", href: "/mypage/suppliers" },
    ],
  },
  {
    title: "서비스",
    items: [
      { label: "구독 관리", href: "/mypage/subscription" },
      { label: "이용 안내", href: "/mypage/guide" },
    ],
  },
]

export const MYPAGE_NAV_ITEMS = MYPAGE_NAV_SECTIONS.flatMap(
  (section) => section.items
)

export function isMypageNavActive(pathname: string, href: string): boolean {
  if (href === "/mypage") {
    return pathname === "/mypage"
  }

  return pathname === href || pathname.startsWith(`${href}/`)
}

export function getMypageNavLabel(pathname: string): string {
  const matched = MYPAGE_NAV_ITEMS.find((item) =>
    isMypageNavActive(pathname, item.href)
  )
  return matched?.label ?? "마이페이지"
}
