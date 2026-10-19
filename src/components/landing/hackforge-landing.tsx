"use client"

import * as React from "react"
import Link from "next/link"
import {
  Flame,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
  GraduationCap,
  Code2,
  Clock,
  Layers,
  Lock,
  BookOpen,
  Cpu,
  Workflow,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Real IA-1 Subject data from Team Bhairava repository
interface StudySubject {
  code: string
  title: string
  subtitle: string
  docsCount: string
  status: string
  tag: string
  avatar: string
  isPriority: boolean
  history: number[]
}

const FEATURED_SUBJECTS: StudySubject[] = [
  {
    code: "PSC",
    title: "Problem Solving with C",
    subtitle: "Pointers, Memory, Modules 1 & 2",
    docsCount: "5 Documents",
    status: "Verified Vault",
    tag: "PSC",
    avatar: "bg-blue-950/70 text-blue-300 border border-blue-800/50",
    isPriority: true,
    history: [82, 85, 90, 88, 94, 98],
  },
  {
    code: "MAT",
    title: "Engineering Mathematics",
    subtitle: "Taylor Series, Jacobians, Calculus",
    docsCount: "3 Documents",
    status: "IA-1 Priority",
    tag: "MAT",
    avatar: "bg-indigo-950/70 text-indigo-300 border border-indigo-800/50",
    isPriority: true,
    history: [75, 80, 84, 89, 91, 95],
  },
  {
    code: "PHY",
    title: "Engineering Physics",
    subtitle: "Quantum Mechanics, Wave Theory",
    docsCount: "4 Documents",
    status: "High Yield",
    tag: "PHY",
    avatar: "bg-purple-950/70 text-purple-300 border border-purple-800/50",
    isPriority: true,
    history: [70, 78, 82, 86, 88, 92],
  },
  {
    code: "BEE",
    title: "Basic Electrical Engg.",
    subtitle: "DC Circuits, KVL/KCL, Mesh Analysis",
    docsCount: "2 Documents",
    status: "Active Review",
    tag: "BEE",
    avatar: "bg-amber-950/70 text-amber-300 border border-amber-800/50",
    isPriority: false,
    history: [65, 72, 75, 80, 82, 86],
  },
]

const LIVE_SPRINT_METRICS = [
  { label: "SPRINT 01", value: "75% Complete", status: "Active Lead: Om", isPositive: true },
  { label: "IA-1 READINESS", value: "94.8% Score", status: "17 Verified Papers", isPositive: true },
  { label: "FOCUS OS", value: "50m Blocks", status: "Shvasa Embedded", isPositive: true },
  { label: "CANVAS VIEWER", value: "100% Zero-Block", status: "Mozilla PDF.js", isPositive: true },
  { label: "AI COPILOT", value: "Low-Token", status: "Strict Engineering", isPositive: true },
]

const WHAT_WE_DO_PILLARS = [
  {
    icon: Layers,
    color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    title: "1. Hackathon Sprint Operations",
    tagline: "From ideation to deployment",
    description: "Eliminates fragmented WhatsApp groups and Discord chats. Manage end-to-end hackathon cycles with a 5-stage kanban board: DISCUSSING → PLANNING → DOING → REVIEWING → COMPLETED.",
  },
  {
    icon: BookOpen,
    color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    title: "2. Verified IA-1 Academic Vault",
    tagline: "Zero syllabus noise, verified notes",
    description: "Strictly scoped to Saptagiri NPS University Semester 1 P-Cycle. Access high-yield question papers, handwritten lecture notes, and formula sheets rendered natively in PDF.js canvas.",
  },
  {
    icon: Clock,
    color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    title: "3. Shvasa Focus OS Sidecar",
    tagline: "Synchronized deep work & breathwork",
    description: "Docked right inside the desk without switching tabs. Run 50-minute Pomodoro study sprints, box breathing intervals, and ambient focus audio alongside active code and notes.",
  },
  {
    icon: Cpu,
    color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    title: "4. ForgeCopilot Engineering AI",
    tagline: "Token-efficient, zero fluff",
    description: "Specialized technical AI assistant strictly bounded to Computer Science, algorithm design, IA-1 coursework, and sprint blockers with minimal token usage and no conversational filler.",
  },
]

const ACADEMIC_MODULES = [
  {
    subject: "Problem Solving with C (PSC)",
    title: "Module 1 & 2 Lecture Notes & Question Bank",
    badge: "IA-1 Question Bank",
    description: "Operators, Control Flow, Arrays, Pointers, and Function Prototypes for Saptagiri NPS P-Cycle.",
  },
  {
    subject: "Engineering Mathematics (MAT)",
    title: "Taylor's Series Expansion & Jacobian Transformations",
    badge: "Core Calculus",
    description: "Consolidated step-by-step proofs, solved model papers, and partial derivatives matrix evaluation.",
  },
  {
    subject: "Engineering Physics (PHY)",
    title: "Quantum Mechanics & Wave Equations",
    badge: "Course 25BEPHY106",
    description: "De Broglie hypothesis, time-independent Schrödinger wave equations, and photoelectric effect derivations.",
  },
]

export function HackForgeLandingPage() {
  const [activeTab, setActiveTab] = React.useState<"all" | "psc" | "mat" | "phy">("all")
  const [selectedSubject, setSelectedSubject] = React.useState<StudySubject>(FEATURED_SUBJECTS[0])

  return (
    <div className="min-h-screen bg-[#08090d]/50 text-zinc-100 selection:bg-blue-600/30 selection:text-blue-200 font-sans antialiased relative overflow-x-hidden">
      {/* Ambient background glows matching Vestia layout */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/12 via-indigo-600/8 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[400px] right-0 w-[500px] h-[400px] bg-blue-500/10 blur-[120px] pointer-events-none -z-10" />

      {/* 1. Global Navigation Bar with prominent Sign-In AND Sign-Up */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-[#08090d]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand Identity */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <div className="size-full bg-blue-600 rounded-[10px] flex items-center justify-center">
                <Flame className="size-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-heading">HackForge</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                Team Bhairava
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-400">
            <a href="#about" className="hover:text-white transition-colors">
              What We Do
            </a>
            <a href="#vault" className="hover:text-white transition-colors">
              IA-1 Vault
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Pillars
            </a>
            <a href="#velocity" className="hover:text-white transition-colors">
              Notes & Papers
            </a>
            <Link
              href="/dashboard"
              className="hover:text-blue-400 transition-colors flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300"
            >
              <Sparkles className="size-3" />
              <span>Workspace</span>
            </Link>
          </nav>

          {/* Action CTAs: Verified Access only via Sign-In and Sign-Up */}
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs font-medium text-zinc-300 hover:text-white hover:bg-zinc-800/70 h-9 px-3.5 rounded-lg transition-colors cursor-pointer"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 h-9 rounded-lg shadow-md shadow-blue-600/25 transition-all text-xs cursor-pointer gap-1.5"
              >
                <span>Sign Up</span>
                <ArrowRight className="size-3" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Live Sprint Pulse Ticker Bar */}
      <div className="w-full border-b border-zinc-800/50 bg-zinc-950/40 py-1.5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 text-[11px] whitespace-nowrap">
          <span className="text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Desk State
          </span>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {LIVE_SPRINT_METRICS.map((metric) => (
              <div key={metric.label} className="flex items-center gap-2 shrink-0">
                <span className="font-medium text-zinc-400">{metric.label}:</span>
                <span className="font-mono text-zinc-200">{metric.value}</span>
                <span className="font-mono text-[10px] text-emerald-400">({metric.status})</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Section (Pixel-Aligned with Vestia Layout) */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Value Prop & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Semester 1, P-Cycle • IA-1 Active</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-heading leading-[1.1]">
              Forge Your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Future
              </span>
            </h1>

            {/* Subtitle Introduction */}
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
              The centralized digital desk for Team Bhairava at Saptagiri NPS University. Access
              verified IA-1 examination repositories, coordinate hackathon sprints, and power deep work
              with embedded Pomodoro OS.
            </p>

            {/* Action Buttons: Sign In and Sign Up required for workspace access */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link href="/login">
                <Button
                  size="lg"
                  className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 transition-all text-sm gap-2 cursor-pointer"
                >
                  <Lock className="size-4" />
                  <span>Sign In to Desk</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-5 rounded-xl border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-200 hover:text-white transition-all text-sm cursor-pointer gap-2"
                >
                  <ShieldCheck className="size-4 text-emerald-400" />
                  <span>Sign Up / Join Team</span>
                </Button>
              </Link>
            </div>

            {/* 3 Metric Stats Row (Matching Vestia $2.5B+, 500K+, 0.1% layout) */}
            <div className="pt-8 border-t border-zinc-800/60 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                  17+
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">Verified IA-1 Docs</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                  5 Core
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">Syllabus Subjects</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                  100%
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">Canvas PDF Render</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Preview Card (Exact Vestia Layout with HackForge Content) */}
          <div className="lg:col-span-6 w-full">
            <div className="relative mx-auto max-w-lg">
              {/* Subtle back ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/10 rounded-3xl blur-2xl opacity-75" />

              {/* Glassmorphic Container Card */}
              <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-2xl shadow-black/80 space-y-5">
                {/* Top Section: Velocity & Progress */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                      Sprint Velocity & IA-1 Score
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight mt-1">
                      94.8% Readiness
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1">
                      <ArrowUpRight className="size-3.5" />
                      <span>+14.2% this sprint</span>
                    </div>
                    <div className="text-[11px] text-emerald-400/80 mt-0.5">Sprint 01 in Progress</div>
                  </div>
                </div>

                {/* Interactive SVG Sparkline Wave Chart (Matching the blue glowing wave in screenshot) */}
                <div className="relative h-28 sm:h-32 w-full pt-2">
                  <svg
                    viewBox="0 0 400 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full overflow-visible"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="100" gradientUnits="userSpaceOnUse">
                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                      </linearGradient>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#3b82f6" floodOpacity="0.6" />
                      </filter>
                    </defs>

                    {/* Gradient fill beneath wave */}
                    <path
                      d="M 0,80 Q 80,85 140,65 T 260,35 T 340,30 T 400,20 L 400,100 L 0,100 Z"
                      fill="url(#chartGradient)"
                    />

                    {/* Neon blue line curve */}
                    <path
                      d="M 0,80 Q 80,85 140,65 T 260,35 T 340,30 T 400,20"
                      stroke="#38bdf8"
                      strokeWidth="2.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      filter="url(#glow)"
                    />

                    {/* Pulsing endpoint coordinate */}
                    <circle cx="400" cy="20" r="4" fill="#38bdf8" />
                    <circle cx="400" cy="20" r="8" fill="#38bdf8" opacity="0.3" className="animate-ping" />
                  </svg>
                </div>

                {/* 3 Subject Rows List (Matches AAPL, GOOGL, MSFT layout) */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800/60">
                  {FEATURED_SUBJECTS.slice(0, 3).map((item) => (
                    <div
                      key={item.code}
                      onClick={() => setSelectedSubject(item)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedSubject.code === item.code
                          ? "border-blue-500/40 bg-blue-500/5 shadow-inner"
                          : "border-zinc-800/50 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-800/40"
                      }`}
                    >
                      {/* Left: Tag + Title */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${item.avatar}`}
                        >
                          {item.tag}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-white tracking-wide">
                            {item.code} • {item.title}
                          </div>
                          <div className="text-[11px] text-zinc-400">{item.subtitle}</div>
                        </div>
                      </div>

                      {/* Right: Docs Count + Status */}
                      <div className="text-right">
                        <div className="font-mono text-xs font-semibold text-zinc-100">
                          {item.docsCount}
                        </div>
                        <div className="font-mono text-[11px] font-medium text-emerald-400">
                          {item.status}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desk Integration Callout */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-blue-400" />
                    <span>Mozilla PDF.js Canvas Engine</span>
                  </span>
                  <Link
                    href="/dashboard"
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <span>Full Dashboard</span>
                    <ChevronRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. INTRODUCTION SECTION: WHAT WE DO, WHO WE ARE & OUR MISSION */}
      <section id="about" className="py-20 border-t border-zinc-800/60 bg-zinc-950/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          {/* Header intro */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/10">
              Introduction & Mission
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
              About HackForge — What We Do
            </h2>
            <p className="text-sm text-zinc-400 leading-relaxed">
              **HackForge** (Act Force) is the unified developer-first workspace engineered for student hackathon
              cohorts and academic peers at **Saptagiri NPS University**. We bridge the divide between rapid sprint
              execution and disciplined academic excellence.
            </p>
          </div>

          {/* 4 Pillars of What We Do */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHAT_WE_DO_PILLARS.map((pillar) => {
              const Icon = pillar.icon
              return (
                <div
                  key={pillar.title}
                  className="rounded-2xl border border-zinc-800/80 bg-zinc-900/50 p-6 space-y-3.5 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className={`size-11 rounded-xl flex items-center justify-center border ${pillar.color}`}>
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm text-white">{pillar.title}</h3>
                      <span className="text-[11px] font-mono text-zinc-500">{pillar.tagline}</span>
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{pillar.description}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* How It Works Flow */}
          <div className="rounded-2xl border border-zinc-800/70 bg-gradient-to-r from-blue-950/20 via-zinc-900/50 to-indigo-950/20 p-6 md:p-8 space-y-6">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-400">
              <Workflow className="size-4" />
              <span>How Team Bhairava Operates</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="text-xs font-mono font-bold text-blue-400">01. Onboard</span>
                <h4 className="text-xs font-semibold text-white">Sign Up & Verify</h4>
                <p className="text-[11px] text-zinc-400">Institutional registration protected with Postgres RLS.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="text-xs font-mono font-bold text-emerald-400">02. Study</span>
                <h4 className="text-xs font-semibold text-white">Access IA-1 Vault</h4>
                <p className="text-[11px] text-zinc-400">Stream 17 verified papers directly via PDF.js canvas.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="text-xs font-mono font-bold text-purple-400">03. Build</span>
                <h4 className="text-xs font-semibold text-white">Hackathon Sprinting</h4>
                <p className="text-[11px] text-zinc-400">Track 5-stage tasks with embedded Shvasa Pomodoro OS.</p>
              </div>

              <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800/60 space-y-1.5">
                <span className="text-xs font-mono font-bold text-amber-400">04. Accelerate</span>
                <h4 className="text-xs font-semibold text-white">ForgeCopilot AI</h4>
                <p className="text-[11px] text-zinc-400">Deterministic engineering assistant with low token cost.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Verified IA-1 Academic Vault Explorer */}
      <section id="vault" className="py-16 border-t border-zinc-800/60 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/10 mb-2">
                Saptagiri NPS Repository
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
                Semester 1, P-Cycle IA-1 Vault
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Zero syllabus noise. Verified lecture notes, question papers, and high-yield question banks
                rendered via native PDF.js canvas with zero browser extension sandboxing issues.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 self-start md:self-auto">
              {(["all", "psc", "mat", "phy"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab === "all" ? "All Subjects" : tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Subject Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_SUBJECTS.filter((s) => activeTab === "all" || s.code.toLowerCase() === activeTab.toLowerCase()).map((subject) => (
              <Card
                key={subject.code}
                className="border border-zinc-800/70 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all shadow-md group"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`size-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${subject.avatar}`}>
                        {subject.tag}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{subject.code}</div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-[100px]">{subject.title}</div>
                      </div>
                    </div>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {subject.status}
                    </span>
                  </div>

                  <div>
                    <div className="text-xl font-bold font-mono text-zinc-100">{subject.docsCount}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">{subject.subtitle}</div>
                  </div>

                  {/* Micro sparkline progress */}
                  <div className="h-9 w-full flex items-end gap-1 pt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {subject.history.map((val, idx) => {
                      const min = Math.min(...subject.history)
                      const max = Math.max(...subject.history)
                      const heightPercent = Math.max(20, Math.min(100, ((val - min) / (max - min || 1)) * 100))
                      return (
                        <div
                          key={idx}
                          className="flex-1 rounded-t transition-all"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: "#38bdf8",
                            opacity: 0.3 + (idx / subject.history.length) * 0.7,
                          }}
                        />
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Academic Modules & Question Papers */}
      <section id="velocity" className="py-16 border-t border-zinc-800/60 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 mb-2">
                IA-1 Preparation Hub
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
                Consolidated Notes & Solved Papers
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-lg">
                Curated by Team Bhairava for the first internal assessment at Saptagiri NPS University.
              </p>
            </div>

            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-800 text-zinc-300 hover:text-white text-xs gap-1.5 cursor-pointer"
              >
                <span>Access Full Vault</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ACADEMIC_MODULES.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-blue-400">{item.subject}</span>
                    <span className="text-zinc-500">{item.badge}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                    Canvas PDF
                  </span>
                  <Link
                    href="/dashboard"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                  >
                    <span>View in Desk</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pre-Login CTA Banner (Smooth Transition to Sign Up & Login) */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-zinc-900/60 to-zinc-900/90 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          {/* Ambient center radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
              Ready to Step into Team Bhairava Desk?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Create an account or sign in with your verified university credentials to access real-time
              kanban boards, instant study rooms, and synchronized focus sessions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xl shadow-blue-600/30 text-sm gap-2 cursor-pointer"
                >
                  <span>Create Free Account</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 rounded-xl border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-sm cursor-pointer"
                >
                  Sign In to Workspace
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <GraduationCap className="size-3.5 text-blue-400" />
                <span>Saptagiri NPS University</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Code2 className="size-3.5 text-emerald-400" />
                <span>CSE General P-Cycle</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Lock className="size-3.5 text-purple-400" />
                <span>Row Level Security (RLS)</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. COMPREHENSIVE FOOTER ("Things and everything should be there") */}
      <footer className="border-t border-zinc-800 bg-[#06070a] pt-16 pb-12 text-xs text-zinc-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Main 5-Column Grid */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
            {/* Column 1: Brand & Institutional Context */}
            <div className="col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
                  <Flame className="size-4" />
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-white font-heading">HackForge</span>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300">
                    Act Force
                  </span>
                </div>
              </div>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-sm">
                The centralized developer desk and academic vault for **Team Bhairava** at
                **Saptagiri NPS University**. Built for high-velocity hackathons and Semester 1 IA-1 mastery.
              </p>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 text-[11px] font-medium">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>All Systems Operational • IA-1 Ready</span>
              </div>
            </div>

            {/* Column 2: Platform & Features */}
            <div className="space-y-3">
              <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider font-mono">
                Platform
              </h4>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Sprint Kanban Board
                  </Link>
                </li>
                <li>
                  <a href="#vault" className="hover:text-white transition-colors">
                    IA-1 Study Vault
                  </a>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    Shvasa Focus OS
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard" className="hover:text-white transition-colors">
                    ForgeCopilot AI
                  </Link>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors">
                    PDF.js Canvas Viewer
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 3: Academic Repository (IA-1) */}
            <div className="space-y-3">
              <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider font-mono">
                IA-1 Subjects
              </h4>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <a href="#vault" className="hover:text-white transition-colors">
                    Problem Solving with C (PSC)
                  </a>
                </li>
                <li>
                  <a href="#vault" className="hover:text-white transition-colors">
                    Engineering Mathematics
                  </a>
                </li>
                <li>
                  <a href="#vault" className="hover:text-white transition-colors">
                    Engineering Physics
                  </a>
                </li>
                <li>
                  <a href="#vault" className="hover:text-white transition-colors">
                    Basic Electrical Engg.
                  </a>
                </li>
                <li>
                  <a href="#vault" className="hover:text-white transition-colors">
                    Design Thinking & IPR
                  </a>
                </li>
              </ul>
            </div>

            {/* Column 4: Accounts & Access */}
            <div className="space-y-3">
              <h4 className="font-semibold text-zinc-200 text-xs uppercase tracking-wider font-mono">
                Account & Access
              </h4>
              <ul className="space-y-2 text-zinc-400">
                <li>
                  <Link href="/login" className="hover:text-white transition-colors">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link href="/signup" className="hover:text-white transition-colors font-medium text-blue-400">
                    Sign Up / Register
                  </Link>
                </li>
                <li>
                  <Link href="/request-invite" className="hover:text-white transition-colors">
                    Request Team Invite
                  </Link>
                </li>
                <li>
                  <Link href="/forgot-password" className="hover:text-white transition-colors">
                    Reset Password
                  </Link>
                </li>
                <li>
                  <Link href="/admin/access-requests" className="hover:text-white transition-colors">
                    Admin Access Review
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar: Copyright & Compliance */}
          <div className="pt-8 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-500">
            <div>
              © 2026 HackForge (Act Force) • Team Bhairava • Saptagiri NPS University. All rights reserved.
            </div>
            <div className="flex items-center gap-5 text-zinc-400">
              <Link href="/login" className="hover:text-white transition-colors">
                Workspace Portal
              </Link>
              <Link href="/signup" className="hover:text-white transition-colors">
                New Account
              </Link>
              <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
