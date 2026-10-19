/**
 * Server-side Admin Authorization Guard
 * Protects administrative routes and approval endpoints against unauthorized access.
 */

const DEFAULT_ADMIN_EMAILS = [
  "om@saptagirinps.edu.in",
  "admin@saptagirinps.edu.in",
]

export function getAdminEmails(): string[] {
  const envAdmins = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(",").map((e) => e.trim().toLowerCase())
    : []
  return Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...envAdmins]))
}

export function isAuthorizedAdmin(email: string | null | undefined): boolean {
  if (!email) return false
  const normalized = email.toLowerCase().trim()
  return getAdminEmails().includes(normalized)
}
