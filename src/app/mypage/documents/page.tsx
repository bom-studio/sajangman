import { redirect } from "next/navigation"

import { DOCUMENT_MANAGEMENT_HREF } from "@/lib/site-nav"

export default function DocumentsIndexPage() {
  redirect(DOCUMENT_MANAGEMENT_HREF)
}
