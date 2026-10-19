"use client"

import * as React from "react"
import Link from "next/link"
import {
  LayoutDashboard,
  MessageSquare,
  Flame,
  CalendarDays,
  Code2,
  Lightbulb,
  Headphones,
  FolderGit2,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  Laptop,
  GraduationCap,
  LogOut,
  User,
  Settings,
  Shield,
  Building2,
} from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { NavigationTab } from "@/types/desk"
import { deskChannels } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

interface DeskSidebarProps {
  activeTab: NavigationTab
  onSelectTab: (tab: NavigationTab) => void
  isCollapsed: boolean
  onToggleCollapse: () => void
  className?: string
  onCloseMobile?: () => void
}

export function DeskSidebar({
  activeTab,
  onSelectTab,
  isCollapsed,
  onToggleCollapse,
  className,
  onCloseMobile,
}: DeskSidebarProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])

  // Dynamic profile state loaded from Supabase Auth
  const [profileName, setProfileName] = React.useState("Om")
  const [profileRole, setProfileRole] = React.useState("Team Lead")
  const [profileHandle, setProfileHandle] = React.useState("@om")

  React.useEffect(() => {
    async function fetchAuthProfile() {
      try {
        const savedLocal = typeof window !== "undefined" ? localStorage.getItem("hf_user_name") : null
        if (savedLocal) setProfileName(savedLocal)

        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          const meta = user.user_metadata || {}
          if (meta.full_name) {
            setProfileName(meta.full_name)
            localStorage.setItem("hf_user_name", meta.full_name)
          }
          if (meta.role) setProfileRole(meta.role)
          if (meta.handle) setProfileHandle(meta.handle)

          const { data: dbProfile } = await supabase
            .from("profiles")
            .select("full_name, handle, status_text")
            .eq("id", user.id)
            .maybeSingle()

          if (dbProfile) {
            if (dbProfile.full_name) setProfileName(dbProfile.full_name)
            if (dbProfile.handle) setProfileHandle(dbProfile.handle)
            if (dbProfile.status_text) setProfileRole(dbProfile.status_text)
          }
        }
      } catch (err) {
        console.warn("Could not load authenticated profile:", err)
      }
    }

    fetchAuthProfile()
  }, [supabase])

  const handleNav = (tab: NavigationTab) => {
    onSelectTab(tab)
    if (onCloseMobile) {
      onCloseMobile()
    }
  }

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Signed out successfully.")
      router.push("/login")
      router.refresh()
    } catch {
      router.push("/login")
    }
  }

  const getChannelIcon = (slug: string) => {
    switch (slug) {
      case "general":
        return <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
      case "hackathon-team":
        return <Flame className="size-4 shrink-0 text-amber-500" />
      case "events-opps":
        return <CalendarDays className="size-4 shrink-0 text-sky-500" />
      case "development":
        return <Code2 className="size-4 shrink-0 text-emerald-500" />
      case "ideas-discussions":
        return <Lightbulb className="size-4 shrink-0 text-yellow-500" />
      case "study-room":
        return <Headphones className="size-4 shrink-0 text-indigo-400" />
      default:
        return <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
    }
  }

  const initials = profileName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "OM"

  return (
    <aside
      className={cn(
        "flex h-full flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-all duration-300 select-none",
        isCollapsed ? "w-16" : "w-[260px]",
        className
      )}
    >
      {/* Workspace Branding Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-3">
        {!isCollapsed ? (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 font-bold text-xs text-white shadow-xs">
              TB
            </div>
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm leading-tight text-foreground truncate">
                Team Bhairava
              </span>
              <span className="flex items-center gap-1 text-[11px] text-muted-foreground truncate">
                <GraduationCap className="size-3 text-indigo-400 shrink-0" />
                Saptagiri NPS Univ
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-indigo-600 font-bold text-xs text-white">
            TB
          </div>
        )}

        {/* Desktop Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon-xs"
          onClick={onToggleCollapse}
          className="hidden md:inline-flex text-muted-foreground hover:text-foreground"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
        </Button>
      </div>

      {/* Main Navigation Scroll Area */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
        {/* Desk Core View */}
        <div>
          <button
            type="button"
            onClick={() => handleNav("dashboard")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors cursor-pointer",
              activeTab === "dashboard"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title="Team Desk Dashboard"
          >
            <LayoutDashboard className="size-4 shrink-0 text-primary" />
            {!isCollapsed && <span className="truncate">Team Desk Overview</span>}
          </button>
        </div>

        {/* Discussion Channels Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
              Discussion Channels
            </div>
          )}
          {deskChannels.map((channel) => {
            const tabKey = channel.id as NavigationTab
            const isActive = activeTab === tabKey

            return (
              <button
                key={channel.id}
                type="button"
                onClick={() => handleNav(tabKey)}
                className={cn(
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer group",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
                title={channel.name}
              >
                <div className="flex items-center gap-2 overflow-hidden">
                  {getChannelIcon(channel.slug)}
                  {!isCollapsed && <span className="truncate">{channel.name}</span>}
                </div>

                {!isCollapsed && channel.unreadCount && channel.unreadCount > 0 ? (
                  <Badge
                    variant="secondary"
                    className="ml-auto size-4 p-0 text-[10px] font-mono font-bold flex items-center justify-center rounded-full bg-primary/20 text-primary"
                  >
                    {channel.unreadCount}
                  </Badge>
                ) : null}
              </button>
            )
          })}
        </div>

        {/* Focus & Collaboration Modules */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
              Academic & Sprints
            </div>
          )}

          <button
            type="button"
            onClick={() => handleNav("channel-study")}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              activeTab === "channel-study"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title="Study Room & IA-1 Question Banks"
          >
            <div className="flex items-center gap-2 overflow-hidden">
              <Headphones className="size-4 shrink-0 text-indigo-400" />
              {!isCollapsed && <span className="truncate">Study Room (IA-1)</span>}
            </div>
            {!isCollapsed && (
              <Badge variant="outline" className="text-[9px] py-0 px-1 border-indigo-500/30 text-indigo-400">
                Verified
              </Badge>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleNav("projects")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              activeTab === "projects"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title="Projects & Tasks"
          >
            <FolderGit2 className="size-4 shrink-0 text-muted-foreground" />
            {!isCollapsed && <span className="truncate">Projects & Tasks</span>}
          </button>

          <button
            type="button"
            onClick={() => handleNav("events")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              activeTab === "events"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title="Events & Opportunities"
          >
            <CalendarDays className="size-4 shrink-0 text-muted-foreground" />
            {!isCollapsed && <span className="truncate">Events & Calendar</span>}
          </button>

          <button
            type="button"
            onClick={() => handleNav("knowledge")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors cursor-pointer",
              activeTab === "knowledge"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
            title="Team Knowledge Base"
          >
            <BookOpen className="size-4 shrink-0 text-muted-foreground" />
            {!isCollapsed && <span className="truncate">Knowledge Base</span>}
          </button>
        </div>
      </div>

      {/* Honest Scope Banner */}
      {!isCollapsed && (
        <div className="mx-2 mb-2 rounded-lg border border-border/60 bg-muted/30 p-2.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <GraduationCap className="size-3.5 text-indigo-400" />
            <span>Semester 1, P-Cycle</span>
          </div>
          <p className="mt-1 text-[10px] text-muted-foreground leading-snug">
            Verified IA-1 course syllabi, question banks & Shvasa Pomodoro co-working.
          </p>
        </div>
      )}

      {/* Current User & Settings Footer */}
      <div className="border-t border-border p-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="w-full flex items-center justify-between p-1.5 rounded-lg hover:bg-muted/60 transition-colors text-left cursor-pointer group"
              title="Open account & profile menu"
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <Avatar className="size-8 rounded-lg border border-border bg-indigo-950/40 text-indigo-300 font-mono text-xs font-semibold">
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>

                {!isCollapsed && (
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-medium text-foreground truncate group-hover:text-indigo-400 transition-colors">
                      {profileName}
                    </span>
                    <span className="text-[10px] text-muted-foreground truncate">
                      {profileRole}
                    </span>
                  </div>
                )}
              </div>

              {!isCollapsed && (
                <Settings className="size-3.5 text-muted-foreground group-hover:text-foreground transition-colors" />
              )}
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-xs">
              <div className="font-semibold text-foreground">{profileName}</div>
              <div className="text-[10px] text-muted-foreground font-mono">{profileHandle}</div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="text-xs gap-2 cursor-pointer">
                <User className="size-3.5 text-indigo-400" />
                <span>Personal Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/account" className="text-xs gap-2 cursor-pointer">
                <Shield className="size-3.5 text-emerald-400" />
                <span>Account & Security</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/preferences" className="text-xs gap-2 cursor-pointer">
                <Settings className="size-3.5 text-zinc-400" />
                <span>Preferences</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/workspace" className="text-xs gap-2 cursor-pointer">
                <Building2 className="size-3.5 text-amber-400" />
                <span>Team Workspace</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel className="text-[10px] uppercase font-mono text-muted-foreground">
              Theme Mode
            </DropdownMenuLabel>
            <div className="grid grid-cols-3 gap-1 px-1 py-1">
              <Button
                variant={theme === "light" ? "secondary" : "ghost"}
                size="icon-xs"
                onClick={() => setTheme("light")}
                title="Light mode"
              >
                <Sun className="size-3" />
              </Button>
              <Button
                variant={theme === "dark" ? "secondary" : "ghost"}
                size="icon-xs"
                onClick={() => setTheme("dark")}
                title="Dark mode"
              >
                <Moon className="size-3" />
              </Button>
              <Button
                variant={theme === "system" ? "secondary" : "ghost"}
                size="icon-xs"
                onClick={() => setTheme("system")}
                title="System theme"
              >
                <Laptop className="size-3" />
              </Button>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="text-xs gap-2 text-destructive focus:text-destructive cursor-pointer"
            >
              <LogOut className="size-3.5" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </aside>
  )
}
