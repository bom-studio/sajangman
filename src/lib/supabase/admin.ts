import "server-only"

import { createClient, type SupabaseClient } from "@supabase/supabase-js"

function trimEnv(value: string | undefined): string | undefined {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function getAdminEnv() {
  const url = trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const serviceRoleKey = trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)

  if (!url || !serviceRoleKey) {
    return null
  }

  return { url, serviceRoleKey }
}

function getSupabaseHostname(url: string): string | null {
  try {
    return new URL(url).hostname
  } catch {
    return null
  }
}

export function isSupabaseAdminConfigured(): boolean {
  return getAdminEnv() !== null
}

/** Safe diagnostics — never logs secret values. Enabled in production for Vercel Logs. */
export function logSupabaseAdminDiagnostics(context: string, error?: unknown) {
  const url = trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)
  const serviceRoleKey = trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  const hostname = url ? getSupabaseHostname(url) : null
  const projectRef = hostname?.endsWith(".supabase.co")
    ? hostname.replace(".supabase.co", "")
    : null

  const errObj =
    error && typeof error === "object"
      ? (error as Record<string, unknown>)
      : null

  const keyFormat = !serviceRoleKey
    ? "missing"
    : serviceRoleKey.startsWith("eyJ")
      ? "legacy_jwt"
      : serviceRoleKey.startsWith("sb_secret_")
        ? "sb_secret"
        : serviceRoleKey.startsWith("sb_publishable_")
          ? "sb_publishable"
          : "unknown"

  console.error(`[supabase:admin] ${context}`, {
    hasUrl: Boolean(url),
    hasServiceRoleKey: Boolean(serviceRoleKey),
    keyFormat,
    hostname,
    projectRef,
    message:
      error instanceof Error
        ? error.message
        : typeof errObj?.message === "string"
          ? errObj.message
          : error
            ? String(error)
            : undefined,
    code:
      error instanceof Error
        ? (error as NodeJS.ErrnoException).code
        : typeof errObj?.code === "string"
          ? errObj.code
          : undefined,
    cause:
      error instanceof Error && error.cause !== undefined
        ? error.cause instanceof Error
          ? {
              message: error.cause.message,
              code: (error.cause as NodeJS.ErrnoException).code,
            }
          : String(error.cause)
        : undefined,
  })
}

let didLogConfigOnce = false

function logConfigOnce() {
  if (didLogConfigOnce) return
  didLogConfigOnce = true

  const env = getAdminEnv()
  if (!env) {
    console.error("[supabase:admin] missing env", {
      hasUrl: Boolean(trimEnv(process.env.NEXT_PUBLIC_SUPABASE_URL)),
      hasServiceRoleKey: Boolean(
        trimEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
      ),
    })
    return
  }

  if (process.env.NODE_ENV === "production") return

  const hostname = getSupabaseHostname(env.url)
  console.info("[supabase:admin] configured", {
    hostname,
    projectRef: hostname?.endsWith(".supabase.co")
      ? hostname.replace(".supabase.co", "")
      : null,
  })
}

/** Server-only Supabase client. Never import from Client Components. */
export function createSupabaseAdmin(): SupabaseClient | null {
  const env = getAdminEnv()
  if (!env) {
    logSupabaseAdminDiagnostics("createSupabaseAdmin: missing env")
    return null
  }

  try {
    // Validate URL early so misconfigured values fail clearly
    const parsed = new URL(env.url)
    if (!parsed.protocol.startsWith("http")) {
      logSupabaseAdminDiagnostics("createSupabaseAdmin: invalid URL protocol")
      return null
    }
  } catch (error) {
    logSupabaseAdminDiagnostics("createSupabaseAdmin: invalid URL", error)
    return null
  }

  logConfigOnce()

  return createClient(env.url, env.serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  })
}
