import { calculateDeliveryNote } from "@/lib/delivery-note"
import { calculateEstimate } from "@/lib/estimate"
import { calculatePurchaseOrder } from "@/lib/purchase-order"
import { calculateReceipt } from "@/lib/receipt"
import { calculateStatement } from "@/lib/statement"
import { calculateSupplyContract } from "@/lib/supply-contract"
import { calculateTransactionConfirmation } from "@/lib/transaction-confirmation"
import type { DocumentSaveInput, SupplierSnapshot } from "@/types/documents"
import { DOCUMENT_TYPE_CONFIG_MAP } from "@/types/documents"

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>
  }
  return {}
}

function pickString(...values: unknown[]): string {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim()
    }
  }
  return ""
}

function copyDocumentNumber(original: string, documentType: string): string {
  const base = original.trim() || documentType.toUpperCase()
  const suffix = `-COPY-${Date.now().toString().slice(-4)}`
  return `${base}${suffix}`.slice(0, 80)
}

export function buildSupplierSnapshot(
  supplier: Record<string, unknown>,
  sealUrl?: string | null
): SupplierSnapshot {
  return {
    ...supplier,
    companyName: pickString(supplier.companyName),
    representative: pickString(supplier.representative, supplier.representativeName),
    businessNumber: pickString(supplier.businessNumber),
    phone: pickString(supplier.phone),
    email: pickString(supplier.email),
    address: pickString(supplier.address),
    sealUrl: sealUrl ?? (supplier.sealUrl as string | null | undefined) ?? null,
  }
}

export function buildDocumentMetadata(
  input: DocumentSaveInput
): Required<
  Pick<
    DocumentSaveInput,
    "documentNumber" | "title" | "customerName" | "totalAmount"
  >
> {
  const { documentType, documentData } = input
  const data = asRecord(documentData.data ?? documentData)

  switch (documentType) {
    case "estimate": {
      const estimate = asRecord(data.estimate)
      const customer = asRecord(data.customer)
      const items = Array.isArray(data.items) ? data.items : []
      const totals = calculateEstimate(
        items as Parameters<typeof calculateEstimate>[0]
      )
      const documentNumber = pickString(estimate.number, input.documentNumber)
      const customerName = pickString(customer.name, customer.companyName)
      return {
        documentNumber,
        title: pickString(
          input.title,
          customer.companyName,
          customer.name,
          `${DOCUMENT_TYPE_CONFIG_MAP.estimate.label} ${documentNumber}`
        ),
        customerName,
        totalAmount: input.totalAmount ?? totals.total,
      }
    }
    case "quote_request": {
      const request = asRecord(data.request)
      const requester = asRecord(data.requester)
      const target = asRecord(data.target)
      const documentNumber = pickString(request.number, input.documentNumber)
      return {
        documentNumber,
        title: pickString(
          input.title,
          requester.companyName,
          `${DOCUMENT_TYPE_CONFIG_MAP.quote_request.label} ${documentNumber}`
        ),
        customerName: pickString(
          input.customerName,
          target.companyName,
          target.contactName
        ),
        totalAmount: input.totalAmount ?? 0,
      }
    }
    case "statement": {
      const transaction = asRecord(data.transaction)
      const recipient = asRecord(data.recipient)
      const items = Array.isArray(data.items) ? data.items : []
      const totals = calculateStatement(
        items as Parameters<typeof calculateStatement>[0]
      )
      const documentNumber = pickString(transaction.number, input.documentNumber)
      return {
        documentNumber,
        title: pickString(
          input.title,
          recipient.companyName,
          `${DOCUMENT_TYPE_CONFIG_MAP.statement.label} ${documentNumber}`
        ),
        customerName: pickString(
          input.customerName,
          recipient.contactName,
          recipient.companyName
        ),
        totalAmount: input.totalAmount ?? totals.total,
      }
    }
    case "purchase_order": {
      const order = asRecord(data.order)
      const vendor = asRecord(data.vendor)
      const items = Array.isArray(data.items) ? data.items : []
      const totals = calculatePurchaseOrder(
        items as Parameters<typeof calculatePurchaseOrder>[0]
      )
      const documentNumber = pickString(order.number, input.documentNumber)
      return {
        documentNumber,
        title: pickString(
          input.title,
          vendor.companyName,
          `${DOCUMENT_TYPE_CONFIG_MAP.purchase_order.label} ${documentNumber}`
        ),
        customerName: pickString(
          input.customerName,
          vendor.companyName,
          vendor.contactName
        ),
        totalAmount: input.totalAmount ?? totals.total,
      }
    }
    case "delivery_note": {
      const delivery = asRecord(data.delivery)
      const recipient = asRecord(data.recipient)
      const items = Array.isArray(data.items) ? data.items : []
      const totals = calculateDeliveryNote(
        items as Parameters<typeof calculateDeliveryNote>[0]
      )
      const documentNumber = pickString(delivery.number, input.documentNumber)
      return {
        documentNumber,
        title: pickString(
          input.title,
          recipient.companyName,
          `${DOCUMENT_TYPE_CONFIG_MAP.delivery_note.label} ${documentNumber}`
        ),
        customerName: pickString(
          input.customerName,
          recipient.companyName,
          recipient.contactName
        ),
        totalAmount: input.totalAmount ?? totals.totalAmount,
      }
    }
    case "supply_contract": {
      const buyer = asRecord(data.buyer)
      const signing = asRecord(data.signing)
      const items = Array.isArray(data.items) ? data.items : []
      const totals = calculateSupplyContract(
        items as Parameters<typeof calculateSupplyContract>[0]
      )
      const writtenDate = pickString(signing.writtenDate)
      const documentNumber = pickString(
        input.documentNumber,
        writtenDate ? writtenDate.replace(/-/g, "") : ""
      )
      return {
        documentNumber,
        title: pickString(
          input.title,
          buyer.companyName
            ? `${buyer.companyName} 공급계약`
            : DOCUMENT_TYPE_CONFIG_MAP.supply_contract.label
        ),
        customerName: pickString(input.customerName, buyer.companyName),
        totalAmount: input.totalAmount ?? totals.total,
      }
    }
    case "receipt": {
      const receipt = asRecord(data.receipt)
      const recipient = asRecord(data.recipient)
      const items = Array.isArray(data.items) ? data.items : []
      const vatMode = (receipt.vatMode as "included" | "separate") ?? "separate"
      const totals = calculateReceipt(
        items as Parameters<typeof calculateReceipt>[0],
        vatMode
      )
      const documentNumber = pickString(receipt.number, input.documentNumber)
      return {
        documentNumber,
        title: pickString(
          input.title,
          recipient.name,
          `${DOCUMENT_TYPE_CONFIG_MAP.receipt.label} ${documentNumber}`
        ),
        customerName: pickString(input.customerName, recipient.name),
        totalAmount: input.totalAmount ?? totals.total,
      }
    }
    case "transaction_confirmation": {
      const transaction = asRecord(data.transaction)
      const recipient = asRecord(data.recipient)
      const items = Array.isArray(data.items) ? data.items : []
      const totals = calculateTransactionConfirmation(
        items as Parameters<typeof calculateTransactionConfirmation>[0]
      )
      const documentNumber = pickString(transaction.number, input.documentNumber)
      return {
        documentNumber,
        title: pickString(
          input.title,
          recipient.companyName,
          `${DOCUMENT_TYPE_CONFIG_MAP.transaction_confirmation.label} ${documentNumber}`
        ),
        customerName: pickString(
          input.customerName,
          recipient.companyName,
          recipient.representative
        ),
        totalAmount: input.totalAmount ?? totals.total,
      }
    }
    default:
      return {
        documentNumber: pickString(input.documentNumber),
        title: pickString(input.title, "저장 문서"),
        customerName: pickString(input.customerName),
        totalAmount: input.totalAmount ?? 0,
      }
  }
}

