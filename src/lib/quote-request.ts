import { getTodayKST } from "@/lib/date-kst"
import {
  DEFAULT_ESTIMATE_UNIT,
  ESTIMATE_UNIT_OPTIONS,
  formatDisplayDate,
} from "@/lib/estimate"

export { DEFAULT_ESTIMATE_UNIT, ESTIMATE_UNIT_OPTIONS, formatDisplayDate }

export interface QuoteRequestContact {
  companyName: string
  contactName: string
  phone: string
  email: string
}

export interface QuoteRequestRequester extends QuoteRequestContact {
  address: string
}

export interface QuoteRequestItem {
  id: string
  name: string
  spec: string
  quantity: number
  unit: string
  note: string
}

export interface QuoteRequestConditions {
  vatIncluded: boolean
  shippingIncluded: boolean
  mockupIncluded: boolean
  installationIncluded: boolean
  maintenanceIncluded: boolean
  sampleRequired: boolean
}

export interface SelectionCriteria {
  price: boolean
  delivery: boolean
  quality: boolean
  experience: boolean
  afterService: boolean
  other: boolean
}

export interface QuoteRequestAttachment {
  id: string
  name: string
  size: number
}

export interface QuoteRequestData {
  requester: QuoteRequestRequester
  target: QuoteRequestContact
  request: {
    number: string
    writtenDate: string
    desiredDeliveryDate: string
    submissionDeadline: string
  }
  items: QuoteRequestItem[]
  conditions: QuoteRequestConditions
  selectionCriteria: SelectionCriteria
  details: string
  attachments: QuoteRequestAttachment[]
}

export const REQUEST_CONDITION_OPTIONS: {
  key: keyof QuoteRequestConditions
  label: string
}[] = [
  { key: "vatIncluded", label: "부가세 포함 가격 요청" },
  { key: "shippingIncluded", label: "배송비 포함 가격 요청" },
  { key: "mockupIncluded", label: "시안 포함 요청" },
  { key: "installationIncluded", label: "설치 포함 요청" },
  { key: "maintenanceIncluded", label: "유지보수 포함 요청" },
  { key: "sampleRequired", label: "샘플 제출 요청" },
]

export const SELECTION_CRITERIA_OPTIONS: {
  key: keyof SelectionCriteria
  label: string
}[] = [
  { key: "price", label: "가격" },
  { key: "delivery", label: "납기" },
  { key: "quality", label: "품질" },
  { key: "experience", label: "경력" },
  { key: "afterService", label: "A/S" },
  { key: "other", label: "기타" },
]

export const ATTACHMENT_ACCEPT =
  ".pdf,.jpg,.jpeg,.png,.zip,application/pdf,image/jpeg,image/png,application/zip"

function createId() {
  return crypto.randomUUID()
}

export function createEmptyQuoteRequestItem(): QuoteRequestItem {
  return {
    id: createId(),
    name: "",
    spec: "",
    quantity: 1,
    unit: DEFAULT_ESTIMATE_UNIT,
    note: "",
  }
}

export function getDefaultQuoteRequestNumber(date: string): string {
  return `RFQ-${date.replace(/-/g, "")}-001`
}

function getDefaultConditions(): QuoteRequestConditions {
  return {
    vatIncluded: false,
    shippingIncluded: false,
    mockupIncluded: false,
    installationIncluded: false,
    maintenanceIncluded: false,
    sampleRequired: false,
  }
}

function getDefaultSelectionCriteria(): SelectionCriteria {
  return {
    price: false,
    delivery: false,
    quality: false,
    experience: false,
    afterService: false,
    other: false,
  }
}

export function getDefaultQuoteRequestData(): QuoteRequestData {
  const today = getTodayKST()
  return {
    requester: {
      companyName: "",
      contactName: "",
      phone: "",
      email: "",
      address: "",
    },
    target: {
      companyName: "",
      contactName: "",
      phone: "",
      email: "",
    },
    request: {
      number: getDefaultQuoteRequestNumber(today),
      writtenDate: today,
      desiredDeliveryDate: "",
      submissionDeadline: "",
    },
    items: [createEmptyQuoteRequestItem()],
    conditions: getDefaultConditions(),
    selectionCriteria: getDefaultSelectionCriteria(),
    details: "",
    attachments: [],
  }
}

export function getActiveConditionLabels(
  conditions: QuoteRequestConditions
): string[] {
  return REQUEST_CONDITION_OPTIONS.filter(({ key }) => conditions[key]).map(
    ({ label }) => label
  )
}

export function getActiveCriteriaLabels(
  criteria: SelectionCriteria
): string[] {
  return SELECTION_CRITERIA_OPTIONS.filter(({ key }) => criteria[key]).map(
    ({ label }) => label
  )
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}

export function sanitizeFilenamePart(value: string): string {
  return value.trim().replace(/[/\\?%*:|"<>]/g, "-") || "업체"
}

export function validateQuoteRequest(data: QuoteRequestData): string | null {
  if (!data.requester.companyName.trim()) {
    return "요청자 회사명을 입력해주세요."
  }
  if (!data.target.companyName.trim()) {
    return "견적 요청 대상 업체명을 입력해주세요."
  }
  if (!data.request.writtenDate) {
    return "작성일을 입력해주세요."
  }
  const validItems = data.items.filter((item) => item.name.trim())
  if (validItems.length === 0) {
    return "견적 요청 품목을 1개 이상 입력해주세요."
  }
  return null
}
