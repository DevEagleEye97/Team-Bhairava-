import * as React from "react"

interface TerminalLoaderProps {
  title?: string
  text?: string
  className?: string
}

/**
 * TerminalLoader component (Uiverse.io by jeremyssocial)
 * Features retro terminal window styling with macOS-style traffic light controls
 * and a blinking typewriter animation.
 */
export function TerminalLoader({
  title = "HackForge Status",
  text = "Loading...",
  className = "",
}: TerminalLoaderProps) {
  return (
    <div className={`terminal-loader shadow-2xl ${className}`}>
      <div className="terminal-header">
        <div className="terminal-title">{title}</div>
        <div className="terminal-controls">
          <div className="control close" />
          <div className="control minimize" />
          <div className="control maximize" />
        </div>
      </div>
      <div className="text terminal-text">{text}</div>
    </div>
  )
}
