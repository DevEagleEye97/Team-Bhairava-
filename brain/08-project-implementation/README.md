# Pillar 08: Project Implementation Architecture

**Domain:** Codebase Topology, Component Tree & App Router Structure  

---

## 1. Application Layout & Component Tree

```text
src/
├── app/
│   ├── layout.tsx                # Root HTML shell, Geist fonts, Toaster
│   ├── page.tsx                  # Marketing / landing gateway
│   ├── desk/page.tsx             # Primary Team Desk entry point
│   ├── dashboard/page.tsx        # Overview dashboard route
│   ├── todos/page.tsx            # Personal todo tracker
│   └── globals.css               # OKLCH tokens, dark theme variables
└── components/
    ├── desk/
    │   ├── desk-shell.tsx        # Tri-pane coordinator & state holder
    │   ├── desk-sidebar.tsx      # Left navigation (channels, presence)
    │   ├── desk-header.tsx       # Action bar (search, avatars, toggles)
    │   ├── desk-right-panel.tsx  # Context panel (events, polls, threads)
    │   ├── dashboard-view.tsx    # Overview metrics & quick access
    │   ├── study-room-view.tsx   # IA-1 document library & Shvasa sidecar
    │   ├── conversation-view.tsx # Channel chat feeds & code snippet blocks
    │   ├── projects-view.tsx     # 5-stage hackathon sprint board
    │   ├── events-view.tsx       # Curated tech hackathons & workshops
    │   ├── knowledge-view.tsx    # Architecture & tech stack documents
    │   ├── pdf-js-viewer.tsx     # Mozilla PDF.js canvas renderer
    │   ├── quick-action-modal.tsx# Modal for fast creation of tasks/events
    │   └── ai-copilot-modal.tsx  # Floating ForgeCopilot assistant
    └── ui/                       # Reusable shadcn/ui primitives
```

---

## 2. State Management Strategy

1. **Active Tab Navigation:** Controlled in `DeskShell` using `NavigationTab = "dashboard" | "events" | "projects" | "knowledge" | "channel-study" | ...`.
2. **Context Panel State:** Shared via `isRightPanelOpen` toggle. When in Study Room, the right context slot automatically adapts to house the **Shvasa Pomodoro Focus OS**.
3. **Optimistic Updates:** Immediate UI reaction for channel messages, poll votes, and task status changes before server roundtrips.
