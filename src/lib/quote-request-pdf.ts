import { getTodayKST } from "@/lib/date-kst"
import { downloadDocumentPdf } from "@/lib/estimate-pdf"
import { sanitizeFilenamePart } from "@/lib/quote-request"

export const QUOTE_REQUEST_DOCUMENT_ID = "quote-request-document"

export function getQuoteRequestPdfFilename(
  targetCompanyName: string,
  writtenDate: string
): string {
  const safeDate = (writtenDate || getTodayKST()).replace(/-/g, "")
  const safeTarget = sanitizeFilenamePart(targetCompanyName)

  return `견적요청서_${safeTarget}_${safeDate}.pdf`
}

export function getQuoteRequestDocumentElement(): HTMLElement | null {
  const element = document.getElementById(QUOTE_REQUEST_DOCUMENT_ID)
  return element instanceof HTMLElement ? element : null
}

export async function downloadQuoteRequestPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  return downloadDocumentPdf(element, filename, QUOTE_REQUEST_DOCUMENT_ID)
}
