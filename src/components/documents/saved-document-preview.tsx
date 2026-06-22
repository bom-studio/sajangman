"use client"

import { DeliveryNotePreview } from "@/components/delivery-note/delivery-note-preview"
import { EstimatePreview } from "@/components/estimate/estimate-preview"
import { PurchaseOrderPreview } from "@/components/purchase-order/purchase-order-preview"
import { QuoteRequestPreview } from "@/components/quote-request/quote-request-preview"
import { ReceiptPreview } from "@/components/receipt/receipt-preview"
import { StatementPreview } from "@/components/statement/statement-preview"
import { SupplyContractPreview } from "@/components/supply-contract/supply-contract-preview"
import { TransactionConfirmationPreview } from "@/components/transaction-confirmation/transaction-confirmation-preview"
import type { DeliveryNoteData } from "@/lib/delivery-note"
import type { EstimateData } from "@/lib/estimate"
import type { PurchaseOrderData } from "@/lib/purchase-order"
import type { QuoteRequestData } from "@/lib/quote-request"
import type { ReceiptData } from "@/lib/receipt"
import type { StatementData } from "@/lib/statement"
import type { SupplyContractData } from "@/lib/supply-contract"
import type { TransactionConfirmationData } from "@/lib/transaction-confirmation"
import { cn } from "@/lib/utils"
import type { SavedDocument } from "@/types/documents"

export const SAVED_DOCUMENT_PREVIEW_CLASS =
  "mx-auto w-full max-w-[210mm] border-0 shadow-md ring-1 ring-border/80 lg:static"

interface SavedDocumentPreviewProps {
  document: SavedDocument
  className?: string
}

function getSealUrl(
  payloadSeal: string | null | undefined,
  snapshotSeal: unknown
): string | null {
  return payloadSeal ?? (typeof snapshotSeal === "string" ? snapshotSeal : null)
}

export function SavedDocumentPreview({
  document,
  className,
}: SavedDocumentPreviewProps) {
  const previewClassName = cn(SAVED_DOCUMENT_PREVIEW_CLASS, className)

  switch (document.documentType) {
    case "estimate": {
      const payload = document.documentData as {
        data?: EstimateData
        sealUrl?: string | null
      }
      if (!payload.data) return null

      return (
        <EstimatePreview
          data={payload.data}
          sealUrl={getSealUrl(
            payload.sealUrl,
            document.supplierSnapshot.sealUrl
          )}
          className={previewClassName}
        />
      )
    }

    case "quote_request": {
      const payload = document.documentData as {
        data?: QuoteRequestData
        sealUrl?: string | null
      }
      if (!payload.data) return null

      return (
        <QuoteRequestPreview
          data={payload.data}
          sealUrl={getSealUrl(
            payload.sealUrl,
            document.supplierSnapshot.sealUrl
          )}
          className={previewClassName}
        />
      )
    }

    case "statement": {
      const payload = document.documentData as {
        data?: StatementData
        sealUrl?: string | null
      }
      if (!payload.data) return null

      return (
        <StatementPreview
          data={payload.data}
          sealUrl={getSealUrl(
            payload.sealUrl,
            document.supplierSnapshot.sealUrl
          )}
          className={previewClassName}
        />
      )
    }

    case "purchase_order": {
      const payload = document.documentData as {
        data?: PurchaseOrderData
        sealUrl?: string | null
      }
      if (!payload.data) return null

      return (
        <PurchaseOrderPreview
          data={payload.data}
          sealUrl={getSealUrl(
            payload.sealUrl,
            document.supplierSnapshot.sealUrl
          )}
          className={previewClassName}
        />
      )
    }

    case "delivery_note": {
      const payload = document.documentData as {
        data?: DeliveryNoteData
        sealUrl?: string | null
      }
      if (!payload.data) return null

      return (
        <DeliveryNotePreview
          data={payload.data}
          sealUrl={getSealUrl(
            payload.sealUrl,
            document.supplierSnapshot.sealUrl
          )}
          className={previewClassName}
        />
      )
    }

    case "supply_contract": {
      const payload = document.documentData as {
        data?: SupplyContractData
        supplierSealUrl?: string | null
        buyerSealUrl?: string | null
      }
      if (!payload.data) return null

      return (
        <SupplyContractPreview
          data={payload.data}
          supplierSealUrl={getSealUrl(
            payload.supplierSealUrl,
            document.supplierSnapshot.sealUrl
          )}
          buyerSealUrl={payload.buyerSealUrl ?? null}
          className={previewClassName}
        />
      )
    }

    case "receipt": {
      const payload = document.documentData as {
        data?: ReceiptData
        sealUrl?: string | null
      }
      if (!payload.data) return null

      return (
        <ReceiptPreview
          data={payload.data}
          sealUrl={getSealUrl(
            payload.sealUrl,
            document.supplierSnapshot.sealUrl
          )}
          className={previewClassName}
        />
      )
    }

    case "transaction_confirmation": {
      const payload = document.documentData as {
        data?: TransactionConfirmationData
        supplierSealUrl?: string | null
      }
      if (!payload.data) return null

      return (
        <TransactionConfirmationPreview
          data={payload.data}
          supplierSealUrl={getSealUrl(
            payload.supplierSealUrl,
            document.supplierSnapshot.sealUrl
          )}
          className={previewClassName}
        />
      )
    }

    default:
      return null
  }
}
