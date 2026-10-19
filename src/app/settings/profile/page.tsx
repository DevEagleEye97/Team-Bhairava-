"use client"

import * as React from "react"
import {
  Camera,
  Trash2,
  Save,
  GraduationCap,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

export default function ProfileSettingsPage() {
  const supabase = React.useMemo(() => createClient(), [])

  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [hasChanges, setHasChanges] = React.useState(false)

  // Profile fields
  const [userId, setUserId] = React.useState<string | null>(null)
  const [fullName, setFullName] = React.useState("Om")
  const [handle, setHandle] = React.useState("@om")
  const [role, setRole] = React.useState("Team Lead")
  const [bio, setBio] = React.useState("Leading Team Bhairava for hackathons, engineering architecture and IA-1 prep.")
  const [university, setUniversity] = React.useState("Saptagiri NPS University")
  const [program, setProgram] = React.useState("CSE General")
  const [semester, setSemester] = React.useState("Semester 1, P-Cycle")
  const [timezone, setTimezone] = React.useState("Asia/Kolkata (IST +05:30)")
  const [avatarPreview, setAvatarPreview] = React.useState<string | null>(null)

  // Load existing profile from Supabase on mount
  React.useEffect(() => {
    async function loadProfile() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          setUserId(user.id)
          const meta = user.user_metadata || {}
          if (meta.full_name) setFullName(meta.full_name)
          if (meta.handle) setHandle(meta.handle)
          if (meta.role) setRole(meta.role)
          if (meta.bio) setBio(meta.bio)
          if (meta.university) setUniversity(meta.university)
          if (meta.program) setProgram(meta.program)
          if (meta.semester) setSemester(meta.semester)
          if (meta.timezone) setTimezone(meta.timezone)

          // Query live profiles table
          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle()

          if (dbProfile) {
            if (dbProfile.full_name) setFullName(dbProfile.full_name)
            if (dbProfile.handle) setHandle(dbProfile.handle)
            if (dbProfile.status_text) setRole(dbProfile.status_text)
          }
        }
      } catch (err) {
        console.warn("Could not load remote profile:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [supabase])

  // Handle avatar image selection
  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (PNG, JPG, or WebP).")
      return
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size exceeds 2MB limit.")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      setAvatarPreview(event.target?.result as string)
      setHasChanges(true)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveAvatar = () => {
    setAvatarPreview(null)
    setHasChanges(true)
    toast.info("Avatar removed. Using initials fallback.")
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      // 1. Update Supabase Auth user metadata
      await supabase.auth.updateUser({
        data: {
          full_name: fullName.trim(),
          handle: handle.trim(),
          role: role.trim(),
          bio: bio.trim(),
          university: university.trim(),
          program: program.trim(),
          semester: semester.trim(),
          timezone: timezone.trim(),
        },
      })

      // 2. Persist to public.profiles table if user ID exists
      if (userId) {
        await supabase.from("profiles").upsert({
          id: userId,
          full_name: fullName.trim(),
          handle: handle.trim(),
          status_text: role.trim(),
          updated_at: new Date().toISOString(),
        })
      }

      setHasChanges(false)
      toast.success("Profile changes saved to Team Bhairava!")
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update profile."
      toast.error(msg)
    } finally {
      setIsSaving(false)
    }
  }

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "OM"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-100">Personal Profile</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Manage how your identity, role, and academic program appear to teammates on Team Bhairava Desk.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Avatar & Identity Card */}
        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-zinc-200">Profile Picture & Display</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Upload a clear photo or use high-contrast initials.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group">
              <Avatar className="size-20 rounded-2xl border-2 border-zinc-700 bg-zinc-800 text-lg font-bold text-zinc-200 shadow-md">
                {avatarPreview ? <AvatarImage src={avatarPreview} /> : null}
                <AvatarFallback className="bg-indigo-950/60 text-indigo-300 font-mono">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 rounded-2xl bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity text-white text-[10px] gap-1"
              >
                <Camera className="size-4" />
                <span>Change</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarSelect}
                className="hidden"
              />
            </div>

            <div className="space-y-2 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("avatar-upload")?.click()}
                  className="h-8 text-xs border-zinc-700 bg-zinc-800 text-zinc-200 hover:bg-zinc-700 gap-1.5"
                >
                  <Camera className="size-3.5" />
                  <span>Upload Picture</span>
                </Button>
                {avatarPreview && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    className="h-8 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 gap-1.5"
                  >
                    <Trash2 className="size-3.5" />
                    <span>Remove</span>
                  </Button>
                )}
              </div>
              <p className="text-[11px] text-zinc-500">
                Recommended: Square PNG, JPG or WebP (max 2MB).
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Core Profile Fields */}
        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-zinc-200">Identity Details</CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Personalized details displayed on chat messages, task assignments, and the desk header.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300">Display Name</label>
                <Input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value)
                    setHasChanges(true)
                  }}
                  required
                  className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300">Username / Handle</label>
                <Input
                  type="text"
                  value={handle}
                  onChange={(e) => {
                    setHandle(e.target.value)
                    setHasChanges(true)
                  }}
                  required
                  className="h-8 text-xs bg-zinc-950/60 border-zinc-800 font-mono text-zinc-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300">Role / Headline</label>
                <Input
                  type="text"
                  value={role}
                  onChange={(e) => {
                    setRole(e.target.value)
                    setHasChanges(true)
                  }}
                  placeholder="e.g. Team Lead, Full-Stack Lead"
                  className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300">Time Zone</label>
                <Input
                  type="text"
                  value={timezone}
                  onChange={(e) => {
                    setTimezone(e.target.value)
                    setHasChanges(true)
                  }}
                  className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-medium text-zinc-300">Biography / Engineering Focus</label>
              <Textarea
                rows={3}
                value={bio}
                onChange={(e) => {
                  setBio(e.target.value)
                  setHasChanges(true)
                }}
                className="text-xs bg-zinc-950/60 border-zinc-800 resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Academic Program Scope */}
        <Card className="border border-zinc-800 bg-zinc-900/60">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
              <GraduationCap className="size-4 text-indigo-400" />
              <span>Academic Context</span>
            </CardTitle>
            <CardDescription className="text-xs text-zinc-400">
              Verified institutional association for access to the IA-1 Study Room and question banks.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300">Institution</label>
                <Input
                  type="text"
                  value={university}
                  onChange={(e) => {
                    setUniversity(e.target.value)
                    setHasChanges(true)
                  }}
                  className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300">Academic Program</label>
                <Input
                  type="text"
                  value={program}
                  onChange={(e) => {
                    setProgram(e.target.value)
                    setHasChanges(true)
                  }}
                  className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-medium text-zinc-300">Current Scope</label>
                <Input
                  type="text"
                  value={semester}
                  onChange={(e) => {
                    setSemester(e.target.value)
                    setHasChanges(true)
                  }}
                  className="h-8 text-xs bg-zinc-950/60 border-zinc-800"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2">
          <span className="text-[11px] text-zinc-500">
            {isLoading
              ? "Loading profile..."
              : hasChanges
              ? "You have unsaved changes."
              : "All changes saved to Supabase."}
          </span>
          <div className="flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={!hasChanges || isSaving || isLoading}
              onClick={() => window.location.reload()}
              className="h-8 text-xs border-zinc-800 text-zinc-400 hover:text-zinc-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={!hasChanges || isSaving || isLoading}
              className="h-8 text-xs font-medium bg-zinc-100 hover:bg-white text-zinc-950 transition-colors gap-1.5 cursor-pointer"
            >
              <Save className="size-3.5" />
              <span>{isSaving ? "Saving..." : "Save Changes"}</span>
            </Button>
          </div>
        </div>
      </form>
    </div>
  )
}
