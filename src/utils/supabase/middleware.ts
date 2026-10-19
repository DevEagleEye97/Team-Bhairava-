import { createServerClient } from "@supabase/ssr"
import { type NextRequest, NextResponse } from "next/server"
import { sanitizeInternalRedirect } from "@/utils/redirect"

export { sanitizeInternalRedirect }

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

export const createClient = async (request: NextRequest) => {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  if (!supabaseUrl || !supabaseKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, {
            ...options,
            maxAge: options?.maxAge ?? 60 * 60 * 24 * 30, // 30 days persistent session
            sameSite: "lax",
            path: "/",
          })
        )
      },
    },
  })

  // IMPORTANT: Do not run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Protected application routes
  const isProtectedPath =
    pathname.startsWith("/desk") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/settings") ||
    pathname.startsWith("/admin")

  // Auth entry routes
  const isAuthPath =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/forgot-password")

  // 1. Unauthenticated visitor trying to access protected paths -> redirect to /login
  if (!user && isProtectedPath) {
    const redirectUrl = request.nextUrl.clone()
    redirectUrl.pathname = "/login"
    // Preserve requested internal destination
    redirectUrl.searchParams.set("next", pathname + (request.nextUrl.search || ""))
    return NextResponse.redirect(redirectUrl)
  }

  // 2. Authenticated user visiting auth entry pages (/login, /signup, /forgot-password) -> redirect to destination
  if (user && isAuthPath) {
    const rawNext = request.nextUrl.searchParams.get("next")
    const safeDestination = sanitizeInternalRedirect(rawNext, "/dashboard")
    const redirectUrl = new URL(safeDestination, request.url)
    return NextResponse.redirect(redirectUrl)
  }

  return supabaseResponse
}
