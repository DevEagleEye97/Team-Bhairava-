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
  Terminal,
  Code2,
  Clock,
  Layers,
  Lock,
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
    <div className="min-h-screen bg-[#08090d] text-zinc-100 selection:bg-blue-600/30 selection:text-blue-200 font-sans antialiased relative overflow-x-hidden">
      {/* Ambient background glows matching Vestia screenshot */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/12 via-indigo-600/8 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[400px] right-0 w-[500px] h-[400px] bg-blue-500/10 blur-[120px] pointer-events-none -z-10" />

      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-[#08090d]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
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
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#vault" className="hover:text-white transition-colors">
              IA-1 Vault
            </a>
            <a href="#velocity" className="hover:text-white transition-colors">
              Sprint Velocity
            </a>
            <a href="#focus" className="hover:text-white transition-colors">
              Focus OS
            </a>
            <Link
              href="/dashboard"
              className="hover:text-blue-400 transition-colors flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300"
            >
              <Sparkles className="size-3" />
              <span>Enter Dashboard</span>
            </Link>
          </nav>

          {/* Action CTAs: First Landing, then Login and Dashboard */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Log In
            </Link>
            <Link href="/login?next=/dashboard">
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 h-9 rounded-lg shadow-md shadow-blue-600/25 transition-all text-xs cursor-pointer"
              >
                Get Started
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

      {/* 2. Hero Section (Pixel-Aligned with Vestia Screenshot Layout) */}
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

            {/* Subtitle */}
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
              The centralized digital desk for Team Bhairava at Saptagiri NPS University. Access
              verified IA-1 examination repositories, coordinate hackathon sprints, and power deep work
              with embedded Pomodoro OS.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/login?next=/dashboard">
                <Button
                  size="lg"
                  className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 transition-all text-sm gap-2 cursor-pointer"
                >
                  <span>Enter Team Desk</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 rounded-xl border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-sm cursor-pointer"
                >
                  View Dashboard
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

      {/* 3. Verified IA-1 Academic Vault Explorer */}
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
            {FEATURED_SUBJECTS.map((subject) => (
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

      {/* 4. Core Pillars: Sprint Velocity, Pomodoro OS, & Copilot */}
      <section id="features" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 bg-indigo-500/10">
            Integrated Workspace Architecture
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            Built for High-Velocity Hackathon Squads
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            A unified desk bridging rapid sprint execution, academic syllabus mastery, and focused
            co-working into a single, distraction-free environment.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Layers className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100">Five-Stage Project Board</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Track ideas from DISCUSSING through PLANNING, DOING, REVIEWING, and COMPLETED with
              real-time team assignments and priority tags.
            </p>
          </Card>

          <Card className="border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Clock className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100">Embedded Shvasa Focus OS</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Dedicated right-docked sidecar running 50-minute synchronized focus sprints, box breathing,
              and lo-fi audio without closing your active study vault.
            </p>
          </Card>

          <Card className="border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Terminal className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100">ForgeCopilot Engineering AI</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Low-token, deterministic technical assistant strictly scoped to Computer Science,
              IA-1 engineering topics, and sprint blockers with zero fluff.
            </p>
          </Card>
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

            <Link href="/login?next=/dashboard">
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

      {/* 6. Pre-Login CTA Banner (Smooth Transition to Login and Dashboard) */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-zinc-900/60 to-zinc-900/90 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          {/* Ambient center radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
              Ready to Step into Team Bhairava Desk?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Sign in with your verified university credentials to access real-time kanban boards,
              instant study rooms, and synchronized focus sessions.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/login?next=/dashboard">
                <Button
                  size="lg"
                  className="h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xl shadow-blue-600/30 text-sm gap-2 cursor-pointer"
                >
                  <span>Enter Team Desk</span>
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

      {/* 7. Footer */}
      <footer className="border-t border-zinc-800/60 bg-zinc-950 py-12 text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="size-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Flame className="size-3.5" />
            </div>
            <span className="font-bold text-zinc-300">HackForge</span>
            <span>• Team Bhairava • Saptagiri NPS University</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#vault" className="hover:text-white transition-colors">
              IA-1 Vault
            </a>
            <a href="#velocity" className="hover:text-white transition-colors">
              Velocity
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/dashboard" className="hover:text-blue-400 transition-colors">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
