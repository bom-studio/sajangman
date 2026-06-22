import { DocumentManagementLoginPrompt } from "@/components/documents/document-management-login-prompt"
import { DocumentsShell } from "@/components/documents/documents-shell"
import { createClient } from "@/lib/supabase/server"

export default async function DocumentsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return <DocumentManagementLoginPrompt />
  }

  return <DocumentsShell>{children}</DocumentsShell>
}
