"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  User,
  Shield,
  Sliders,
  Eye,
  Building2,
  ArrowLeft,
  GraduationCap,
  LogOut,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/utils/supabase/client"
import { toast } from "sonner"

interface SettingsLayoutProps {
  children: React.ReactNode
}

const navItems = [
  {
    title: "Personal Profile",
    href: "/settings/profile",
    icon: User,
    description: "Display name, avatar, bio & academic program",
  },
  {
    title: "Account & Security",
    href: "/settings/account",
    icon: Shield,
    description: "Email, password change & active sessions",
  },
  {
    title: "Preferences",
    href: "/settings/preferences",
    icon: Sliders,
    description: "Theme, reduced motion & formatting",
  },
  {
    title: "Privacy & Visibility",
    href: "/settings/privacy",
    icon: Eye,
    description: "Team presence & profile visibility",
  },
  {
    title: "Team Workspace",
    href: "/settings/workspace",
    icon: Building2,
    description: "Team Bhairava settings & members",
  },
]

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = React.useMemo(() => createClient(), [])

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut()
      toast.success("Signed out of Team Bhairava.")
      router.push("/login")
      router.refresh()
    } catch {
      router.push("/login")
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Bar */}
      <header className="sticky top-0 z-30 flex h-14 w-full items-center justify-between border-b border-zinc-800 bg-zinc-950/90 px-4 md:px-6 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="h-8 gap-1.5 px-2.5 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900"
          >
            <Link href="/desk">
              <ArrowLeft className="size-3.5" />
              <span>Back to Desk</span>
            </Link>
          </Button>

          <div className="h-4 w-px bg-zinc-800" />

          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-zinc-100">
              Settings & Account
            </span>
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900 text-zinc-400">
              Team Bhairava
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSignOut}
            className="h-8 gap-1.5 text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 cursor-pointer"
          >
            <LogOut className="size-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 lg:p-8 flex flex-col md:flex-row gap-6 md:gap-8">
        {/* Secondary Sidebar Navigation */}
        <aside className="w-full md:w-60 shrink-0 space-y-1">
          <div className="px-2 pb-2 text-[11px] font-semibold tracking-wider text-zinc-500 uppercase">
            Account Navigation
          </div>
          <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium transition-colors shrink-0 md:w-full",
                    isActive
                      ? "bg-zinc-800 text-zinc-100 font-semibold"
                      : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                  )}
                >
                  <Icon className={cn("size-4 shrink-0", isActive ? "text-indigo-400" : "text-zinc-500")} />
                  <span className="truncate">{item.title}</span>
                </Link>
              )
            })}
          </nav>

          <div className="hidden md:block pt-6 border-t border-zinc-900 mt-6 px-2">
            <p className="text-[11px] text-zinc-500 flex items-center gap-1.5">
              <GraduationCap className="size-3.5 text-zinc-400 shrink-0" />
              Saptagiri NPS University
            </p>
            <p className="text-[10px] text-zinc-600 mt-0.5">
              CSE General • Semester 1, P-Cycle
            </p>
          </div>
        </aside>

        {/* Settings View Area */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
