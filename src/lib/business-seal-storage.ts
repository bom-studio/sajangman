import { createClient } from "@/lib/supabase/client"

export const BUSINESS_SEALS_BUCKET = "business-seals"

const MAX_SEAL_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_SEAL_MIME_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
])

function getExtensionFromMime(mimeType: string): string {
  switch (mimeType) {
    case "image/png":
      return "png"
    case "image/jpeg":
    case "image/jpg":
      return "jpg"
    case "image/webp":
      return "webp"
    default:
      return "png"
  }
}

export function validateSealImageFile(file: File): string | null {
  if (!ALLOWED_SEAL_MIME_TYPES.has(file.type)) {
    return "PNG, JPG, WEBP 이미지만 업로드할 수 있습니다."
  }

  if (file.size > MAX_SEAL_FILE_SIZE) {
    return "이미지 크기는 최대 5MB까지 가능합니다."
  }

  return null
}

export function getSealStoragePath(
  userId: string,
  profileId: string,
  extension: string
): string {
  return `${userId}/${profileId}/seal.${extension}`
}

export function getSealPathFromPublicUrl(url: string): string | null {
  const marker = `/storage/v1/object/public/${BUSINESS_SEALS_BUCKET}/`
  const index = url.indexOf(marker)
  if (index === -1) return null
  return decodeURIComponent(url.slice(index + marker.length))
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

async function removeSealFileByPath(path: string): Promise<void> {
  const supabase = createClient()
  await supabase.storage.from(BUSINESS_SEALS_BUCKET).remove([path])
}

export async function uploadBusinessSeal(
  profileId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> {
  if (file.type !== "image/png") {
    return { url: null, error: "직인은 PNG 형식으로만 저장할 수 있습니다." }
  }

  if (file.size > MAX_SEAL_FILE_SIZE) {
    return { url: null, error: "이미지 크기는 최대 5MB까지 가능합니다." }
  }

  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { url: null, error: authError }
  }

  const supabase = createClient()
  const storagePath = getSealStoragePath(userId, profileId, "png")

  const { data: existingProfile, error: fetchError } = await supabase
    .from("business_profiles")
    .select("seal_url")
    .eq("id", profileId)
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError || !existingProfile) {
    return { url: null, error: "공급자 정보를 찾을 수 없습니다." }
  }

  if (existingProfile.seal_url) {
    const oldPath = getSealPathFromPublicUrl(existingProfile.seal_url)
    if (oldPath && oldPath !== storagePath) {
      await removeSealFileByPath(oldPath)
    }
  }

  const { error: uploadError } = await supabase.storage
    .from(BUSINESS_SEALS_BUCKET)
    .upload(storagePath, file, {
      upsert: true,
      contentType: "image/png",
      cacheControl: "3600",
    })

  if (uploadError) {
    return { url: null, error: "직인 이미지 업로드에 실패했습니다." }
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from(BUSINESS_SEALS_BUCKET).getPublicUrl(storagePath)

  const cacheBustedUrl = `${publicUrl}?v=${Date.now()}`

  const { error: updateError } = await supabase
    .from("business_profiles")
    .update({ seal_url: cacheBustedUrl })
    .eq("id", profileId)
    .eq("user_id", userId)

  if (updateError) {
    return { url: null, error: "직인 정보 저장에 실패했습니다." }
  }

  return { url: cacheBustedUrl, error: null }
}

export async function deleteBusinessSeal(
  profileId: string
): Promise<{ error: string | null }> {
  const { userId, error: authError } = await getAuthenticatedUserId()
  if (authError || !userId) {
    return { error: authError }
  }

  const supabase = createClient()
  const { data: profile, error: fetchError } = await supabase
    .from("business_profiles")
    .select("seal_url")
    .eq("id", profileId)
    .eq("user_id", userId)
    .maybeSingle()

  if (fetchError || !profile) {
    return { error: "공급자 정보를 찾을 수 없습니다." }
  }

  if (profile.seal_url) {
    const path = getSealPathFromPublicUrl(profile.seal_url)
    if (path) {
      await removeSealFileByPath(path)
    }
  }

  const { error: updateError } = await supabase
    .from("business_profiles")
    .update({ seal_url: null })
    .eq("id", profileId)
    .eq("user_id", userId)

  if (updateError) {
    return { error: "직인 삭제에 실패했습니다." }
  }

  return { error: null }
}

export async function deleteBusinessSealByUrl(
  sealUrl: string | null | undefined
): Promise<void> {
  if (!sealUrl) return

  const path = getSealPathFromPublicUrl(sealUrl)
  if (!path) return

  await removeSealFileByPath(path)
}
