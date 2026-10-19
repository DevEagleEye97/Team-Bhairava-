"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import {
  Sun,
  Moon,
  Laptop,
  Bell,
  Keyboard,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function PreferencesPage() {
  const { theme, setTheme } = useTheme()

  const [reducedMotion, setReducedMotion] = React.useState(false)
  const [inAppNotifications, setInAppNotifications] = React.useState(true)
  const [focusModeMute, setFocusModeMute] = React.useState(true)

  // Sync from localStorage after hydration
  React.useEffect(() => {
    queueMicrotask(() => {
      const savedMotion = localStorage.getItem("hf_reduced_motion") === "true"
      const savedNotifs = localStorage.getItem("hf_in_app_notifs") !== "false"
      const savedFocusMute = localStorage.getItem("hf_focus_mute") !== "false"

      if (savedMotion) {
        setReducedMotion(true)
        document.documentElement.classList.add("reduce-motion")
      }
      if (!savedNotifs) {
        setInAppNotifications(false)
      }
      if (!savedFocusMute) {
        setFocusModeMute(false)
      }
    })
  }, [])

  const handleToggleMotion = () => {
    const nextVal = !reducedMotion
    setReducedMotion(nextVal)
    localStorage.setItem("hf_reduced_motion", String(nextVal))
    if (nextVal) {
      document.documentElement.classList.add("reduce-motion")
    } else {
      document.documentElement.classList.remove("reduce-motion")
    }
    toast.success(`Reduced motion ${nextVal ? "enabled" : "disabled"}.`)
  }

  const handleToggleNotifications = () => {
    const nextVal = !inAppNotifications
    setInAppNotifications(nextVal)
    localStorage.setItem("hf_in_app_notifs", String(nextVal))
    toast.success(`In-app message notifications ${nextVal ? "enabled" : "muted"}.`)
  }

  const handleToggleFocusMute = () => {
    const nextVal = !focusModeMute
    setFocusModeMute(nextVal)
    localStorage.setItem("hf_focus_mute", String(nextVal))
    toast.success(`Mute during Shvasa Pomodoro ${nextVal ? "enabled" : "disabled"}.`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-zinc-100">Preferences</h1>
        <p className="text-xs text-zinc-400 mt-1">
          Customize your appearance, motion behavior, clock display, and notification volume.
        </p>
      </div>

      {/* Theme Card */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200">Interface Theme</CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Select your preferred color scheme. Dark mode provides low-contrast deep charcoal surfaces.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3 max-w-md">
            <button
              type="button"
              onClick={() => {
                setTheme("dark")
                toast.success("Theme set to Dark Mode.")
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer ${
                theme === "dark"
                  ? "border-indigo-500/80 bg-zinc-800 text-zinc-100 font-semibold"
                  : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:bg-zinc-800/40"
              }`}
            >
              <Moon className="size-4 text-indigo-400" />
              <span>Dark (Default)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("light")
                toast.success("Theme set to Light Mode.")
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer ${
                theme === "light"
                  ? "border-indigo-500/80 bg-zinc-800 text-zinc-100 font-semibold"
                  : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:bg-zinc-800/40"
              }`}
            >
              <Sun className="size-4 text-amber-400" />
              <span>Light</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setTheme("system")
                toast.success("Theme synchronized with System settings.")
              }}
              className={`flex flex-col items-center justify-center p-3 rounded-lg border text-xs gap-2 transition-all cursor-pointer ${
                theme === "system"
                  ? "border-indigo-500/80 bg-zinc-800 text-zinc-100 font-semibold"
                  : "border-zinc-800 bg-zinc-950/60 text-zinc-400 hover:bg-zinc-800/40"
              }`}
            >
              <Laptop className="size-4 text-zinc-400" />
              <span>System</span>
            </button>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility & Motion */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200">Accessibility & Motion</CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Control dynamic visual effects and UI animations.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/60">
            <div>
              <div className="text-xs font-medium text-zinc-200">Reduce Motion</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Disable smooth transitions and decorative movement across the workspace.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleMotion}
              className={`h-7 text-xs border-zinc-700 cursor-pointer ${
                reducedMotion ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {reducedMotion ? "Active" : "Off"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications & Focus */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Bell className="size-4 text-indigo-400" />
            <span>Notifications & Study Room Focus</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Configure toast alerts and automatic silent mode during Shvasa Pomodoro sessions.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/60">
            <div>
              <div className="text-xs font-medium text-zinc-200">In-App Chat Toasts</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Display pop-up alerts for new channel messages and task mentions.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleNotifications}
              className={`h-7 text-xs border-zinc-700 cursor-pointer ${
                inAppNotifications ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {inAppNotifications ? "Enabled" : "Muted"}
            </Button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg border border-zinc-800 bg-zinc-950/60">
            <div>
              <div className="text-xs font-medium text-zinc-200">Mute During Shvasa Focus Sessions</div>
              <div className="text-[11px] text-zinc-500 mt-0.5">
                Automatically silence channel alerts when the Shvasa Pomodoro timer is running.
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleToggleFocusMute}
              className={`h-7 text-xs border-zinc-700 cursor-pointer ${
                focusModeMute ? "bg-indigo-600 text-white border-indigo-500" : "bg-zinc-800 text-zinc-300"
              }`}
            >
              {focusModeMute ? "Active" : "Off"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard Shortcuts Reference */}
      <Card className="border border-zinc-800 bg-zinc-900/60">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
            <Keyboard className="size-4 text-zinc-400" />
            <span>Keyboard Shortcuts</span>
          </CardTitle>
          <CardDescription className="text-xs text-zinc-400">
            Accelerate your engineering workflow with built-in desk shortcuts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-zinc-300">Quick Action / Command Palette</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">
                Cmd / Ctrl + K
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-zinc-300">Close Modal / Viewer</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">
                Esc
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-zinc-300">Send Message in Channel</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">
                Enter
              </kbd>
            </div>
            <div className="flex items-center justify-between p-2 rounded bg-zinc-950/60 border border-zinc-800/80">
              <span className="text-zinc-300">Toggle Shvasa Sidecar</span>
              <kbd className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono text-[10px] border border-zinc-700">
                Cmd / Ctrl + J
              </kbd>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
