import { getTodayKST } from "@/lib/date-kst"
import { downloadDocumentPdf } from "@/lib/estimate-pdf"
import {
  sanitizeFilenamePart,
  type ReceiptPdfFormat,
} from "@/lib/receipt"

export const RECEIPT_DOCUMENT_ID = "receipt-document"

const A4_WIDTH_MM = 210
const RECEIPT_WIDTH_MM = 80

export function getReceiptPdfFilename(
  recipientName: string,
  issueDate: string
): string {
  const safeDate = (issueDate || getTodayKST()).replace(/-/g, "")
  const safeRecipient = sanitizeFilenamePart(recipientName)

  return `영수증_${safeRecipient}_${safeDate}.pdf`
}

export function getReceiptDocumentElement(): HTMLElement | null {
  const element = document.getElementById(RECEIPT_DOCUMENT_ID)
  return element instanceof HTMLElement ? element : null
}

export async function downloadReceiptPdf(
  element: HTMLElement,
  filename: string,
  format: ReceiptPdfFormat = "a4"
): Promise<void> {
  if (format === "a4") {
    return downloadDocumentPdf(element, filename, RECEIPT_DOCUMENT_ID)
  }

  return downloadReceiptNarrowPdf(element, filename)
}

async function downloadReceiptNarrowPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import("html2canvas"),
    import("jspdf"),
  ])

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: "#ffffff",
    logging: false,
  })

  const imgData = canvas.toDataURL("image/png")
  const imgWidth = RECEIPT_WIDTH_MM
  const imgHeight = (canvas.height * imgWidth) / canvas.width
  const pageHeight = Math.max(imgHeight + 10, 120)

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: [RECEIPT_WIDTH_MM, pageHeight],
  })

  pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight)
  pdf.save(filename)
}
