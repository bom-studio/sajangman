import { getTodayKST } from "@/lib/date-kst"
import {
  createEmptyDeliveryNoteItem,
  getDefaultDeliveryNoteNumber,
  type DeliveryNoteData,
} from "@/lib/delivery-note"
import {
  getLineSupplyAmount,
  getLineVat,
  type StatementData,
} from "@/lib/statement"

export function convertStatementToDeliveryNote(
  statement: StatementData
): DeliveryNoteData {
  const today = getTodayKST()
  const validItems = statement.items.filter((item) => item.name.trim())

  return {
    supplier: {
      ...statement.supplier,
      contactPerson: "",
      businessType: "",
      businessItem: "",
    },
    recipient: {
      companyName: statement.recipient.companyName,
      contactName: statement.recipient.contactName,
      phone: statement.recipient.phone,
      email: "",
      address: "",
    },
    delivery: {
      number: getDefaultDeliveryNoteNumber(today),
      date: statement.transaction.date || today,
      location: "",
      shippingMethod: "direct",
    },
    remarks: "",
    items:
      validItems.length > 0
        ? validItems.map((item) => ({
            id: crypto.randomUUID(),
            name: item.name,
            spec: item.spec,
            quantity: item.quantity,
            unit: item.unit,
            amount: getLineSupplyAmount(item) + getLineVat(item),
            note: item.note,
          }))
        : [createEmptyDeliveryNoteItem()],
  }
}
