"use client"

import * as React from "react"
import Link from "next/link"
import {
  Menu,
  Search,
  Plus,
  PanelRight,
} from "lucide-react"
import { NavigationTab } from "@/types/desk"
import { deskChannels } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { createClient } from "@/utils/supabase/client"

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
  const supabase = React.useMemo(() => createClient(), [])
  const [userName, setUserName] = React.useState("Om")

  React.useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        if (user.user_metadata?.full_name) {
          setUserName(user.user_metadata.full_name)
        }
      }
    }

    getProfile()
  }, [supabase])

  const getHeaderDetails = () => {
    if (activeTab === "dashboard") {
      return {
        title: "Team Desk Overview",
        subtitle: "Team Bhairava workspace activity, sprint deliverables & IA-1 resources",
        badge: "Team Bhairava",
      }
    }
    if (activeTab === "events") {
      return {
        title: "Events & Calendar",
        subtitle: "Academic deadlines, hackathons & technical workshops",
        badge: "Verified Dates",
      }
    }
    if (activeTab === "projects") {
      return {
        title: "Projects & Tasks",
        subtitle: "Sprint task board and hackathon deliverables",
        badge: "Sprint Active",
      }
    }
    if (activeTab === "knowledge") {
      return {
        title: "Team Knowledge Base",
        subtitle: "Architecture docs, setup guides & study notes",
        badge: "Engineering Wiki",
      }
    }
    if (activeTab === "channel-study") {
      return {
        title: "Study Room (IA-1)",
        subtitle: "Semester 1, P-Cycle syllabus, question banks & Shvasa Pomodoro co-working",
        badge: "IA-1 Verified",
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
      title: "Team Bhairava Desk",
      subtitle: "Digital workspace for Saptagiri NPS University",
      badge: "Active",
    }
  }

  const { title, subtitle, badge } = getHeaderDetails()
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "OM"

  return (
    <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-border bg-background/95 px-3 md:px-5 backdrop-blur-md">
      {/* Left section: Hamburger (mobile) + Active view title */}
      <div className="flex items-center gap-3 overflow-hidden min-w-0">
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onOpenMobileMenu}
          className="md:hidden shrink-0 text-muted-foreground hover:text-foreground"
          aria-label="Open mobile menu"
        >
          <Menu className="size-5" />
        </Button>

        <div className="flex flex-col overflow-hidden min-w-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <h1 className="font-semibold text-sm md:text-base leading-tight text-foreground truncate">
              {title}
            </h1>
            <Badge
              variant="outline"
              className="hidden sm:inline-flex text-[10px] py-0 px-1.5 h-4 font-normal text-muted-foreground border-border shrink-0"
            >
              {badge}
            </Badge>
          </div>
          <p className="hidden md:block text-[11px] text-muted-foreground truncate">
            {subtitle}
          </p>
        </div>
      </div>

      {/* Right section: Search bar + User profile shortcut + Quick Action CTA */}
      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        {/* Search Input */}
        <div className="relative hidden lg:block w-48 xl:w-56">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search desk, docs, tasks..."
            className="h-8 pl-8 text-xs bg-muted/40 border-border"
          />
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

        {/* Profile Link Shortcut */}
        <Button
          asChild
          variant="ghost"
          size="icon-sm"
          className="rounded-full size-8 p-0"
          title={`Profile settings for ${userName}`}
        >
          <Link href="/settings/profile">
            <Avatar className="size-7 rounded-full border border-border bg-indigo-950/40 text-indigo-300 text-[10px] font-mono font-bold">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Link>
        </Button>

        {/* Right Context Panel Toggle */}
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
