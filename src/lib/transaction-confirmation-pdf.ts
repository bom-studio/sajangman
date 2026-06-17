import { getTodayKST } from "@/lib/date-kst"
import { downloadDocumentPdf } from "@/lib/estimate-pdf"
import { sanitizeFilenamePart } from "@/lib/transaction-confirmation"

export const TRANSACTION_CONFIRMATION_DOCUMENT_ID =
  "transaction-confirmation-document"

export function getTransactionConfirmationPdfFilename(
  recipientName: string,
  writtenDate: string
): string {
  const safeDate = (writtenDate || getTodayKST()).replace(/-/g, "")
  const safeRecipient = sanitizeFilenamePart(recipientName)

  return `거래확인서_${safeRecipient}_${safeDate}.pdf`
}

export function getTransactionConfirmationDocumentElement(): HTMLElement | null {
  const element = document.getElementById(TRANSACTION_CONFIRMATION_DOCUMENT_ID)
  return element instanceof HTMLElement ? element : null
}

export async function downloadTransactionConfirmationPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  return downloadDocumentPdf(
    element,
    filename,
    TRANSACTION_CONFIRMATION_DOCUMENT_ID
  )
}
