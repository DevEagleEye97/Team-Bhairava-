import * as React from "react"

/**
 * StarryBackground renders the animated cosmic starfield background
 * (Uiverse.io by amir_6539) across all pages of the HackForge platform.
 */
export function StarryBackground() {
  return (
    <div
      aria-hidden="true"
      className="stars-bg fixed inset-0 pointer-events-none -z-50 overflow-hidden"
    >
      <div id="stars" />
      <div id="stars2" />
      <div id="stars3" />
      <div />
    </div>
  )
}
