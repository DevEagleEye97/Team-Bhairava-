"use client"

import * as React from "react"
import {
  Menu,
  Search,
  Plus,
  PanelRight,
} from "lucide-react"
import { NavigationTab } from "@/types/desk"
import { deskChannels, teamMembers } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface DeskHeaderProps {
  activeTab: NavigationTab
  searchQuery: string
  onSearchChange: (query: string) => void
  onOpenMobileMenu: () => void
  onOpenQuickAction: () => void
  isRightPanelOpen?: boolean
  onToggleRightPanel?: () => void
}

export function DeskHeader({
  activeTab,
  searchQuery,
  onSearchChange,
  onOpenMobileMenu,
  onOpenQuickAction,
  isRightPanelOpen,
  onToggleRightPanel,
}: DeskHeaderProps) {
  const getHeaderDetails = () => {
    if (activeTab === "dashboard") {
      return {
        title: "Team Desk Overview",
        subtitle: "Collaborative activity, sprint progress, and active discussions",
        badge: "Live Workspace",
      }
    }
    if (activeTab === "events") {
      return {
        title: "Events & Opportunities",
        subtitle: "Hackathons, technical workshops, competitions & deadlines",
        badge: "Opportunities",
      }
    }
    if (activeTab === "projects") {
      return {
        title: "Projects & Tasks",
        subtitle: "Sprint task board, repository links, and hackathon deliverables",
        badge: "Sprint Active",
      }
    }
    if (activeTab === "knowledge") {
      return {
        title: "Team Knowledge Base",
        subtitle: "Architecture docs, setup guides, decisions & study notes",
        badge: "Engineering Wiki",
      }
    }
    if (activeTab === "channel-study") {
      return {
        title: "Study Room & Academic Desk",
        subtitle: "Course syllabus, previous IA question banks, model solutions & silent co-working",
        badge: "Academic Repository",
      }
    }


    const channel = deskChannels.find((c) => c.id === activeTab)
    if (channel) {
      return {
        title: `# ${channel.name}`,
        subtitle: channel.description,
        badge: channel.category,
      }
    }

    return {
      title: "HackForge Desk",
      subtitle: "Digital team workspace",
      badge: "Active",
    }
  }

  const { title, subtitle, badge } = getHeaderDetails()
  const onlineMembers = teamMembers.filter((m) => m.status === "online" || m.status === "in_flow")

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-3 md:px-5 backdrop-blur-md">
      {/* Left section: Hamburger (mobile) + Active view title */}
      <div className="flex items-center gap-3 overflow-hidden">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenMobileMenu}
          className="md:hidden shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Open mobile menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="flex flex-col overflow-hidden">
          <div className="flex items-center gap-2">
            <h1 className="font-semibold text-sm md:text-base leading-tight text-foreground truncate">
              {title}
            </h1>
            <Badge
              variant="outline"
              className="hidden sm:inline-flex text-[10px] py-0 px-1.5 h-4 font-normal text-muted-foreground border-border"
            >
              {badge}
            </Badge>
          </div>
          <p className="hidden md:block text-[11px] text-muted-foreground truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right section: Search bar + Online team avatars + Quick Action CTA */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Search Input */}
        <div className="relative hidden lg:block w-52 xl:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search desk, docs, tasks..."
            className="h-8 pl-8 text-xs bg-muted/40 border-border"
          />
        </div>

        {/* Online team avatar stack */}
        <div className="hidden sm:flex items-center -space-x-1.5 pl-1">
          {onlineMembers.slice(0, 4).map((member) => (
            <div
              key={member.id}
              className="relative inline-block"
              title={`${member.name} (${member.role}): ${member.currentStatusText || member.status}`}
            >
              <Avatar className="size-7 rounded-full border-2 border-background text-[10px] font-semibold">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {member.avatar}
                </AvatarFallback>
              </Avatar>
              <span
                className={`absolute bottom-0 right-0 size-2 rounded-full border border-background ${
                  member.status === "in_flow" ? "bg-amber-500" : "bg-emerald-500"
                }`}
              />
            </div>
          ))}
          {onlineMembers.length > 4 && (
            <div className="flex size-7 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground">
              +{onlineMembers.length - 4}
            </div>
          )}
        </div>

        {/* Quick Action Button */}
        <Button
          size="sm"
          onClick={onOpenQuickAction}
          className="h-8 gap-1.5 px-2.5 text-xs font-medium shadow-xs"
        >
          <Plus className="size-3.5" />
          <span className="hidden sm:inline">New Action</span>
        </Button>

        {/* Right Context Panel Toggle (for tablet/mobile or user preference) */}
        {onToggleRightPanel && (
          <Button
            variant={isRightPanelOpen ? "secondary" : "ghost"}
            size="icon-xs"
            onClick={onToggleRightPanel}
            className="text-muted-foreground hover:text-foreground"
            title={
              activeTab === "channel-study"
                ? isRightPanelOpen
                  ? "Hide Shvasa Focus Panel"
                  : "Open Shvasa Pomodoro Focus Panel"
                : isRightPanelOpen
                ? "Hide Context Panel"
                : "Show Context Panel"
            }
          >
            <PanelRight className="size-4" />
          </Button>
        )}
      </div>
    </header>
  )
}
