import { getTodayKST } from "@/lib/date-kst"
import { downloadDocumentPdf } from "@/lib/estimate-pdf"
import { sanitizeFilenamePart } from "@/lib/delivery-note"

export const DELIVERY_NOTE_DOCUMENT_ID = "delivery-note-document"

export function getDeliveryNotePdfFilename(
  recipientName: string,
  deliveryDate: string
): string {
  const safeDate = (deliveryDate || getTodayKST()).replace(/-/g, "")
  const safeRecipient = sanitizeFilenamePart(recipientName)

  return `납품서_${safeRecipient}_${safeDate}.pdf`
}

export function getDeliveryNoteDocumentElement(): HTMLElement | null {
  const element = document.getElementById(DELIVERY_NOTE_DOCUMENT_ID)
  return element instanceof HTMLElement ? element : null
}

export async function downloadDeliveryNotePdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  return downloadDocumentPdf(element, filename, DELIVERY_NOTE_DOCUMENT_ID)
}
