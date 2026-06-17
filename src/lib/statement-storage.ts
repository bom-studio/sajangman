import {
  DEFAULT_BANK_NAME,
  type BankAccountInfo,
  type StatementData,
} from "@/lib/statement"

const STORAGE_KEY = "sajangman-bank-account"

export function loadStoredBankAccount(): BankAccountInfo | null {
  if (typeof window === "undefined") return null

  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as BankAccountInfo
    return {
      bankName: parsed.bankName || DEFAULT_BANK_NAME,
      accountNumber: parsed.accountNumber ?? "",
      accountHolder: parsed.accountHolder ?? "",
    }
  } catch {
    return null
  }
}

export function saveStoredBankAccount(bankAccount: BankAccountInfo): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bankAccount))
  } catch {
    // localStorage 용량 초과 등은 조용히 무시
  }
}

const DRAFT_KEY = "sajangman-statement-draft"

export function saveStatementDraft(data: StatementData): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data))
  } catch {
    // localStorage 용량 초과 등은 조용히 무시
  }
}

export function loadStatementDraft(): StatementData | null {
  if (typeof window === "undefined") return null

  try {
    const raw = localStorage.getItem(DRAFT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as StatementData
  } catch {
    return null
  }
}
