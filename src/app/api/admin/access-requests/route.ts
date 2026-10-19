import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { isAuthorizedAdmin } from "@/utils/admin"
import { StoredAccessRequest } from "@/app/api/auth/request-invite/route"

export async function GET() {
  try {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Enforce server-side administrator authorization
    if (!user || !isAuthorizedAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized. Administrator access required." }, { status: 403 })
    }

    // 1. Attempt to query PostgreSQL access_requests table
    const { data: dbData, error: dbError } = await supabase
      .from("access_requests")
      .select("*")
      .order("created_at", { ascending: false })

    if (!dbError && dbData) {
      return NextResponse.json({
        requests: dbData,
        source: "database",
      })
    }

    // 2. Fallback to memory store if database table is pending migration
    const memStore: StoredAccessRequest[] = globalThis.__accessRequestsMemoryStore || []

    return NextResponse.json({
      requests: memStore,
      source: "memory_pending_migration",
      note: "Database table public.access_requests is pending migration.",
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error"
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
