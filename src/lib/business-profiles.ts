import { deleteBusinessSealByUrl } from "@/lib/business-seal-storage"
import { createClient } from "@/lib/supabase/client"
import {
  fetchBusinessProfilesFromDb,
  fetchDefaultBusinessProfileFromDb,
  mapBusinessProfileRow,
  type BusinessProfile,
  type BusinessProfileRow,
} from "@/lib/supabase/business-profiles"

export type {
  BusinessProfile,
  BusinessProfileRow,
} from "@/lib/supabase/business-profiles"

export {
  businessProfileToStoredSupplier,
  mapBusinessProfileRow,
} from "@/lib/supabase/business-profiles"

export interface BusinessProfileInput {
  companyName: string
  representativeName: string
  businessNumber: string
  phone: string
  email: string
  address: string
  sealUrl: string
  isDefault: boolean
}

function mapInputToRow(input: BusinessProfileInput, isDefault: boolean) {
  return {
    company_name: input.companyName.trim(),
    representative_name: input.representativeName.trim() || null,
    business_number: input.businessNumber.trim() || null,
    phone: input.phone.trim() || null,
    email: input.email.trim() || null,
    address: input.address.trim() || null,
    seal_url: input.sealUrl.trim() || null,
    is_default: isDefault,
  }
}

function getBusinessProfileErrorMessage(
  error: { code?: string; message?: string },
  fallback: string
): string {
  if (error.code === "23505") {
    return "기본 공급자 설정 중 충돌이 발생했습니다. 잠시 후 다시 시도해주세요."
  }

  return fallback
}

async function getAuthenticatedUserId(): Promise<{
  userId: string | null
  error: string | null
}> {
  const supabase = createClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return { userId: null, error: "로그인이 필요합니다." }
  }

  return { userId: user.id, error: null }
}

async function countBusinessProfiles(userId: string): Promise<number> {
  const supabase = createClient()
  const { count, error } = await supabase
    .from("business_profiles")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)

  if (error) {
    return 0
  }

  return count ?? 0
}

async function clearDefaultBusinessProfiles(userId: string): Promise<string | null> {
  const supabase = createClient()
  const { error } = await supabase
    .from("business_profiles")
    .update({ is_default: false })
    .eq("user_id", userId)
    .eq("is_default", true)

  if (error) {
    return getBusinessProfileErrorMessage(
      error,
      "기존 기본 공급자 해제에 실패했습니다."
    )
  }

  return null
}

async function promoteLatestBusinessProfile(userId: string): Promise<string | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("business_profiles")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    return getBusinessProfileErrorMessage(
      error,
      "기본 공급자 자동 설정에 실패했습니다."
    )
  }

  if (!data) {
    return null
  }

  const clearError = await clearDefaultBusinessProfiles(userId)
  if (clearError) {
    return clearError
  }

  const { error: promoteError } = await supabase
    .from("business_profiles")
    .update({ is_default: true })
    .eq("id", data.id)
    .eq("user_id", userId)

  if (promoteError) {
    return getBusinessProfileErrorMessage(
      promoteError,
      "기본 공급자 자동 설정에 실패했습니다."
    )
  }

  return null
}

export function createEmptyBusinessProfileInput(
  isDefault = false
): BusinessProfileInput {
  return {
    companyName: "",
    representativeName: "",
    businessNumber: "",
    phone: "",
    email: "",
    address: "",
    sealUrl: "",
    isDefault,
  }
}

export function businessProfileToInput(
  profile: BusinessProfile
): BusinessProfileInput {
  return {
    companyName: profile.companyName,
    representativeName: profile.representativeName,
    businessNumber: profile.businessNumber,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    sealUrl: profile.sealUrl ?? "",
    isDefault: profile.isDefault,
  }
}

export async function fetchBusinessProfiles(): Promise<{
  data: BusinessProfile[]
  error: string | null
}> {
  return fetchBusinessProfilesFromDb()
}

