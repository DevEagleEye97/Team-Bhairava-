"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Lock,
  Mail,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  GraduationCap,
  AlertCircle,
  CheckSquare,
  Square,
  UserPlus,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"
import { sanitizeInternalRedirect } from "@/utils/redirect"

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawNext = searchParams.get("next")
  const targetDestination = sanitizeInternalRedirect(rawNext, "/dashboard")

  const supabase = React.useMemo(() => createClient(), [])

  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [rememberMe, setRememberMe] = React.useState(true)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)

  // Restore saved email and check if existing session is already active
  React.useEffect(() => {
    async function checkExistingSession() {
      const savedEmail = localStorage.getItem("hf_saved_email")
      if (savedEmail) {
        setEmail(savedEmail)
      }

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        // Session persisted across tab close! Direct to desk
        router.push(targetDestination)
      }
    }

    checkExistingSession()
  }, [supabase, router, targetDestination])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage(null)

    if (!email.trim() || !password) {
      setErrorMessage("Please enter both your institutional email and password.")
      setIsLoading(false)
      return
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        throw error
      }

      // Persist email if remember me is checked
      if (rememberMe) {
        localStorage.setItem("hf_saved_email", email.trim())
      } else {
        localStorage.removeItem("hf_saved_email")
      }

      if (data.user) {
        localStorage.setItem("hf_session_user_id", data.user.id)
        localStorage.setItem("hf_session_user_email", data.user.email || "")
      }

      toast.success("Welcome back! Entering Team Bhairava Desk...")
      router.push(targetDestination)
      router.refresh()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed. Please verify credentials."
      setErrorMessage(msg)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-zinc-950/40 backdrop-blur-[2px] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
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
          <span className="text-xs text-zinc-400 hidden sm:inline">Invite-only workspace</span>
          <Button
            asChild
            variant="outline"
            size="sm"
            className="h-8 text-xs border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 hover:text-zinc-100 text-zinc-300 gap-1.5"
          >
            <Link href="/request-invite">
              <UserPlus className="size-3.5" />
              <span>Request Invitation</span>
            </Link>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-md space-y-4">
          <Card className="border border-zinc-800/90 bg-zinc-900/90 shadow-2xl relative">
            <CardHeader className="space-y-1.5 pb-4">
              <div className="size-10 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300 mb-2">
                <Shield className="size-5 text-indigo-400" />
              </div>
              <CardTitle className="font-heading text-xl font-bold tracking-tight text-zinc-100">
                Sign In to Team Desk
              </CardTitle>
              <CardDescription className="text-xs text-zinc-400 leading-relaxed">
                Enter your institutional credentials. Your session is securely remembered across browser sessions and tab closes.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {errorMessage && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300 flex items-start gap-2.5">
                  <AlertCircle className="size-4 shrink-0 mt-0.5 text-rose-400" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form id="login-form" onSubmit={handleSignIn} className="space-y-3.5" method="POST">
                <div className="space-y-1">
                  <label htmlFor="login-email" className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                    <Mail className="size-3 text-zinc-400" />
                    Institutional Email
                  </label>
                  <Input
                    id="login-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@saptagirinps.edu.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label htmlFor="login-password" className="text-[11px] font-medium text-zinc-300 flex items-center gap-1.5">
                      <Lock className="size-3 text-zinc-400" />
                      Password
                    </label>
                    <Link
                      href="/forgot-password"
                      className="text-[11px] text-zinc-400 hover:text-zinc-200 underline underline-offset-2"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Input
                      id="login-password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="••••••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-8 pr-8 text-xs bg-zinc-950/60 border-zinc-800"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me Option */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setRememberMe(!rememberMe)}
                    className="flex items-center gap-2 text-xs text-zinc-400 hover:text-zinc-200 cursor-pointer select-none"
                  >
                    {rememberMe ? (
                      <CheckSquare className="size-4 text-indigo-400" />
                    ) : (
                      <Square className="size-4 text-zinc-600" />
                    )}
                    <span>Remember login on this device</span>
                  </button>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-8 text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors gap-2 cursor-pointer mt-2"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="size-3.5 rounded-full border-2 border-zinc-900 border-t-zinc-400 animate-spin" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>Sign In & Open Dashboard</span>
                      <ArrowRight className="size-3.5" />
                    </>
                  )}
                </Button>
              </form>

              {/* Request Invite CTA for new visitors */}
              <div className="text-center pt-3 border-t border-zinc-800/60">
                <p className="text-[11px] text-zinc-500">
                  Don&apos;t have an account?{" "}
                  <Link
                    href="/request-invite"
                    className="font-medium text-zinc-300 hover:text-white underline underline-offset-2"
                  >
                    Request an Invitation
                  </Link>
                </p>
              </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t border-zinc-800/60 text-center justify-center text-[10px] text-zinc-500">
              Saptagiri NPS University • CSE General • Semester 1, P-Cycle
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

export default function LoginPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-400 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-4 rounded-full border-2 border-zinc-700 border-t-zinc-300 animate-spin" />
            <span>Loading Team Bhairava Desk...</span>
          </div>
        </div>
      }
    >
      <LoginForm />
    </React.Suspense>
  )
}
