"use client"

import * as React from "react"
import {
  CalendarDays,
  Plus,
  Search,
  ExternalLink,
  Clock,
  MapPin,
  Trophy,
  ShieldCheck,
} from "lucide-react"
import { DeskEvent, EventType } from "@/types/desk"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { toast } from "sonner"

interface EventsViewProps {
  events: DeskEvent[]
  onAddEvent: (event: DeskEvent) => void
}

export function EventsView({ events, onAddEvent }: EventsViewProps) {
  const [filterType, setFilterType] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedEvent, setSelectedEvent] = React.useState<DeskEvent | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Form state for creating new event
  const [newTitle, setNewTitle] = React.useState("")
  const [newType, setNewType] = React.useState<EventType>("hackathon")
  const [newDate, setNewDate] = React.useState("")
  const [newTime, setNewTime] = React.useState("")
  const [newLocation, setNewLocation] = React.useState("")
  const [newRegUrl, setNewRegUrl] = React.useState("")
  const [newOrganizer, setNewOrganizer] = React.useState("")
  const [newEligibility, setNewEligibility] = React.useState("")
  const [newDeadline, setNewDeadline] = React.useState("")
  const [newDescription, setNewDescription] = React.useState("")
  const [newPrizePool, setNewPrizePool] = React.useState("")

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newDate.trim() || !newOrganizer.trim()) {
      toast.error("Please fill in Title, Date, and Organizer.")
      return
    }

    const created: DeskEvent = {
      id: `evt-${Date.now()}`,
      title: newTitle.trim(),
      type: newType,
      organizer: newOrganizer.trim(),
      date: newDate.trim(),
      time: newTime.trim() || "TBA",
      locationOrUrl: newLocation.trim() || "Virtual",
      registrationUrl: newRegUrl.trim() || "#",
      eligibility: newEligibility.trim() || "Open to all team members",
      status: "open",
      deadline: newDeadline.trim() || newDate.trim(),
      tags: [newType.toUpperCase(), "Desk Created"],
      prizePool: newPrizePool.trim() || undefined,
      description: newDescription.trim() || "Community organized team event.",
    }

    onAddEvent(created)
    setIsCreateOpen(false)
    // Reset form
    setNewTitle("")
    setNewDate("")
    setNewTime("")
    setNewLocation("")
    setNewRegUrl("")
    setNewOrganizer("")
    setNewEligibility("")
    setNewDeadline("")
    setNewDescription("")
    setNewPrizePool("")
    toast.success("Event posted to HackForge Opportunities board!")
  }

  const filteredEvents = events.filter((evt) => {
    const matchesFilter = filterType === "all" || evt.type === filterType
    const matchesSearch =
      !searchQuery.trim() ||
      evt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      evt.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesFilter && matchesSearch
  })

  const getTypeBadgeStyle = (type: EventType) => {
    switch (type) {
      case "hackathon":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
      case "workshop":
        return "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20"
      case "competition":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      case "study_session":
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
      case "submission_deadline":
        return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Banner & Action Controls */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="size-5 text-sky-500" />
            <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
              Events & Opportunities Desk
            </h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Curated hackathons, technical workshops, competitions, study sessions, and team deadlines.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 text-xs font-medium self-start md:self-auto shadow-xs"
        >
          <Plus className="size-3.5" />
          Post Opportunity
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Items" },
            { id: "hackathon", label: "Hackathons" },
            { id: "workshop", label: "Workshops" },
            { id: "competition", label: "Competitions" },
            { id: "study_session", label: "Study Rooms" },
            { id: "submission_deadline", label: "Deadlines" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setFilterType(tab.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filterType === tab.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search opportunities..."
            className="h-8 pl-8 text-xs bg-muted/30 border-border"
          />
        </div>
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground space-y-2">
            <CalendarDays className="size-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-medium">No events found matching your criteria</p>
            <p className="text-xs">Adjust your filter or create a new opportunity listing.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => (
            <Card
              key={evt.id}
              className="flex flex-col justify-between border-border bg-card shadow-xs hover:border-primary/40 transition-colors"
            >
              <CardHeader className="p-4 pb-2 space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge className={`text-[10px] font-medium border ${getTypeBadgeStyle(evt.type)}`}>
                    {evt.type.replace("_", " ").toUpperCase()}
                  </Badge>

                  {evt.status === "closing_soon" && (
                    <Badge variant="destructive" className="text-[10px] h-4 px-1.5 animate-pulse">
                      Closing Soon
                    </Badge>
                  )}
                </div>

                <div>
                  <CardTitle className="text-sm font-semibold line-clamp-2 leading-snug">
                    {evt.title}
                  </CardTitle>
                  <span className="text-[11px] text-muted-foreground block mt-0.5">
                    by {evt.organizer}
                  </span>
                </div>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {evt.description}
                </p>

                {evt.prizePool && (
                  <div className="flex items-center gap-1.5 rounded-lg bg-amber-500/10 p-2 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Trophy className="size-3.5 shrink-0" />
                    <span>{evt.prizePool}</span>
                  </div>
                )}

                <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
                  <div className="flex items-center gap-1.5">
                    <Clock className="size-3.5 text-primary shrink-0" />
                    <span className="font-medium text-foreground">{evt.date}</span>
                    <span>• {evt.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate">{evt.locationOrUrl}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-muted-foreground shrink-0" />
                    <span className="truncate text-[11px]">{evt.eligibility}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {evt.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-2 border-t border-border/60 flex items-center justify-between gap-2">
                <span className="text-[10px] text-muted-foreground truncate">
                  Deadline: {evt.deadline}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedEvent(evt)}
                  className="h-7 text-xs"
                >
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Event Details Dialog */}
      {selectedEvent && (
        <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge className={`text-[10px] ${getTypeBadgeStyle(selectedEvent.type)}`}>
                  {selectedEvent.type.replace("_", " ").toUpperCase()}
                </Badge>
                <span className="text-xs text-muted-foreground">Deadline: {selectedEvent.deadline}</span>
              </div>
              <DialogTitle className="text-base md:text-lg font-bold text-foreground">
                {selectedEvent.title}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Organized by {selectedEvent.organizer}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs">
              <div>
                <h4 className="font-semibold text-foreground mb-1">Overview</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {selectedEvent.description}
                </p>
              </div>

              {selectedEvent.prizePool && (
                <div className="rounded-lg bg-amber-500/10 p-2.5 text-amber-600 dark:text-amber-400 font-semibold border border-amber-500/20 flex items-center gap-2">
                  <Trophy className="size-4 shrink-0" />
                  <span>{selectedEvent.prizePool}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3 rounded-lg border border-border p-3 bg-muted/20">
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Date & Time</span>
                  <p className="font-medium text-foreground mt-0.5">{selectedEvent.date}</p>
                  <p className="text-muted-foreground text-[11px]">{selectedEvent.time}</p>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Location / Link</span>
                  <p className="font-medium text-foreground mt-0.5 truncate">{selectedEvent.locationOrUrl}</p>
                </div>
                <div className="col-span-2 pt-1 border-t border-border/50">
                  <span className="text-[10px] text-muted-foreground uppercase font-semibold">Eligibility Criteria</span>
                  <p className="font-medium text-foreground mt-0.5">{selectedEvent.eligibility}</p>
                </div>
              </div>
            </div>

            <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedEvent(null)}
                className="text-xs"
              >
                Close
              </Button>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => {
                    toast.success("Team registered interest! Added to War Room calendar.")
                    setSelectedEvent(null)
                  }}
                  className="text-xs gap-1.5"
                >
                  <ExternalLink className="size-3.5" />
                  Register / Open Link
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Post Opportunity Creation Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <form onSubmit={handleCreateSubmit}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                Post New Event or Opportunity
              </DialogTitle>
              <DialogDescription className="text-xs">
                Share an upcoming hackathon, workshop, conference, or team deadline with the workspace.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Event Title *</label>
                <Input
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. HackGlobal Edge Edition 2026"
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Event Category *</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as EventType)}
                    className="w-full h-8 rounded border border-border bg-background px-2 text-xs text-foreground outline-none"
                  >
                    <option value="hackathon">Hackathon</option>
                    <option value="workshop">Workshop</option>
                    <option value="competition">Competition</option>
                    <option value="study_session">Study Session</option>
                    <option value="submission_deadline">Project Deadline</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">Organizer *</label>
                  <Input
                    required
                    value={newOrganizer}
                    onChange={(e) => setNewOrganizer(e.target.value)}
                    placeholder="e.g. OpenTech Foundation"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Event Date *</label>
                  <Input
                    required
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    placeholder="e.g. Nov 12 - 14, 2026"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">Time / Duration</label>
                  <Input
                    value={newTime}
                    onChange={(e) => setNewTime(e.target.value)}
                    placeholder="e.g. 48 Hours"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Location or URL</label>
                  <Input
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    placeholder="e.g. Virtual or Campus Auditorium"
                    className="h-8 text-xs"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-foreground">Registration Deadline</label>
                  <Input
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="e.g. Nov 05, 2026"
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Eligibility</label>
                <Input
                  value={newEligibility}
                  onChange={(e) => setNewEligibility(e.target.value)}
                  placeholder="e.g. Students & Open Dev Teams"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Prize Pool / Grant (Optional)</label>
                <Input
                  value={newPrizePool}
                  onChange={(e) => setNewPrizePool(e.target.value)}
                  placeholder="e.g. $15,000 in Grants"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Description</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Brief details regarding goals, tracks, and tech requirements..."
                  rows={3}
                  className="w-full rounded border border-border bg-background p-2 text-xs text-foreground outline-none resize-none"
                />
              </div>
            </div>

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreateOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" className="text-xs">
                Post Opportunity
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
