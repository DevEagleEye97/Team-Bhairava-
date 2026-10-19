import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { isAuthorizedAdmin } from "@/utils/admin"

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !isAuthorizedAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized. Administrator access required." }, { status: 403 })
    }

    const nowIso = new Date().toISOString()

    // Update database
    await supabase
      .from("access_requests")
      .update({
        status: "rejected",
        reviewed_at: nowIso,
        reviewed_by: user.id,
      })
      .eq("id", id)

    // Update memory fallback
    if (globalThis.__accessRequestsMemoryStore) {
      const memItem = globalThis.__accessRequestsMemoryStore.find((r) => r.id === id)
      if (memItem) {
        memItem.status = "rejected"
        memItem.reviewed_at = nowIso
        memItem.reviewed_by = user.id
      }
    }

    return NextResponse.json({ success: true, status: "rejected" })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error rejecting request"
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
