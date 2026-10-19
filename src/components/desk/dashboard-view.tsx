"use client"

import * as React from "react"
import {
  CalendarDays,
  FolderGit2,
  ArrowRight,
  Pin,
  Vote,
  Sparkles,
  CheckCircle2,
  Radio,
  GraduationCap,
  Headphones,
} from "lucide-react"
import { NavigationTab, Poll } from "@/types/desk"
import {
  deskAnnouncements,
  deskPolls,
  deskProjects,
  deskStudyMaterials,
} from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"
import { createClient } from "@/utils/supabase/client"

interface DashboardViewProps {
  onNavigateTab: (tab: NavigationTab) => void
  onOpenQuickAction: () => void
}

export function DashboardView({ onNavigateTab, onOpenQuickAction }: DashboardViewProps) {
  const supabase = React.useMemo(() => createClient(), [])

  const [userName, setUserName] = React.useState("Om")
  const [userRole, setUserRole] = React.useState("Lead")

  React.useEffect(() => {
    async function loadAuth() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (user) {
          if (user.user_metadata?.full_name) {
            setUserName(user.user_metadata.full_name)
          }
          if (user.user_metadata?.role) {
            setUserRole(user.user_metadata.role)
          }

          const { data: profile } = await supabase
            .from("profiles")
            .select("full_name, status_text")
            .eq("id", user.id)
            .maybeSingle()

          if (profile) {
            if (profile.full_name) setUserName(profile.full_name)
            if (profile.status_text) setUserRole(profile.status_text)
          }
        }
      } catch (err) {
        console.warn("Could not query user profile:", err)
      }
    }

    loadAuth()
  }, [supabase])

  // Local state for interactive poll voting
  const [activePoll, setActivePoll] = React.useState<Poll>(deskPolls[0])
  const [userVotedId, setUserVotedId] = React.useState<string | undefined>(activePoll.userVotedOptionId)

  const handleVote = (optionId: string) => {
    if (userVotedId === optionId) {
      toast.info("You have already recorded your vote.")
      return
    }

    setActivePoll((prev) => {
      const updatedOptions = prev.options.map((opt) => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 }
        }
        if (opt.id === userVotedId) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) }
        }
        return opt
      })

      const newTotal = userVotedId ? prev.totalVotes : prev.totalVotes + 1

      return {
        ...prev,
        options: updatedOptions,
        totalVotes: newTotal,
        userVotedOptionId: optionId,
      }
    })

    setUserVotedId(optionId)
    toast.success("Vote recorded for Team Bhairava decision.")
  }

  // Verified academic and hackathon deadlines for Semester 1, P-Cycle
  const verifiedDeadlines = [
    {
      title: "Problem Solving with C (PSC) IA-1 Evaluation",
      date: "Nov 12, 2026",
      badge: "Syllabus Modules 1 & 2",
      type: "exam",
    },
    {
      title: "Engineering Mathematics IA-1 Question Bank Review",
      date: "Nov 15, 2026",
      badge: "Taylor Series & Jacobians",
      type: "academic",
    },
    {
      title: "Engineering Physics Quantum Mechanics Prep",
      date: "Nov 18, 2026",
      badge: "Wave Equations",
      type: "academic",
    },
  ]

  // Real verified members roster
  const verifiedMembers = [
    { name: "Om", role: "Team Lead", status: "online", statusText: "Sprint 01 Lead & Architecture" },
    { name: "Priya Sharma", role: "Full-Stack Lead", status: "online", statusText: "Shvasa sidecar & auth verification" },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Workspace Welcome & High-level Status */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-5 md:p-7 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Team Bhairava Live
              </span>
              <span className="text-xs text-muted-foreground">Sprint 01 in Progress</span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <span>Welcome back, {userName}</span>
              {userRole && (
                <span className="text-xs px-2 py-0.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 font-normal">
                  {userRole}
                </span>
              )}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed flex items-center gap-1.5">
              <GraduationCap className="size-4 text-indigo-400 shrink-0" />
              <span>Saptagiri NPS University • CSE General • Semester 1, P-Cycle (IA-1 Context)</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
            <Button
              size="sm"
              onClick={onOpenQuickAction}
              className="gap-2 text-xs font-medium cursor-pointer"
            >
              <Sparkles className="size-3.5" />
              Quick Action
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab("channel-study")}
              className="gap-2 text-xs cursor-pointer border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10"
            >
              <Headphones className="size-3.5" />
              Open Study Room
            </Button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border/80 pt-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">Verified Members</span>
            <span className="text-lg md:text-xl font-bold text-foreground">
              {verifiedMembers.length} <span className="text-xs font-normal text-muted-foreground">active on desk</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">IA-1 Study Library</span>
            <span className="text-lg md:text-xl font-bold text-indigo-400">
              {deskStudyMaterials.length} <span className="text-xs font-normal text-muted-foreground">verified documents</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">Sprint Tasks</span>
            <span className="text-lg md:text-xl font-bold text-emerald-500">
              4 <span className="text-xs font-normal text-muted-foreground">in active track</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">Academic Scope</span>
            <span className="text-lg md:text-xl font-bold text-sky-400">
              IA-1 <span className="text-xs font-normal text-muted-foreground">P-Cycle</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main 2-Column Responsive Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (2 Cols on lg): Announcements, Polls, Activity, Projects */}
        <div className="space-y-6 lg:col-span-2">
          {/* Pinned Announcements */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                <Pin className="size-4 text-primary" />
                Desk Announcements
              </h2>
              <Badge variant="outline" className="text-[10px] font-normal">
                {deskAnnouncements.length} posted
              </Badge>
            </div>

            <div className="space-y-3">
              {deskAnnouncements.map((ann) => (
                <Card key={ann.id} className="border-border bg-card shadow-xs">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={
                              ann.tag === "Urgent"
                                ? "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                                : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                            }
                          >
                            {ann.tag}
                          </Badge>
                          <span className="text-[11px] text-muted-foreground">{ann.date}</span>
                        </div>
                        <CardTitle className="text-sm font-semibold">{ann.title}</CardTitle>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Avatar className="size-5">
                          <AvatarFallback className="text-[9px] bg-primary/10 text-primary">
                            {ann.author.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <span className="hidden sm:inline font-medium">{ann.author.name}</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-muted-foreground leading-relaxed">{ann.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Active Team Decision Poll */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex size-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Vote className="size-4" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold">Active Team Poll</CardTitle>
                    <CardDescription className="text-xs">One vote per team member</CardDescription>
                  </div>
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {activePoll.totalVotes} votes cast
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs font-medium text-foreground">{activePoll.question}</p>
              <div className="space-y-2">
                {activePoll.options.map((opt) => {
                  const percent = activePoll.totalVotes > 0 ? Math.round((opt.votes / activePoll.totalVotes) * 100) : 0
                  const isSelected = userVotedId === opt.id

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleVote(opt.id)}
                      className={`relative w-full overflow-hidden rounded-lg border p-2.5 text-left transition-all cursor-pointer ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary"
                          : "border-border/80 bg-muted/20 hover:border-border hover:bg-muted/40"
                      }`}
                    >
                      <div
                        className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                      <div className="relative flex items-center justify-between text-xs">
                        <span className="font-medium flex items-center gap-1.5">
                          {isSelected && <CheckCircle2 className="size-3.5 text-primary shrink-0" />}
                          {opt.label}
                        </span>
                        <span className="font-mono text-[11px] text-muted-foreground">
                          {percent}% ({opt.votes})
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Core Projects & Sprints */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                <FolderGit2 className="size-4 text-primary" />
                Active Team Projects
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("projects")}
                className="h-7 text-xs gap-1 text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <span>Full Board</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {deskProjects.slice(0, 2).map((project) => (
                <Card
                  key={project.id}
                  className="cursor-pointer border-border bg-card transition-colors hover:border-primary/40"
                  onClick={() => onNavigateTab("projects")}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-sm font-semibold">{project.name}</CardTitle>
                        <CardDescription className="text-xs line-clamp-1">{project.tagline}</CardDescription>
                      </div>
                      <Badge variant="outline" className="text-[10px]">
                        {project.status.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-1 space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-muted-foreground">
                        <span>Sprint Progress</span>
                        <span className="font-semibold text-foreground">{project.progressPercent}%</span>
                      </div>
                      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${project.progressPercent}%` }}
                        />
                      </div>
                    </div>
                    <div className="text-[11px] text-muted-foreground">
                      {project.tasks.length} tracked tasks
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col on lg): Upcoming Academic Deadlines, Presence */}
        <div className="space-y-6">
          {/* Upcoming Academic Deadlines */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-sky-500" />
                  <CardTitle className="text-sm font-semibold">Academic Schedule</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateTab("events")}
                  className="h-6 text-xs px-1.5 cursor-pointer"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {verifiedDeadlines.map((item, idx) => (
                <div
                  key={idx}
                  className="flex flex-col gap-1 rounded-lg border border-border/60 bg-muted/20 p-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400">{item.date}</span>
                  </div>
                  <Badge variant="secondary" className="w-fit text-[10px] text-muted-foreground font-normal">
                    {item.badge}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Desk Presence Roster */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Radio className="size-4 text-emerald-500 animate-pulse" />
                  <CardTitle className="text-sm font-semibold">Desk Presence</CardTitle>
                </div>
                <span className="text-[11px] text-muted-foreground">
                  {verifiedMembers.length} Active Now
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {verifiedMembers.map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/20"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <Avatar className="size-7 rounded-lg border border-border text-[10px] font-semibold">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {member.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-0 right-0 size-2 rounded-full border border-background bg-emerald-500" />
                    </div>
                    <div>
                      <div className="text-xs font-medium text-foreground">{member.name}</div>
                      <div className="text-[10px] text-muted-foreground">{member.statusText}</div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-border text-muted-foreground">
                    {member.role}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
