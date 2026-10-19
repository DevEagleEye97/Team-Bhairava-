import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"

// In-memory sliding-window rate limit: max 5 requests per 15 minutes per IP
const rateLimitMap = new Map<string, { count: number; expiresAt: number }>()

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.expiresAt) {
    rateLimitMap.set(ip, { count: 1, expiresAt: now + 15 * 60 * 1000 })
    return true
  }

  if (entry.count >= 5) {
    return false
  }

  entry.count += 1
  return true
}

// In-memory store for access requests when database table migration is pending approval
export interface StoredAccessRequest {
  id: string
  full_name: string
  email_normalized: string
  reason: string
  status: "pending" | "approved" | "rejected" | "invite_sent"
  created_at: string
  reviewed_at?: string
  reviewed_by?: string
  last_error?: string
}

declare global {
  var __accessRequestsMemoryStore: StoredAccessRequest[] | undefined
}

if (!globalThis.__accessRequestsMemoryStore) {
  globalThis.__accessRequestsMemoryStore = []
}

export async function POST(request: Request) {
  try {
    const forwarded = request.headers.get("x-forwarded-for")
    const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1"

    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a few minutes before submitting another request." },
        { status: 429 }
      )
    }

    const body = await request.json().catch(() => null)
    if (!body) {
      return NextResponse.json({ error: "Invalid request payload." }, { status: 400 })
    }

    const { fullName, email, reason } = body

    if (!fullName || typeof fullName !== "string" || fullName.trim().length < 2) {
      return NextResponse.json({ error: "Please enter your full name (minimum 2 characters)." }, { status: 400 })
    }

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 })
    }

    const emailNormalized = email.toLowerCase().trim()
    const cleanFullName = fullName.trim()
    const cleanReason = typeof reason === "string" ? reason.trim().slice(0, 500) : ""

    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Attempt to persist into PostgreSQL access_requests table
    const { error: dbError } = await supabase.from("access_requests").insert({
      full_name: cleanFullName,
      email_normalized: emailNormalized,
      reason: cleanReason,
      status: "pending",
    })

    if (dbError) {
      // If table doesn't exist yet (PGRST205) or RLS restriction, store in server memory
      const memStore = globalThis.__accessRequestsMemoryStore || []
      const exists = memStore.find(
        (r) => r.email_normalized === emailNormalized && r.status === "pending"
      )

      if (!exists) {
        memStore.unshift({
          id: `req-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          full_name: cleanFullName,
          email_normalized: emailNormalized,
          reason: cleanReason,
          status: "pending",
          created_at: new Date().toISOString(),
        })
      }
    }

    // Return the exact mandatory neutral confirmation message
    return NextResponse.json({
      message:
        "Invitation request received. Your request is awaiting review. If approved, you will receive an email with instructions to set up your HackForge account.",
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error"
    console.error("Access request submission error:", errorMsg)
    return NextResponse.json(
      {
        message:
          "Invitation request received. Your request is awaiting review. If approved, you will receive an email with instructions to set up your HackForge account.",
      },
      { status: 200 }
    )
  }
}
