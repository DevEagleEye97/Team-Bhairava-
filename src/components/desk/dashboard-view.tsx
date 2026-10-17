"use client"

import * as React from "react"
import {
  Flame,
  CalendarDays,
  FolderGit2,
  BookOpen,
  MessageSquare,
  ArrowRight,
  Pin,
  Vote,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Radio,
  FileCode2,
} from "lucide-react"
import { NavigationTab, Poll } from "@/types/desk"
import {
  currentWorkspace,
  teamMembers,
  deskAnnouncements,
  deskPolls,
  deskProjects,
} from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"

interface DashboardViewProps {
  onNavigateTab: (tab: NavigationTab) => void
  onOpenQuickAction: () => void
}

export function DashboardView({ onNavigateTab, onOpenQuickAction }: DashboardViewProps) {
  // Local state for interactive poll voting
  const [activePoll, setActivePoll] = React.useState<Poll>(deskPolls[0])
  const [userVotedId, setUserVotedId] = React.useState<string | undefined>(activePoll.userVotedOptionId)

  const handleVote = (optionId: string) => {
    if (userVotedId === optionId) {
      toast.info("You have already voted for this option.")
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
    toast.success("Vote recorded for HackForge team decision!")
  }

  const upcomingDeadlines = [
    { title: "HackGlobal Registration Closes", date: "Oct 22, 2026", daysLeft: "4 days", type: "hackathon" },
    { title: "Desk Sprint 01 Code Freeze", date: "Oct 23, 2026", daysLeft: "5 days", type: "sprint" },
    { title: "Postgres RLS Workshop Session", date: "Oct 20, 2026", daysLeft: "2 days", type: "workshop" },
  ]

  const recentDiscussions = [
    {
      channelId: "channel-hackathon",
      channelName: "Hackathon Team",
      author: "David Chen",
      content: "HackGlobal 2026 track submissions open in 48 hours. Our chosen track is 'Smart Infrastructure & Resilient Edge'.",
      timestamp: "Yesterday at 4:30 PM",
    },
    {
      channelId: "channel-dev",
      channelName: "Development",
      author: "Marcus Thorne",
      content: "Next.js 16 layout props use strictly typed generic definitions. Keep an eye on Turbopack build outputs.",
      timestamp: "Today at 08:45 AM",
    },
    {
      channelId: "channel-general",
      channelName: "General / Tea Group",
      author: "Priya Sharma",
      content: "Working on the responsive navigation shell right now. Making sure touch interactions have zero horizontal overflow.",
      timestamp: "Today at 10:05 AM",
    },
  ]

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Workspace Welcome & High-level Status */}
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-r from-card via-card to-muted/40 p-5 md:p-7 shadow-xs">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active Team Desk
              </span>
              <span className="text-xs text-muted-foreground">Sprint 01 in Progress</span>
            </div>
            <h1 className="font-heading text-xl md:text-2xl font-bold tracking-tight text-foreground">
              Welcome back to {currentWorkspace.name}
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground max-w-2xl leading-relaxed">
              {currentWorkspace.description}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 pt-2 md:pt-0">
            <Button
              size="sm"
              onClick={onOpenQuickAction}
              className="gap-2 text-xs font-medium"
            >
              <Sparkles className="size-3.5" />
              Quick Action
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onNavigateTab("channel-hackathon")}
              className="gap-2 text-xs"
            >
              <Flame className="size-3.5 text-amber-500" />
              War Room
            </Button>
          </div>
        </div>

        {/* Quick Metrics Bar */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 border-t border-border/80 pt-4">
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">Team Members</span>
            <span className="text-lg md:text-xl font-bold text-foreground">
              {currentWorkspace.onlineCount} <span className="text-xs font-normal text-muted-foreground">/ {currentWorkspace.memberCount} active</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">Active Hackathons</span>
            <span className="text-lg md:text-xl font-bold text-amber-500">
              {currentWorkspace.activeHackathonsCount} <span className="text-xs font-normal text-muted-foreground">in prep</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">Sprint Tasks</span>
            <span className="text-lg md:text-xl font-bold text-emerald-500">
              6 <span className="text-xs font-normal text-muted-foreground">open</span>
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-[11px] font-medium text-muted-foreground">Upcoming Deadlines</span>
            <span className="text-lg md:text-xl font-bold text-sky-500">
              3 <span className="text-xs font-normal text-muted-foreground">this week</span>
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
                  {activePoll.totalVotes} total votes
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs font-medium text-foreground">{activePoll.question}</p>
              {activePoll.description && (
                <p className="text-[11px] text-muted-foreground">{activePoll.description}</p>
              )}

              <div className="space-y-2 pt-1">
                {activePoll.options.map((option) => {
                  const percentage =
                    activePoll.totalVotes > 0
                      ? Math.round((option.votes / activePoll.totalVotes) * 100)
                      : 0
                  const isSelected = userVotedId === option.id

                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleVote(option.id)}
                      className={`relative w-full overflow-hidden rounded-lg border p-2.5 text-left transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                          : "border-border hover:border-border/80 hover:bg-muted/40"
                      }`}
                    >
                      {/* Visual progress bar fill */}
                      <div
                        className="absolute inset-y-0 left-0 bg-primary/10 transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                      <div className="relative flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground flex items-center gap-1.5">
                          {isSelected && <CheckCircle2 className="size-3.5 text-primary" />}
                          {option.label}
                        </span>
                        <span className="text-[11px] font-semibold text-muted-foreground">
                          {percentage}% ({option.votes})
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </CardContent>
            <CardFooter className="pt-0 text-[11px] text-muted-foreground">
              Created by {activePoll.author.name} ({activePoll.author.role})
            </CardFooter>
          </Card>

          {/* Recent Channel Discussions Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                <MessageSquare className="size-4 text-primary" />
                Recent Desk Conversations
              </h2>
              <span className="text-[11px] text-muted-foreground">Live snapshots</span>
            </div>

            <div className="space-y-2.5">
              {recentDiscussions.map((disc, idx) => (
                <div
                  key={idx}
                  onClick={() => onNavigateTab(disc.channelId as NavigationTab)}
                  className="group flex cursor-pointer items-start justify-between gap-3 rounded-xl border border-border bg-card p-3.5 transition-colors hover:border-primary/40 hover:bg-muted/30"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-xs text-primary">#{disc.channelName}</span>
                      <span className="text-[11px] text-muted-foreground">by {disc.author}</span>
                      <span className="text-[10px] text-muted-foreground">• {disc.timestamp}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {disc.content}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-foreground" />
                </div>
              ))}
            </div>
          </div>

          {/* Active Projects Preview */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 font-heading text-sm font-semibold text-foreground">
                <FolderGit2 className="size-4 text-emerald-500" />
                Active Projects & Deliverables
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigateTab("projects")}
                className="h-7 text-xs gap-1"
              >
                <span>All Projects</span>
                <ArrowRight className="size-3" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {deskProjects.map((project) => (
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

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                      <span>{project.tasks.length} tracked tasks</span>
                      <div className="flex -space-x-1.5">
                        {project.members.map((m) => (
                          <Avatar key={m.id} className="size-5 border border-background">
                            <AvatarFallback className="text-[8px] bg-primary/10 text-primary">
                              {m.avatar}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column (1 Col on lg): Upcoming Deadlines, Team Presence, Quick Links */}
        <div className="space-y-6">
          {/* Upcoming Events & Deadlines */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-sky-500" />
                  <CardTitle className="text-sm font-semibold">Upcoming Deadlines</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateTab("events")}
                  className="h-6 text-xs px-1.5"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {upcomingDeadlines.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-2 rounded-lg border border-border/60 bg-muted/20 p-2.5"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-medium text-foreground line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-[11px] text-muted-foreground">{item.date}</span>
                  </div>
                  <Badge variant="secondary" className="shrink-0 text-[10px] font-semibold text-primary">
                    {item.daysLeft}
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
                  {teamMembers.filter((m) => m.status === "online" || m.status === "in_flow").length} Active Now
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-2.5">
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center justify-between gap-2 rounded-lg p-1.5 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <div className="relative shrink-0">
                      <Avatar className="size-7 rounded-lg">
                        <AvatarFallback className="text-[10px] font-semibold bg-primary/10 text-primary">
                          {member.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 size-2 rounded-full border border-card ${
                          member.status === "online"
                            ? "bg-emerald-500"
                            : member.status === "in_flow"
                            ? "bg-amber-500"
                            : "bg-zinc-400"
                        }`}
                      />
                    </div>
                    <div className="flex flex-col truncate">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-medium text-foreground truncate">
                          {member.name}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-normal">
                          {member.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground truncate">
                        {member.currentStatusText || member.status}
                      </span>
                    </div>
                  </div>

                  <Badge
                    variant="outline"
                    className="text-[9px] h-4 px-1 shrink-0 font-normal border-border"
                  >
                    {member.status === "in_flow" ? "Focus" : member.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Team Bookmarks */}
          <Card className="border-border bg-card shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <BookOpen className="size-4 text-amber-500" />
                <CardTitle className="text-sm font-semibold">Key Resources</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              <a
                href="https://github.com/hackforge/team-desk"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors border border-border/50"
              >
                <span className="flex items-center gap-2">
                  <FileCode2 className="size-3.5 text-primary" />
                  GitHub Team Repository
                </span>
                <ExternalLink className="size-3" />
              </a>

              <button
                type="button"
                onClick={() => onNavigateTab("knowledge")}
                className="flex w-full items-center justify-between rounded-lg p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors border border-border/50 text-left"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="size-3.5 text-amber-500" />
                  Next.js 16 Architecture Wiki
                </span>
                <ArrowRight className="size-3" />
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
