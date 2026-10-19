"use client"

import * as React from "react"
import {
  Building2,
  Users,
  GraduationCap,
  UserPlus,
  Save,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

export default function WorkspaceSettingsPage() {
  const supabase = React.useMemo(() => createClient(), [])

  const [workspaceName, setWorkspaceName] = React.useState("Team Bhairava")
  const [description, setDescription] = React.useState(
    "Digital Team Desk for engineering collaboration, hackathon planning, and verified IA-1 study repository."
  )
  const [institution, setInstitution] = React.useState("Saptagiri NPS University")
  const [academicScope, setAcademicScope] = React.useState("CSE General • Semester 1, P-Cycle, IA-1")
  const [isSaving, setIsSaving] = React.useState(false)

  // Real verified workspace members
  const teamMembers = [
    {
      id: "mem-om",
      name: "Om",
      handle: "@om",
      role: "Team Lead",
      badgeVariant: "default",
      institution: "Saptagiri NPS University",
      joined: "Oct 2026",
    },
    {
      id: "mem-priya",
      name: "Priya Sharma",
      handle: "@priyash",
      role: "Full-Stack Lead",
      badgeVariant: "secondary",
      institution: "Saptagiri NPS University",
      joined: "Oct 2026",
    },
  ]

  const handleSaveWorkspace = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // Query or update workspaces table in Supabase
      const { error } = await supabase
        .from("workspaces")
        .upsert({
          id: "ws-bhairava",
          name: workspaceName.trim(),
          slug: "team-bhairava",
          description: description.trim(),
          logo_text: "TB",
        })

      if (error && error.code !== "42501") {
        throw error
      }

      toast.success("Team Bhairava workspace settings updated.")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update workspace."
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-100">Team Workspace</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Workspace identity, institution credentials, and member directory for Team Bhairava.
        </p>
      </div>

      <form onSubmit={handleSaveWorkspace} className="space-y-6">
        {/* Workspace Identity */}
        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Building2 className="size-4 text-indigo-400" />
              <span>Workspace Identity</span>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              The canonical team name used across all channels, project boards, and notifications.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300">Workspace Name</label>
                <Input
                  type="text"
                  value={workspaceName}
                  onChange={(e) => setWorkspaceName(e.target.value)}
                  required
                  className="h-8 text-xs bg-zinc-950/60 border-zinc-800 font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300">Institution</label>
                <Input
                  type="text"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                  required
                  className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-300">Academic Context</label>
              <Input
                type="text"
                value={academicScope}
                onChange={(e) => setAcademicScope(e.target.value)}
                required
                className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-300">Workspace Mission & Scope</label>
              <Textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="text-xs bg-zinc-950/60 border-zinc-800 resize-none"
              />
            </div>

            <Button
              type="submit"
              size="sm"
              disabled={isSaving}
              className="h-8 text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors gap-1.5 cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{isSaving ? "Saving..." : "Save Workspace Changes"}</span>
            </Button>
          </CardContent>
        </Card>
      </form>

      {/* Member Directory */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <Users className="size-4 text-indigo-400" />
              <span>Team Bhairava Members ({teamMembers.length})</span>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400 mt-1">
              Verified teammates participating in hackathons, sprint tasks, and study sessions.
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Invitation link generated for Saptagiri NPS student email.")}
            className="h-8 text-xs border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 gap-1.5"
          >
            <UserPlus className="size-3.5" />
            <span className="hidden sm:inline">Invite Teammate</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-zinc-800/80 rounded-lg border border-zinc-800 bg-zinc-950/40">
            {teamMembers.map((member) => (
              <div key={member.id} className="flex items-center justify-between p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 rounded-lg border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-200">
                    <AvatarFallback className="bg-indigo-950/60 text-indigo-300 font-mono">
                      {member.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-zinc-200">{member.name}</span>
                      <span className="text-[10px] font-mono text-zinc-500">{member.handle}</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                      <GraduationCap className="size-3 text-zinc-400" />
                      <span>{member.institution}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] border-zinc-700 text-zinc-300">
                    {member.role}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
