"use client"

import * as React from "react"
import Link from "next/link"
import {
  TrendingUp,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Lock,
  Globe2,
  CheckCircle2,
  Sparkles,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Asset data matching the reference design + live expansion
interface MarketAsset {
  symbol: string
  name: string
  price: string
  change: string
  isPositive: boolean
  tag: string
  avatar: string
  history: number[]
}

const FEATURED_ASSETS: MarketAsset[] = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: "$178.72",
    change: "+2.34%",
    isPositive: true,
    tag: "AA",
    avatar: "bg-zinc-800 text-zinc-200",
    history: [172, 173.5, 175, 174.2, 176.8, 178.72],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: "$141.80",
    change: "+1.12%",
    isPositive: true,
    tag: "GO",
    avatar: "bg-zinc-800 text-zinc-200",
    history: [138, 139.2, 140.1, 139.8, 141.2, 141.8],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: "$378.91",
    change: "-0.45%",
    isPositive: false,
    tag: "MS",
    avatar: "bg-zinc-800 text-zinc-200",
    history: [382, 381, 379.5, 380.2, 379, 378.91],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: "$892.40",
    change: "+4.18%",
    isPositive: true,
    tag: "NV",
    avatar: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40",
    history: [840, 855, 870, 868, 885, 892.4],
  },
]

const MARKET_INDICES = [
  { name: "S&P 500", value: "5,187.03", change: "+0.82%", isUp: true },
  { name: "NASDAQ", value: "16,388.24", change: "+1.15%", isUp: true },
  { name: "DOW JONES", value: "38,989.84", change: "+0.31%", isUp: true },
  { name: "BTC / USD", value: "$67,420.00", change: "+3.42%", isUp: true },
  { name: "US 10Y YIELD", value: "4.28%", change: "-0.04%", isUp: false },
]

const EDUCATIONAL_RESOURCES = [
  {
    category: "Quantitative Strategies",
    title: "Modern Portfolio Theory & The Efficient Frontier",
    readTime: "6 min read",
    level: "Intermediate",
    description: "Learn how asset covariance and mean-variance optimization maximize risk-adjusted yields.",
  },
  {
    category: "Market Structure",
    title: "Understanding Order Flow, Liquidity & Spread Dynamics",
    readTime: "8 min read",
    level: "Advanced",
    description: "Deep dive into market maker mechanics, depth of book (L2), and slippage mitigation.",
  },
  {
    category: "Risk Architecture",
    title: "Automated Rebalancing & Drawdown Guardrails",
    readTime: "5 min read",
    level: "Beginner Friendly",
    description: "Set programmatic thresholds to lock in realized gains and manage portfolio exposure.",
  },
]

