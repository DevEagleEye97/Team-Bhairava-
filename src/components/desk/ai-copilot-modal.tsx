"use client"

import * as React from "react"
import {
  Sparkles,
  X,
  Send,
  Bot,
  User,
  LayoutDashboard,
  CheckCircle2,
  RefreshCw,
  Zap,
  BookOpen,
  Calendar,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { NavigationTab } from "@/types/desk"

interface MessageItem {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
}

interface AiCopilotModalProps {
  isOpen: boolean
  onClose: () => void
  onNavigateTab: (tab: NavigationTab) => void
}

export function AiCopilotModal({ isOpen, onClose, onNavigateTab }: AiCopilotModalProps) {
  const [messages, setMessages] = React.useState<MessageItem[]>([
    {
      id: "welcome-1",
      role: "assistant",
      content: `👋 **Welcome to ForgeCopilot!**

I can help you monitor team velocity, provide executive summary briefings, and organize your desk priorities for the day.

Try one of the quick actions below or ask anything about your sprint!`,
      timestamp: "Just now",
    },
  ])
  const [input, setInput] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen])

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input
    if (!query.trim() || isLoading) return

    const userMsg: MessageItem = {
      id: `user-${Date.now()}`,
      role: "user",
      content: query.trim(),
      timestamp: "Just now",
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsLoading(true)

    try {
      const historyPayload = messages.map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: query.trim(), history: historyPayload }),
      })

      const data = await res.json()
      const aiReply: MessageItem = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.reply || "I am currently organizing the latest sprint updates. How else can I assist?",
        timestamp: "Just now",
      }
      setMessages((prev) => [...prev, aiReply])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `ai-err-${Date.now()}`,
          role: "assistant",
          content: "Sorry, I encountered a temporary connection issue. Please retry your request.",
          timestamp: "Just now",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col w-[380px] sm:w-[440px] h-[580px] max-h-[85vh] rounded-2xl border border-indigo-500/30 bg-card/95 backdrop-blur-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-transparent px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="size-8 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-sm">
            <Sparkles className="size-4 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-heading text-sm font-bold text-foreground">ForgeCopilot</span>
              <Badge variant="outline" className="text-[9px] py-0 h-4 border-indigo-500/30 text-indigo-500">
                AI Desk Assistant
              </Badge>
            </div>
            <span className="text-[10px] text-muted-foreground">Desk Summary & Dashboard Organizer</span>
          </div>
        </div>

        <Button variant="ghost" size="icon-xs" onClick={onClose} className="rounded-lg text-muted-foreground hover:text-foreground">
          <X className="size-4" />
        </Button>
      </div>

      {/* Quick Action Suggestion Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto px-3 py-2 border-b border-border/60 bg-muted/20 scrollbar-none">
        <button
          type="button"
          onClick={() => handleSend("Give me an executive summary overview of the workspace")}
          className="shrink-0 flex items-center gap-1 rounded-full border border-border bg-card/80 px-2.5 py-1 text-[10px] font-medium text-foreground hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-colors"
        >
          <LayoutDashboard className="size-3 text-indigo-500" />
          Summary Overview
        </button>

        <button
          type="button"
          onClick={() => handleSend("How should we organize and prioritize our dashboard tasks today?")}
          className="shrink-0 flex items-center gap-1 rounded-full border border-border bg-card/80 px-2.5 py-1 text-[10px] font-medium text-foreground hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-colors"
        >
          <Zap className="size-3 text-amber-500" />
          Organize Tasks
        </button>

        <button
          type="button"
          onClick={() => handleSend("What study materials and IA-1 question papers do we have?")}
          className="shrink-0 flex items-center gap-1 rounded-full border border-border bg-card/80 px-2.5 py-1 text-[10px] font-medium text-foreground hover:border-indigo-500/50 hover:bg-indigo-500/10 transition-colors"
        >
          <BookOpen className="size-3 text-sky-500" />
          IA-1 Study Prep
        </button>
      </div>

      {/* Chat Messages Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex gap-2.5 ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            {m.role === "assistant" && (
              <div className="size-6 rounded-lg bg-indigo-500/20 text-indigo-500 flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="size-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed ${
                m.role === "user"
                  ? "bg-indigo-600 text-white shadow-xs rounded-br-xs"
                  : "bg-muted/40 border border-border/80 text-foreground shadow-2xs rounded-bl-xs space-y-1.5"
              }`}
            >
              <div className="whitespace-pre-wrap">{m.content}</div>

              {/* Interactive Shortcut buttons if AI mentions specific views */}
              {m.role === "assistant" && (
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-border/40 mt-2">
                  {m.content.toLowerCase().includes("study") && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateTab("channel-study")
                        onClose()
                      }}
                      className="flex items-center gap-1 text-[10px] text-indigo-500 hover:underline font-semibold"
                    >
                      <BookOpen className="size-3" /> Go to Study Room →
                    </button>
                  )}
                  {m.content.toLowerCase().includes("task") && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateTab("projects")
                        onClose()
                      }}
                      className="flex items-center gap-1 text-[10px] text-indigo-500 hover:underline font-semibold"
                    >
                      <CheckCircle2 className="size-3" /> Go to Projects Board →
                    </button>
                  )}
                  {m.content.toLowerCase().includes("deadline") && (
                    <button
                      type="button"
                      onClick={() => {
                        onNavigateTab("events")
                        onClose()
                      }}
                      className="flex items-center gap-1 text-[10px] text-indigo-500 hover:underline font-semibold"
                    >
                      <Calendar className="size-3" /> View Events & Deadlines →
                    </button>
                  )}
                </div>
              )}

              <span className={`block text-[9px] mt-1 ${m.role === "user" ? "text-white/70 text-right" : "text-muted-foreground"}`}>
                {m.timestamp}
              </span>
            </div>

            {m.role === "user" && (
              <div className="size-6 rounded-lg bg-primary/20 text-primary flex items-center justify-center shrink-0 mt-0.5">
                <User className="size-3.5" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
            <RefreshCw className="size-3.5 animate-spin text-indigo-500" />
            <span>Analyzing desk state and generating response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="border-t border-border bg-background/80 p-2.5 flex items-center gap-2"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Copilot to summarize or organize..."
          className="h-9 text-xs bg-muted/40 border-border"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon-sm"
          disabled={!input.trim() || isLoading}
          className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0"
        >
          <Send className="size-3.5" />
        </Button>
      </form>
    </div>
  )
}
