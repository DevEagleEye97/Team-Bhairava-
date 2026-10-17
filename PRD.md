# HackForge — Project Requirements Document (PRD)

**Product Name:** HackForge  
**Active Team Workspace:** Team Bhairava  
**Institution:** Saptagiri NPS University  
**Academic Context:** CSE General, Semester 1, P-Cycle, IA-1  
**Version:** 2.0.0  
**Status:** In Active Development / Production Upgrade  

---

## 1. Executive Summary & Vision

**HackForge** is an integrated, developer-first collaboration workspace and academic desk designed for high-performance student hackathon teams and engineering cohorts. Rooted at **Saptagiri NPS University**, HackForge bridges the divide between real-time team hacking operations (project planning, task kanbans, discussion channels, tech event discovery) and disciplined academic excellence (verified Semester 1 IA-1 preparation repositories and silent Pomodoro co-working).

---

## 2. Target Audience & Personas

| Persona | Role | Core Goals | Pain Points Resolved |
|---|---|---|---|
| **Om / Team Lead** | Engineering Lead & Hackathon Captain | Coordinate project sprints, assign task deadlines, manage ideas lifecycle (`DISCUSSING` $\to$ `COMPLETED`). | Eliminates fragmented communication across WhatsApp, Discord, and Google Drive. |
| **Academic Peer / Student** | 1st Sem CSE General Student (P-Cycle) | Access verified IA-1 study notes, past papers, and question banks with zero syllabus noise. | Stops clutter from irrelevant semesters, unverified notes, or broken PDF links. |
| **Sprint Developer** | Frontend / Full-Stack Contributor | Work in synchronized focus sprints with integrated Pomodoro and breathwork. | Combats burnout and context switching using embedded [Shvasa OS](https://shvasa.lovable.app/). |
| **Workspace Admin** | Academic & Desk Custodian | Manage access, verify syllabus uploads, approve project promotions. | Database-enforced Row Level Security (RLS) protects internal university assets. |

---

## 3. Core Functional Requirements

### 3.1. Team Desk Overview
- **Dynamic Welcome & Header:** Personalized greeting referencing the authenticated user's profile (`Welcome, Om`) and dynamic workspace identifier (`Team Bhairava`).
- **Overview Metrics:** Data-backed cards for active milestones, assigned deadlines, team activity feed, and live presence indicators.
- **Empty States:** Meaningful fallback UI for zero-data states without simulated or invented records.

### 3.2. Study Room (Semester 1, P-Cycle, IA-1 Exclusive)
- **Strict Academic Scoping:** Exclusively queries and surfaces verified Semester 1, P-Cycle, IA-1 materials. Excludes IA-2, IA-3, and semester-end examinations until future assessment cycles.
- **Subject Grouping:** Dynamic organization across core subjects:
  - Problem Solving with C (PSC)
  - Engineering Mathematics (MAT)
  - Engineering Physics (PHY)
  - Basic Electrical Engineering (BEE)
  - Design Thinking & IPR (DTI)
  - Previous Years Question Papers
- **In-App PDF Canvas Viewer:** Powered by Mozilla PDF.js canvas rendering (`PdfJsViewer`). Supports zoom, page navigation, fullscreen, and rotation, bypassing Chromium sandboxed iframe blocks.
- **Secure File Stream:** Document access routed via short-lived signed URLs or server-authorized streams (`/api/study-materials/[id]/view`).

### 3.3. Focus Zone & Pomodoro OS (Shvasa Integration)
- **Side-Docked Co-Working:** Seamlessly embeds [Shvasa OS](https://shvasa.lovable.app/) into a dedicated right-hand side panel (`390px` to `480px`).
- **No View Toggling:** Preserves 100% library visibility while running breathwork, focus sprints, or 50-minute synchronized study blocks.
- **Responsive Drawer:** Slide-in `Sheet` on mobile and tablet displays (`<1024px`) with quick reload, pop-out external link, and collapse controls.

### 3.4. Ideas & Discussions (Realtime Collaboration)
- **Persisted Channels:** Multi-channel messaging (`#general`, `#hackathon-team`, `#ideas-discussions`, `#study-room`, `#development`, `#events-opportunities`).
- **Supabase Realtime:** Immediate message delivery, message reactions, optimistic UI updates, and code block formatting.
- **Thread Context Panel:** Thread replies rendered inside the right context panel.

### 3.5. Hackathon Team & Project Lifecycle
- **Five-Stage Workflow Board:**
  $$\text{DISCUSSING} \longrightarrow \text{PLANNING} \longrightarrow \text{DOING} \longrightarrow \text{REVIEWING} \longrightarrow \text{COMPLETED}$$
- **Idea Promotion Gate:** Proposals require team lead review before promotion into active projects.
- **Task Kanban:** Supports assignee avatars, priority badges (`Critical`, `High`, `Medium`, `Low`), due dates, and tags.

### 3.6. Events & Opportunities
- **Curated Hackathons & Grants:** Distinguishes verified external opportunities from internal demo items.
- **Direct Registration:** External link outs, countdown badges (`closing_soon`, `open`, `ended`), and prize pool trackers.

### 3.7. AI Copilot (ForgeCopilot)
- **Server-Side API Route:** `/api/ai/chat` proxy with server-only API keys (`OPENROUTER_API_KEY` or `GEMINI_API_KEY`).
- **Local Context Awareness:** Injects live workspace stats (tasks, IA-1 subjects, active members) without leaking private documents or user secrets.

---

## 4. Non-Functional Requirements

- **Performance:** Sub-100ms client tab switching; sub-1.5s PDF first-page canvas render.
- **Security:** Private Supabase Storage buckets, Row Level Security (RLS) on all PostgreSQL tables, zero client bundle secret exposure.
- **Reliability:** Offline-conscious seed fallbacks ensuring 100% desk usability during backend maintenance.
- **Responsive Design:** Fluid layout across small mobile devices (390px), tablets (768px), laptops (1280px), and ultrawide monitors (1920px+).
- **Accessibility:** WCAG AA contrast compliance in OKLCH dark mode, ARIA labels on icon buttons, keyboard shortcuts, and reduced-motion support.

---

## 5. Success Metrics & Acceptance Criteria

1. **PDF Rendering:** 0% `ERR_BLOCKED_BY_CLIENT` or Chrome sandbox errors across all 17 IA-1 documents.
2. **Focus Co-Working:** Shvasa OS embeds without breaking library search, filters, or active study state.
3. **Build & Quality:** 0 TypeScript compile errors (`npx tsc --noEmit`), 0 ESLint warnings (`npm run lint`), successful static and dynamic compilation (`npm run build`).
4. **Workspace Personalization:** Authenticated student name and team workspace dynamically reflected in all desk views.
