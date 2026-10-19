"use client"

import * as React from "react"
import Link from "next/link"
import {
  User,
  Mail,
  FileText,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  GraduationCap,
  ArrowLeft,
  KeyRound,
  Sparkles,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"

export default function SignUpPage() {
  const [activeMode, setActiveMode] = React.useState<"request" | "invited">("request")

  // Form fields
  const [fullName, setFullName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState("CSE General • Semester 1, P-Cycle")
  const [reason, setReason] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [confirmationMessage, setConfirmationMessage] = React.useState<string | null>(null)

  const handleRequestSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!fullName.trim()) {
      setErrorMessage("Please enter your full name.")
      return
    }

    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Please enter a valid institutional email address.")
      return
    }

    setIsLoading(true)

    try {
      const fullReason = reason.trim()
        ? `[${role}] ${reason.trim()}`
        : `[${role}] Requesting access for Team Bhairava academic desk & hackathon collaboration.`

      const res = await fetch("/api/auth/request-invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          reason: fullReason,
        }),
      })

      const data = await res.json()

      if (!res.ok && res.status !== 200) {
        throw new Error(data.error || "Failed to submit invitation request.")
      }

      setConfirmationMessage(
        data.message ||
          "Invitation request received. Your request is awaiting review. If approved, you will receive an email with instructions to set up your HackForge account."
      )
      toast.success("Invitation request submitted successfully.")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to submit request."
      setErrorMessage(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-zinc-950 text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="size-8 rounded-lg bg-zinc-800 border border-zinc-700/80 flex items-center justify-center text-zinc-100 font-mono font-bold text-xs group-hover:border-zinc-600 transition-colors">
            HF
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-zinc-100">HackForge</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
                Team Bhairava
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 flex items-center gap-1">
              <GraduationCap className="size-3 text-zinc-400" />
              Saptagiri NPS University • Semester 1, P-Cycle
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 text-xs border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:text-zinc-100 text-zinc-300 gap-1.5"
          >
            <Link href="/login">
              <ArrowLeft className="size-3.5" />
              <span>Already a Member? Sign In</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-lg space-y-4">
          <Card className="border border-zinc-800/90 bg-zinc-900/90 shadow-2xl relative">
            <CardHeader className="space-y-2 pb-4">
              <div className="flex items-center justify-between">
                <div className="size-10 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
                  <ShieldCheck className="size-5 text-indigo-400" />
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[11px] font-mono text-indigo-300">
                  <Sparkles className="size-3 text-indigo-400" />
                  <span>Invite-Only Access</span>
                </div>
              </div>

              <div>
                <CardTitle className="font-heading text-xl font-bold tracking-tight text-zinc-100">
                  Join Team Bhairava Desk
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400 leading-relaxed mt-1">
                  Public registrations are restricted. Request an invitation below to join our academic team workspace for IA-1 and hackathon projects.
                </CardDescription>
              </div>

              {/* Mode Switcher */}
              <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-zinc-950/80 border border-zinc-800 text-xs mt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode("request")
                    setErrorMessage(null)
                  }}
                  className={`py-1.5 px-3 rounded-md font-medium transition-all ${
                    activeMode === "request"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  Request an Invitation
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveMode("invited")
                    setErrorMessage(null)
                  }}
                  className={`py-1.5 px-3 rounded-md font-medium transition-all ${
                    activeMode === "invited"
                      ? "bg-zinc-800 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  I Have an Invitation
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {activeMode === "request" ? (
                confirmationMessage ? (
                  <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4 space-y-3">
                    <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
                      <CheckCircle2 className="size-4 shrink-0" />
                      <span>Request Submitted</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      {confirmationMessage}
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <Button
                        asChild
                        variant="outline"
                        className="flex-1 h-8 text-xs border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                      >
                        <Link href="/login">Return to Sign In</Link>
                      </Button>
                      <Button
                        type="button"
                        onClick={() => {
                          setConfirmationMessage(null)
                          setFullName("")
                          setEmail("")
                          setReason("")
                        }}
                        variant="ghost"
                        className="h-8 text-xs text-zinc-400 hover:text-zinc-200"
                      >
                        Submit another request
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {errorMessage && (
                      <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2.5">
                        <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-400" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    <form onSubmit={handleRequestSubmit} className="space-y-3.5">
                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                          <User className="size-3 text-zinc-400" />
                          Full Name <span className="text-rose-400">*</span>
                        </label>
                        <Input
                          type="text"
                          placeholder="e.g. Om Kumar"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                          <Mail className="size-3 text-zinc-400" />
                          Institutional Email Address <span className="text-rose-400">*</span>
                        </label>
                        <Input
                          type="email"
                          placeholder="name@saptagirinps.edu.in"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                        />
                        <p className="text-[10px] text-zinc-500">
                          Use your Saptagiri NPS University or verified college domain.
                        </p>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                          <GraduationCap className="size-3 text-zinc-400" />
                          Academic Program & Cycle
                        </label>
                        <Input
                          type="text"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                          className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                          <FileText className="size-3 text-zinc-400" />
                          Reason / Planned Contribution
                        </label>
                        <Textarea
                          rows={3}
                          placeholder="Tell us what projects or exams you're collaborating on (e.g., IA-1 C Programming, Web Hackathon track)..."
                          value={reason}
                          onChange={(e) => setReason(e.target.value)}
                          className="text-xs bg-zinc-950/60 border-zinc-800 resize-none"
                        />
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-8 text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors gap-2 cursor-pointer mt-1"
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                            <span className="size-3.5 rounded-full border-2 border-zinc-900 border-t-zinc-400 animate-spin" />
                            Submitting Request...
                          </span>
                        ) : (
                          <>
                            <span>Request Workspace Invitation</span>
                            <ArrowRight className="size-3.5" />
                          </>
                        )}
                      </Button>
                    </form>
                  </>
                )
              ) : (
                /* Already Invited Mode */
                <div className="space-y-4 py-2">
                  <div className="p-4 rounded-lg bg-zinc-950/60 border border-zinc-800 space-y-3">
                    <div className="flex items-center gap-2 text-indigo-400 font-medium text-xs">
                      <KeyRound className="size-4 shrink-0" />
                      <span>Received an Invitation Email?</span>
                    </div>
                    <p className="text-xs text-zinc-300 leading-relaxed">
                      If an administrator has approved your request, you received an invitation email with a one-time secure link to set your password.
                    </p>
                    <ol className="text-xs text-zinc-400 space-y-1.5 list-decimal pl-4">
                      <li>Open the invitation email in your institutional inbox.</li>
                      <li>Click <strong>&quot;Accept Invitation&quot;</strong> to establish your credentials.</li>
                      <li>Create your secure password and you will immediately be directed to your desk.</li>
                    </ol>
                  </div>

                  <div className="flex flex-col gap-2">
                    <Button
                      asChild
                      className="w-full h-8 text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950"
                    >
                      <Link href="/login">
                        <span>Already Completed Setup? Sign In</span>
                        <ArrowRight className="size-3.5 ml-2" />
                      </Link>
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setActiveMode("request")}
                      className="w-full h-8 text-xs text-zinc-400 hover:text-zinc-200"
                    >
                      Need an invite? Click here to request one
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t border-zinc-800/60 text-center justify-center text-[10px] text-zinc-500">
              Saptagiri NPS University • Team Bhairava Academic Workspace
            </CardFooter>
          </Card>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-[11px] text-zinc-500 border-t border-zinc-800/60 bg-zinc-950/60">
        <span>© 2026 HackForge • Team Bhairava</span>
      </footer>
    </div>
  )
}
