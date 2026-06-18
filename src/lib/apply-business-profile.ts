import type { BusinessProfile } from "@/lib/supabase/business-profiles"
import type { SupplierInfo } from "@/lib/estimate"
import type { QuoteRequestRequester } from "@/lib/quote-request"
import type { ContractParty } from "@/lib/supply-contract"
import type { TransactionParty } from "@/lib/transaction-confirmation"

export function applyProfileToSupplierInfo<T extends SupplierInfo>(
  current: T,
  profile: BusinessProfile
): T {
  return {
    ...current,
    companyName: profile.companyName,
    representative: profile.representativeName,
    businessNumber: profile.businessNumber,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
  }
}

export function applyProfileToTransactionParty(
  current: TransactionParty,
  profile: BusinessProfile
): TransactionParty {
  return {
    ...current,
    companyName: profile.companyName,
    representative: profile.representativeName,
    businessNumber: profile.businessNumber,
    phone: profile.phone,
    address: profile.address,
  }
}

export function applyProfileToContractParty(
  current: ContractParty,
  profile: BusinessProfile
): ContractParty {
  return {
    ...current,
    companyName: profile.companyName,
    representative: profile.representativeName,
    businessNumber: profile.businessNumber,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
  }
}

export function applyProfileToQuoteRequestRequester(
  current: QuoteRequestRequester,
  profile: BusinessProfile
): QuoteRequestRequester {
  return {
    ...current,
    companyName: profile.companyName,
    contactName: profile.representativeName,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
  }
}
