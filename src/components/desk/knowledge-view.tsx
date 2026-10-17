"use client"

import * as React from "react"
import {
  BookOpen,
  Plus,
  Search,
  Clock,
  FileText,
  Share2,
} from "lucide-react"
import { KnowledgeItem } from "@/types/desk"
import { currentUser } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
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

interface KnowledgeViewProps {
  knowledge: KnowledgeItem[]
  onAddKnowledge: (item: KnowledgeItem) => void
}

export function KnowledgeView({ knowledge, onAddKnowledge }: KnowledgeViewProps) {
  const [filterCat, setFilterCat] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedDoc, setSelectedDoc] = React.useState<KnowledgeItem | null>(null)
  const [isCreateOpen, setIsCreateOpen] = React.useState(false)

  // Create form state
  const [title, setTitle] = React.useState("")
  const [category, setCategory] = React.useState<KnowledgeItem["category"]>("Architecture")
  const [excerpt, setExcerpt] = React.useState("")
  const [tagsInput, setTagsInput] = React.useState("")
  const [readingTime, setReadingTime] = React.useState("5")

  const handleCreateDoc = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !excerpt.trim()) {
      toast.error("Please fill in document title and excerpt.")
      return
    }

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean)

    const newDoc: KnowledgeItem = {
      id: `kb-${Date.now()}`,
      title: title.trim(),
      category,
      excerpt: excerpt.trim(),
      author: currentUser,
      updatedAt: "Just now",
      tags: tags.length > 0 ? tags : ["Documentation"],
      readingTimeMinutes: parseInt(readingTime, 10) || 4,
    }

    onAddKnowledge(newDoc)
    setIsCreateOpen(false)
    setTitle("")
    setExcerpt("")
    setTagsInput("")
    toast.success("Document added to team knowledge base!")
  }

  const filteredDocs = knowledge.filter((doc) => {
    const matchesCat = filterCat === "all" || doc.category.toLowerCase() === filterCat.toLowerCase()
    const matchesSearch =
      !searchQuery.trim() ||
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))

    return matchesCat && matchesSearch
  })

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-7xl mx-auto w-full">
      {/* Top Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <BookOpen className="size-5 text-amber-500" />
            <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
              Shared Knowledge Base
            </h1>
          </div>
          <p className="text-xs md:text-sm text-muted-foreground mt-1">
            Living repository of system architecture specs, setup guides, hackathon cheat sheets, and technical decisions.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateOpen(true)}
          className="gap-2 text-xs font-medium shadow-xs"
        >
          <Plus className="size-3.5" />
          Create Document
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: "all", label: "All Docs" },
            { id: "architecture", label: "Architecture" },
            { id: "guides", label: "Guides" },
            { id: "meeting notes", label: "Meeting Notes" },
            { id: "study resources", label: "Study Resources" },
            { id: "decisions", label: "Decisions" },
          ].map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCat(cat.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filterCat === cat.id
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search wiki & docs..."
            className="h-8 pl-8 text-xs bg-muted/30 border-border"
          />
        </div>
      </div>

      {/* Knowledge Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.length === 0 ? (
          <div className="col-span-full py-16 text-center text-muted-foreground space-y-2">
            <FileText className="size-8 mx-auto text-muted-foreground/60" />
            <p className="text-sm font-medium">No documents found</p>
            <p className="text-xs">Adjust your search or author a new technical guide.</p>
          </div>
        ) : (
          filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              className="flex flex-col justify-between border-border bg-card shadow-xs hover:border-primary/40 transition-colors cursor-pointer"
              onClick={() => setSelectedDoc(doc)}
            >
              <CardHeader className="p-4 pb-2 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-[10px] py-0 h-4 font-normal">
                    {doc.category}
                  </Badge>
                  <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                    <Clock className="size-3" />
                    {doc.readingTimeMinutes} min read
                  </span>
                </div>
                <CardTitle className="text-sm font-semibold leading-snug line-clamp-2">
                  {doc.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-1 space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                  {doc.excerpt}
                </p>

                <div className="flex flex-wrap gap-1">
                  {doc.tags.map((tag, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[9px] px-1.5 py-0 h-4">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Avatar className="size-5">
                    <AvatarFallback className="text-[8px] bg-primary/10 text-primary font-semibold">
                      {doc.author.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-[11px] font-medium">{doc.author.name}</span>
                </div>
                <span className="text-[10px]">{doc.updatedAt}</span>
              </CardFooter>
            </Card>
          ))
        )}
      </div>

      {/* Document Detail Reader Modal */}
      {selectedDoc && (
        <Dialog open={!!selectedDoc} onOpenChange={(open) => !open && setSelectedDoc(null)}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="outline" className="text-[10px]">
                  {selectedDoc.category}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Updated {selectedDoc.updatedAt} • {selectedDoc.readingTimeMinutes} min read
                </span>
              </div>
              <DialogTitle className="text-base md:text-lg font-bold text-foreground">
                {selectedDoc.title}
              </DialogTitle>
              <DialogDescription className="text-xs">
                Authored by {selectedDoc.author.name} ({selectedDoc.author.role})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-2 text-xs text-foreground/90 leading-relaxed">
              <div className="rounded-lg border border-border bg-muted/20 p-3">
                <span className="font-semibold text-foreground block mb-1">Executive Summary</span>
                <p className="text-muted-foreground">{selectedDoc.excerpt}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Key Architecture Principles</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Enforce strict boundary validation between server actions and client forms.</li>
                  <li>Adopt CSS-first tokens in Tailwind v4; avoid hardcoded utility colors.</li>
                  <li>Ensure zero runtime dependencies on external AI providers during core flows.</li>
                  <li>Verify all components with keyboard navigation and accessible focus rings.</li>
                </ul>
              </div>

              <div className="flex flex-wrap gap-1 pt-1">
                {selectedDoc.tags.map((tag, idx) => (
                  <Badge key={idx} variant="secondary" className="text-[10px]">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>

            <DialogFooter className="flex-row items-center justify-between gap-2 sm:justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDoc(null)}
                className="text-xs"
              >
                Done Reading
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  toast.success("Document link copied to clipboard!")
                }}
                className="text-xs gap-1.5"
              >
                <Share2 className="size-3.5" />
                Copy Reference Link
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Document Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreateDoc}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-foreground">
                Author Team Knowledge Document
              </DialogTitle>
              <DialogDescription className="text-xs">
                Add an architecture specification, sprint guide, or team meeting decision.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-foreground">Document Title *</label>
                <Input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Next.js 16 Server Actions Error Handling"
                  className="h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-medium text-foreground">Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as KnowledgeItem["category"])}
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
                  <label className="font-medium text-foreground">Estimated Read Time (Minutes)</label>
                  <Input
                    type="number"
                    min="1"
                    max="60"
                    value={readingTime}
                    onChange={(e) => setReadingTime(e.target.value)}
                    className="h-8 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Tags (Comma-separated)</label>
                <Input
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  placeholder="e.g. Next.js, Security, RLS"
                  className="h-8 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-foreground">Content / Excerpt *</label>
                <textarea
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Summary of guidelines, rationale, and instructions..."
                  rows={4}
                  className="w-full rounded border border-border bg-background p-2 text-xs text-foreground outline-none resize-none leading-relaxed"
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
                Publish Document
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
