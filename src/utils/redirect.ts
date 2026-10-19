/**
 * Shared redirect utilities
 * Safe for use in both server and client components (no next/server imports)
 */

export function sanitizeInternalRedirect(target: string | null | undefined, fallback = "/dashboard"): string {
  if (!target) return fallback
  // Must start with single slash, not double slash (protocol-relative URL)
  if (target.startsWith("/") && !target.startsWith("//")) {
    return target
  }
  return fallback
}
