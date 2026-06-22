import type { DeliveryNoteData } from "@/lib/delivery-note"
import {
  downloadDeliveryNotePdf,
  getDeliveryNoteDocumentElement,
  getDeliveryNotePdfFilename,
} from "@/lib/delivery-note-pdf"
import type { EstimateData } from "@/lib/estimate"
import {
  downloadEstimatePdf,
  getEstimateDocumentElement,
  getEstimatePdfFilename,
} from "@/lib/estimate-pdf"
import type { PurchaseOrderData } from "@/lib/purchase-order"
import {
  downloadPurchaseOrderPdf,
  getPurchaseOrderDocumentElement,
  getPurchaseOrderPdfFilename,
} from "@/lib/purchase-order-pdf"
import type { QuoteRequestData } from "@/lib/quote-request"
import {
  downloadQuoteRequestPdf,
  getQuoteRequestDocumentElement,
  getQuoteRequestPdfFilename,
} from "@/lib/quote-request-pdf"
import type { ReceiptData } from "@/lib/receipt"
import {
  downloadReceiptPdf,
  getReceiptDocumentElement,
  getReceiptPdfFilename,
} from "@/lib/receipt-pdf"
import type { StatementData } from "@/lib/statement"
import {
  downloadStatementPdf,
  getStatementDocumentElement,
  getStatementPdfFilename,
} from "@/lib/statement-pdf"
import type { SupplyContractData } from "@/lib/supply-contract"
import {
  downloadSupplyContractPdf,
  getSupplyContractDocumentElement,
  getSupplyContractPdfFilename,
} from "@/lib/supply-contract-pdf"
import type { TransactionConfirmationData } from "@/lib/transaction-confirmation"
import {
  downloadTransactionConfirmationPdf,
  getTransactionConfirmationDocumentElement,
  getTransactionConfirmationPdfFilename,
} from "@/lib/transaction-confirmation-pdf"
import type { SavedDocument } from "@/types/documents"

const DOCUMENT_ELEMENT_ERROR: Record<SavedDocument["documentType"], string> = {
  estimate: "견적서 문서 영역을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
  quote_request:
    "견적 요청서 문서 영역을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
  statement:
    "거래명세서 문서 영역을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
  purchase_order:
    "발주서 문서 영역을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
  delivery_note:
    "납품서 문서 영역을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
  supply_contract:
    "물품공급계약서 문서 영역을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
  receipt: "영수증 문서 영역을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
  transaction_confirmation:
    "거래확인서 문서 영역을 찾을 수 없습니다. 잠시 후 다시 시도해주세요.",
}

function waitForPreviewRender(): Promise<void> {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resolve())
    })
  })
}

export async function downloadSavedDocumentPdf(
  document: SavedDocument
): Promise<{ error: string | null }> {
  await waitForPreviewRender()

  try {
    switch (document.documentType) {
      case "estimate": {
        const payload = document.documentData as {
          data?: EstimateData
        }
        const data = payload.data
        if (!data) {
          return { error: "저장된 문서 데이터가 없습니다." }
        }

        const element = getEstimateDocumentElement()
        if (!element) {
          return { error: DOCUMENT_ELEMENT_ERROR.estimate }
        }

        const filename = getEstimatePdfFilename(
          data.estimate.number,
          data.estimate.date
        )
        await downloadEstimatePdf(element, filename)
        return { error: null }
      }

      case "quote_request": {
        const payload = document.documentData as {
          data?: QuoteRequestData
        }
        const data = payload.data
        if (!data) {
          return { error: "저장된 문서 데이터가 없습니다." }
        }

        const element = getQuoteRequestDocumentElement()
        if (!element) {
          return { error: DOCUMENT_ELEMENT_ERROR.quote_request }
        }

        const filename = getQuoteRequestPdfFilename(
          data.target.companyName,
          data.request.writtenDate
        )
        await downloadQuoteRequestPdf(element, filename)
        return { error: null }
      }

      case "statement": {
        const payload = document.documentData as {
          data?: StatementData
        }
        const data = payload.data
        if (!data) {
          return { error: "저장된 문서 데이터가 없습니다." }
        }

        const element = getStatementDocumentElement()
        if (!element) {
          return { error: DOCUMENT_ELEMENT_ERROR.statement }
        }

        const filename = getStatementPdfFilename(
          data.transaction.number,
          data.transaction.date
        )
        await downloadStatementPdf(element, filename)
        return { error: null }
      }

      case "purchase_order": {
        const payload = document.documentData as {
          data?: PurchaseOrderData
        }
        const data = payload.data
        if (!data) {
          return { error: "저장된 문서 데이터가 없습니다." }
        }

        const element = getPurchaseOrderDocumentElement()
        if (!element) {
          return { error: DOCUMENT_ELEMENT_ERROR.purchase_order }
        }

        const filename = getPurchaseOrderPdfFilename(
          data.order.number,
          data.order.date
        )
        await downloadPurchaseOrderPdf(element, filename)
        return { error: null }
      }

      case "delivery_note": {
        const payload = document.documentData as {
          data?: DeliveryNoteData
        }
        const data = payload.data
        if (!data) {
          return { error: "저장된 문서 데이터가 없습니다." }
        }

        const element = getDeliveryNoteDocumentElement()
        if (!element) {
          return { error: DOCUMENT_ELEMENT_ERROR.delivery_note }
        }

        const filename = getDeliveryNotePdfFilename(
          data.recipient.companyName,
          data.delivery.date
        )
        await downloadDeliveryNotePdf(element, filename)
        return { error: null }
      }

      case "supply_contract": {
        const payload = document.documentData as {
          data?: SupplyContractData
        }
        const data = payload.data
        if (!data) {
          return { error: "저장된 문서 데이터가 없습니다." }
        }

        const element = getSupplyContractDocumentElement()
        if (!element) {
          return { error: DOCUMENT_ELEMENT_ERROR.supply_contract }
        }

        const filename = getSupplyContractPdfFilename(
          data.supplier.companyName,
          data.buyer.companyName,
          data.signing.writtenDate
        )
        await downloadSupplyContractPdf(element, filename)
        return { error: null }
      }

      case "receipt": {
        const payload = document.documentData as {
          data?: ReceiptData
        }
        const data = payload.data
        if (!data) {
          return { error: "저장된 문서 데이터가 없습니다." }
        }

        const element = getReceiptDocumentElement()
        if (!element) {
          return { error: DOCUMENT_ELEMENT_ERROR.receipt }
        }

        const filename = getReceiptPdfFilename(
          data.recipient.name,
          data.receipt.issueDate
        )
        await downloadReceiptPdf(element, filename, data.receipt.pdfFormat)
        return { error: null }
      }

      case "transaction_confirmation": {
        const payload = document.documentData as {
          data?: TransactionConfirmationData
        }
        const data = payload.data
        if (!data) {
          return { error: "저장된 문서 데이터가 없습니다." }
        }

        const element = getTransactionConfirmationDocumentElement()
        if (!element) {
          return { error: DOCUMENT_ELEMENT_ERROR.transaction_confirmation }
        }

        const filename = getTransactionConfirmationPdfFilename(
          data.recipient.companyName,
          data.transaction.writtenDate
        )
        await downloadTransactionConfirmationPdf(element, filename)
        return { error: null }
      }

      default:
        return { error: "지원하지 않는 문서 종류입니다." }
    }
  } catch (error) {
    console.error("저장 문서 PDF 생성 실패:", error)
    return { error: "PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요." }
  }
}