export function InvestmentLandingPage() {
  const [activeTab, setActiveTab] = React.useState<"all" | "equities" | "etfs" | "crypto">("all")
  const [selectedAsset, setSelectedAsset] = React.useState<MarketAsset>(FEATURED_ASSETS[0])

  return (
    <div className="min-h-screen bg-[#08090d] text-zinc-100 selection:bg-blue-600/30 selection:text-blue-200 font-sans antialiased relative overflow-x-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[550px] bg-gradient-to-b from-blue-600/12 via-indigo-600/8 to-transparent blur-[140px] pointer-events-none -z-10" />
      <div className="absolute top-[400px] right-0 w-[500px] h-[400px] bg-blue-500/10 blur-[120px] pointer-events-none -z-10" />

      {/* 1. Global Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/60 bg-[#08090d]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="size-9 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-blue-500 p-0.5 flex items-center justify-center shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
              <div className="size-full bg-blue-600 rounded-[10px] flex items-center justify-center">
                <TrendingUp className="size-5 text-white" />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white font-heading">Vestia</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/50">
                PRO
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#markets" className="hover:text-white transition-colors">
              Markets
            </a>
            <a href="#analytics" className="hover:text-white transition-colors">
              Analytics
            </a>
            <a href="#learn" className="hover:text-white transition-colors">
              Learn
            </a>
            <Link href="/desk" className="hover:text-blue-400 transition-colors flex items-center gap-1 text-xs px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-blue-300">
              <Sparkles className="size-3" />
              <span>Team Desk</span>
            </Link>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
            >
              Log In
            </Link>
            <Link href="/signup">
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

      {/* Ticker Bar (Live Indices) */}
      <div className="w-full border-b border-zinc-800/50 bg-zinc-950/40 py-1.5 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-6 text-[11px] whitespace-nowrap">
          <span className="text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1.5 shrink-0">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Live Feeds
          </span>
          <div className="flex items-center gap-6 overflow-x-auto no-scrollbar">
            {MARKET_INDICES.map((index) => (
              <div key={index.name} className="flex items-center gap-2 shrink-0">
                <span className="font-medium text-zinc-400">{index.name}</span>
                <span className="font-mono text-zinc-200">{index.value}</span>
                <span
                  className={`font-mono text-[10px] ${
                    index.isUp ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  {index.change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Section (Matching the reference design screenshot) */}
      <section className="relative pt-12 pb-20 md:pt-16 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Heading, Value Prop & CTAs */}
          <div className="lg:col-span-6 space-y-6">
            {/* Status Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
              <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Markets Open</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-heading leading-[1.1]">
              Invest in Your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Future
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg">
              Access global markets, build diversified portfolios, and grow your wealth with
              professional-grade tools, predictive analytics, and institutional execution.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-11 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-lg shadow-blue-600/30 transition-all text-sm gap-2 cursor-pointer"
                >
                  <span>Start Investing</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/desk">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 rounded-xl border-zinc-800 bg-zinc-900/60 hover:bg-zinc-800 text-zinc-300 hover:text-white transition-all text-sm cursor-pointer"
                >
                  View Demo
                </Button>
              </Link>
            </div>

            {/* Metric Stats Row (Matches screenshot: $2.5B+, 500K+, 0.1%) */}
            <div className="pt-8 border-t border-zinc-800/60 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                  $2.5B+
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">Assets Managed</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                  500K+
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">Active Investors</div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-heading text-white tracking-tight">
                  0.1%
                </div>
                <div className="text-xs text-zinc-500 mt-0.5">Trading Fees</div>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Portfolio Preview Card (Matches reference screenshot) */}
          <div className="lg:col-span-6 w-full">
            <div className="relative mx-auto max-w-lg">
              {/* Subtle back ambient glow */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 via-indigo-600/20 to-purple-600/10 rounded-3xl blur-2xl opacity-75" />

              {/* Glassmorphic Container Card */}
              <div className="relative rounded-2xl border border-zinc-800/80 bg-zinc-900/80 backdrop-blur-xl p-5 sm:p-6 shadow-2xl shadow-black/80 space-y-5">
                {/* Top Section: Portfolio Value & Gain */}
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
                      Portfolio Value
                    </span>
                    <div className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight mt-1">
                      $124,582.40
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-semibold text-emerald-400 flex items-center justify-end gap-1">
                      <ArrowUpRight className="size-3.5" />
                      <span>+$12,340.20</span>
                    </div>
                    <div className="text-[11px] text-emerald-400/80 mt-0.5">+11.02% all time</div>
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

                {/* Asset Rows List (AAPL, GOOGL, MSFT from screenshot) */}
                <div className="space-y-2.5 pt-2 border-t border-zinc-800/60">
                  {FEATURED_ASSETS.slice(0, 3).map((asset) => (
                    <div
                      key={asset.symbol}
                      onClick={() => setSelectedAsset(asset)}
                      className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                        selectedAsset.symbol === asset.symbol
                          ? "border-blue-500/40 bg-blue-500/5 shadow-inner"
                          : "border-zinc-800/50 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-800/40"
                      }`}
                    >
                      {/* Left: Tag + Name */}
                      <div className="flex items-center gap-3">
                        <div
                          className={`size-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${asset.avatar}`}
                        >
                          {asset.tag}
                        </div>
                        <div>
                          <div className="font-semibold text-xs text-white tracking-wide">
                            {asset.symbol}
                          </div>
                          <div className="text-[11px] text-zinc-400">{asset.name}</div>
                        </div>
                      </div>

                      {/* Right: Price + Percentage Change */}
                      <div className="text-right">
                        <div className="font-mono text-xs font-semibold text-zinc-100">
                          {asset.price}
                        </div>
                        <div
                          className={`font-mono text-[11px] font-medium flex items-center justify-end gap-0.5 ${
                            asset.isPositive ? "text-emerald-400" : "text-rose-400"
                          }`}
                        >
                          {asset.isPositive ? "+" : ""}
                          {asset.change}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Desk Integration Callout */}
                <div className="pt-2 flex items-center justify-between text-[11px] text-zinc-400">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="size-3.5 text-blue-400" />
                    <span>Real-time WebSocket Data</span>
                  </span>
                  <Link
                    href="/login"
                    className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                  >
                    <span>Full Analytics</span>
                    <ChevronRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Market Exploration Section (Search & Live Categories) */}
      <section id="markets" className="py-16 border-t border-zinc-800/60 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/10 mb-2">
                Live Market Ticker
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
                Institutional Depth, Zero Lag
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-xl">
                Explore real-time order books, liquidity metrics, and cross-asset correlations across
                global equities and digital assets.
              </p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800 self-start md:self-auto">
              {(["all", "equities", "etfs", "crypto"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all cursor-pointer ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-zinc-400 hover:text-zinc-200"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Grid of Market Asset Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURED_ASSETS.map((asset) => (
              <Card
                key={asset.symbol}
                className="border border-zinc-800/70 bg-zinc-900/50 hover:bg-zinc-900/80 hover:border-zinc-700 transition-all shadow-md group"
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`size-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${asset.avatar}`}>
                        {asset.tag}
                      </div>
                      <div>
                        <div className="font-bold text-xs text-white">{asset.symbol}</div>
                        <div className="text-[10px] text-zinc-400 truncate max-w-[90px]">{asset.name}</div>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-mono font-semibold px-2 py-0.5 rounded ${
                        asset.isPositive
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                      }`}
                    >
                      {asset.change}
                    </span>
                  </div>

                  {/* Price */}
                  <div>
                    <div className="text-xl font-bold font-mono text-zinc-100">{asset.price}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">Volume: $4.2B • 24h</div>
                  </div>

                  {/* Micro sparkline */}
                  <div className="h-9 w-full flex items-end gap-1 pt-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    {asset.history.map((val, idx) => {
                      const min = Math.min(...asset.history)
                      const max = Math.max(...asset.history)
                      const heightPercent = Math.max(15, Math.min(100, ((val - min) / (max - min || 1)) * 100))
                      return (
                        <div
                          key={idx}
                          className="flex-1 rounded-t transition-all"
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: asset.isPositive ? "#10b981" : "#f43f5e",
                            opacity: 0.3 + (idx / asset.history.length) * 0.7,
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

      {/* 4. Portfolio Analytics & Trust Features */}
      <section id="analytics" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <Badge variant="outline" className="text-indigo-400 border-indigo-500/30 bg-indigo-500/10">
            Institutional Infrastructure
          </Badge>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading text-white tracking-tight">
            Built on Uncompromising Precision
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Every dollar tracked, rebalanced, and executed through bank-grade cryptographic protocols
            and real-time risk engines.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <div className="size-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <BarChart3 className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100">Predictive Alpha Modeling</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Backtested quantitative models evaluate asset correlations, factor exposures, and
              dynamic volatility stops automatically.
            </p>
          </Card>

          <Card className="border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <div className="size-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Lock className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100">Cold Vault Custody & RLS</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Multi-signature authorization, Row Level Security (RLS) on PostgreSQL, and 256-bit AES
              encryption guard user assets and identity.
            </p>
          </Card>

          <Card className="border border-zinc-800 bg-zinc-900/40 p-6 space-y-4">
            <div className="size-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Globe2 className="size-5" />
            </div>
            <h3 className="font-semibold text-sm text-zinc-100">Low-Latency Global Routing</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sub-millisecond smart order routing ensures best bid and offer execution with minimal
              slippage across worldwide liquidity pools.
            </p>
          </Card>
        </div>
      </section>

      {/* 5. Educational Resources ("Vestia Academy") */}
      <section id="learn" className="py-16 border-t border-zinc-800/60 bg-zinc-950/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 mb-2">
                Knowledge & Mastery
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-white tracking-tight">
                Educational Resources & Research
              </h2>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-lg">
                Curated curriculum designed by quantitative analysts and academic researchers to
                elevate your financial literacy and technical intuition.
              </p>
            </div>

            <Link href="/request-invite">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-800 text-zinc-300 hover:text-white text-xs gap-1.5"
              >
                <span>Request Research Access</span>
                <ArrowRight className="size-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EDUCATIONAL_RESOURCES.map((item) => (
              <div
                key={item.title}
                className="p-5 rounded-2xl border border-zinc-800/80 bg-zinc-900/50 hover:bg-zinc-900/80 transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-mono text-blue-400">{item.category}</span>
                    <span className="text-zinc-500">{item.readTime}</span>
                  </div>
                  <h3 className="font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">{item.description}</p>
                </div>

                <div className="pt-3 border-t border-zinc-800/50 flex items-center justify-between text-xs text-zinc-500">
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-[10px] text-zinc-300">
                    {item.level}
                  </span>
                  <Link
                    href="/login"
                    className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-medium"
                  >
                    <span>Read Paper</span>
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Pre-Login Signup / Invite CTA Banner */}
      <section className="py-20 relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl border border-blue-500/30 bg-gradient-to-b from-blue-950/40 via-zinc-900/60 to-zinc-900/90 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          {/* Ambient center radial glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-600/15 blur-[100px] pointer-events-none" />

          <div className="relative z-10 max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-white tracking-tight">
              Ready to Take Control of Your Portfolio?
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Create an account in minutes or sign in to access live order books, automated rebalancing,
              and dedicated academic research vaults.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <Link href="/signup">
                <Button
                  size="lg"
                  className="h-11 px-7 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-xl shadow-blue-600/30 text-sm gap-2 cursor-pointer"
                >
                  <span>Open Free Account</span>
                  <ArrowRight className="size-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 rounded-xl border-zinc-700 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 text-sm cursor-pointer"
                >
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-6 pt-6 text-[11px] text-zinc-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>Zero commission trading</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>SIPC insured up to $500k</span>
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-3.5 text-emerald-400" />
                <span>Bank-grade 256-bit encryption</span>
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
              <TrendingUp className="size-3.5" />
            </div>
            <span className="font-bold text-zinc-300">Vestia Platform</span>
            <span>• © 2026 Vestia Global Markets, Inc.</span>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <a href="#features" className="hover:text-white transition-colors">
              Features
            </a>
            <a href="#markets" className="hover:text-white transition-colors">
              Markets
            </a>
            <a href="#learn" className="hover:text-white transition-colors">
              Learn
            </a>
            <Link href="/login" className="hover:text-white transition-colors">
              Client Portal
            </Link>
            <Link href="/desk" className="hover:text-blue-400 transition-colors">
              Team Desk
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
