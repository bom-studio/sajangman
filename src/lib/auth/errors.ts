const AUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_callback_failed:
    "로그인 처리 중 문제가 발생했습니다. 다시 시도해 주세요.",
  invalid_credentials: "이메일 또는 비밀번호가 올바르지 않습니다.",
  email_not_confirmed: "이메일 인증이 완료되지 않았습니다. 메일함을 확인해 주세요.",
  user_already_registered: "이미 가입된 이메일입니다. 로그인해 주세요.",
}

export function getAuthErrorMessage(
  code: string | null | undefined,
  fallback = "로그인에 실패했습니다. 다시 시도해 주세요."
): string {
  if (!code) return fallback
  return AUTH_ERROR_MESSAGES[code] ?? fallback
}

export function mapSupabaseAuthError(message: string): string {
  const normalized = message.toLowerCase()

  if (normalized.includes("invalid login credentials")) {
    return AUTH_ERROR_MESSAGES.invalid_credentials
  }

  if (normalized.includes("email not confirmed")) {
    return AUTH_ERROR_MESSAGES.email_not_confirmed
  }

  if (normalized.includes("user already registered")) {
    return AUTH_ERROR_MESSAGES.user_already_registered
  }

  return message
}