export async function fetchDefaultBusinessProfile(): Promise<BusinessProfile | null> {
  return fetchDefaultBusinessProfileFromDb()
}

export async function createBusinessProfile(
  input: BusinessProfileInput
): Promise<{ data: BusinessProfile | null; error: string | null }> {
  if (!input.companyName.trim()) {
    return { data: null, error: "상호명을 입력해주세요." }
  }

  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { data: null, error: authError ?? "로그인이 필요합니다." }
  }

  const supabase = createClient()
  const existingCount = await countBusinessProfiles(userId)
  const shouldBeDefault = existingCount === 0 || input.isDefault

  if (shouldBeDefault) {
    const clearError = await clearDefaultBusinessProfiles(userId)
    if (clearError) {
      return { data: null, error: clearError }
    }
  }

  const { data, error } = await supabase
    .from("business_profiles")
    .insert({
      user_id: userId,
      ...mapInputToRow(input, shouldBeDefault),
    })
    .select("*")
    .single()

  if (error) {
    return {
      data: null,
      error: getBusinessProfileErrorMessage(error, "공급자 등록에 실패했습니다."),
    }
  }

  return { data: mapBusinessProfileRow(data as BusinessProfileRow), error: null }
}

export async function updateBusinessProfile(
  id: string,
  input: BusinessProfileInput
): Promise<{ data: BusinessProfile | null; error: string | null }> {
  if (!input.companyName.trim()) {
    return { data: null, error: "상호명을 입력해주세요." }
  }

  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { data: null, error: authError ?? "로그인이 필요합니다." }
  }

  const supabase = createClient()

  if (input.isDefault) {
    const clearError = await clearDefaultBusinessProfiles(userId)
    if (clearError) {
      return { data: null, error: clearError }
    }
  }

  const { data, error } = await supabase
    .from("business_profiles")
    .update(mapInputToRow(input, input.isDefault))
    .eq("id", id)
    .eq("user_id", userId)
    .select("*")
    .single()

  if (error) {
    return {
      data: null,
      error: getBusinessProfileErrorMessage(error, "공급자 수정에 실패했습니다."),
    }
  }

  return { data: mapBusinessProfileRow(data as BusinessProfileRow), error: null }
}

export async function deleteBusinessProfile(
  id: string
): Promise<{ error: string | null }> {
  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { error: authError ?? "로그인이 필요합니다." }
  }

  const supabase = createClient()
  const { data: target, error: fetchError } = await supabase
    .from("business_profiles")
    .select("id, is_default, seal_url")
    .eq("id", id)
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError) {
    return {
      error: getBusinessProfileErrorMessage(fetchError, "공급자 정보를 찾을 수 없습니다."),
    }
  }

  if (!target) {
    return { error: "공급자 정보를 찾을 수 없습니다." }
  }

  const wasDefault = target.is_default

  const { error: deleteError } = await supabase
    .from("business_profiles")
    .delete()
    .eq("id", id)
    .eq("user_id", userId)

  if (deleteError) {
    return {
      error: getBusinessProfileErrorMessage(deleteError, "공급자 삭제에 실패했습니다."),
    }
  }

  await deleteBusinessSealByUrl(target.seal_url)

  if (wasDefault) {
    const promoteError = await promoteLatestBusinessProfile(userId)
    if (promoteError) {
      return { error: promoteError }
    }
  }

  return { error: null }
}

export async function setDefaultBusinessProfile(
  id: string
): Promise<{ error: string | null }> {
  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { error: authError ?? "로그인이 필요합니다." }
  }

  const clearError = await clearDefaultBusinessProfiles(userId)
  if (clearError) {
    return { error: clearError }
  }

  const supabase = createClient()
  const { error } = await supabase
    .from("business_profiles")
    .update({ is_default: true })
    .eq("id", id)
    .eq("user_id", userId)

  if (error) {
    return {
      error: getBusinessProfileErrorMessage(
        error,
        "기본 공급자 설정에 실패했습니다."
      ),
    }
  }

  return { error: null }
}
