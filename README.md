# ⚡ HackForge — Digital Team Desk & Academic Collaboration Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.4.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL_%26_Auth-3ecf8e?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![PDF.js](https://img.shields.io/badge/Mozilla-PDF.js_Canvas-FF6600?style=for-the-badge&logo=mozilla)](https://mozilla.github.io/pdf.js/)
[![Shvasa OS](https://img.shields.io/badge/Focus-Shvasa_Pomodoro-8b5cf6?style=for-the-badge)](https://shvasa.lovable.app/)

> **Team Workspace:** Team Bhairava  
> **Institution:** Saptagiri NPS University  
> **Academic Context:** CSE General, Semester 1, P-Cycle, IA-1 Prep  
> **Repository:** [https://github.com/DevEagleEye97/Team-Bhairava-.git](https://github.com/DevEagleEye97/Team-Bhairava-.git)  

---

## 🌟 Overview

**HackForge** is an integrated, developer-first workspace engineered for competitive hackathon teams and computer science students. Built on the **Next.js App Router**, **Tailwind CSS v4**, and **Supabase**, HackForge combines team sprint coordination (task kanbans, project lifecycles, realtime channels) with a verified academic study repository and a zero-distraction Pomodoro focus environment.

---

## 🚀 Key Features

### 1. 🖥️ Ergonomic Tri-Pane Team Desk
- **Collapsible Sidebar (260px):** Quick navigation across channels, team desks, presence indicators, and quick action modals.
- **Fluid Center Stage:** High-density view switcher powering the Dashboard Overview, Study Room, Projects, and Discussion Channels.
- **Context Sidecar (320px–480px):** Dynamic panel hosting thread discussions, community polls, event countdowns, and the Shvasa Pomodoro tool.

### 2. 📚 Study Room (Verified Semester 1, P-Cycle IA-1 Only)
- **Strict Academic Scoping:** Exclusively serves verified Semester 1, P-Cycle, IA-1 course materials.
- **Subject-Grouped Repository:** Organized across Problem Solving with C (PSC), Engineering Mathematics (MAT), Engineering Physics (PHY), Basic Electrical Engineering (BEE), Design Thinking & IPR (DTI), and Previous Years Papers.
- **In-App Canvas PDF Viewer:** Powered by Mozilla `pdfjs-dist@4.4.168` canvas rendering (`PdfJsViewer`). Resolves Chromium iframe sandbox blocks, supporting page pagination, zoom (`-`, `+`, `Reset`), rotation (`90°`), and fullscreen mode.
- **Secure File Delivery:** Served via server-authorized endpoints (`/api/study-materials/[id]/view`) with short-lived signed URLs.

### 3. ⏱️ Shvasa Focus & Pomodoro OS
- **Docked Sidecar Co-Working:** Seamlessly embeds [Shvasa OS](https://shvasa.lovable.app/) in a dedicated right-hand side panel.
- **Zero-Toggle Flow:** Study documents and the Pomodoro timer operate side-by-side in the same viewport without full-page view switching.
- **Mobile Drawer Support:** Responsive slide-in `Sheet` on mobile devices with reload and standalone browser tab pop-out.

### 4. 💬 Realtime Collaboration & Threads
- **Multi-Channel Feeds:** Dedicated channels for general discussion, hackathon coordination, ideas, and development.
- **Discussion Threads:** Inline thread replies rendered inside the right context panel.
- **Code Snippets:** Rich markdown rendering with language tags and copy-to-clipboard actions.

### 5. 🎯 Hackathon Sprint Lifecycle
- **5-Stage Workflow Board:**
  $$\text{DISCUSSING} \longrightarrow \text{PLANNING} \longrightarrow \text{DOING} \longrightarrow \text{REVIEWING} \longrightarrow \text{COMPLETED}$$
- **Idea Promotion Gate:** Curated proposals reviewed by leads before converting into active development projects.
- **Task Kanban:** Priority badges (`Critical`, `High`, `Medium`, `Low`), assignee avatars, and due dates.

### 6. 🤖 ForgeCopilot AI Assistant
- **Server-Side API Route:** `/api/ai/chat` powered by OpenRouter or Gemini with server-only key protection (`OPENROUTER_API_KEY`).
- **Context Injection:** Injects live desk metrics (active tasks, IA-1 subjects, team availability) without leaking private files or credentials.

---

## 📁 Repository Documentation Index

| Document | Purpose |
|---|---|
| [**PRD.md**](PRD.md) | Comprehensive Project Requirements Document (Personas, Requirements, Acceptance Criteria) |
| [**DESIGN.md**](DESIGN.md) | Design & UI/UX Specification (OKLCH Dark Mode Tokens, Tri-Pane Desk, Typography, Breakpoints) |
| [**ARCHITECTURE.md**](ARCHITECTURE.md) | System Architecture, ERD, Security Policies, Supabase RLS, and API Contracts |

---

## 🛠️ Project Structure

```text
team/
├── .agents/                        # Specialized agent skills (Supabase best practices, server SDK)
├── public/
│   ├── pdf.worker.min.mjs          # Mozilla PDF.js canvas worker
│   └── study-materials/ia-1-prep/  # Saptagiri NPS IA-1 verified syllabus PDFs
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── ai/chat/            # ForgeCopilot AI server route
│   │   │   └── study-materials/    # IA-1 document metadata & stream endpoints
│   │   ├── dashboard/              # Team Desk overview page
│   │   ├── desk/                   # Primary Tri-Pane Team Desk route
│   │   ├── globals.css             # OKLCH color engine and Tailwind CSS v4 tokens
│   │   └── layout.tsx              # Root Next.js layout with Sonner toaster
│   ├── components/
│   │   ├── desk/
│   │   │   ├── desk-shell.tsx      # Tri-pane layout coordinator
│   │   │   ├── desk-sidebar.tsx    # Left sidebar navigation
│   │   │   ├── desk-header.tsx     # Top action bar with search and panel toggles
│   │   │   ├── desk-right-panel.tsx# Context panel for events, polls, and threads
│   │   │   ├── study-room-view.tsx # IA-1 library with docked Shvasa sidecar
│   │   │   ├── pdf-js-viewer.tsx   # PDF.js canvas in-app viewer
│   │   │   └── ai-copilot-modal.tsx# ForgeCopilot floating modal
│   │   └── ui/                     # Accessible shadcn/ui primitives
│   ├── lib/
│   │   └── mock-data.ts            # Realistic, typed workspace seed models
│   ├── types/
│   │   └── desk.ts                 # TypeScript interfaces for desk entities
│   └── utils/
│       └── supabase/               # SSR server, client, and middleware helpers
├── ARCHITECTURE.md                 # System architecture & database specs
├── DESIGN.md                       # UI/UX & design system tokens
├── PRD.md                          # Project requirements document
└── README.md                       # Main GitHub documentation
```

---

## 🏁 Quickstart Guide

### Prerequisites
- **Node.js:** v18.17+ or v20+
- **Package Manager:** `npm` (v10+)
- **Git**

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/DevEagleEye97/Team-Bhairava-.git
   cd Team-Bhairava-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Provide your Supabase and OpenRouter credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   OPENROUTER_API_KEY=your-openrouter-key
   ```

4. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000/desk](http://localhost:3000/desk) to explore the interactive Team Desk.

5. **Run Quality Assurance Checks:**
   ```bash
   # Type check
   npx tsc --noEmit

   # Lint check
   npm run lint

   # Production bundle compilation
   npm run build
   ```

---

## 🔒 Security & Privacy

- **Row Level Security (RLS):** All Supabase database tables enforce strict workspace-level membership checks.
- **Private Storage:** University study PDFs and user avatars are stored in private buckets and accessed strictly via short-lived signed URLs.
- **Zero Secret Leakage:** Service-role keys and AI provider keys are restricted to server-only runtime contexts and never exposed to client bundles.

---

## 👥 Team Bhairava

Developed with ❤️ by **Team Bhairava** for **Saptagiri NPS University**.  
For inquiries, contributions, or feedback, submit an issue or pull request on [GitHub](https://github.com/DevEagleEye97/Team-Bhairava-.git).