export function buildCopyDocumentInput(
  source: {
    documentType: DocumentSaveInput["documentType"]
    documentNumber: string
    title: string
    customerName: string
    totalAmount: number
    supplierSnapshot: SupplierSnapshot
    customerSnapshot: Record<string, unknown> | null
    documentData: Record<string, unknown>
  }
): DocumentSaveInput {
  const copiedData = JSON.parse(JSON.stringify(source.documentData)) as Record<
    string,
    unknown
  >
  const innerData = asRecord(copiedData.data ?? copiedData)
  const newNumber = copyDocumentNumber(
    source.documentNumber,
    source.documentType
  )

  if (source.documentType === "estimate") {
    innerData.estimate = { ...asRecord(innerData.estimate), number: newNumber }
  } else if (source.documentType === "quote_request") {
    innerData.request = { ...asRecord(innerData.request), number: newNumber }
  } else if (source.documentType === "statement") {
    innerData.transaction = {
      ...asRecord(innerData.transaction),
      number: newNumber,
    }
  } else if (source.documentType === "purchase_order") {
    innerData.order = { ...asRecord(innerData.order), number: newNumber }
  } else if (source.documentType === "delivery_note") {
    innerData.delivery = { ...asRecord(innerData.delivery), number: newNumber }
  } else if (source.documentType === "receipt") {
    innerData.receipt = { ...asRecord(innerData.receipt), number: newNumber }
  } else if (source.documentType === "transaction_confirmation") {
    innerData.transaction = {
      ...asRecord(innerData.transaction),
      number: newNumber,
    }
  }

  if (copiedData.data) {
    copiedData.data = innerData
  } else {
    Object.assign(copiedData, innerData)
  }

  return {
    documentType: source.documentType,
    documentData: copiedData,
    supplierSnapshot: JSON.parse(JSON.stringify(source.supplierSnapshot)),
    customerSnapshot: source.customerSnapshot
      ? JSON.parse(JSON.stringify(source.customerSnapshot))
      : null,
    title: source.title ? `${source.title} 복사본` : "복사본",
    documentNumber: newNumber,
    customerName: source.customerName,
    totalAmount: source.totalAmount,
  }
}
