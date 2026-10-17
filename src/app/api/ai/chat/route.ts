import { NextResponse } from "next/server"
import { deskProjects, deskEvents, deskStudyMaterials, teamMembers, deskPolls } from "@/lib/mock-data"

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const geminiKey = process.env.GEMINI_API_KEY
    const model = process.env.AI_MODEL || "gemini-2.0-flash"

    // Contextual system prompt about HackForge state
    const deskContext = {
      workspace: "HackForge Team Desk",
      onlineMembers: teamMembers.filter((m) => m.status === "online" || m.status === "in_flow").map((m) => `${m.name} (${m.role}): ${m.currentStatusText || "Active"}`),
      upcomingDeadlines: deskEvents.map((e) => `${e.title} [${e.type}] - Deadline: ${e.deadline}`),
      projects: deskProjects.map((p) => `${p.name} (${p.status}, ${p.progressPercent}% complete) with ${p.tasks.length} sprint tasks`),
      tasks: deskProjects.flatMap((p) => p.tasks).map((t) => `${t.title} [${t.priority.toUpperCase()}] - ${t.status} (Assignee: ${t.assignee.name})`),
      activePoll: `${deskPolls[0]?.question} (Total votes: ${deskPolls[0]?.totalVotes})`,
      studyMaterialsCount: deskStudyMaterials.length,
      ia1Subjects: Array.from(new Set(deskStudyMaterials.filter((m) => m.ia === "IA-1").map((m) => m.subject))),
    }

    // If a Google Gemini API Key is configured, query the live Gemini API
    if (geminiKey && geminiKey.trim().length > 10) {
      try {
        const systemInstruction = `You are ForgeCopilot, an intelligent AI collaborator embedded in the HackForge Digital Team Desk.
You assist developers, student teams, and hackathon squads by:
1. Providing executive summary overviews of active sprints, deadlines, channels, and study materials.
2. Helping organize the dashboard by highlighting critical path tasks, upcoming deadlines, and focus areas.
3. Answering questions about the current desk state accurately using the provided workspace context:
${JSON.stringify(deskContext, null, 2)}
Keep your responses concise, highly structured (using Markdown lists and bold text), and actionable.`

        const contents = [
          ...(history || []).map((h: { role: string; content: string }) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content }],
          })),
          { role: "user", parts: [{ text: message }] },
        ]

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: systemInstruction }] },
              contents,
              generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 1000,
              },
            }),
          }
        )

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json()
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text
          if (reply) {
            return NextResponse.json({
              reply,
              provider: "gemini",
              model,
            })
          }
        }
      } catch (geminiError) {
        console.warn("Live Gemini API call failed, falling back to local desk intelligence:", geminiError)
      }
    }

    // Contextual intelligent desk response engine (works 100% without external API key)
    const lower = message.toLowerCase()
    let reply = ""

    if (lower.includes("summary") || lower.includes("overview") || lower.includes("status")) {
      reply = `### 📊 HackForge Team Desk Executive Summary

**Workspace Activity:**
- **5 active teammates** currently collaborating on the desk (Alex, Priya, Marcus, Elena, Karan).
- **Core Sprint 01:** 75% complete on *HackForge Digital Desk*.

**Key Deadlines & Hackathons:**
- 🚨 **HackGlobal 2026: Edge Computing Edition:** Registration closes **Oct 22, 2026** ($25,000 Prize Pool).
- 🛠️ **Supabase RLS & High-Throughput Postgres Workshop:** Live on **Oct 20, 2026**.

**Academic Study Repository:**
- **${deskStudyMaterials.length} verified study documents** loaded in the Study Room across ${deskContext.ia1Subjects.join(", ")}.

**Active Pulse:**
- Active Poll: *"${deskPolls[0]?.question}"* (${deskPolls[0]?.totalVotes} votes cast).`
    } else if (lower.includes("organize") || lower.includes("priorit") || lower.includes("task") || lower.includes("todo")) {
      reply = `### 🎯 Dashboard Organization & Priority Matrix

Here is how I recommend organizing your sprint focus for today:

1. **🔴 Urgent / High Priority (Blockers):**
   - **Postgres EXPLAIN plan & index tuning** (Assigned to *Marcus Thorne* - Review status).
   - **Supabase Realtime viewport channel binding** (Assigned to *Alex Vance* - In Progress).

2. **🟡 In Progress (Core Deliverables):**
   - **Mobile responsive navigation sheet & overflow guard** (Assigned to *Karan Patel*).
   - **Context Desk right-panel poll voting** (Assigned to *Priya Sharma*).

3. **🟢 Ready for Next Cycle:**
   - **HackMIT pitch problem statement selection** (Assigned to *David Chen*).

💡 *Action Tip: You can jump directly to the **Projects & Tasks** board or toggle the Right Context Desk to clear the review queue.*`
    } else if (lower.includes("study") || lower.includes("ia") || lower.includes("pdf") || lower.includes("exam")) {
      reply = `### 📚 Study Room & IA-1 Preparation Hub

We have **17 verified documents** loaded from the IA-1 preparation repository:

- **Problem Solving with C (PSC):** IA-1 Question Paper, Module 1 & 2 Lecture Notes, Module 1 & 2 Question Banks, and Revision Guide.
- **Engineering Mathematics:** IA-1 Question Paper and Modules 1 & 2 Question Bank (Calculus, Taylor Series, Jacobians).
- **Engineering Physics:** Module 1 Quantum Mechanics Notes, Course 25BEPHY106 & 25BEPHY105 Notes, Modules 1 & 2 Question Bank.
- **Basic Electrical Engineering:** IA-1 Question Paper (DC Circuits, KVL/KCL, Mesh/Nodal analysis).
- **Design Thinking & IPR:** IA-1 Preparation Guide & IPR Question Bank.
- **Comprehensive Previous Years:** 2 Volumes of consolidated IA-1 examination papers.

📖 *All documents can be viewed in-app via the new Canvas-rendered PDF.js viewer with zero browser plugin blocks!*`
    } else {
      reply = `Hello! I am **ForgeCopilot**, your digital desk assistant.

I can help you:
- **Summarize Desk Overview:** Get an instant high-level briefing on active team tasks, online members, and hackathon deadlines.
- **Organize Dashboard:** Recommend sprint task prioritizations, highlight review bottlenecks, and track deadlines.
- **Study Room Navigation:** Explore the 17 IA-1 course question banks, lecture notes, and formula sheets.

*How can I help organize your workspace today?*`
    }

    return NextResponse.json({
      reply,
      provider: "desk_intelligence",
      configuredWithGeminiKey: Boolean(geminiKey && geminiKey.trim().length > 10),
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Unknown error processing AI chat"
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
