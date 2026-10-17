# HackForge — Design & UI/UX Specification

**Design System:** ForgeDesk Dark  
**Primary Aesthetic:** Dark Developer-Workspace • Clean OKLCH Color Engine • Purple & Indigo Accents  
**Target Viewports:** 390px (Mobile) • 768px (Tablet) • 1280px (Laptop) • 1920px+ (Desktop)  

---

## 1. Design Philosophy

HackForge delivers a calm, high-density, distraction-free environment tailored for engineering hackathon teams and computer science students. The interface prioritizes content clarity, fast scanning, and ergonomics over gratuitous decoration.

1. **Layered Surfaces & Depth:** Dark background surfaces (`oklch(0.14 0.01 285)`) layered with translucent cards, subtle 1px border strokes (`border-border`), and restrained backdrops.
2. **Intentional Accents:** Deep violet/indigo accents (`oklch(0.62 0.22 285)`) for primary focus states, paired with emerald (`oklch(0.68 0.18 150)`) for live presence and amber (`oklch(0.75 0.18 65)`) for sprint deadlines.
3. **Ergonomic Tri-Pane Architecture:** Sidebar (navigation) | Center Stage (work area) | Context Panel (sidecar/threads/tools).
4. **Touch & Keyboard Parity:** Minimum 44px tap targets on mobile, full keyboard navigation, and explicit accessible labels.

---

## 2. Color Palette & Design Tokens

Configured via Tailwind CSS v4 and CSS variables in `src/app/globals.css`:

```css
:root {
  --background: oklch(0.14 0.01 285);
  --foreground: oklch(0.98 0.005 285);
  --card: oklch(0.17 0.012 285);
  --card-foreground: oklch(0.98 0.005 285);
  --popover: oklch(0.16 0.012 285);
  --popover-foreground: oklch(0.98 0.005 285);
  --primary: oklch(0.62 0.22 285);
  --primary-foreground: oklch(0.98 0.005 285);
  --secondary: oklch(0.22 0.015 285);
  --secondary-foreground: oklch(0.92 0.01 285);
  --muted: oklch(0.22 0.012 285);
  --muted-foreground: oklch(0.70 0.02 285);
  --accent: oklch(0.24 0.02 285);
  --accent-foreground: oklch(0.98 0.005 285);
  --destructive: oklch(0.60 0.22 25);
  --destructive-foreground: oklch(0.98 0.005 285);
  --border: oklch(0.26 0.015 285);
  --input: oklch(0.26 0.015 285);
  --ring: oklch(0.62 0.22 285);
  --sidebar: oklch(0.13 0.01 285);
}
```

---

## 3. Layout Architecture: Tri-Pane Workspace

```
+-------------------------------------------------------------------------------------------------------+
| DeskHeader: Workspace Name [Team Bhairava] | Search | Team Avatars | Quick Action | Panel Toggles    |
+-------------------+-----------------------------------------------------------+-----------------------+
|                   | Center Stage (Fluid flex-1 min-w-0):                      | Right Context Panel:  |
| DeskSidebar       | - Dashboard Overview                                      | (320px - 440px)       |
| (260px Fixed)     | - Study Room (Semester 1 IA-1 Document Library)           | - Shvasa Focus OS     |
|                   | - Ideas & Discussions Channel Feed                        | - Thread Discussions  |
| - Navigation Tabs | - Hackathon Sprints Board                                 | - Community Polls     |
| - Channel List    | - Events & Competitions                                   | - Upcoming Deadlines  |
| - Desk Presence   | - Knowledge Base                                          |                       |
+-------------------+-----------------------------------------------------------+-----------------------+
| Floating AI Copilot Launcher: [Ask Copilot ✦]                                                         |
+-------------------------------------------------------------------------------------------------------+
```

### Responsive Breakpoints
- **Desktop ($\ge$ 1024px):** All three panes persistent or toggleable. Side panels dock cleanly side-by-side with zero horizontal scroll.
- **Tablet (768px – 1023px):** Left sidebar collapses to a slide-in drawer (`Sheet`). Center stage gains fluid priority. Right context panel toggleable via top-bar action.
- **Mobile (< 768px):** Single-pane layout. Navigation and secondary tools (like the Shvasa Pomodoro sidecar) slide in smoothly via right and left `Sheet` overlays.

---

## 4. Typography Scale

- **Display / Headers:** `font-heading` (sans-serif with crisp geometric terminals, -0.02em letter spacing).
  - Desk View Titles: `text-xl md:text-2xl font-bold`
  - Section Headers: `text-sm md:text-base font-semibold`
  - Card Titles: `text-xs md:text-sm font-semibold leading-snug`
- **Body & Metadata:** `font-sans`
  - Standard Body: `text-xs md:text-sm text-foreground/90`
  - Secondary Metadata: `text-[11px] text-muted-foreground`
  - Badges & Micro-tags: `text-[9px] md:text-[10px] font-mono tracking-wider uppercase`
- **Code Snippets:** `font-mono` with subtle syntax highlight backgrounds (`bg-muted/40 p-2 rounded`).

---

## 5. Key View UI/UX Patterns

### 5.1. Study Room & Shvasa Sidecar
- **Persistent Library:** Filter pills for subjects (All, PSC, MAT, PHY, BEE, DTI). Cards display PDF file size, module badges, and an eye icon for instantaneous preview.
- **Sidecar Focus Panel:** Docked on the right (`w-[390px]` to `w-[480px]`). Houses an embedded iframe to [Shvasa](https://shvasa.lovable.app/) with reload and pop-out controls.
- **No Full-Page Toggling:** Studying notes and running Pomodoro focus cycles happen concurrently in the same viewport.

### 5.2. PDF.js Canvas Modal Viewer
- **Canvas Rendering:** HTML5 `<canvas>` elements avoid browser plugin and iframe blocking.
- **Header Overlay:** Title, subject, IA badge, page pagination (`Page X of Y`), zoom controls (`-`, `+`, `Reset`), rotation (`90°`), and fullscreen expansion.

### 5.3. Hackathon Lifecycle Board
- Columns styled with status indicator dots:
  - `DISCUSSING` (Purple)
  - `PLANNING` (Sky)
  - `DOING` (Amber)
  - `REVIEWING` (Indigo)
  - `COMPLETED` (Emerald)

---

## 6. Accessibility & Motion Guidelines

- **Contrast:** Text colors maintain at least 4.5:1 contrast against dark card backgrounds.
- **Focus Rings:** Explicit outline indicators on all interactive inputs and buttons (`ring-ring ring-offset-background`).
- **Motion Restraint:** Micro-animations (pulse badges, sheet slides) are bounded to $\le 200\text{ms}$ with `prefers-reduced-motion: reduce` fallback.
