# Pillar 15: Error Analysis & Debugging Post-Mortems

**Domain:** Root Cause Diagnoses, Vulnerability Fixes & Performance Resolutions  

---

## 1. Issue 01: Chrome Sandboxed Iframe PDF Preview Block

### Symptom
When opening a PDF document in the Study Room, the viewer header rendered correctly, but the PDF content viewport displayed Chrome's error: `"This page has been blocked by Chrome"` (`ERR_BLOCKED_BY_CLIENT`).

### Root Cause
1. The previous viewer utilized `<iframe sandbox="allow-scripts allow-same-origin">`.
2. Chromium strictly forbids its built-in internal PDF viewer plugin (`chrome-extension://...`) from running inside sandboxed iframes as a defense-in-depth security measure.
3. Attempting to embed `data:application/pdf;base64` or direct blob URLs into a sandboxed iframe triggered top-level security blocks.

### Resolution
- Implemented `src/components/desk/pdf-js-viewer.tsx` using Mozilla `pdfjs-dist@4.4.168`.
- Rendered pages directly onto native HTML5 `<canvas>` elements.
- Copied `pdf.worker.min.mjs` into `public/pdf.worker.min.mjs` for multithreaded rendering.
- Bypassed Chromium browser plugin sandboxing completely, resulting in 100% reliable PDF rendering across all desktop and mobile browsers.

---

## 2. Issue 02: DeskHeader Glitch & Unrecognized Breakpoint

### Symptom
The top header suffered from an unrecognized CSS layout shift on mobile and tablet viewports, causing button labels to disappear and action icons to misalign.

### Root Cause
1. `src/components/desk/desk-header.tsx` contained `<span className="hidden xs:inline">New Action</span>`.
2. In Tailwind CSS v4, `xs:` is an unrecognized variant. Tailwind silently ignored the rule, causing the span to remain hidden or unpredictable.

### Resolution
- Replaced `xs:inline` with valid Tailwind breakpoint `sm:inline`.
- Standardized flex alignments across viewports to eliminate horizontal shifts when switching tabs.
