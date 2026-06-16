import Link from "next/link"

const legalLinks = [
  { label: "개인정보처리방침", href: "/privacy" },
  { label: "이용약관", href: "/terms" },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-white py-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
          {legalLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} 사장만. 사장님의 업무를 더 쉽게.
        </p>
      </div>
    </footer>
  )
}
