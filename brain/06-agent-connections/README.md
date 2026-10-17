# Pillar 06: Agent Connections & Skills Architecture

**Domain:** Antigravity AI Customizations, Subagent Coordination & Prompt Engineering  

---

## 1. Installed Agent Skills
Located under `.agents/skills/`:

1. **`supabase` (`.agents/skills/supabase/SKILL.md`):**
   - Core knowledge for database interactions, RLS verification, client and SSR setup.
2. **`supabase-server` (`.agents/skills/supabase-server/SKILL.md`):**
   - Guides edge functions, `@supabase/server` token verification, and server routes.
3. **`supabase-postgres-best-practices` (`.agents/skills/supabase-postgres-best-practices/SKILL.md`):**
   - Best practices for composite indexes, foreign key coverage, locking prevention, and query tuning.

---

## 2. In-App Copilot Agent (ForgeCopilot)

- **Component:** `src/components/desk/ai-copilot-modal.tsx`
- **System Instructions:**
  - Speaks with concise, developer-conscious tone.
  - Represents the AI companion of **Team Bhairava** at **Saptagiri NPS University**.
  - Focuses on hackathon sprint organization and Semester 1 IA-1 preparation.
- **Trigger Actions:**
  - Floating launcher button (`bottom-6 right-6`).
  - Keyboard shortcut / Quick action integration.
  - Pre-canned prompts: "Summarize IA-1 Syllabus", "Triage Task Deadlines", "Help Organize Sprints".
