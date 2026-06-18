import { DocumentsShell } from "@/components/documents/documents-shell"

export default function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DocumentsShell>{children}</DocumentsShell>
}
