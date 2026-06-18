import { createClient } from "@/lib/supabase/client"
import {
  businessProfileToStoredSupplier,
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

function mapInputToRow(input: BusinessProfileInput) {
  return {
    company_name: input.companyName.trim(),
    representative_name: input.representativeName.trim() || null,
    business_number: input.businessNumber.trim() || null,
    phone: input.phone.trim() || null,
    email: input.email.trim() || null,
    address: input.address.trim() || null,
    seal_url: input.sealUrl.trim() || null,
    is_default: input.isDefault,
  }
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

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { data: null, error: "로그인이 필요합니다." }
  }

  const { data, error } = await supabase
    .from("business_profiles")
    .insert({
      user_id: user.id,
      ...mapInputToRow(input),
    })
    .select("*")
    .single()

  if (error) {
    return { data: null, error: "공급자 등록에 실패했습니다." }
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

  const supabase = createClient()
  const { data, error } = await supabase
    .from("business_profiles")
    .update(mapInputToRow(input))
    .eq("id", id)
    .select("*")
    .single()

  if (error) {
    return { data: null, error: "공급자 수정에 실패했습니다." }
  }

  return { data: mapBusinessProfileRow(data as BusinessProfileRow), error: null }
}

export async function deleteBusinessProfile(
  id: string
): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase.from("business_profiles").delete().eq("id", id)

  if (error) {
    return { error: "공급자 삭제에 실패했습니다." }
  }

  return { error: null }
}

export async function setDefaultBusinessProfile(
  id: string
): Promise<{ error: string | null }> {
  const supabase = createClient()
  const { error } = await supabase
    .from("business_profiles")
    .update({ is_default: true })
    .eq("id", id)

  if (error) {
    return { error: "기본 공급자 설정에 실패했습니다." }
  }

  return { error: null }
}
