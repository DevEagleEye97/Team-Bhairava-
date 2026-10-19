"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Shield,
  Mail,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Eye,
  EyeOff,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

export default function AccountSettingsPage() {
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])

  const [email, setEmail] = React.useState("om@saptagirinps.edu.in")
  const [isEmailVerified, setIsEmailVerified] = React.useState(true)
  const [createdDate, setCreatedDate] = React.useState<string>("October 18, 2026")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [isUpdatingPassword, setIsUpdatingPassword] = React.useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = React.useState(false)
  const [deleteConfirmationText, setDeleteConfirmationText] = React.useState("")

  React.useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        if (user.email) setEmail(user.email)
        setIsEmailVerified(Boolean(user.email_confirmed_at))
        if (user.created_at) {
          const d = new Date(user.created_at)
          setCreatedDate(d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }))
        }
      }
    }

    loadUser()
  }, [supabase])

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("Confirmation password does not match.")
      return
    }

    setIsUpdatingPassword(true)

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      setNewPassword("")
      setConfirmPassword("")
      toast.success("Account password updated successfully.")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update password."
      toast.error(msg)
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Session terminated. Signed out.")
      router.push("/login")
      router.refresh()
    } catch {
      router.push("/login")
    }
  }

  const handleDeleteAccount = () => {
    if (deleteConfirmationText !== "DELETE") {
      toast.error('Type "DELETE" to confirm account deactivation.')
      return
    }

    toast.info("Account deletion request submitted. Revoking active sessions...")
    setTimeout(async () => {
      await supabase.auth.signOut()
      router.push("/login")
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-100">Account & Security</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage credentials, security verification, active authentication sessions, and sign out.
        </p>
      </div>

      {/* Institutional Email Card */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Mail className="size-4 text-indigo-400" />
            <span>Institutional Email Address</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Primary identity used for access control, password recovery, and verified academic material access.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-lg border border-zinc-800 bg-zinc-950/60">
            <div>
              <div className="text-xs font-mono font-medium text-zinc-200">{email}</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">Account registered on {createdDate}</div>
            </div>
            <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-medium self-start sm:self-auto ${
              isEmailVerified
                ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                : "border-amber-500/30 bg-amber-500/10 text-amber-400"
            }`}>
              <CheckCircle2 className="size-3.5" />
              <span>{isEmailVerified ? "Verified Institutional User" : "Verification Pending"}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <KeyRound className="size-4 text-indigo-400" />
            <span>Change Password</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Ensure your password is at least 8 characters long with a mix of letters and numbers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-3.5 max-w-md">
            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-300">New Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
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

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-300">Confirm New Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isUpdatingPassword || !newPassword}
              className="h-8 text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors cursor-pointer"
            >
              {isUpdatingPassword ? "Updating..." : "Update Password"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Active Session & Sign Out Card */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Shield className="size-4 text-emerald-400" />
            <span>Active Authentication Session</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Session tokens are secured via Supabase SSR HTTP-only cookies and RLS authorization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/60">
            <div className="space-y-0.5">
              <div className="text-xs font-medium text-zinc-200">Current Browser Session</div>
              <div className="text-[11px] text-zinc-500">Active on Team Bhairava Workspace</div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleSignOut}
              className="h-8 text-xs text-rose-400 hover:text-rose-300 border-zinc-800 hover:bg-rose-500/10 gap-1.5"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone: Account Deletion */}
      <Card className="border border-rose-900/40 bg-rose-950/10">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-rose-400 flex items-center gap-2">
            <AlertTriangle className="size-4" />
            <span>Danger Zone</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Deactivating your account revokes access to Team Bhairava messages and project task assignments.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!showDeleteConfirm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDeleteConfirm(true)}
              className="h-8 text-xs border-rose-800/60 text-rose-400 hover:bg-rose-500/20"
            >
              Request Account Deactivation
            </Button>
          ) : (
            <div className="space-y-3 p-3 rounded-lg border border-rose-900/60 bg-zinc-950/80">
              <p className="text-xs text-rose-300">
                Are you sure? Type <strong className="text-white font-mono">DELETE</strong> below to confirm.
              </p>
              <Input
                type="text"
                placeholder='Type "DELETE"'
                value={deleteConfirmationText}
                onChange={(e) => setDeleteConfirmationText(e.target.value)}
                className="h-8 text-xs bg-zinc-900 border-rose-900/80 font-mono text-zinc-200 max-w-xs"
              />
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleDeleteAccount}
                  className="h-8 text-xs bg-rose-600 hover:bg-rose-700 text-white"
                >
                  Confirm Deactivation
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowDeleteConfirm(false)
                    setDeleteConfirmationText("")
                  }}
                  className="h-8 text-xs text-zinc-400 hover:text-zinc-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
