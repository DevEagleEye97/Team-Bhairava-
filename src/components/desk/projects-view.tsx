"use client"

import * as React from "react"
import {
  FolderGit2,
  Plus,
  GitBranch,
  ExternalLink,
  CheckCircle2,
  Circle,
  Sparkles,
  ListTodo,
} from "lucide-react"
import { Project, Task, TaskStatus, TaskPriority } from "@/types/desk"
import { teamMembers, currentUser } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface ProjectsViewProps {
  projects: Project[]
  onUpdateProjects: (projects: Project[]) => void
}

export function ProjectsView({ projects, onUpdateProjects }: ProjectsViewProps) {
  const [selectedProjectId, setSelectedProjectId] = React.useState<string>(projects[0]?.id || "")
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false)

  // New task form state
  const [taskTitle, setTaskTitle] = React.useState("")
  const [taskDesc, setTaskDesc] = React.useState("")
  const [taskStatus, setTaskStatus] = React.useState<TaskStatus>("todo")
  const [taskPriority, setTaskPriority] = React.useState<TaskPriority>("medium")
  const [taskAssigneeId, setTaskAssigneeId] = React.useState<string>(currentUser.id)
  const [taskDueDate, setTaskDueDate] = React.useState("Next Sprint")

  // Hackathon Submission Checklist State
  const [checklist, setChecklist] = React.useState([
    { id: "c-1", label: "Core Problem statement and user persona validated", done: true },
    { id: "c-2", label: "Next.js 16 Responsive Desk Layout and navigation completed", done: true },
    { id: "c-3", label: "Interactive Conversation feeds and mock store active", done: true },
    { id: "c-4", label: "Offline inference with local Qwen2.5-coder tested", done: false },
    { id: "c-5", label: "Multi-tenant Supabase schema & RLS rules verified", done: false },
    { id: "c-6", label: "3-Minute Video Pitch Walkthrough & GitHub repo cleanup", done: false },
  ])

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    )
    toast.success("Checklist progress updated")
  }

  const currentProject = projects.find((p) => p.id === selectedProjectId) || projects[0]

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!taskTitle.trim()) {
      toast.error("Please enter a task title.")
      return
    }

    const assignee = teamMembers.find((m) => m.id === taskAssigneeId) || currentUser

    const newTask: Task = {
      id: `tsk-${Date.now()}`,
      projectId: currentProject.id,
      title: taskTitle.trim(),
      description: taskDesc.trim(),
      status: taskStatus,
      priority: taskPriority,
      assignee,
      dueDate: taskDueDate.trim() || "Upcoming",
    }

    const updatedProjects = projects.map((p) => {
      if (p.id === currentProject.id) {
        return {
          ...p,
          tasks: [newTask, ...p.tasks],
        }
      }
      return p
    })

    onUpdateProjects(updatedProjects)
    setIsAddTaskOpen(false)
    setTaskTitle("")
    setTaskDesc("")
    toast.success(`Task added to ${currentProject.name}!`)
  }

  const handleMoveTaskStatus = (taskId: string, nextStatus: TaskStatus) => {
    const updatedProjects = projects.map((p) => {
      if (p.id === currentProject.id) {
        const updatedTasks = p.tasks.map((t) =>
          t.id === taskId ? { ...t, status: nextStatus } : t
        )
        // Calculate new progress percent
        const doneCount = updatedTasks.filter((t) => t.status === "done").length
        const total = updatedTasks.length
        const newProgress = Math.round((doneCount / total) * 100)

        return {
          ...p,
          tasks: updatedTasks,
          progressPercent: newProgress,
        }
      }
      return p
    })

    onUpdateProjects(updatedProjects)
    toast.info(`Task status updated to ${nextStatus.replace("_", " ")}`)
  }

  const columns: { status: TaskStatus; label: string; color: string }[] = [
    { status: "todo", label: "To Do", color: "text-muted-foreground" },
    { status: "in_progress", label: "In Progress", color: "text-amber-500" },
    { status: "review", label: "In Review", color: "text-sky-500" },
    { status: "done", label: "Completed", color: "text-emerald-500" },
  ]

  const getPriorityBadge = (p: TaskPriority) => {
    switch (p) {
      case "urgent":
        return <Badge variant="destructive" className="text-[9px] px-1 h-3.5">Urgent</Badge>
      case "high":
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-[9px] px-1 h-3.5">High</Badge>
      case "medium":
        return <Badge variant="secondary" className="text-[9px] px-1 h-3.5">Med</Badge>
      case "low":
        return <Badge variant="outline" className="text-[9px] px-1 h-3.5 text-muted-foreground">Low</Badge>
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Header and Project Switcher */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="size-5 text-emerald-500" />
            <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
              Projects & Task Board
            </h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Track sprints, engineering deliverables, repository milestones, and hackathon submission readiness.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Project Switcher Tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
            {projects.map((proj) => (
              <button
                key={proj.id}
                type="button"
                onClick={() => setSelectedProjectId(proj.id)}
                className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                  selectedProjectId === proj.id
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {proj.name}
              </button>
            ))}
          </div>

          <Button
            size="sm"
            onClick={() => setIsAddTaskOpen(true)}
            className="gap-1.5 text-xs font-medium shadow-xs"
          >
            <Plus className="size-3.5" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Selected Project Overview Card */}
      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-4 md:p-6 space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-foreground">{currentProject.name}</h2>
                <Badge variant="outline" className="text-xs">
                  {currentProject.status.replace("_", " ").toUpperCase()}
                </Badge>
                {currentProject.track && (
                  <Badge className="bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20 text-xs">
                    {currentProject.track}
                  </Badge>
                )}
              </div>
              <p className="text-xs md:text-sm text-muted-foreground leading-relaxed">
                {currentProject.description}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {currentProject.githubUrl && (
                <a
                  href={currentProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <GitBranch className="size-3.5" />
                  <span>GitHub</span>
                </a>
              )}
              {currentProject.demoUrl && (
                <a
                  href={currentProject.demoUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <ExternalLink className="size-3.5" />
                  <span>Local Demo</span>
                </a>
              )}
            </div>
          </div>

          {/* Progress bar and Team Assignees */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-border/60">
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Deliverables Progress</span>
                <span className="font-bold text-foreground">{currentProject.progressPercent}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${currentProject.progressPercent}%` }}
                />
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-muted-foreground block">Assigned Engineers</span>
              <div className="flex items-center gap-1.5 pt-0.5">
                <div className="flex -space-x-1.5">
                  {currentProject.members.map((m) => (
                    <Avatar key={m.id} className="size-6 border-2 border-background" title={m.name}>
                      <AvatarFallback className="text-[9px] bg-primary/10 text-primary font-semibold">
                        {m.avatar}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                </div>
                <span className="text-muted-foreground text-[11px]">
                  {currentProject.members.length} team members
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-muted-foreground block">Key Milestones</span>
              <div className="flex flex-wrap gap-2 text-[11px]">
                {currentProject.deadlines.map((dl, idx) => (
                  <span key={idx} className="font-medium text-foreground">
                    {dl.label}: <span className="text-primary">{dl.date}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Hackathon Sprint & Submission Readiness Checklist */}
      <Card className="border-border bg-gradient-to-br from-card via-card to-muted/20 shadow-xs">
        <CardHeader className="p-4 pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-amber-500" />
              <CardTitle className="text-sm font-semibold">
                Hackathon Sprint & Submission Checklist
              </CardTitle>
            </div>
            <span className="text-xs font-semibold text-foreground">
              {checklist.filter((i) => i.done).length} / {checklist.length} Completed
            </span>
          </div>
          <CardDescription className="text-xs">
            Operational milestones required before submitting the demo build to judges.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
            {checklist.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => toggleChecklistItem(item.id)}
                className={`flex items-center gap-2.5 rounded-lg border p-2 text-left transition-colors ${
                  item.done
                    ? "border-emerald-500/20 bg-emerald-500/5 text-foreground"
                    : "border-border hover:bg-muted/40 text-muted-foreground"
                }`}
              >
                {item.done ? (
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="size-4 text-muted-foreground shrink-0" />
                )}
                <span className={item.done ? "line-through opacity-85" : "font-medium"}>
                  {item.label}
                </span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Kanban Task Columns */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-heading text-sm font-semibold text-foreground flex items-center gap-2">
            <ListTodo className="size-4 text-primary" />
            Task Board — {currentProject.name}
          </h3>
          <span className="text-xs text-muted-foreground">
            {currentProject.tasks.length} total tasks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {columns.map((col) => {
            const colTasks = currentProject.tasks.filter((t) => t.status === col.status)

            return (
              <div
                key={col.status}
                className="flex flex-col rounded-xl border border-border bg-muted/20 p-3 min-h-[350px]"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-3">
                  <div className="flex items-center gap-2">
                    <span className={`size-2 rounded-full ${
                      col.status === "todo" ? "bg-zinc-400" :
                      col.status === "in_progress" ? "bg-amber-500" :
                      col.status === "review" ? "bg-sky-500" : "bg-emerald-500"
                    }`} />
                    <span className="text-xs font-semibold text-foreground">{col.label}</span>
                  </div>
                  <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                    {colTasks.length}
                  </Badge>
                </div>

                {/* Column Tasks List */}
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {colTasks.length === 0 ? (
                    <div className="flex h-32 items-center justify-center text-center text-xs text-muted-foreground/60">
                      No tasks in {col.label}
                    </div>
                  ) : (
                    colTasks.map((task) => (
                      <div
                        key={task.id}
                        className="rounded-lg border border-border bg-card p-3 shadow-2xs hover:border-primary/40 transition-colors space-y-2"
                      >
                        <div className="flex items-start justify-between gap-1.5">
                          <span className="text-xs font-medium text-foreground leading-snug">
                            {task.title}
                          </span>
                          {getPriorityBadge(task.priority)}
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-border/40 text-[11px]">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Avatar className="size-5">
                              <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-semibold">
                                {task.assignee.avatar}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-[10px] truncate max-w-[80px]">
                              {task.assignee.name}
                            </span>
                          </div>

                          <span className="text-[10px] text-muted-foreground font-mono">
                            {task.dueDate}
                          </span>
                        </div>

                        {/* Status Shift Controls */}
                        <div className="flex items-center justify-end gap-1 pt-1">
                          {col.status !== "todo" && (
                            <button
                              type="button"
                              onClick={() => {
                                const prev =
                                  col.status === "done" ? "review" :
                                  col.status === "review" ? "in_progress" : "todo"
                                handleMoveTaskStatus(task.id, prev)
                              }}
                              className="text-[10px] text-muted-foreground hover:text-foreground p-0.5"
                              title="Move back"
                            >
                              ←
                            </button>
                          )}
                          {col.status !== "done" && (
                            <button
                              type="button"
                              onClick={() => {
                                const next =
                                  col.status === "todo" ? "in_progress" :
                                  col.status === "in_progress" ? "review" : "done"
                                handleMoveTaskStatus(task.id, next)
                              }}
                              className="text-[10px] text-primary hover:underline p-0.5 font-medium"
                              title="Move forward"
                            >
                              Advance →
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleAddTask}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                Add Task to {currentProject.name}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Create an engineering deliverable or review item for the team.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Task Title *</label>
                <Input
                  required
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  placeholder="e.g. Audit responsive table behavior on mobile"
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Column Status</label>
                  <select
                    value={taskStatus}
                    onChange={(e) => setTaskStatus(e.target.value as TaskStatus)}
                    className="w-full h-8 rounded border border-border bg-background px-2 text-xs text-foreground outline-none"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">In Review</option>
                    <option value="done">Completed</option>
                  </select>
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
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Assignee</label>
                  <select
                    value={taskAssigneeId}
                    onChange={(e) => setTaskAssigneeId(e.target.value)}
                    className="w-full h-8 rounded border border-border bg-background px-2 text-xs text-foreground outline-none"
                  >
                    {teamMembers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">Due Date</label>
                  <Input
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    placeholder="e.g. Oct 22"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Description</label>
                <textarea
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Task context, acceptance criteria, or relevant file paths..."
                  rows={2}
                  className="w-full rounded border border-border bg-background p-2 text-xs text-foreground outline-none resize-none"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddTaskOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
