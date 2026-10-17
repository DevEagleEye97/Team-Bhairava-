# Pillar 13: System Integration & Component Wiring

**Domain:** Cross-Pane Coordination, Event Dispatching & View Routing  

---

## 1. Tri-Pane Desk Coordination

The central nervous system of HackForge lives in `src/components/desk/desk-shell.tsx`:

```text
[DeskHeader]  <--->  [DeskShell]  <--->  [DeskSidebar]
                          |
             +------------+------------+
             |                         |
     [Center Stage]            [Context Sidecar]
(Study Room / Projects)      (Shvasa / Threads)
```

- **Dynamic Sidecar Swap:** When `activeTab === "channel-study"`, `DeskShell` automatically swaps the default poll/event panel for the **Shvasa Pomodoro Focus OS** sidecar.
- **Header Synchronization:** The top header button dynamically displays "Hide Shvasa Focus Panel" when in the Study Room and toggles the sidecar without disturbing library state.
- **Thread Context Routing:** Clicking "Reply in Thread" in any discussion channel immediately opens the relevant thread panel in the right context pane.

---

## 2. In-App Canvas PDF Integration

- Clicking "View PDF" on any IA-1 document card mounts the `PdfJsViewer` component.
- The document binary is fetched via `/api/study-materials/[id]/view`.
- Fullscreen toggle expands the canvas over the entire viewport while retaining the close button to return to the desk immediately.
