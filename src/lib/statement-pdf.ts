import { getTodayKST } from "@/lib/date-kst"
import { downloadDocumentPdf } from "@/lib/estimate-pdf"

export const STATEMENT_DOCUMENT_ID = "statement-document"

export function getStatementPdfFilename(
  transactionNumber: string,
  issueDate: string
): string {
  const safeDate = issueDate || getTodayKST()
  const safeNumber = transactionNumber
    .trim()
    .replace(/[/\\?%*:|"<>]/g, "-")

  if (safeNumber) {
    return `거래명세서_${safeNumber}_${safeDate}.pdf`
  }
  return `거래명세서_${safeDate}.pdf`
}

export function getStatementDocumentElement(): HTMLElement | null {
  const element = document.getElementById(STATEMENT_DOCUMENT_ID)
  return element instanceof HTMLElement ? element : null
}

export async function downloadStatementPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  return downloadDocumentPdf(element, filename, STATEMENT_DOCUMENT_ID)
}
