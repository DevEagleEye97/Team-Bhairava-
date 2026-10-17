"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  Send,
  Smile,
  Paperclip,
  Code2,
  Pin,
  MessageSquare,
  Search,
  Check,
  Copy,
  Info,
  CornerDownRight,
} from "lucide-react"
import { Channel, Message } from "@/types/desk"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { toast } from "sonner"

interface ConversationViewProps {
  channel: Channel
  messages: Message[]
  onSendMessage: (channelId: string, content: string, codeSnippet?: { language: string; code: string }) => void
  onToggleReaction: (messageId: string, emoji: string) => void
  onOpenThread?: (message: Message) => void
}

export function ConversationView({
  channel,
  messages,
  onSendMessage,
  onToggleReaction,
  onOpenThread,
}: ConversationViewProps) {
  const [inputText, setInputText] = React.useState("")
  const [includeCodeSnippet, setIncludeCodeSnippet] = React.useState(false)
  const [codeLanguage, setCodeLanguage] = React.useState("typescript")
  const [codeContent, setCodeContent] = React.useState("")
  const [searchInChannel, setSearchInChannel] = React.useState("")
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Auto scroll to bottom when new messages arrive
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages.length])

  const handleSend = () => {
    if (!inputText.trim() && (!includeCodeSnippet || !codeContent.trim())) {
      toast.error("Please enter a message or code snippet.")
      return
    }

    const snippet =
      includeCodeSnippet && codeContent.trim()
        ? { language: codeLanguage, code: codeContent.trim() }
        : undefined

    onSendMessage(channel.id, inputText.trim(), snippet)
    setInputText("")
    setCodeContent("")
    setIncludeCodeSnippet(false)
    toast.success("Message dispatched to #" + channel.name)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault()
      handleSend()
    }
  }

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code)
    setCopiedCodeId(id)
    toast.info("Code copied to clipboard")
    setTimeout(() => setCopiedCodeId(null), 2000)
  }

  const filteredMessages = messages.filter((m) => {
    if (!searchInChannel.trim()) return true
    const q = searchInChannel.toLowerCase()
    return (
      m.content.toLowerCase().includes(q) ||
      m.author.name.toLowerCase().includes(q) ||
      m.codeSnippet?.code.toLowerCase().includes(q)
    )
  })

  const pinnedMessages = messages.filter((m) => m.isPinned)

  return (
    <div className="flex h-full flex-1 flex-col overflow-hidden bg-background">
      {/* Channel Header Bar */}
      <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 md:px-6 bg-card/60">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="flex flex-col truncate">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm md:text-base text-foreground">
                #{channel.name}
              </span>
              <Badge variant="outline" className="text-[10px] py-0 h-4">
                {channel.category}
              </Badge>
            </div>
            <p className="text-[11px] text-muted-foreground truncate">
              {channel.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Search within Channel */}
          <div className="relative hidden sm:block w-40 md:w-52">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground pointer-events-none" />
            <Input
              value={searchInChannel}
              onChange={(e) => setSearchInChannel(e.target.value)}
              placeholder="Search channel..."
              className="h-7 text-[11px] pl-7 bg-muted/30 border-border"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info(`${pinnedMessages.length} pinned messages in this channel.`)}
            className="h-7 text-xs gap-1.5"
            title="Pinned messages"
          >
            <Pin className="size-3 text-primary" />
            <span className="hidden md:inline">{pinnedMessages.length} Pinned</span>
          </Button>
        </div>
      </div>

      {/* Local Mock Session Disclaimer Bar */}
      <div className="flex items-center justify-between border-b border-border/70 bg-muted/20 px-4 py-1.5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Info className="size-3 text-primary shrink-0" />
          <span>Local Digital Desk Session — messages update in memory. Persistence connects in Phase 6.</span>
        </div>
        <span className="hidden sm:inline font-mono text-[10px]">#channel-id: {channel.slug}</span>
      </div>

      {/* Pinned Messages Highlights */}
      {pinnedMessages.length > 0 && !searchInChannel && (
        <div className="border-b border-border/80 bg-primary/5 px-4 py-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-primary font-medium truncate">
              <Pin className="size-3.5 shrink-0" />
              <span className="truncate">
                Pinned by {pinnedMessages[0].author.name}: &quot;{pinnedMessages[0].content}&quot;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        {filteredMessages.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center text-center p-6 space-y-3">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
              <MessageSquare className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-foreground">
                {searchInChannel ? "No matching messages" : `Welcome to #${channel.name}!`}
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mt-1">
                {searchInChannel
                  ? "Try searching for another keyword or author name."
                  : channel.description}
              </p>
            </div>
          </div>
        ) : (
          filteredMessages.map((msg) => (
            <motion.div
              key={msg.id}
              layout
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
              className="group relative flex items-start gap-3 rounded-xl p-2 md:p-3 transition-colors hover:bg-muted/30"
            >
                {/* Author Avatar */}
                <Avatar className="size-8 rounded-lg shrink-0 mt-0.5">
                  <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                    {msg.author.avatar}
                  </AvatarFallback>
                </Avatar>

                {/* Message Body */}
                <div className="flex-1 space-y-1.5 overflow-hidden">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs text-foreground">
                      {msg.author.name}
                    </span>
                    <Badge variant="outline" className="text-[9px] h-3.5 px-1 py-0 font-normal">
                      {msg.author.role}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{msg.timestamp}</span>
                    {msg.isPinned && (
                      <span title="Pinned message">
                        <Pin className="size-3 text-primary shrink-0" />
                      </span>
                    )}
                  </div>

                  {/* Message Content */}
                  {msg.content && (
                    <p className="text-xs text-foreground/90 leading-relaxed break-words whitespace-pre-wrap">
                      {msg.content}
                    </p>
                  )}

                  {/* Code Snippet Box */}
                  {msg.codeSnippet && (
                    <div className="my-2 rounded-lg border border-border bg-card/80 overflow-hidden font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-border bg-muted/60 px-3 py-1.5 text-[11px] text-muted-foreground">
                        <span className="font-medium text-foreground uppercase text-[10px]">
                          {msg.codeSnippet.language}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={() => handleCopyCode(msg.id, msg.codeSnippet!.code)}
                          className="h-5 px-1.5 text-[10px] gap-1"
                        >
                          {copiedCodeId === msg.id ? (
                            <>
                              <Check className="size-3 text-emerald-500" />
                              <span className="text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="size-3" />
                              <span>Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                      <pre className="p-3 overflow-x-auto text-[11px] leading-relaxed text-foreground">
                        <code>{msg.codeSnippet.code}</code>
                      </pre>
                    </div>
                  )}

                  {/* Thread Replies / Open Thread in Context Panel */}
                  <div className="flex items-center gap-3 pt-0.5">
                    {msg.threadReplyCount ? (
                      <button
                        type="button"
                        onClick={() => onOpenThread?.(msg)}
                        className="flex items-center gap-1.5 text-[11px] text-primary font-medium hover:underline cursor-pointer"
                        title="View replies in context panel"
                      >
                        <CornerDownRight className="size-3.5" />
                        <span>{msg.threadReplyCount} replies in thread</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenThread?.(msg)}
                        className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-opacity cursor-pointer"
                        title="Reply in context panel thread"
                      >
                        <CornerDownRight className="size-3" />
                        <span>Reply in thread</span>
                      </button>
                    )}
                  </div>

                  {/* Reactions List */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {msg.reactions.map((rx, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => onToggleReaction(msg.id, rx.emoji)}
                        className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-medium transition-colors ${
                          rx.reactedByMe
                            ? "border-primary/50 bg-primary/10 text-primary"
                            : "border-border bg-card text-muted-foreground hover:bg-muted"
                        }`}
                      >
                        <span>{rx.emoji}</span>
                        <span>{rx.count}</span>
                      </button>
                    ))}

                    {/* Quick Reaction Buttons */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 pl-1">
                      {["👍", "❤️", "🚀", "💡"].map((emoji) => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => onToggleReaction(msg.id, emoji)}
                          className="size-5 rounded hover:bg-muted text-xs flex items-center justify-center"
                          title={`React ${emoji}`}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
      </div>

      {/* Message Composer Area */}
      <div className="border-t border-border bg-card p-3 md:p-4 space-y-2">
        {/* Code Snippet Box (when toggled) */}
        {includeCodeSnippet && (
          <div className="rounded-lg border border-border bg-background p-2.5 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-foreground flex items-center gap-1.5">
                <Code2 className="size-3.5 text-primary" />
                Attach Code Snippet
              </span>
              <div className="flex items-center gap-2">
                <select
                  value={codeLanguage}
                  onChange={(e) => setCodeLanguage(e.target.value)}
                  className="h-6 rounded border border-border bg-muted px-2 text-[11px] text-foreground outline-none"
                >
                  <option value="typescript">TypeScript</option>
                  <option value="javascript">JavaScript</option>
                  <option value="bash">Bash / Shell</option>
                  <option value="python">Python</option>
                  <option value="sql">SQL</option>
                </select>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => setIncludeCodeSnippet(false)}
                >
                  ✕
                </Button>
              </div>
            </div>
            <textarea
              value={codeContent}
              onChange={(e) => setCodeContent(e.target.value)}
              placeholder="Paste or write code here..."
              rows={3}
              className="w-full rounded border border-border bg-muted/40 p-2 font-mono text-xs text-foreground outline-none resize-none"
            />
          </div>
        )}

        {/* Text Input & Controls */}
        <div className="flex flex-col gap-2 rounded-xl border border-border bg-background p-2 focus-within:ring-1 focus-within:ring-primary/50">
          <Textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Message #${channel.name}... (Press Ctrl+Enter to send)`}
            rows={2}
            className="border-0 shadow-none focus-visible:ring-0 resize-none text-xs leading-relaxed p-1"
          />

          <div className="flex items-center justify-between border-t border-border/50 pt-2 px-1">
            <div className="flex items-center gap-1">
              <Button
                variant={includeCodeSnippet ? "secondary" : "ghost"}
                size="icon-xs"
                onClick={() => setIncludeCodeSnippet(!includeCodeSnippet)}
                title="Toggle Code Snippet"
              >
                <Code2 className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => toast.info("Attachment selector: file uploads will connect with Supabase Storage.")}
                title="Attach Document"
              >
                <Paperclip className="size-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => setInputText((prev) => prev + " ☕ ")}
                title="Coffee break"
              >
                <Smile className="size-3.5" />
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-[10px] text-muted-foreground font-mono">
                Ctrl + Enter to send
              </span>
              <Button
                size="sm"
                onClick={handleSend}
                className="h-7 gap-1 px-3 text-xs font-medium"
              >
                <Send className="size-3" />
                <span>Send</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
