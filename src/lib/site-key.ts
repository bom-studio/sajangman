/**
 * Hardcoded per deploy — never accept site_key from the client.
 * Other sites (bomstudio, blingtarot, …) use their own constant in their repo.
 */
export const SITE_KEY = "sajangman" as const
