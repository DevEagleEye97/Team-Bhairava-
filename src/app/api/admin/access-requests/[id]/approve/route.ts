import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js"
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

    const { origin } = new URL(request.url)

    // 1. Check in database first
    let targetEmail = ""
    let currentStatus = ""

    const { data: dbRequest } = await supabase
      .from("access_requests")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (dbRequest) {
      targetEmail = dbRequest.email_normalized
      currentStatus = dbRequest.status
    } else {
      const memStore = globalThis.__accessRequestsMemoryStore || []
      const found = memStore.find((r) => r.id === id)
      if (found) {
        targetEmail = found.email_normalized
        currentStatus = found.status
      }
    }

    if (!targetEmail) {
      return NextResponse.json({ error: "Invitation request not found." }, { status: 404 })
    }

    if (currentStatus === "invite_sent" || currentStatus === "accepted") {
      return NextResponse.json({ message: "An invitation has already been issued to this user." }, { status: 200 })
    }

    // 2. Dispatch Supabase Admin Invitation if service role key is configured
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

    let inviteSent = false
    let inviteError: string | null = null

    if (serviceRoleKey && serviceRoleKey.trim().length > 10 && supabaseUrl) {
      try {
        const adminClient = createSupabaseAdminClient(supabaseUrl, serviceRoleKey, {
          auth: { autoRefreshToken: false, persistSession: false },
        })

        const { error: inviteErr } = await adminClient.auth.admin.inviteUserByEmail(targetEmail, {
          redirectTo: `${origin}/auth/callback?next=/settings/security`,
        })

        if (inviteErr) {
          inviteError = inviteErr.message
        } else {
          inviteSent = true
        }
      } catch (adminErr: unknown) {
        inviteError = adminErr instanceof Error ? adminErr.message : "Failed to call inviteUserByEmail"
      }
    }

    const newStatus = inviteSent ? "invite_sent" : "approved"
    const nowIso = new Date().toISOString()

    // 3. Update database record
    await supabase
      .from("access_requests")
      .update({
        status: newStatus,
        reviewed_at: nowIso,
        reviewed_by: user.id,
        invitation_sent_at: inviteSent ? nowIso : null,
        last_error: inviteError,
      })
      .eq("id", id)

    // Update memory fallback
    if (globalThis.__accessRequestsMemoryStore) {
      const memItem = globalThis.__accessRequestsMemoryStore.find((r) => r.id === id)
      if (memItem) {
        memItem.status = newStatus
        memItem.reviewed_at = nowIso
        memItem.reviewed_by = user.id
        memItem.last_error = inviteError || undefined
      }
    }

    return NextResponse.json({
      success: true,
      status: newStatus,
      inviteSent,
      targetEmail,
      note: inviteSent
        ? `Invitation email dispatched to ${targetEmail}.`
        : `Request approved for ${targetEmail}. (Configure SUPABASE_SERVICE_ROLE_KEY for automated email dispatch or click Send Invitation in Supabase Dashboard).`,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error approving request"
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
