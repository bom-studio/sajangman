import { DocumentsMobileNav } from "@/components/documents/documents-mobile-nav"
import { DocumentsSidebar } from "@/components/documents/documents-sidebar"

interface DocumentsShellProps {
  children: React.ReactNode
}

export function DocumentsShell({ children }: DocumentsShellProps) {
  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:gap-12">
      <aside className="hidden w-56 shrink-0 lg:block">
        <div className="sticky top-24">
          <DocumentsSidebar />
        </div>
      </aside>

      <DocumentsMobileNav />

      <div className="min-w-0 flex-1">{children}</div>
    </div>
  )
}
