"use client"

import * as React from "react"
import {
  MessageSquare,
  CalendarDays,
  ListTodo,
  BookOpen,
  Sparkles,
} from "lucide-react"
import {
  DeskEvent,
  Task,
  KnowledgeItem,
  EventType,
  TaskPriority,
} from "@/types/desk"
import { deskChannels, deskProjects, currentUser } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface QuickActionModalProps {
  isOpen: boolean
  onClose: () => void
  onSendMessage: (channelId: string, content: string) => void
  onAddEvent: (event: DeskEvent) => void
  onAddTask: (projectId: string, task: Task) => void
  onAddKnowledge: (doc: KnowledgeItem) => void
}

export function QuickActionModal({
  isOpen,
  onClose,
  onSendMessage,
  onAddEvent,
  onAddTask,
  onAddKnowledge,
}: QuickActionModalProps) {
  const [activeTab, setActiveTab] = React.useState<"message" | "event" | "task" | "doc">("message")

  // Message Form State
  const [targetChannel, setTargetChannel] = React.useState(deskChannels[0].id)
  const [messageContent, setMessageContent] = React.useState("")

  // Event Form State
  const [eventTitle, setEventTitle] = React.useState("")
  const [eventType, setEventType] = React.useState<EventType>("hackathon")
  const [eventDate, setEventDate] = React.useState("")
  const [eventOrg, setEventOrg] = React.useState("")

  // Task Form State
  const [taskProjectId, setTaskProjectId] = React.useState(deskProjects[0].id)
  const [taskTitle, setTaskTitle] = React.useState("")
  const [taskPriority, setTaskPriority] = React.useState<TaskPriority>("high")

  // Doc Form State
  const [docTitle, setDocTitle] = React.useState("")
  const [docCategory, setDocCategory] = React.useState<KnowledgeItem["category"]>("Architecture")
  const [docExcerpt, setDocExcerpt] = React.useState("")

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!messageContent.trim()) {
      toast.error("Please enter a message.")
      return
    }
    onSendMessage(targetChannel, messageContent.trim())
    setMessageContent("")
    onClose()
    toast.success("Message dispatched to channel!")
  }

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!eventTitle.trim() || !eventDate.trim()) {
      toast.error("Please provide title and date.")
      return
    }
    const newEvt: DeskEvent = {
      id: `evt-${Date.now()}`,
      title: eventTitle.trim(),
      type: eventType,
      organizer: eventOrg.trim() || "HackForge Team",
      date: eventDate.trim(),
      time: "TBA",
      locationOrUrl: "Virtual",
      registrationUrl: "#",
      eligibility: "All Members",
      status: "open",
      deadline: eventDate.trim(),
      tags: ["Quick Action", eventType.toUpperCase()],
      description: "Opportunity shared via quick action desk menu.",
    }
    onAddEvent(newEvt)
    setEventTitle("")
    setEventDate("")
    setEventOrg("")
    onClose()
    toast.success("Opportunity posted to desk!")
  }

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle.trim()) {
      toast.error("Please enter task title.")
      return
    }
    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      projectId: taskProjectId,
      title: taskTitle.trim(),
      description: "Created via desk quick action launcher.",
      status: "todo",
      priority: taskPriority,
      assignee: currentUser,
      dueDate: "This Sprint",
    }
    onAddTask(taskProjectId, newTask)
    setTaskTitle("")
    onClose()
    toast.success("Task created in project board!")
  }

  const handleDocSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!docTitle.trim() || !docExcerpt.trim()) {
      toast.error("Please enter title and summary.")
      return
    }
    const newDoc: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      title: docTitle.trim(),
      category: docCategory,
      excerpt: docExcerpt.trim(),
      author: currentUser,
      updatedAt: "Just now",
      tags: ["Quick Note"],
      readingTimeMinutes: 3,
    }
    onAddKnowledge(newDoc)
    setDocTitle("")
    setDocExcerpt("")
    onClose()
    toast.success("Knowledge document published!")
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <DialogTitle className="text-base font-bold text-foreground">
              Quick Action Launcher
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs">
            Quickly trigger a discussion, list an opportunity, add a task, or share notes.
          </DialogDescription>
        </DialogHeader>

        {/* Tab Selector */}
        <div className="grid grid-cols-4 gap-1 rounded-lg border border-border bg-muted/40 p-1 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab("message")}
            className={`flex flex-col items-center gap-1 rounded-md py-1.5 transition-colors ${
              activeTab === "message"
                ? "bg-primary text-primary-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <MessageSquare className="size-3.5" />
            <span className="text-[10px]">Discuss</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("event")}
            className={`flex flex-col items-center gap-1 rounded-md py-1.5 transition-colors ${
              activeTab === "event"
                ? "bg-primary text-primary-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <CalendarDays className="size-3.5" />
            <span className="text-[10px]">Event</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("task")}
            className={`flex flex-col items-center gap-1 rounded-md py-1.5 transition-colors ${
              activeTab === "task"
                ? "bg-primary text-primary-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <ListTodo className="size-3.5" />
            <span className="text-[10px]">Task</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("doc")}
            className={`flex flex-col items-center gap-1 rounded-md py-1.5 transition-colors ${
              activeTab === "doc"
                ? "bg-primary text-primary-foreground font-medium shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <BookOpen className="size-3.5" />
            <span className="text-[10px]">Doc</span>
          </button>
        </div>

        {/* Tab 1: Discussion Form */}
        {activeTab === "message" && (
          <form onSubmit={handleMessageSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground">Target Channel</label>
              <select
                value={targetChannel}
                onChange={(e) => setTargetChannel(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs text-foreground outline-none"
              >
                {deskChannels.map((c) => (
                  <option key={c.id} value={c.id}>
                    #{c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">Message</label>
              <textarea
                required
                value={messageContent}
                onChange={(e) => setMessageContent(e.target.value)}
                placeholder="Share an update or question..."
                rows={3}
                className="w-full rounded border border-border bg-background p-2 text-xs text-foreground outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Send Message
              </Button>
            </div>
          </form>
        )}

        {/* Tab 2: Event Form */}
        {activeTab === "event" && (
          <form onSubmit={handleEventSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground">Title</label>
              <Input
                required
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                placeholder="e.g. HackMIT Track Submissions"
                className="h-8 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Category</label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value as EventType)}
                  className="w-full h-8 rounded border border-border bg-background px-2 text-xs text-foreground outline-none"
                >
                  <option value="hackathon">Hackathon</option>
                  <option value="workshop">Workshop</option>
                  <option value="competition">Competition</option>
                  <option value="study_session">Study Session</option>
                  <option value="submission_deadline">Deadline</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Date</label>
                <Input
                  required
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  placeholder="e.g. Oct 28, 2026"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">Organizer</label>
              <Input
                value={eventOrg}
                onChange={(e) => setEventOrg(e.target.value)}
                placeholder="e.g. HackForge Team"
                className="h-8 text-xs"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Post Event
              </Button>
            </div>
          </form>
        )}

        {/* Tab 3: Task Form */}
        {activeTab === "task" && (
          <form onSubmit={handleTaskSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground">Target Project</label>
              <select
                value={taskProjectId}
                onChange={(e) => setTaskProjectId(e.target.value)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs text-foreground outline-none"
              >
                {deskProjects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">Task Title</label>
              <Input
                required
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                placeholder="e.g. Setup Supabase local docker migration"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">Priority</label>
              <select
                value={taskPriority}
                onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs text-foreground outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Create Task
              </Button>
            </div>
          </form>
        )}

        {/* Tab 4: Knowledge Doc Form */}
        {activeTab === "doc" && (
          <form onSubmit={handleDocSubmit} className="space-y-3 pt-2 text-xs">
            <div className="space-y-1">
              <label className="font-medium text-foreground">Document Title</label>
              <Input
                required
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                placeholder="e.g. Turbopack Build Optimization Guide"
                className="h-8 text-xs"
              />
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">Category</label>
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value as KnowledgeItem["category"])}
                className="w-full h-8 rounded border border-border bg-background px-2 text-xs text-foreground outline-none"
              >
                <option value="Architecture">Architecture</option>
                <option value="Guides">Guides</option>
                <option value="Meeting Notes">Meeting Notes</option>
                <option value="Study Resources">Study Resources</option>
                <option value="Decisions">Decisions</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-medium text-foreground">Summary</label>
              <textarea
                required
                value={docExcerpt}
                onChange={(e) => setDocExcerpt(e.target.value)}
                placeholder="Key takeaways or instructions..."
                rows={3}
                className="w-full rounded border border-border bg-background p-2 text-xs text-foreground outline-none resize-none leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <Button type="button" variant="outline" size="sm" onClick={onClose} className="text-xs">
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Save Note
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
