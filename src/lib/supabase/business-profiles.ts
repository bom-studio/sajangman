import type { StoredSupplier } from "@/lib/estimate"
import { createClient } from "@/lib/supabase/client"

export interface BusinessProfile {
  id: string
  userId: string
  companyName: string
  representativeName: string
  businessNumber: string
  phone: string
  email: string
  address: string
  sealUrl: string | null
  isDefault: boolean
  createdAt: string
  updatedAt: string
}

export interface BusinessProfileRow {
  id: string
  user_id: string
  company_name: string
  representative_name: string | null
  business_number: string | null
  phone: string | null
  email: string | null
  address: string | null
  seal_url: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export function mapBusinessProfileRow(row: BusinessProfileRow): BusinessProfile {
  return {
    id: row.id,
    userId: row.user_id,
    companyName: row.company_name,
    representativeName: row.representative_name ?? "",
    businessNumber: row.business_number ?? "",
    phone: row.phone ?? "",
    email: row.email ?? "",
    address: row.address ?? "",
    sealUrl: row.seal_url,
    isDefault: row.is_default,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function fetchBusinessProfilesFromDb(): Promise<{
  data: BusinessProfile[]
  error: string | null
}> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: true })

  if (error) {
    return { data: [], error: "공급자 목록을 불러오지 못했습니다." }
  }

  return {
    data: (data as BusinessProfileRow[]).map(mapBusinessProfileRow),
    error: null,
  }
}

export async function fetchDefaultBusinessProfileFromDb(): Promise<BusinessProfile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("business_profiles")
    .select("*")
    .eq("is_default", true)
    .maybeSingle()

  if (error || !data) return null
  return mapBusinessProfileRow(data as BusinessProfileRow)
}

export function businessProfileToStoredSupplier(
  profile: BusinessProfile
): StoredSupplier {
  return {
    companyName: profile.companyName,
    representative: profile.representativeName,
    businessNumber: profile.businessNumber,
    phone: profile.phone,
    email: profile.email,
    address: profile.address,
    sealUrl: profile.sealUrl,
  }
}
