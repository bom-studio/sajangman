import { getTodayKST } from "@/lib/date-kst"
import { downloadDocumentPdf } from "@/lib/estimate-pdf"

export const PURCHASE_ORDER_DOCUMENT_ID = "purchase-order-document"

export function getPurchaseOrderPdfFilename(
  orderNumber: string,
  issueDate: string
): string {
  const safeDate = (issueDate || getTodayKST()).replace(/-/g, "")
  const safeNumber = orderNumber.trim().replace(/[/\\?%*:|"<>]/g, "-")

  if (safeNumber) {
    return `발주서_${safeNumber}_${safeDate}.pdf`
  }
  return `발주서_${safeDate}.pdf`
}

export function getPurchaseOrderDocumentElement(): HTMLElement | null {
  const element = document.getElementById(PURCHASE_ORDER_DOCUMENT_ID)
  return element instanceof HTMLElement ? element : null
}

export async function downloadPurchaseOrderPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  return downloadDocumentPdf(element, filename, PURCHASE_ORDER_DOCUMENT_ID)
}
