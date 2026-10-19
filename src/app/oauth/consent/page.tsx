"use client"

import * as React from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  ShieldCheck,
  ShieldAlert,
  Shield,
  Check,
  X,
  ExternalLink,
  Lock,
  User,
  Mail,
  KeyRound,
  Database,
  Globe,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  LogOut,
  AlertCircle,
  Cpu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StarryBackground } from "@/components/ui/starry-background"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

interface OAuthClientDetails {
  id: string
  name: string
  uri?: string
  logo_uri?: string
}

interface OAuthUserDetails {
  id: string
  email: string
}

interface OAuthDetailsState {
  authorization_id: string
  redirect_uri: string
  client: OAuthClientDetails
  user: OAuthUserDetails
  scope: string
}

// Scope descriptor map for human-friendly permission explanations
const SCOPE_DEFINITIONS: Record<
  string,
  { label: string; description: string; icon: React.ElementType; critical?: boolean }
> = {
  openid: {
    label: "Identity Verification (OpenID)",
    description: "Verify your identity using your Team Bhairava account credentials.",
    icon: ShieldCheck,
  },
  profile: {
    label: "User Profile Information",
    description: "View your display name, academic profile, and avatar.",
    icon: User,
  },
  email: {
    label: "Primary Email Address",
    description: "View the verified email address associated with your account.",
    icon: Mail,
  },
  offline_access: {
    label: "Offline & Background Access",
    description: "Maintain a continuous connection and refresh tokens when you are not actively using the app.",
    icon: KeyRound,
  },
  read: {
    label: "Read Workspace Data",
    description: "Access your project boards, sprint records, and team workspaces.",
    icon: Database,
  },
  write: {
    label: "Modify Workspace Data",
    description: "Create, update, or delete tasks, sprint goals, and notes on your behalf.",
    icon: Layers,
    critical: true,
  },
}

function parseScopes(scopeString?: string) {
  if (!scopeString) return []
  const tokens = scopeString.split(/\s+/).filter(Boolean)
  return tokens.map((token) => {
    const matched = SCOPE_DEFINITIONS[token.toLowerCase()]
    if (matched) {
      return { token, ...matched }
    }
    return {
      token,
      label: token,
      description: `Access resource scope: ${token}`,
      icon: Cpu,
      critical: false,
    }
  })
}

function OAuthConsentContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const authorizationId =
    searchParams.get("authorization_id") || searchParams.get("authorizationId")

  const supabase = React.useMemo(() => createClient(), [])

  const [isLoading, setIsLoading] = React.useState(true)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [authDetails, setAuthDetails] = React.useState<OAuthDetailsState | null>(null)
  const [currentUser, setCurrentUser] = React.useState<{ id: string; email?: string; name?: string } | null>(null)
  const [isPreviewMode, setIsPreviewMode] = React.useState(false)

  // 1. Check user authentication and retrieve authorization details
  React.useEffect(() => {
    let isMounted = true

    async function loadAuthorization() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        // Fetch current session
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user && authorizationId) {
          // If authorization_id is provided but user isn't logged in, redirect to login with return target
          const currentPath = `/oauth/consent?${searchParams.toString()}`
          router.push(`/login?next=${encodeURIComponent(currentPath)}`)
          return
        }

        if (user && isMounted) {
          const savedName = localStorage.getItem("hf_user_name")
          const fullName =
            savedName ||
            user.user_metadata?.full_name ||
            user.user_metadata?.name ||
            user.email?.split("@")[0] ||
            "Team Member"

          setCurrentUser({
            id: user.id,
            email: user.email,
            name: fullName,
          })
        }

        // If no authorization ID was provided in the URL, this is a dashboard preview check
        if (!authorizationId) {
          if (isMounted) {
            setIsPreviewMode(true)
            setAuthDetails({
              authorization_id: "preview-auth-id-demo-84920",
              redirect_uri: "https://cursor.com/auth/callback",
              client: {
                id: "client-preview-demo-uuid",
                name: "Cursor AI / MCP Integration",
                uri: "https://cursor.com",
                logo_uri: "",
              },
              user: {
                id: user?.id || "preview-user-id",
                email: user?.email || "developer@saptagirinps.edu.in",
              },
              scope: "openid profile email offline_access read",
            })
            setIsLoading(false)
          }
          return
        }

        // Fetch real OAuth 2.1 authorization details from Supabase Auth Server
        const { data, error } = await supabase.auth.oauth.getAuthorizationDetails(authorizationId)

        if (error) {
          if (isMounted) {
            setErrorMessage(error.message || "Failed to load OAuth authorization request.")
            setIsLoading(false)
          }
          return
        }

        if (!data) {
          if (isMounted) {
            setErrorMessage("No authorization request data returned from the server.")
            setIsLoading(false)
          }
          return
        }

        // If the user has already consented or auto-approved, redirect immediately
        if ("redirect_url" in data && data.redirect_url) {
          window.location.href = data.redirect_url
          return
        }

        // If consent is required, populate state
        if ("authorization_id" in data && isMounted) {
          setAuthDetails(data as unknown as OAuthDetailsState)
          setIsPreviewMode(false)
          setIsLoading(false)
        }
      } catch (err: unknown) {
        if (isMounted) {
          const msg =
            err instanceof Error ? err.message : "Unexpected error during authorization initialization."
          setErrorMessage(msg)
          setIsLoading(false)
        }
      }
    }

    loadAuthorization()

    return () => {
      isMounted = false
    }
  }, [authorizationId, router, searchParams, supabase])

  // Handle Approve
  const handleApprove = async () => {
    if (isPreviewMode) {
      toast.success("Preview Mode: Authorization simulated successfully!", {
        description: "In production, the browser would redirect to the client's redirect_uri with the auth code.",
      })
      return
    }

    if (!authorizationId) return

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase.auth.oauth.approveAuthorization(authorizationId)

      if (error) {
        toast.error(`Approval failed: ${error.message}`)
        setErrorMessage(error.message)
        setIsSubmitting(false)
        return
      }

      if (data?.redirect_url) {
        toast.success("Authorization granted! Redirecting back to client...")
        window.location.href = data.redirect_url
      } else {
        toast.success("Authorization confirmed.")
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve authorization request."
      toast.error(msg)
      setErrorMessage(msg)
      setIsSubmitting(false)
    }
  }

  // Handle Deny
  const handleDeny = async () => {
    if (isPreviewMode) {
      toast.info("Preview Mode: Authorization rejection simulated.", {
        description: "In production, an access_denied error would be sent back to the client callback.",
      })
      return
    }

    if (!authorizationId) return

    setIsSubmitting(true)
    try {
      const { data, error } = await supabase.auth.oauth.denyAuthorization(authorizationId)

      if (error) {
        toast.error(`Denial failed: ${error.message}`)
        setErrorMessage(error.message)
        setIsSubmitting(false)
        return
      }

      if (data?.redirect_url) {
        toast.info("Authorization denied. Returning to application...")
        window.location.href = data.redirect_url
      } else {
        router.push("/dashboard")
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to deny authorization request."
      toast.error(msg)
      setErrorMessage(msg)
      setIsSubmitting(false)
    }
  }

  const handleSignOutAndSwitch = async () => {
    await supabase.auth.signOut()
    localStorage.removeItem("hf_session_user_id")
    toast.info("Signed out. Please sign in with the desired account.")
    const currentPath = `/oauth/consent?${searchParams.toString()}`
    router.push(`/login?next=${encodeURIComponent(currentPath)}`)
  }

  const scopes = parseScopes(authDetails?.scope)

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between bg-zinc-950/60 backdrop-blur-[2px] text-zinc-100 selection:bg-indigo-500/30 selection:text-indigo-200">
      <StarryBackground />

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
            <p className="text-[11px] text-zinc-500">OAuth 2.1 Identity Server</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          {isPreviewMode && (
            <Badge
              variant="outline"
              className="border-amber-500/40 bg-amber-500/10 text-amber-300 text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 gap-1"
            >
              <Sparkles className="size-3" />
              <span>Preview Mode</span>
            </Badge>
          )}
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 text-xs text-zinc-400 hover:text-zinc-100"
          >
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        </div>
      </header>

      {/* Main Consent Body */}
      <main className="relative z-10 flex-1 flex items-center justify-center p-4 md:p-8">
        <div className="w-full max-w-xl space-y-4">
          {/* Loading State */}
          {isLoading && (
            <Card className="border border-zinc-800 bg-zinc-900/90 shadow-2xl p-8 text-center space-y-4">
              <div className="flex justify-center">
                <div className="size-10 rounded-full border-2 border-indigo-500/30 border-t-indigo-400 animate-spin" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-semibold text-zinc-200">Verifying OAuth 2.1 Request</h3>
                <p className="text-xs text-zinc-400">
                  Retrieving client authorization details from Supabase Auth Server...
                </p>
              </div>
            </Card>
          )}

          {/* Error State */}
          {!isLoading && errorMessage && (
            <Card className="border border-rose-900/60 bg-zinc-900/90 shadow-2xl">
              <CardHeader className="pb-3">
                <div className="size-10 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-2">
                  <ShieldAlert className="size-5" />
                </div>
                <CardTitle className="text-lg font-bold text-zinc-100">
                  Authorization Request Invalid
                </CardTitle>
                <CardDescription className="text-xs text-zinc-400">
                  The requested OAuth 2.1 authorization request could not be processed.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg border border-rose-900/40 bg-rose-950/20 text-xs text-rose-300 flex items-start gap-2">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  <div>
                    <div className="font-semibold">Reason</div>
                    <div className="mt-0.5 text-zinc-300 font-mono text-[11px] break-all">
                      {errorMessage}
                    </div>
                  </div>
                </div>
                <p className="text-[11px] text-zinc-500">
                  This error typically occurs if the authorization request has already been used, has expired, or the client was not registered on this Supabase project.
                </p>
              </CardContent>
              <CardFooter className="pt-2 flex items-center justify-between border-t border-zinc-800/80">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs border-zinc-800 bg-zinc-900 hover:bg-zinc-800 text-zinc-200"
                >
                  <Link href="/dashboard">Return to Dashboard</Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.reload()}
                  className="h-8 text-xs text-zinc-400 hover:text-white"
                >
                  Retry Request
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Active Consent Screen */}
          {!isLoading && !errorMessage && authDetails && (
            <Card className="border border-zinc-800 bg-zinc-900/90 shadow-2xl relative overflow-hidden backdrop-blur-xl">
              {/* Subtle top accent gradient */}
              <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500" />

              <CardHeader className="space-y-4 pb-4">
                {/* Visual OAuth Bridge Diagram */}
                <div className="flex items-center justify-between p-3 rounded-xl border border-zinc-800 bg-zinc-950/70">
                  {/* Client App Node */}
                  <div className="flex items-center gap-2.5">
                    <div className="size-10 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-bold text-xs uppercase font-mono shadow-inner">
                      {authDetails.client.logo_uri ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={authDetails.client.logo_uri}
                          alt={authDetails.client.name}
                          className="size-8 object-contain rounded"
                        />
                      ) : (
                        authDetails.client.name.slice(0, 2)
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-zinc-100 flex items-center gap-1">
                        <span>{authDetails.client.name}</span>
                        {authDetails.client.uri && (
                          <a
                            href={authDetails.client.uri}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-zinc-500 hover:text-indigo-300"
                            title="Visit client website"
                          >
                            <ExternalLink className="size-3" />
                          </a>
                        )}
                      </div>
                      <div className="text-[10px] text-zinc-500 font-mono">
                        OAuth 2.1 Client
                      </div>
                    </div>
                  </div>

                  {/* Connection Bridge Pulse */}
                  <div className="flex items-center gap-1.5 px-3">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest hidden sm:inline">
                      Connects to
                    </span>
                    <ArrowRight className="size-3.5 text-zinc-600" />
                  </div>

                  {/* Team Bhairava Node */}
                  <div className="flex items-center gap-2.5 text-right">
                    <div>
                      <div className="text-xs font-semibold text-zinc-100">Team Bhairava</div>
                      <div className="text-[10px] text-zinc-500 font-mono">HackForge Identity</div>
                    </div>
                    <div className="size-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-100 font-bold text-xs font-mono">
                      TB
                    </div>
                  </div>
                </div>

                {/* Consent Title */}
                <div>
                  <CardTitle className="text-xl font-bold tracking-tight text-zinc-100">
                    Authorize <span className="text-indigo-400">{authDetails.client.name}</span>
                  </CardTitle>
                  <CardDescription className="text-xs text-zinc-400 mt-1">
                    This third-party application is requesting permission to access your Team Bhairava account.
                  </CardDescription>
                </div>

                {/* Authenticated Account Selector */}
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-zinc-800 bg-zinc-950/50">
                  <div className="flex items-center gap-2.5">
                    <div className="size-7 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center text-indigo-300 text-xs font-bold">
                      {(currentUser?.name || currentUser?.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-medium text-zinc-200">
                        {currentUser?.name || "Authorized User"}
                      </div>
                      <div className="text-[11px] text-zinc-500 font-mono">
                        {currentUser?.email || authDetails.user.email}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignOutAndSwitch}
                    className="text-[11px] text-zinc-400 hover:text-zinc-200 flex items-center gap-1 underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    <LogOut className="size-3" />
                    <span>Switch account</span>
                  </button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Requested Permissions Section */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-300 uppercase tracking-wider font-mono flex items-center gap-1.5">
                      <Shield className="size-3.5 text-indigo-400" />
                      Requested Permissions
                    </span>
                    <span className="text-[10px] text-zinc-500 font-mono">
                      {scopes.length} {scopes.length === 1 ? "scope" : "scopes"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/60 divide-y divide-zinc-800/60 overflow-hidden">
                    {scopes.map((s) => {
                      const Icon = s.icon
                      return (
                        <div key={s.token} className="p-3 flex items-start gap-3">
                          <div
                            className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                              s.critical
                                ? "bg-amber-500/10 border border-amber-500/30 text-amber-400"
                                : "bg-zinc-900 border border-zinc-800 text-zinc-300"
                            }`}
                          >
                            <Icon className="size-3.5" />
                          </div>
                          <div className="flex-1 space-y-0.5">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-medium text-zinc-200">
                                {s.label}
                              </span>
                              <Badge
                                variant="outline"
                                className="font-mono text-[9px] px-1.5 py-0 border-zinc-800 text-zinc-400 bg-zinc-900"
                              >
                                {s.token}
                              </Badge>
                            </div>
                            <p className="text-[11px] text-zinc-400 leading-relaxed">
                              {s.description}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Security Guarantee Notice */}
                <div className="p-3 rounded-lg border border-zinc-800/60 bg-zinc-950/40 text-[11px] text-zinc-400 space-y-1">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-medium">
                    <Lock className="size-3 text-emerald-400" />
                    <span>Security & Privacy Protection</span>
                  </div>
                  <p className="text-zinc-500 leading-relaxed">
                    Authorizing gives this client access only to the requested scopes above. Team Bhairava will never share your password, secret environment keys, or ungranted resources. You can revoke this grant anytime in Settings.
                  </p>
                </div>

                {/* Preview Mode Alert Callout */}
                {isPreviewMode && (
                  <div className="p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-semibold">
                      <Sparkles className="size-3.5 text-amber-300" />
                      <span>Supabase OAuth Server Preview</span>
                    </div>
                    <p className="text-[11px] text-amber-200/80 leading-relaxed">
                      You are previewing the consent interface configured in your Supabase project (Site URL: <span className="font-mono text-white">team-bhairava-...vercel.app</span>, Path: <span className="font-mono text-white">/oauth/consent</span>). Clicking Authorize below will test the UI flow.
                    </p>
                  </div>
                )}
              </CardContent>

              <CardFooter className="pt-2 pb-6 px-6 flex flex-col sm:flex-row items-center gap-3 border-t border-zinc-800/80 bg-zinc-950/40">
                <Button
                  type="button"
                  onClick={handleApprove}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto sm:flex-1 h-9 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40 transition-all gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="size-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                      Processing Authorization...
                    </span>
                  ) : (
                    <>
                      <Check className="size-4" />
                      <span>Authorize & Continue</span>
                    </>
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDeny}
                  disabled={isSubmitting}
                  className="w-full sm:w-auto h-9 text-xs border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-colors gap-1.5 cursor-pointer"
                >
                  <X className="size-3.5" />
                  <span>Cancel / Deny</span>
                </Button>
              </CardFooter>
            </Card>
          )}

          {/* Technical Info Footnote */}
          <div className="text-center space-y-1">
            <p className="text-[10px] text-zinc-500">
              Supabase OAuth 2.1 Authorization Server • RFC 6749 / 7636 PKCE Protocol
            </p>
            <div className="flex items-center justify-center gap-3 text-[10px] text-zinc-600 font-mono">
              <span>Path: /oauth/consent</span>
              <span>•</span>
              <span>Project: kbkasggnwispxwbafkpw</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full py-4 text-center text-[11px] text-zinc-500 border-t border-zinc-800/60 bg-zinc-950/60">
        <span>© 2026 HackForge • Team Bhairava • Saptagiri NPS University</span>
      </footer>
    </div>
  )
}

export default function OAuthConsentPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-zinc-950 text-zinc-400 text-xs">
          <div className="flex items-center gap-2">
            <span className="size-4 rounded-full border-2 border-zinc-700 border-t-zinc-300 animate-spin" />
            <span>Loading OAuth Consent Screen...</span>
          </div>
        </div>
      }
    >
      <OAuthConsentContent />
    </React.Suspense>
  )
}
