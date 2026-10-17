"use client"

import * as React from "react"
import {
  Search,
  FileText,
  Shield,
  GraduationCap,
  Eye,
  X,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Flame,
  Filter,
} from "lucide-react"

import { StudyMaterial } from "@/types/desk"
import { deskStudyMaterials } from "@/lib/mock-data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { toast } from "sonner"
import { PdfJsViewer } from "@/components/desk/pdf-js-viewer"

interface StudyRoomViewProps {
  onOpenQuickAction?: () => void
  isFocusSideOpen?: boolean
  onToggleFocusSide?: () => void
}

export function StudyRoomView({
  onOpenQuickAction,
  isFocusSideOpen,
  onToggleFocusSide,
}: StudyRoomViewProps) {
  // Local fallback state if parent doesn't provide panel control
  const [internalFocusOpen, setInternalFocusOpen] = React.useState(true)
  const isFocusOpen = isFocusSideOpen ?? internalFocusOpen
  const toggleFocus = onToggleFocusSide ?? (() => setInternalFocusOpen((prev) => !prev))

  // Mobile drawer state for smaller screens (< 1024px)
  const [isMobileFocusOpen, setIsMobileFocusOpen] = React.useState(false)

  // Shvasa iframe state
  const [isIframeLoading, setIsIframeLoading] = React.useState(true)
  const [iframeKey, setIframeKey] = React.useState(0)

  // Data fetching states
  const [materials, setMaterials] = React.useState<StudyMaterial[]>(deskStudyMaterials)
  const [isLoading, setIsLoading] = React.useState(true)
  const [fetchError, setFetchError] = React.useState<string | null>(null)
  const [dataSource, setDataSource] = React.useState<string>("seed_fallback")
  const [dbStatus, setDbStatus] = React.useState<string>("ready")

  // Filters & search (Strictly IA-1 & Semester 1 per academic requirement)
  const selectedSemester = "Semester 1"
  const selectedIa = "IA-1"
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedSubject, setSelectedSubject] = React.useState<string>("all")

  // In-App PDF Viewer modal state
  const [viewingMaterial, setViewingMaterial] = React.useState<StudyMaterial | null>(null)
  const [isViewerFullscreen, setIsViewerFullscreen] = React.useState(false)
  const [viewerUrl, setViewerUrl] = React.useState<string | null>(null)

  // Fetch materials from API route
  const handleRefresh = React.useCallback(() => {
    setIsLoading(true)
    setFetchError(null)

    const params = new URLSearchParams()
    params.append("semester", selectedSemester)
    params.append("ia", selectedIa)
    if (selectedSubject !== "all") params.append("subject", selectedSubject)
    if (searchQuery.trim()) params.append("q", searchQuery.trim())

    fetch(`/api/study-materials?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        return res.json()
      })
      .then((data) => {
        setMaterials(data.data || deskStudyMaterials)
        setDataSource(data.source || "seed_fallback")
        setDbStatus(data.databaseStatus || "live_ready")
        setIsLoading(false)
      })
      .catch((err: unknown) => {
        const msg = err instanceof Error ? err.message : "Failed to load study documents"
        setFetchError(msg)
        setMaterials(deskStudyMaterials)
        setIsLoading(false)
      })
  }, [selectedSemester, selectedIa, selectedSubject, searchQuery])

  React.useEffect(() => {
    let ignore = false

    const params = new URLSearchParams()
    params.append("semester", selectedSemester)
    params.append("ia", selectedIa)
    if (selectedSubject !== "all") params.append("subject", selectedSubject)
    if (searchQuery.trim()) params.append("q", searchQuery.trim())

    fetch(`/api/study-materials?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error ${res.status}`)
        return res.json()
      })
      .then((data) => {
        if (!ignore) {
          setMaterials(data.data || deskStudyMaterials)
          setDataSource(data.source || "seed_fallback")
          setDbStatus(data.databaseStatus || "live_ready")
          setIsLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const msg = err instanceof Error ? err.message : "Failed to load study documents"
          setFetchError(msg)
          setMaterials(deskStudyMaterials)
          setIsLoading(false)
        }
      })

    return () => {
      ignore = true
    }
  }, [selectedSemester, selectedIa, selectedSubject, searchQuery])

  // Open PDF viewer with server-authorized short-lived signed URL or inline stream
  const handleOpenPdf = async (item: StudyMaterial) => {
    setViewingMaterial(item)
    setViewerUrl(null)

    try {
      const res = await fetch(`/api/study-materials/${encodeURIComponent(item.id)}/view?format=url`)
      if (!res.ok) {
        throw new Error("Authorization failed")
      }
      const data = await res.json()
      setViewerUrl(data.signedUrl)
    } catch {
      toast.error("Could not authorize document viewer. Using direct secure stream.")
      setViewerUrl(`/api/study-materials/${encodeURIComponent(item.id)}/view`)
    }
  }

  // Close viewer
  const handleClosePdf = () => {
    setViewingMaterial(null)
    setViewerUrl(null)
    setIsViewerFullscreen(false)
  }

  // Group materials by Subject
  const uniqueSubjects = Array.from(new Set(deskStudyMaterials.map((m) => m.subject)))

  const groupedBySubject = React.useMemo(() => {
    const map: Record<string, StudyMaterial[]> = {}
    for (const item of materials) {
      if (!map[item.subject]) {
        map[item.subject] = []
      }
      map[item.subject].push(item)
    }
    return map
  }, [materials])

  return (
    <div className="flex flex-1 h-full overflow-hidden w-full relative">
      {/* 1. Left / Center Main Pane: Academic Document Library (Always Visible & Accessible) */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 min-w-0">
        {/* Top Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-border pb-5">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="size-6 text-indigo-500" />
              <h1 className="font-heading text-xl md:text-2xl font-bold text-foreground">
                Study Room & Academic Repository
              </h1>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground mt-1">
              Verified Semester 1, P-Cycle, IA-1 Course Notes, Question Papers & Question Banks • Saptagiri NPS University
            </p>
          </div>

          {/* Action & Status Controls */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Shvasa Pomodoro Focus Side Panel Launcher Button */}
            <Button
              variant={isFocusOpen ? "default" : "outline"}
              size="sm"
              onClick={() => {
                // On mobile screens (< 1024px), open the mobile Sheet
                if (typeof window !== "undefined" && window.innerWidth < 1024) {
                  setIsMobileFocusOpen(true)
                } else {
                  toggleFocus()
                }
              }}
              className={`h-8 text-xs gap-2 transition-all cursor-pointer ${
                isFocusOpen
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-xs font-semibold hover:from-indigo-700 hover:to-purple-700"
                  : "border-border text-foreground hover:bg-muted"
              }`}
              title="Toggle Shvasa Pomodoro & Focus OS in the side"
            >
              <Flame className={`size-3.5 ${isFocusOpen ? "text-amber-300 animate-pulse" : "text-indigo-400"}`} />
              <span>Pomodoro Focus (Shvasa)</span>
              <span
                className={`size-2 rounded-full ${
                  isFocusOpen ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-muted-foreground/50"
                }`}
              />
            </Button>

            {onOpenQuickAction && (
              <Button
                size="sm"
                onClick={onOpenQuickAction}
                className="text-xs h-8 gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <FileText className="size-3" />
                Upload Material
              </Button>
            )}

            <Badge
              variant="outline"
              className="text-[11px] h-8 px-2.5 gap-1.5 border-border bg-card/60"
              title={dataSource === "supabase_postgresql" ? "Connected to Supabase PostgreSQL" : "Previewing verified seed data"}
            >
              <span
                className={`size-2 rounded-full ${
                  dataSource === "supabase_postgresql" ? "bg-emerald-500" : "bg-amber-500"
                }`}
              />
              {dataSource === "supabase_postgresql" ? "Live Supabase PostgreSQL" : "Verified Academic Seed"}
            </Badge>
          </div>
        </div>

        {/* Supabase Schema Notice Banner (when table is pending migration) */}
        {dbStatus === "table_pending_migration" && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-700 dark:text-amber-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="size-4 shrink-0 text-amber-500 mt-0.5" />
              <div>
                <span className="font-semibold block text-foreground">
                  Supabase PostgreSQL Table Ready for Application
                </span>
                <span>
                  The <code className="bg-amber-500/20 px-1 py-0.5 rounded text-[10px]">study_materials</code> table and private storage bucket are drafted with complete RLS policies. Displaying verified Semester 1, P-Cycle IA-1 documents.
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="shrink-0 text-xs h-7 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 gap-1.5"
            >
              <RefreshCw className="size-3" />
              Check DB Status
            </Button>
          </div>
        )}

        {/* Filters Bar: Search & Subject Chips */}
        <div className="flex flex-col gap-3 rounded-xl border border-border bg-card/60 p-3.5 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Search input */}
            <div className="relative flex-1 w-full">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground pointer-events-none" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by subject, module, or keyword (e.g. C Programming, Differential Equations, Physics, BEE)..."
                className="h-8 pl-8 text-xs bg-muted/30 border-border"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Academic IA-1 Badge */}
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="outline" className="border-indigo-500/30 text-indigo-500 text-xs py-1 px-2.5 gap-1.5">
                <Shield className="size-3" />
                IA-1 Prep Only
              </Badge>
              <Badge variant="secondary" className="text-xs py-1 px-2.5">
                P-Cycle • Sem 1
              </Badge>
            </div>
          </div>

          {/* Subject Pills Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 text-xs">
            <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 shrink-0 mr-1">
              <Filter className="size-3" />
              Subject:
            </span>

            <button
              type="button"
              onClick={() => setSelectedSubject("all")}
              className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                selectedSubject === "all"
                  ? "bg-indigo-600 text-white font-semibold"
                  : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              All Subjects ({materials.length})
            </button>

            {uniqueSubjects.map((subject) => {
              const count = deskStudyMaterials.filter((m) => m.subject === subject).length
              return (
                <button
                  key={subject}
                  type="button"
                  onClick={() => setSelectedSubject(subject)}
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium transition-colors whitespace-nowrap ${
                    selectedSubject === subject
                      ? "bg-indigo-600 text-white font-semibold"
                      : "bg-muted/50 text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  {subject} ({count})
                </button>
              )
            })}
          </div>
        </div>

        {/* Loading state skeleton */}
        {isLoading && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-44 rounded-xl" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Error message state */}
        {!isLoading && fetchError && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-center">
            <AlertCircle className="size-8 text-destructive mx-auto mb-2" />
            <h3 className="font-semibold text-foreground text-sm">Failed to load study documents</h3>
            <p className="text-xs text-muted-foreground mt-1">{fetchError}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              className="mt-4 text-xs gap-1.5"
            >
              <RefreshCw className="size-3.5" />
              Try Again
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !fetchError && materials.length === 0 && (
          <div className="rounded-xl border border-border bg-card/40 p-12 text-center space-y-3">
            <GraduationCap className="size-10 text-muted-foreground/40 mx-auto" />
            <h3 className="font-semibold text-foreground text-sm">No study documents matched your filter</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Try adjusting your search query or subject filters to find IA-1 materials.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("")
                setSelectedSubject("all")
              }}
              className="text-xs"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Grouped Document List */}
        {!isLoading && !fetchError && materials.length > 0 && (
          <div className="space-y-8">
            {Object.entries(groupedBySubject).map(([subject, docs]) => (
              <div key={subject} className="space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="size-2 rounded-full bg-indigo-500" />
                    <h2 className="font-heading text-sm font-bold text-foreground">
                      {subject}
                    </h2>
                    <Badge variant="secondary" className="text-[10px] h-4 px-1.5">
                      {docs.length} {docs.length === 1 ? "document" : "documents"}
                    </Badge>
                  </div>
                  <span className="text-[11px] text-muted-foreground">Semester 1 • P-Cycle</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {docs.map((doc) => (
                    <Card
                      key={doc.id}
                      onClick={() => handleOpenPdf(doc)}
                      className="group relative cursor-pointer border-border/80 bg-card/60 hover:bg-card hover:border-indigo-500/40 hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
                    >
                      <CardHeader className="p-4 pb-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className="text-[10px] font-mono font-semibold px-1.5 py-0 border-indigo-500/40 text-indigo-600 dark:text-indigo-400"
                          >
                            {doc.ia}
                          </Badge>

                          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                            <span className="rounded bg-muted/60 px-1 py-0.5 font-mono uppercase">
                              PDF
                            </span>
                            <span>{(doc.fileSizeBytes / (1024 * 1024)).toFixed(1)} MB</span>
                          </div>
                        </div>

                        <CardTitle className="text-xs md:text-sm font-semibold leading-snug line-clamp-2 group-hover:text-indigo-500 transition-colors">
                          {doc.title}
                        </CardTitle>
                      </CardHeader>

                      <CardContent className="p-4 pt-1 space-y-3">
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                          {doc.description}
                        </p>

                        {doc.tags && doc.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {doc.tags.map((tag, idx) => (
                              <Badge
                                key={idx}
                                variant="secondary"
                                className="text-[9px] px-1.5 py-0 h-4 bg-muted/50"
                              >
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </CardContent>

                      <CardFooter className="p-4 pt-2.5 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-1.5">
                          <Avatar className="size-5">
                            <AvatarFallback className="text-[8px] bg-indigo-500/10 text-indigo-600 font-semibold">
                              {doc.uploadedBy?.avatar || "AD"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[11px] truncate max-w-[100px]">
                            {doc.uploadedBy?.name || "Academic Lead"}
                          </span>
                        </div>

                        <div className="flex items-center gap-1 text-[11px] text-indigo-500 font-medium group-hover:underline">
                          <Eye className="size-3.5" />
                          <span>View PDF</span>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 2. Right Pane: Docked Shvasa Focus & Pomodoro Side Panel (Desktop ≥ 1024px) */}
      {isFocusOpen && (
        <aside className="hidden lg:flex w-[390px] xl:w-[440px] 2xl:w-[480px] shrink-0 border-l border-border bg-sidebar/95 backdrop-blur-md flex-col h-full overflow-hidden select-none animate-in slide-in-from-right-4 duration-200">
          {/* Side Panel Header */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4 shrink-0 bg-background/60">
            <div className="flex items-center gap-2.5">
              <div className="size-7 rounded-lg bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                <Flame className="size-4 animate-pulse text-amber-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xs font-bold text-foreground">Shvasa OS</h2>
                  <Badge variant="outline" className="text-[9px] h-4 px-1 border-indigo-500/40 text-indigo-400">
                    Focus & Pomodoro
                  </Badge>
                </div>
                <p className="text-[10px] text-muted-foreground">Mindful Breath & Study Sprint</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {/* Reload button */}
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => {
                  setIsIframeLoading(true)
                  setIframeKey((k) => k + 1)
                  toast.info("Reloading Shvasa focus session...")
                }}
                className="text-muted-foreground hover:text-foreground"
                title="Reload Shvasa"
              >
                <RefreshCw className="size-3.5" />
              </Button>

              {/* Open in new tab button */}
              <Button
                variant="ghost"
                size="icon-xs"
                asChild
                className="text-muted-foreground hover:text-foreground"
                title="Open Shvasa in new browser tab"
              >
                <a href="https://shvasa.lovable.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>

              {/* Close side panel button */}
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={toggleFocus}
                className="text-muted-foreground hover:text-foreground"
                title="Collapse Focus Panel"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Context Strip */}
          <div className="px-3.5 py-1.5 bg-indigo-500/5 border-b border-indigo-500/10 flex items-center justify-between text-[11px] text-muted-foreground shrink-0">
            <span className="flex items-center gap-1.5 truncate">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Live alongside IA-1 Study Desk
            </span>
            <span className="text-[10px] text-indigo-400/80 font-mono">shvasa.lovable.app</span>
          </div>

          {/* Iframe Container */}
          <div className="relative flex-1 w-full bg-background overflow-hidden">
            {isIframeLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/90 backdrop-blur-xs gap-3 z-10">
                <RefreshCw className="size-6 animate-spin text-indigo-500" />
                <div className="text-center">
                  <p className="text-xs font-medium text-foreground">Loading Shvasa Focus OS</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Preparing breathwork & pomodoro timer...</p>
                </div>
              </div>
            )}
            <iframe
              key={iframeKey}
              src="https://shvasa.lovable.app/"
              title="Shvasa Focus & Pomodoro OS"
              className="w-full h-full border-0 bg-background"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              onLoad={() => setIsIframeLoading(false)}
            />
          </div>
        </aside>
      )}

      {/* 3. Mobile / Tablet Sheet for Shvasa Focus Drawer (< 1024px) */}
      <Sheet open={isMobileFocusOpen} onOpenChange={setIsMobileFocusOpen}>
        <SheetContent
          side="right"
          className="p-0 w-[92vw] sm:w-[420px] max-w-full border-l border-border bg-sidebar flex flex-col h-full"
          showCloseButton={false}
        >
          {/* Mobile Sheet Header */}
          <div className="flex h-14 items-center justify-between border-b border-border px-4 shrink-0 bg-background/60">
            <div className="flex items-center gap-2">
              <Flame className="size-4 text-amber-400 animate-pulse" />
              <div>
                <h2 className="text-xs font-bold text-foreground">Shvasa Pomodoro Focus</h2>
                <p className="text-[10px] text-muted-foreground">Study Room Companion</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon-xs"
                asChild
                className="text-muted-foreground hover:text-foreground"
              >
                <a href="https://shvasa.lovable.app/" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="size-3.5" />
                </a>
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setIsMobileFocusOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="size-3.5" />
              </Button>
            </div>
          </div>

          {/* Mobile Iframe */}
          <div className="relative flex-1 w-full bg-background overflow-hidden">
            <iframe
              src="https://shvasa.lovable.app/"
              title="Shvasa Focus & Pomodoro OS Mobile"
              className="w-full h-full border-0 bg-background"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
        </SheetContent>
      </Sheet>

      {/* 4. DEDICATED IN-APP PDF VIEWER (PDF.JS CANVAS POWERED) */}
      {viewingMaterial && viewerUrl && (
        <PdfJsViewer
          documentUrl={viewerUrl}
          title={viewingMaterial.title}
          subject={viewingMaterial.subject}
          semester={viewingMaterial.semester}
          ia={viewingMaterial.ia}
          onClose={handleClosePdf}
          isFullscreen={isViewerFullscreen}
          onToggleFullscreen={() => setIsViewerFullscreen(!isViewerFullscreen)}
          onRenewLink={() => handleOpenPdf(viewingMaterial)}
        />
      )}
    </div>
  )
}
