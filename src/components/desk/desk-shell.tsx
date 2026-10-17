"use client"

import * as React from "react"
import { NavigationTab, Message, DeskEvent, Project, KnowledgeItem, Task, Poll } from "@/types/desk"
import {
  currentUser,
  deskChannels,
  initialMessages,
  deskEvents,
  deskProjects,
  deskKnowledge,
  deskPolls,
} from "@/lib/mock-data"
import { DeskSidebar } from "@/components/desk/desk-sidebar"
import { DeskHeader } from "@/components/desk/desk-header"
import { DeskRightPanel } from "@/components/desk/desk-right-panel"
import { DashboardView } from "@/components/desk/dashboard-view"
import { ConversationView } from "@/components/desk/conversation-view"
import { EventsView } from "@/components/desk/events-view"
import { ProjectsView } from "@/components/desk/projects-view"
import { KnowledgeView } from "@/components/desk/knowledge-view"
import { StudyRoomView } from "@/components/desk/study-room-view"
import { QuickActionModal } from "@/components/desk/quick-action-modal"
import { AiCopilotModal } from "@/components/desk/ai-copilot-modal"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Sparkles } from "lucide-react"
import { toast } from "sonner"

export function DeskShell() {
  const [activeTab, setActiveTab] = React.useState<NavigationTab>("dashboard")
  const [isSidebarCollapsed, setIsSidebarCollapsed] = React.useState(false)
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = React.useState(false)
  const [isMobileRightPanelOpen, setIsMobileRightPanelOpen] = React.useState(false)
  const [isRightPanelOpen, setIsRightPanelOpen] = React.useState(true)
  const [isQuickActionOpen, setIsQuickActionOpen] = React.useState(false)
  const [isAiCopilotOpen, setIsAiCopilotOpen] = React.useState(false)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [activeThreadMessage, setActiveThreadMessage] = React.useState<Message | null>(null)


  // Dynamic client session state
  const [messagesByChannel, setMessagesByChannel] = React.useState<Record<string, Message[]>>(initialMessages)
  const [eventsList, setEventsList] = React.useState<DeskEvent[]>(deskEvents)
  const [projectsList, setProjectsList] = React.useState<Project[]>(deskProjects)
  const [knowledgeList, setKnowledgeList] = React.useState<KnowledgeItem[]>(deskKnowledge)
  const [activePoll, setActivePoll] = React.useState<Poll>(deskPolls[0])

  // Message dispatcher
  const handleSendMessage = (
    channelId: string,
    content: string,
    codeSnippet?: { language: string; code: string }
  ) => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    const ampm = hours >= 12 ? "PM" : "AM"
    const formattedHours = hours % 12 || 12
    const formattedTime = `Today at ${formattedHours}:${minutes < 10 ? "0" : ""}${minutes} ${ampm}`

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      channelId,
      author: currentUser,
      content,
      timestamp: formattedTime,
      reactions: [],
      codeSnippet,
    }

    setMessagesByChannel((prev) => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg],
    }))
  }

  // Reaction toggler
  const handleToggleReaction = (messageId: string, emoji: string) => {
    setMessagesByChannel((prev) => {
      const next = { ...prev }
      for (const chId in next) {
        next[chId] = next[chId].map((msg) => {
          if (msg.id === messageId) {
            const existingReactionIndex = msg.reactions.findIndex((r) => r.emoji === emoji)
            let updatedReactions = [...msg.reactions]

            if (existingReactionIndex > -1) {
              const rx = updatedReactions[existingReactionIndex]
              if (rx.reactedByMe) {
                // remove reaction
                if (rx.count === 1) {
                  updatedReactions = updatedReactions.filter((_, idx) => idx !== existingReactionIndex)
                } else {
                  updatedReactions[existingReactionIndex] = {
                    ...rx,
                    count: rx.count - 1,
                    reactedByMe: false,
                  }
                }
              } else {
                // increment
                updatedReactions[existingReactionIndex] = {
                  ...rx,
                  count: rx.count + 1,
                  reactedByMe: true,
                }
              }
            } else {
              // new reaction
              updatedReactions.push({ emoji, count: 1, reactedByMe: true })
            }

            return { ...msg, reactions: updatedReactions }
          }
          return msg
        })
      }
      return next
    })
  }

  // Poll voting handler
  const handleVotePoll = (optionId: string) => {
    if (activePoll.userVotedOptionId === optionId) {
      toast.info("You have already voted for this option.")
      return
    }

    setActivePoll((prev) => {
      const updatedOptions = prev.options.map((opt) => {
        if (opt.id === optionId) {
          return { ...opt, votes: opt.votes + 1 }
        }
        if (opt.id === prev.userVotedOptionId) {
          return { ...opt, votes: Math.max(0, opt.votes - 1) }
        }
        return opt
      })

      const newTotal = prev.userVotedOptionId ? prev.totalVotes : prev.totalVotes + 1

      return {
        ...prev,
        options: updatedOptions,
        totalVotes: newTotal,
        userVotedOptionId: optionId,
      }
    })

    toast.success("Vote recorded in Context Desk!")
  }

  // Event handler
  const handleAddEvent = (event: DeskEvent) => {
    setEventsList((prev) => [event, ...prev])
  }

  // Project task handler
  const handleAddTask = (projectId: string, task: Task) => {
    setProjectsList((prev) =>
      prev.map((proj) => {
        if (proj.id === projectId) {
          return {
            ...proj,
            tasks: [task, ...proj.tasks],
          }
        }
        return proj
      })
    )
  }

  // Knowledge handler
  const handleAddKnowledge = (doc: KnowledgeItem) => {
    setKnowledgeList((prev) => [doc, ...prev])
  }

  // Open thread in right panel
  const handleOpenThread = (message: Message) => {
    setActiveThreadMessage(message)
    setIsRightPanelOpen(true)
    setIsMobileRightPanelOpen(true)
  }

  // Active channel resolution
  const activeChannel = deskChannels.find((c) => c.id === activeTab)

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background font-sans text-foreground">
      {/* 1. Left Sidebar: Fixed 260px on desktop (≥1024px) */}
      <DeskSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        className="hidden md:flex shrink-0"
      />

      {/* Mobile Drawer (Left Navigation Sheet) */}
      <Sheet open={isMobileDrawerOpen} onOpenChange={setIsMobileDrawerOpen}>
        <SheetContent side="left" className="p-0 w-72 max-w-[85vw] border-r border-border bg-sidebar" showCloseButton={false}>
          <DeskSidebar
            activeTab={activeTab}
            onSelectTab={setActiveTab}
            isCollapsed={false}
            onToggleCollapse={() => {}}
            onCloseMobile={() => setIsMobileDrawerOpen(false)}
            className="w-full border-none"
          />
        </SheetContent>
      </Sheet>

      {/* 2. Center Stage: Fluid width flex-1 min-w-0 */}
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <DeskHeader
          activeTab={activeTab}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onOpenMobileMenu={() => setIsMobileDrawerOpen(true)}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
          isRightPanelOpen={isRightPanelOpen}
          onToggleRightPanel={() => {
            setIsRightPanelOpen(!isRightPanelOpen)
            setIsMobileRightPanelOpen(!isMobileRightPanelOpen)
          }}
        />

        {/* View Switcher Container */}
        <main className="flex flex-1 overflow-hidden min-w-0">
          {activeTab === "dashboard" && (
            <DashboardView
              onNavigateTab={(tab) => setActiveTab(tab)}
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
            />
          )}

          {activeTab === "events" && (
            <EventsView
              events={eventsList}
              onAddEvent={handleAddEvent}
            />
          )}

          {activeTab === "projects" && (
            <ProjectsView
              projects={projectsList}
              onUpdateProjects={setProjectsList}
            />
          )}

          {activeTab === "knowledge" && (
            <KnowledgeView
              knowledge={knowledgeList}
              onAddKnowledge={handleAddKnowledge}
            />
          )}

          {activeTab === "channel-study" && (
            <StudyRoomView
              onOpenQuickAction={() => setIsQuickActionOpen(true)}
              isFocusSideOpen={isRightPanelOpen}
              onToggleFocusSide={() => setIsRightPanelOpen(!isRightPanelOpen)}
            />
          )}

          {activeChannel && activeTab !== "channel-study" && (
            <ConversationView
              channel={activeChannel}
              messages={messagesByChannel[activeChannel.id] || []}
              onSendMessage={handleSendMessage}
              onToggleReaction={handleToggleReaction}
              onOpenThread={handleOpenThread}
            />
          )}
        </main>

      </div>

      {/* 3. Right Context Panel: Fixed 320px, Persistent on Desktop (≥1024px) for non-study views */}
      {isRightPanelOpen && activeTab !== "channel-study" && (
        <DeskRightPanel
          events={eventsList}
          activePoll={activePoll}
          onVotePoll={handleVotePoll}
          onNavigateTab={setActiveTab}
          activeThreadMessage={activeThreadMessage}
          onCloseThread={() => setActiveThreadMessage(null)}
          className="hidden lg:flex"
        />
      )}

      {/* Mobile / Tablet Overlay Drawer for Right Context Panel */}
      {activeTab !== "channel-study" && (
        <Sheet open={isMobileRightPanelOpen} onOpenChange={setIsMobileRightPanelOpen}>
          <SheetContent side="right" className="p-0 w-80 max-w-[90vw] border-l border-border bg-sidebar" showCloseButton={false}>
            <DeskRightPanel
              events={eventsList}
              activePoll={activePoll}
              onVotePoll={handleVotePoll}
              onNavigateTab={(tab) => {
                setActiveTab(tab)
                setIsMobileRightPanelOpen(false)
              }}
              activeThreadMessage={activeThreadMessage}
              onCloseThread={() => setActiveThreadMessage(null)}
              onCloseMobilePanel={() => setIsMobileRightPanelOpen(false)}
              className="w-full border-none"
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Quick Action Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onSendMessage={handleSendMessage}
        onAddEvent={handleAddEvent}
        onAddTask={handleAddTask}
        onAddKnowledge={handleAddKnowledge}
      />

      {/* Floating AI Copilot Launcher Button */}
      {!isAiCopilotOpen && (
        <button
          type="button"
          onClick={() => setIsAiCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-indigo-500/40 bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xl hover:scale-105 hover:shadow-indigo-500/25 transition-all cursor-pointer group"
          title="Open ForgeCopilot AI Assistant"
        >
          <Sparkles className="size-4 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Ask Copilot</span>
        </button>
      )}

      {/* AI Copilot Chatbot Modal */}
      <AiCopilotModal
        isOpen={isAiCopilotOpen}
        onClose={() => setIsAiCopilotOpen(false)}
        onNavigateTab={setActiveTab}
      />
    </div>
  )
}

