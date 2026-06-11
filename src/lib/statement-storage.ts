import {
  DEFAULT_BANK_NAME,
  type BankAccountInfo,
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
