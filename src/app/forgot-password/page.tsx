"use client"

import * as React from "react"
import Link from "next/link"
import {
  Lock,
  Mail,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  GraduationCap,
  ArrowLeft,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

export default function ForgotPasswordPage() {
  const supabase = React.useMemo(() => createClient(), [])

  const [email, setEmail] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = React.useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!email.trim()) {
      setErrorMessage("Please enter your registered institutional email.")
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/settings/security`,
      })

      if (error) {
        throw error
      }

      setIsSubmitted(true)
      toast.success("Password reset instructions dispatched.")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to request password reset. Please try again."
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

        <Button
          asChild
          variant="outline"
          size="sm"
          className="h-8 text-xs border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:text-zinc-100 text-zinc-300 gap-1.5"
        >
          <Link href="/login">
            <ArrowLeft className="size-3.5" />
            <span>Back to Login</span>
          </Link>
        </Button>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-4">
          <Card className="border border-zinc-800/90 bg-zinc-900/90 shadow-2xl relative">
            <CardHeader className="space-y-1.5 pb-4">
              <div className="size-10 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 mb-2">
                <Lock className="size-5 text-indigo-400" />
              </div>
              <CardTitle className="font-heading text-xl font-bold tracking-tight text-zinc-100">
                Reset Account Password
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 leading-relaxed">
                Enter your registered Saptagiri NPS University email address. We will send a secure link to reset your credentials.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {isSubmitted ? (
                <div className="rounded-lg border border-indigo-500/30 bg-indigo-500/10 p-4 space-y-3">
                  <div className="flex items-center gap-2 text-indigo-400 font-medium text-sm">
                    <CheckCircle2 className="size-4" />
                    <span>Reset email dispatched</span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    If an account matches <strong className="text-zinc-100">{email}</strong>, a recovery token has been sent. Follow the instructions in the email to define a new password.
                  </p>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full h-8 text-xs border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700"
                  >
                    <Link href="/login">Return to Sign In</Link>
                  </Button>
                </div>
              ) : (
                <>
                  {errorMessage && (
                    <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2.5">
                      <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-400" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleReset} className="space-y-3.5">
                    <div className="space-y-1">
                      <label className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                        <Mail className="size-3 text-zinc-400" />
                        Institutional Email Address
                      </label>
                      <Input
                        type="email"
                        placeholder="username@saptagirinps.edu.in"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
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
                          Sending Reset Instructions...
                        </span>
                      ) : (
                        <>
                          <span>Send Recovery Link</span>
                          <ArrowRight className="size-3.5" />
                        </>
                      )}
                    </Button>
                  </form>
                </>
              )}
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t border-zinc-800/60 text-center justify-center text-[10px] text-zinc-500">
              Saptagiri NPS University • Team Bhairava Academic Desk
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
