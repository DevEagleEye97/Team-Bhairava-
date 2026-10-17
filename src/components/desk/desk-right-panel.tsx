"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  CalendarDays,
  Vote,
  Pin,
  Clock,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  X,
  MessageSquare,
  ArrowRight,
  Radio,
} from "lucide-react"
import { DeskEvent, Poll, Message, NavigationTab } from "@/types/desk"
import { teamMembers, currentUser } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"

interface DeskRightPanelProps {
  events: DeskEvent[]
  activePoll: Poll
  onVotePoll: (optionId: string) => void
  onNavigateTab: (tab: NavigationTab) => void
  activeThreadMessage?: Message | null
  onCloseThread?: () => void
  className?: string
  onCloseMobilePanel?: () => void
}

export function DeskRightPanel({
  events,
  activePoll,
  onVotePoll,
  onNavigateTab,
  activeThreadMessage,
  onCloseThread,
  className,
  onCloseMobilePanel,
}: DeskRightPanelProps) {
  const [threadReplyText, setThreadReplyText] = React.useState("")
  const [localThreadReplies, setLocalThreadReplies] = React.useState<
    { id: string; author: typeof currentUser; content: string; time: string }[]
  >([
    {
      id: "tr-1",
      author: teamMembers[0], // Alex
      content: "Let's make sure the touch drawer in Sheet doesn't clip on iPhone screens.",
      time: "10:12 AM",
    },
    {
      id: "tr-2",
      author: teamMembers[4], // Karan
      content: "Tested on 390px viewport. Layout is clean with 44px min tap targets.",
      time: "10:18 AM",
    },
  ])

  const handleSendThreadReply = () => {
    if (!threadReplyText.trim()) return
    const now = new Date()
    const hours = now.getHours() % 12 || 12
    const mins = now.getMinutes()
    const ampm = now.getHours() >= 12 ? "PM" : "AM"
    const timeStr = `${hours}:${mins < 10 ? "0" : ""}${mins} ${ampm}`

    setLocalThreadReplies((prev) => [
      ...prev,
      {
        id: `tr-${Date.now()}`,
        author: currentUser,
        content: threadReplyText.trim(),
        time: timeStr,
      },
    ])
    setThreadReplyText("")
    toast.success("Thread reply posted!")
  }

  const upcomingEvents = events.slice(0, 3)

  return (
    <aside
      className={`flex h-full w-[320px] shrink-0 flex-col border-l border-border bg-sidebar/50 text-foreground overflow-y-auto select-none ${className || ""}`}
    >
      {/* Panel Header */}
      <div className="flex h-14 items-center justify-between border-b border-border px-4 shrink-0 bg-background/50">
        <div className="flex items-center gap-2">
          {activeThreadMessage ? (
            <div className="flex items-center gap-2">
              <MessageSquare className="size-4 text-primary" />
              <span className="font-semibold text-xs text-foreground">Discussion Thread</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Radio className="size-3.5 text-emerald-500 animate-pulse" />
              <span className="font-semibold text-xs text-foreground">Team Heartbeat</span>
              <Badge variant="outline" className="text-[9px] h-4 px-1 py-0 border-border">
                Context
              </Badge>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
          {activeThreadMessage && onCloseThread && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onCloseThread}
              title="Close thread view"
            >
              <X className="size-3.5" />
            </Button>
          )}

          {onCloseMobilePanel && (
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onCloseMobilePanel}
              title="Close panel"
            >
              <X className="size-3.5" />
            </Button>
          )}
        </div>
      </div>

      <div className="p-3.5 space-y-4 flex-1">
        {/* CONDITIONAL: Active Thread View if open */}
        {activeThreadMessage ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Avatar className="size-6">
                  <AvatarFallback className="text-[9px] bg-primary/20 text-primary">
                    {activeThreadMessage.author.avatar}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-foreground">
                    {activeThreadMessage.author.name}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {activeThreadMessage.timestamp}
                  </span>
                </div>
              </div>
              <p className="text-xs text-foreground/90 leading-relaxed">
                {activeThreadMessage.content}
              </p>
            </div>

            {/* Thread Replies List */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase px-1">
                {localThreadReplies.length} Replies
              </span>

              <div className="space-y-2">
                {localThreadReplies.map((reply) => (
                  <div
                    key={reply.id}
                    className="rounded-lg border border-border bg-card p-2.5 space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-foreground">
                        {reply.author.name}
                      </span>
                      <span className="text-[9px] text-muted-foreground">{reply.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Thread Composer */}
            <div className="pt-2 space-y-2">
              <textarea
                value={threadReplyText}
                onChange={(e) => setThreadReplyText(e.target.value)}
                placeholder="Reply to thread..."
                rows={2}
                className="w-full rounded-lg border border-border bg-background p-2 text-xs text-foreground outline-none resize-none focus:ring-1 focus:ring-primary/50"
              />
              <div className="flex justify-end">
                <Button size="sm" onClick={handleSendThreadReply} className="h-7 text-xs px-3">
                  Reply
                </Button>
              </div>
            </div>
          </div>
        ) : (
          /* STANDARD: Persistent Context Dashboard (Upcoming Events, Active Poll, Resources) */
          <>
            {/* 1. Upcoming Events & Opportunities */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                  <CalendarDays className="size-3.5 text-sky-500" />
                  Upcoming Events
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigateTab("events")}
                  className="h-5 text-[10px] px-1 text-primary hover:underline"
                >
                  View All
                </Button>
              </div>

              <div className="space-y-2">
                {upcomingEvents.map((evt) => (
                  <motion.div
                    key={evt.id}
                    layout
                    className="rounded-lg border border-border bg-card p-2.5 space-y-1.5 shadow-2xs hover:border-primary/40 transition-colors cursor-pointer"
                    onClick={() => onNavigateTab("events")}
                  >
                    <div className="flex items-start justify-between gap-1.5">
                      <span className="text-xs font-semibold text-foreground line-clamp-1 leading-snug">
                        {evt.title}
                      </span>
                      <Badge
                        className={`text-[9px] h-3.5 px-1 py-0 uppercase font-medium ${
                          evt.type === "hackathon"
                            ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                            : "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
                        }`}
                      >
                        {evt.type === "submission_deadline" ? "Deadline" : evt.type}
                      </Badge>
                    </div>

                    <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[10px] text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="size-2.5 text-primary" />
                        {evt.date}
                      </span>
                      <span className="font-medium text-foreground">{evt.organizer}</span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* 2. Active Team Poll */}
            <Card className="border-border bg-card shadow-xs">
              <CardHeader className="p-3 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Vote className="size-3.5 text-primary" />
                    <CardTitle className="text-xs font-semibold">Active Team Poll</CardTitle>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">
                    {activePoll.totalVotes} votes
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-3 pt-0 space-y-2">
                <p className="text-[11px] font-medium text-foreground leading-snug">
                  {activePoll.question}
                </p>

                <div className="space-y-1.5 pt-0.5">
                  {activePoll.options.map((opt) => {
                    const pct =
                      activePoll.totalVotes > 0
                        ? Math.round((opt.votes / activePoll.totalVotes) * 100)
                        : 0
                    const isVoted = activePoll.userVotedOptionId === opt.id

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => onVotePoll(opt.id)}
                        className={`relative w-full overflow-hidden rounded-md border p-2 text-left transition-all ${
                          isVoted
                            ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                            : "border-border hover:bg-muted/40"
                        }`}
                      >
                        <div
                          className="absolute inset-y-0 left-0 bg-primary/15 transition-all duration-300"
                          style={{ width: `${pct}%` }}
                        />
                        <div className="relative flex items-center justify-between text-[11px]">
                          <span className="font-medium text-foreground flex items-center gap-1 truncate pr-2">
                            {isVoted && <CheckCircle2 className="size-3 text-primary shrink-0" />}
                            {opt.label.split("(")[0]}
                          </span>
                          <span className="text-[10px] font-semibold text-muted-foreground shrink-0">
                            {pct}%
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* 3. Pinned Sprint Links & Wiki */}
            <div className="space-y-2">
              <span className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase px-1">
                Sprint Shortcuts
              </span>

              <div className="space-y-1 text-xs">
                <button
                  type="button"
                  onClick={() => onNavigateTab("channel-hackathon")}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <Sparkles className="size-3.5 text-amber-500" />
                    <span>HackGlobal War Room</span>
                  </span>
                  <ArrowRight className="size-3" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab("projects")}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <Pin className="size-3.5 text-emerald-500" />
                    <span>Sprint 01 Kanban Board</span>
                  </span>
                  <ArrowRight className="size-3" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigateTab("knowledge")}
                  className="flex w-full items-center justify-between rounded-lg border border-border bg-card p-2 text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-colors text-left"
                >
                  <span className="flex items-center gap-2">
                    <ExternalLink className="size-3.5 text-primary" />
                    <span>Architecture Wiki</span>
                  </span>
                  <ArrowRight className="size-3" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  )
}
