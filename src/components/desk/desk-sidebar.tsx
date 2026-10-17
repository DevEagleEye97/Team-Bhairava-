"use client"

import * as React from "react"
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
  Radio,
} from "lucide-react"
import { useTheme } from "next-themes"
import { cn } from "@/lib/utils"
import { NavigationTab } from "@/types/desk"
import { currentWorkspace, currentUser, deskChannels } from "@/lib/mock-data"
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

  const handleNav = (tab: NavigationTab) => {
    onSelectTab(tab)
    if (onCloseMobile) {
      onCloseMobile()
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
        return <Headphones className="size-4 shrink-0 text-indigo-500" />
      default:
        return <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
    }
  }

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
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary font-bold text-xs text-primary-foreground shadow-xs">
              {currentWorkspace.logoText}
            </div>
            <div className="flex flex-col truncate">
              <span className="font-semibold text-sm leading-tight text-foreground truncate">
                {currentWorkspace.name}
              </span>
              <span className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                {currentWorkspace.onlineCount} online
              </span>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex size-8 items-center justify-center rounded-lg bg-primary font-bold text-xs text-primary-foreground">
            {currentWorkspace.logoText}
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
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs font-medium transition-colors",
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
                  "flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 text-xs transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
                title={channel.name}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {getChannelIcon(channel.slug)}
                  {!isCollapsed && <span className="truncate">{channel.name}</span>}
                </div>
                {!isCollapsed && channel.unreadCount && (
                  <Badge
                    variant="secondary"
                    className="h-4 px-1.5 text-[10px] font-semibold bg-primary/10 text-primary"
                  >
                    {channel.unreadCount}
                  </Badge>
                )}
              </button>
            )
          })}
        </div>

        {/* Modules Section */}
        <div className="space-y-1">
          {!isCollapsed && (
            <div className="px-2 pb-1 text-[10px] font-semibold tracking-wider text-muted-foreground/80 uppercase">
              Collaboration Desks
            </div>
          )}

          {/* Events Board */}
          <button
            type="button"
            onClick={() => handleNav("events")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
              activeTab === "events"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
            title="Events & Opportunities"
          >
            <CalendarDays className="size-4 shrink-0 text-sky-500" />
            {!isCollapsed && <span className="truncate">Events & Opportunities</span>}
          </button>

          {/* Projects & Tasks */}
          <button
            type="button"
            onClick={() => handleNav("projects")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
              activeTab === "projects"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
            title="Projects & Tasks"
          >
            <FolderGit2 className="size-4 shrink-0 text-emerald-500" />
            {!isCollapsed && <span className="truncate">Projects & Tasks</span>}
          </button>

          {/* Knowledge Base */}
          <button
            type="button"
            onClick={() => handleNav("knowledge")}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-xs transition-colors",
              activeTab === "knowledge"
                ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
            )}
            title="Shared Knowledge Base"
          >
            <BookOpen className="size-4 shrink-0 text-amber-500" />
            {!isCollapsed && <span className="truncate">Knowledge Base</span>}
          </button>
        </div>
      </div>

      {/* Desk Status Pill */}
      {!isCollapsed && (
        <div className="mx-2 mb-2 rounded-lg border border-border/80 bg-background/50 p-2.5">
          <div className="flex items-center gap-1.5 text-[11px] font-medium text-foreground">
            <Radio className="size-3.5 text-emerald-500 animate-pulse" />
            <span>Digital Desk Live</span>
          </div>
          <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
            Local session mode active. 5 teammates working on sprint items.
          </p>
        </div>
      )}

      {/* Current User & Theme Footer */}
      <div className="border-t border-border p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="relative">
              <Avatar className="size-8 rounded-lg border border-border">
                <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                  {currentUser.avatar}
                </AvatarFallback>
              </Avatar>
              <span className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-sidebar bg-emerald-500" />
            </div>

            {!isCollapsed && (
              <div className="flex flex-col truncate">
                <span className="text-xs font-medium text-foreground truncate">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {currentUser.role} Desk
                </span>
              </div>
            )}
          </div>

          {!isCollapsed && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon-xs" title="Toggle theme">
                  {theme === "light" ? (
                    <Sun className="size-3.5" />
                  ) : theme === "dark" ? (
                    <Moon className="size-3.5" />
                  ) : (
                    <Laptop className="size-3.5" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel className="text-xs">Appearance</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setTheme("light")} className="text-xs gap-2">
                  <Sun className="size-3.5" /> Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")} className="text-xs gap-2">
                  <Moon className="size-3.5" /> Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")} className="text-xs gap-2">
                  <Laptop className="size-3.5" /> System Default
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </aside>
  )
}
