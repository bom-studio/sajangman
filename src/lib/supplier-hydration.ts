import {
  businessProfileToStoredSupplier,
  fetchDefaultBusinessProfileFromDb,
} from "@/lib/supabase/business-profiles"
import type { StoredSupplier } from "@/lib/estimate"
import { loadStoredSupplier } from "@/lib/estimate-storage"
import { createClient } from "@/lib/supabase/client"

/**
 * 로그인 사용자의 기본 공급자를 우선 조회하고,
 * 없으면 localStorage에 저장된 공급자 정보를 반환합니다.
 */
export async function loadInitialSupplier(): Promise<StoredSupplier | null> {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user) {
    const profile = await fetchDefaultBusinessProfileFromDb()
    if (profile) {
      return businessProfileToStoredSupplier(profile)
    }
  }

  return loadStoredSupplier()
}

/**
 * 로그인 사용자의 기본 공급자를 견적요청서 요청자 정보 형식으로 반환합니다.
 */
export async function loadInitialRequester() {
  const stored = await loadInitialSupplier()
  if (!stored) return null

  return {
    companyName: stored.companyName,
    contactName: stored.representative,
    phone: stored.phone,
    email: stored.email,
    address: stored.address,
  }
}
