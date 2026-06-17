import { getTodayKST } from "@/lib/date-kst"
import { downloadDocumentPdf } from "@/lib/estimate-pdf"
import { sanitizeFilenamePart } from "@/lib/supply-contract"

export const SUPPLY_CONTRACT_DOCUMENT_ID = "supply-contract-document"

export function getSupplyContractPdfFilename(
  supplierName: string,
  buyerName: string,
  writtenDate: string
): string {
  const safeDate = (writtenDate || getTodayKST()).replace(/-/g, "")
  const safeSupplier = sanitizeFilenamePart(supplierName)
  const safeBuyer = sanitizeFilenamePart(buyerName)

  return `물품공급계약서_${safeSupplier}_${safeBuyer}_${safeDate}.pdf`
}

export function getSupplyContractDocumentElement(): HTMLElement | null {
  const element = document.getElementById(SUPPLY_CONTRACT_DOCUMENT_ID)
  return element instanceof HTMLElement ? element : null
}

export async function downloadSupplyContractPdf(
  element: HTMLElement,
  filename: string
): Promise<void> {
  return downloadDocumentPdf(element, filename, SUPPLY_CONTRACT_DOCUMENT_ID)
}
