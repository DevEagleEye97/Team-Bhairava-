"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  Send,
  ArrowLeft,
  RefreshCw,
  AlertTriangle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

interface AccessRequest {
  id: string
  full_name: string
  email_normalized: string
  reason?: string
  status: "pending" | "approved" | "rejected" | "invite_sent" | "accepted"
  created_at: string
  reviewed_at?: string
  last_error?: string
}

export default function AdminAccessRequestsPage() {
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])

  const [requests, setRequests] = React.useState<AccessRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [isAdmin, setIsAdmin] = React.useState(false)
  const [adminEmail, setAdminEmail] = React.useState<string | null>(null)
  const [processingId, setProcessingId] = React.useState<string | null>(null)

  const fetchRequests = React.useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/access-requests")
      if (res.status === 403) {
        setIsAdmin(false)
        setIsLoading(false)
        return
      }

      if (!res.ok) {
        throw new Error("Failed to fetch requests.")
      }

      const data = await res.json()
      setRequests(data.requests || [])
      setIsAdmin(true)
    } catch (err) {
      console.error(err)
      toast.error("Could not load access requests.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login?next=/admin/access-requests")
        return
      }

      setAdminEmail(user.email || null)
      fetchRequests()
    }

    checkAuth()
  }, [supabase, router, fetchRequests])

  const handleApprove = async (id: string, name: string) => {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/admin/access-requests/${id}/approve`, {
        method: "POST",
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Approval failed.")
      }

      toast.success(data.note || `Approved access for ${name}.`)
      fetchRequests()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve request."
      toast.error(msg)
    } finally {
      setProcessingId(null)
    }
  }

  const handleReject = async (id: string, name: string) => {
    setProcessingId(id)
    try {
      const res = await fetch(`/api/admin/access-requests/${id}/reject`, {
        method: "POST",
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.error || "Rejection failed.")
      }

      toast.info(`Request for ${name} rejected.`)
      fetchRequests()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reject request."
      toast.error(msg)
    } finally {
      setProcessingId(null)
    }
  }

  if (!isLoading && !isAdmin) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center p-4">
        <Card className="max-w-md w-full border-zinc-800 bg-zinc-900/90 text-center p-6 space-y-4">
          <div className="size-12 mx-auto rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
            <AlertTriangle className="size-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-zinc-100">Access Restricted</h2>
            <p className="text-xs text-zinc-400 mt-1">
              You are signed in as <strong className="text-zinc-200">{adminEmail}</strong>, which does not have authorized administrator privileges for Team Bhairava.
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="h-8 text-xs border-zinc-700 bg-zinc-800 text-zinc-200">
            <Link href="/desk">Return to Team Desk</Link>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 md:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          >
            <Link href="/desk">
              <ArrowLeft className="size-3.5" />
              <span>Back to Desk</span>
            </Link>
          </Button>

          <div className="h-4 w-px bg-zinc-800" />

          <div className="flex items-center gap-2">
            <ShieldCheck className="size-4 text-indigo-400" />
            <span className="font-semibold text-sm tracking-tight text-zinc-100">
              Admin Access Review
            </span>
            <Badge variant="outline" className="text-[10px] font-mono border-zinc-700 text-zinc-400">
              Team Bhairava
            </Badge>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={fetchRequests}
          disabled={isLoading}
          className="h-8 text-xs border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 gap-1.5"
        >
          <RefreshCw className={`size-3.5 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </Button>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-zinc-100">
            Invitation & Access Requests
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Review prospective student and faculty requests to join Team Bhairava. Approved invitees receive secure setup links.
          </p>
        </div>

        {/* Requests Table / Card */}
        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-zinc-200">
                Pending & Reviewed Requests ({requests.length})
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400">
                Authorized approvals invoke Supabase Auth Admin invitations.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            {requests.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-zinc-800 rounded-lg space-y-2">
                <CheckCircle2 className="size-8 mx-auto text-zinc-600" />
                <div className="text-xs font-medium text-zinc-300">No pending requests</div>
                <p className="text-[11px] text-zinc-500 max-w-xs mx-auto">
                  New student requests submitted via the invitation form will appear here for review.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/40">
                {requests.map((req) => {
                  const isProcessing = processingId === req.id
                  const formattedDate = new Date(req.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })

                  return (
                    <div
                      key={req.id}
                      className="flex flex-col md:flex-row md:items-center justify-between p-4 gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-zinc-100">
                            {req.full_name}
                          </span>
                          <span className="text-[11px] font-mono text-zinc-400">
                            {req.email_normalized}
                          </span>
                          <Badge
                            className={
                              req.status === "pending"
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : req.status === "invite_sent" || req.status === "approved"
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                            }
                          >
                            {req.status.replace("_", " ")}
                          </Badge>
                        </div>

                        {req.reason && (
                          <p className="text-xs text-zinc-300 italic line-clamp-2">
                            &ldquo;{req.reason}&rdquo;
                          </p>
                        )}

                        <div className="flex items-center gap-2 text-[10px] text-zinc-500">
                          <Clock className="size-3" />
                          <span>Submitted on {formattedDate}</span>
                          {req.last_error && (
                            <span className="text-rose-400">({req.last_error})</span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2 shrink-0">
                        {req.status === "pending" ? (
                          <>
                            <Button
                              size="sm"
                              disabled={isProcessing}
                              onClick={() => handleApprove(req.id, req.full_name)}
                              className="h-8 text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white gap-1.5 cursor-pointer"
                            >
                              <Send className="size-3" />
                              <span>Approve & Invite</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isProcessing}
                              onClick={() => handleReject(req.id, req.full_name)}
                              className="h-8 text-xs border-zinc-700 bg-zinc-800 text-rose-400 hover:bg-rose-500/10 cursor-pointer"
                            >
                              <XCircle className="size-3.5" />
                              <span>Reject</span>
                            </Button>
                          </>
                        ) : req.status === "approved" || req.status === "invite_sent" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isProcessing}
                            onClick={() => handleApprove(req.id, req.full_name)}
                            className="h-7 text-xs border-zinc-700 bg-zinc-800 text-zinc-300 hover:text-white"
                          >
                            <span>Re-send Invite</span>
                          </Button>
                        ) : (
                          <span className="text-xs text-zinc-500">Rejected</span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
