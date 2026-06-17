import { addDaysToDateString, getTodayKST } from "@/lib/date-kst"
import {
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatDisplayDate,
  formatKRW,
} from "@/lib/estimate"

export {
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatDisplayDate,
  formatKRW,
}

export type BusinessEntityType = "corporation" | "sole_proprietor" | "individual"

export type PaymentMethod =
  | "lump_sum"
  | "installment"
  | "after_delivery"
  | "monthly"

export type ShippingCostBearer = "supplier" | "buyer" | "negotiated"

export interface ContractParty {
  entityType: BusinessEntityType
  companyName: string
  representative: string
  businessNumber: string
  address: string
  businessType: string
  businessItem: string
  contactPerson: string
  phone: string
  email: string
}

export interface SupplyContractItem {
  id: string
  deliveryDeadline: string
  name: string
  spec: string
  quantity: number
  unit: string
  unitPrice: number
}

export interface ContractPeriod {
  startDate: string
  endDate: string
  autoRenewal: boolean
  terminationNoticeDays: string
  terminationReasons: string
}

export interface PaymentTerms {
  method: PaymentMethod
  depositRatio: number
  balanceRatio: number
  paymentDeadline: string
  bankAccount: string
  issueTaxInvoice: boolean
  lateInterest: boolean
  lateInterestRate: number
}

export interface DeliveryTerms {
  location: string
  shippingCostBearer: ShippingCostBearer
}

export interface InspectionTerms {
  inspectionDeadline: string
  defectHandling: string
  ownershipTransferTiming: string
}

export interface LegalOptions {
  confidentiality: boolean
  intellectualProperty: boolean
  resaleRestriction: boolean
}

export interface ContractSigning {
  writtenDate: string
  place: string
}

export interface SupplyContractData {
  supplier: ContractParty
  buyer: ContractParty
  items: SupplyContractItem[]
  contractPeriod: ContractPeriod
  paymentTerms: PaymentTerms
  deliveryTerms: DeliveryTerms
  inspectionTerms: InspectionTerms
  legalOptions: LegalOptions
  specialTerms: string
  signing: ContractSigning
}

export interface SupplyContractTotals {
  supplyAmount: number
  vat: number
  total: number
}

export const ENTITY_TYPE_LABEL: Record<BusinessEntityType, string> = {
  corporation: "법인",
  sole_proprietor: "개인사업자",
  individual: "개인",
}

export const PAYMENT_METHOD_LABEL: Record<PaymentMethod, string> = {
  lump_sum: "일시 지급",
  installment: "분할 지급",
  after_delivery: "납품 후 지급",
  monthly: "월말 정산",
}

export const SHIPPING_COST_LABEL: Record<ShippingCostBearer, string> = {
  supplier: "공급자 부담",
  buyer: "구매자 부담",
  negotiated: "협의",
}

function createItemId() {
  return crypto.randomUUID()
}

function emptyParty(): ContractParty {
  return {
    entityType: "sole_proprietor",
    companyName: "",
    representative: "",
    businessNumber: "",
    address: "",
    businessType: "",
    businessItem: "",
    contactPerson: "",
    phone: "",
    email: "",
  }
}

export function createEmptySupplyContractItem(): SupplyContractItem {
  return {
    id: createItemId(),
    deliveryDeadline: "",
    name: "",
    spec: "",
    quantity: 1,
    unit: DEFAULT_ESTIMATE_UNIT,
    unitPrice: 0,
  }
}

export function getDefaultSupplyContractData(): SupplyContractData {
  const today = getTodayKST()
  const endDate = addDaysToDateString(today, 365)

  return {
    supplier: emptyParty(),
    buyer: emptyParty(),
    items: [createEmptySupplyContractItem()],
    contractPeriod: {
      startDate: today,
      endDate,
      autoRenewal: true,
      terminationNoticeDays: "30",
      terminationReasons:
        "상대방의 중대한 계약 위반, 파산·회생절차 개시, 천재지변 등 불가항력",
    },
    paymentTerms: {
      method: "after_delivery",
      depositRatio: 0,
      balanceRatio: 100,
      paymentDeadline:
        "공급자가 물품을 공급한 후 세금계산서를 수취한 날로부터 7일 이내",
      bankAccount: "",
      issueTaxInvoice: true,
      lateInterest: true,
      lateInterestRate: 12,
    },
    deliveryTerms: {
      location: "",
      shippingCostBearer: "supplier",
    },
    inspectionTerms: {
      inspectionDeadline: "납품 후 3일 이내",
      defectHandling:
        "하자 또는 불량이 확인된 경우 공급자는 교환·수리·환불 등 합리적인 조치를 취한다.",
      ownershipTransferTiming: "대금 전액 지급 완료 시",
    },
    legalOptions: {
      confidentiality: true,
      intellectualProperty: false,
      resaleRestriction: false,
    },
    specialTerms: "",
    signing: {
      writtenDate: today,
      place: "",
    },
  }
}

export function getLineSupplyAmount(item: SupplyContractItem): number {
  const quantity = Number.isFinite(item.quantity) ? item.quantity : 0
  const unitPrice = Number.isFinite(item.unitPrice) ? item.unitPrice : 0
  return quantity * unitPrice
}

export function getLineVat(item: SupplyContractItem): number {
  return Math.round(getLineSupplyAmount(item) * 0.1)
}

export function getLineTotal(item: SupplyContractItem): number {
  return getLineSupplyAmount(item) + getLineVat(item)
}

export function calculateSupplyContract(
  items: SupplyContractItem[]
): SupplyContractTotals {
  const supplyAmount = items.reduce(
    (sum, item) => sum + getLineSupplyAmount(item),
    0
  )
  const vat = Math.round(supplyAmount * 0.1)
  const total = supplyAmount + vat

  return { supplyAmount, vat, total }
}

export function validateSupplyContract(data: SupplyContractData): string | null {
  if (!data.supplier.companyName.trim()) {
    return "공급자 상호명을 입력해주세요."
  }
  if (!data.buyer.companyName.trim()) {
    return "구매자 상호명을 입력해주세요."
  }
  if (!data.signing.writtenDate) {
    return "계약 작성일을 입력해주세요."
  }
  const validItems = data.items.filter((item) => item.name.trim())
  if (validItems.length === 0) {
    return "공급 물품을 1개 이상 입력해주세요."
  }
  const totals = calculateSupplyContract(validItems)
  if (totals.total <= 0) {
    return "계약금액이 0원을 초과해야 합니다."
  }
  return null
}

export function getAutoRenewalText(autoRenewal: boolean): string {
  return autoRenewal
    ? "계약기간 만료 전 별도의 해지 의사표시가 없는 경우 동일 조건으로 연장됩니다."
    : "계약기간이 종료되면 본 계약은 자동 종료됩니다."
}

export function sanitizeFilenamePart(value: string): string {
  return value.trim().replace(/[/\\?%*:|"<>]/g, "-") || "미입력"
}
