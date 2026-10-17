"use client"

import * as React from "react"
import {
  FileText,
  Shield,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Minimize2,
  X,
  RotateCw,
  AlertTriangle,
  RefreshCw,
  Lock,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface PdfJsViewerProps {
  documentUrl: string
  title: string
  subject: string
  semester: string
  ia: string
  onClose: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
  onRenewLink?: () => void
}

export function PdfJsViewer({
  documentUrl,
  title,
  subject,
  semester,
  ia,
  onClose,
  isFullscreen,
  onToggleFullscreen,
  onRenewLink,
}: PdfJsViewerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const canvasRefs = React.useRef<(HTMLCanvasElement | null)[]>([])

  const [numPages, setNumPages] = React.useState<number>(0)
  const [currentPage, setCurrentPage] = React.useState<number>(1)
  const [scale, setScale] = React.useState<number>(1.2)
  const [rotation, setRotation] = React.useState<number>(0)

  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null)
  const [isAuthError, setIsAuthError] = React.useState<boolean>(false)

  // Load and render document via PDF.js
  React.useEffect(() => {
    let isCancelled = false

    async function loadPdf() {
      try {
        const pdfjsLib = await import("pdfjs-dist")
        pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs"


        // Fetch PDF using credentials if needed
        const loadingTask = pdfjsLib.getDocument({
          url: documentUrl,
          withCredentials: true,
        })

        const pdfDoc = await loadingTask.promise
        if (isCancelled) return

        setNumPages(pdfDoc.numPages)
        setIsLoading(false)

        // Render all pages sequentially
        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          if (isCancelled) break
          const page = await pdfDoc.getPage(pageNum)
          const viewport = page.getViewport({ scale, rotation })

          const canvas = canvasRefs.current[pageNum - 1]
          if (canvas) {
            const context = canvas.getContext("2d")
            if (context) {
              canvas.height = viewport.height
              canvas.width = viewport.width

              const renderContext = {
                canvasContext: context,
                viewport,
              }
              await page.render(renderContext).promise
            }
          }
        }
      } catch (err: unknown) {
        if (isCancelled) return
        const msg = err instanceof Error ? err.message : "Failed to render PDF document"
        if (msg.includes("401") || msg.includes("403") || msg.includes("unauthorized") || msg.includes("expired")) {
          setIsAuthError(true)
        }
        setErrorMessage(msg)
        setIsLoading(false)
      }
    }

    loadPdf()

    return () => {
      isCancelled = true
    }
  }, [documentUrl, scale, rotation])

  // Track scrolling page indicator
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget
    const pageElements = canvasRefs.current.filter(Boolean) as HTMLCanvasElement[]
    for (let i = 0; i < pageElements.length; i++) {
      const el = pageElements[i]
      if (el.offsetTop + el.clientHeight / 2 >= target.scrollTop) {
        setCurrentPage(i + 1)
        break
      }
    }
  }

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2.5))
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6))
  const handleResetZoom = () => setScale(1.2)
  const handleRotate = () => setRotation((prev) => (prev + 90) % 360)

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-md select-none transition-all ${
        isFullscreen ? "p-0" : "p-2 sm:p-4 md:p-6"
      }`}
      onContextMenu={(e) => {
        // Prevent right-click context menu to prevent browser inspect/save triggers
        e.preventDefault()
      }}
    >
      <div className="flex flex-1 flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
        {/* Top Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-muted/40 px-4 py-2.5">
          {/* Metadata Section */}
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="size-8 rounded-lg bg-indigo-500/10 text-indigo-500 flex items-center justify-center shrink-0">
              <FileText className="size-4" />
            </div>
            <div className="flex flex-col truncate">
              <div className="flex items-center gap-2">
                <span className="text-xs md:text-sm font-bold text-foreground truncate">
                  {title}
                </span>
                <Badge variant="outline" className="text-[10px] py-0 h-4 shrink-0 font-medium border-border">
                  {subject} • {semester}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <Badge
                  variant="secondary"
                  className="text-[9px] py-0 h-3.5 px-1 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold"
                >
                  {ia}
                </Badge>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-medium">
                  <Shield className="size-3" />
                  PDF.js Protected In-App Reader (Canvas Rendered)
                </span>
              </div>
            </div>
          </div>

          {/* Controls: Zoom, Rotate, Page Count, Fullscreen, Close */}
          <div className="flex items-center gap-1.5">
            {/* Page Count */}
            {numPages > 0 && (
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-muted/60 text-[11px] font-medium text-foreground mr-1">
                <span>Page</span>
                <span className="font-bold">{currentPage}</span>
                <span>/</span>
                <span>{numPages}</span>
              </div>
            )}

            {/* Zoom Controls */}
            <div className="flex items-center rounded-lg border border-border bg-muted/30 p-0.5 mr-1">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleZoomOut}
                disabled={scale <= 0.6}
                title="Zoom Out"
              >
                <ZoomOut className="size-3.5" />
              </Button>
              <button
                type="button"
                onClick={handleResetZoom}
                className="px-1.5 text-[11px] font-mono text-muted-foreground hover:text-foreground"
                title="Reset Zoom"
              >
                {Math.round(scale * 100)}%
              </button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={handleZoomIn}
                disabled={scale >= 2.5}
                title="Zoom In"
              >
                <ZoomIn className="size-3.5" />
              </Button>
            </div>

            {/* Rotate */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={handleRotate}
              title="Rotate 90 degrees"
            >
              <RotateCw className="size-3.5" />
            </Button>

            {/* Fullscreen */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Viewer"}
            >
              {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </Button>

            {/* Close */}
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={onClose}
              title="Close Viewer (ESC)"
              className="hover:bg-destructive/10 hover:text-destructive"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>

        {/* PDF Canvas Rendering Body */}
        <div
          ref={containerRef}
          onScroll={handleScroll}
          className="relative flex-1 overflow-y-auto overflow-x-auto bg-muted/20 p-4 sm:p-6"
        >
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-muted-foreground bg-card/60 backdrop-blur-xs z-10">
              <RefreshCw className="size-8 animate-spin text-indigo-500" />
              <div className="text-center">
                <span className="text-xs font-semibold block text-foreground">
                  Rendering Document with PDF.js
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Decoding PDF binary stream into secure HTML5 canvas...
                </span>
              </div>
            </div>
          )}

          {/* Auth / Expired Error State */}
          {isAuthError && (
            <div className="mx-auto max-w-md my-12 rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 text-center space-y-3">
              <AlertTriangle className="size-8 mx-auto text-amber-500" />
              <h4 className="text-sm font-bold text-foreground">Signed Access Link Expired</h4>
              <p className="text-xs text-muted-foreground">
                The short-lived signed URL for this academic document has expired or your session needs re-authorization.
              </p>
              {onRenewLink && (
                <Button size="sm" onClick={onRenewLink} className="text-xs gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white">
                  <RefreshCw className="size-3" />
                  Renew Signed Token
                </Button>
              )}
            </div>
          )}

          {/* General Error State */}
          {errorMessage && !isAuthError && (
            <div className="mx-auto max-w-md my-12 rounded-xl border border-destructive/30 bg-destructive/10 p-6 text-center space-y-3">
              <AlertTriangle className="size-8 mx-auto text-destructive" />
              <h4 className="text-sm font-bold text-foreground">Unable to Display Document</h4>
              <p className="text-xs text-muted-foreground">{errorMessage}</p>
              <Button size="sm" onClick={() => window.location.reload()} className="text-xs">
                Reload Application
              </Button>
            </div>
          )}

          {/* Rendered PDF Pages */}
          <div className="flex flex-col items-center gap-6 min-w-min mx-auto">
            {Array.from({ length: numPages }).map((_, index) => (
              <div
                key={index}
                className="relative rounded-sm shadow-lg border border-border/80 bg-white dark:bg-card overflow-hidden"
              >
                <canvas
                  ref={(el) => {
                    canvasRefs.current[index] = el
                  }}
                  className="block max-w-none"
                />
                <div className="absolute bottom-2 right-2 text-[9px] font-mono px-1.5 py-0.5 rounded bg-black/40 text-white/80 pointer-events-none">
                  Page {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Bottom Ribbon */}
        <div className="flex flex-wrap items-center justify-between border-t border-border bg-muted/40 px-4 py-2 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Lock className="size-3 text-emerald-500" />
            PDF.js In-App Canvas Engine • Cross-Origin Browser Sandboxing Bypassed Securely
          </span>
          <span>
            Protected university preview: UI download & print triggers disabled.
          </span>
        </div>
      </div>
    </div>
  )
}
