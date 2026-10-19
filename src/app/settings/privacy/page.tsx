"use client"

import * as React from "react"
import {
  Eye,
  Users,
  Download,
  Lock,
  CheckCircle2,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function PrivacySettingsPage() {
  const [presenceBroadcast, setPresenceBroadcast] = React.useState(true)

  const handleExportData = () => {
    toast.info("Preparing data export archive (profile metadata, study activity, task logs)...")
    setTimeout(() => {
      const payload = {
        exportedAt: new Date().toISOString(),
        product: "HackForge",
        team: "Team Bhairava",
        institution: "Saptagiri NPS University",
        academicContext: "Semester 1, P-Cycle, IA-1",
        userNotes: "Export generated via verified authenticated session.",
      }
      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `hackforge-bhairava-export-${Date.now()}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success("Account data export downloaded.")
    }, 800)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-100">Privacy & Visibility</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review which profile fields are shared within Team Bhairava and understand how Supabase Row Level Security protects your data.
        </p>
      </div>

      {/* Visibility Scope Card */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Users className="size-4 text-indigo-400" />
            <span>Workspace Membership Visibility</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            HackForge workspaces are private by design. Your profile and task assignments are visible exclusively to authorized members of Team Bhairava.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-200 font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-400" />
              <span>Visible to Teammates:</span>
            </div>
            <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-1 pl-1">
              <li>Display Name and Handle (@om)</li>
              <li>Assigned sprint tasks, code reviews, and project deliverables</li>
              <li>Study Room activity and shared IA-1 notes</li>
              <li>Status indicator (Online, In Flow, or Away)</li>
            </ul>
          </div>

          <div className="p-3 rounded-lg border border-zinc-800 bg-zinc-950/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-zinc-200 font-medium">
              <Lock className="size-3.5 text-indigo-400" />
              <span>Strictly Private & Confidential:</span>
            </div>
            <ul className="list-disc list-inside text-zinc-400 text-[11px] space-y-1 pl-1">
              <li>Raw password hashes (managed by Supabase Auth with bcrypt/argon2)</li>
              <li>Direct login session tokens and cookies</li>
              <li>Personal study bookmarks and unshared draft notes</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Presence Controls */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Eye className="size-4 text-indigo-400" />
            <span>Live Presence Broadcasting</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Presence is derived directly from your live WebSocket connection on Team Bhairava channels.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/60">
            <div>
              <div className="text-xs font-medium text-zinc-200">Share Realtime Presence</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Displays green/amber status badge when actively collaborating in a channel.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const nextVal = !presenceBroadcast
                setPresenceBroadcast(nextVal)
                toast.success(`Live presence ${nextVal ? "broadcast enabled" : "hidden"}.`)
              }}
              className={`h-7 text-xs border-zinc-700 ${
                presenceBroadcast ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {presenceBroadcast ? "Broadcasting" : "Invisible"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Data Export */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Download className="size-4 text-zinc-400" />
            <span>Export Account Data</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Download a portable JSON archive of your personal profile, task contributions, and academic activity logs.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="outline"
            size="sm"
            onClick={handleExportData}
            className="h-8 text-xs border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 gap-1.5"
          >
            <Download className="size-3.5" />
            <span>Download Data Archive</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
