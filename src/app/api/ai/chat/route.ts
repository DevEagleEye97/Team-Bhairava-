import { NextResponse } from "next/server"
import { deskProjects, deskEvents, teamMembers } from "@/lib/mock-data"

// Token-sparse keywords to identify engineering and academic coursework domains
const ENGINEERING_KEYWORDS = [
  "code", "program", "function", "algorithm", "data structure", "c", "python", "javascript",
  "typescript", "sql", "postgres", "database", "api", "backend", "frontend", "react", "next",
  "memory", "pointer", "array", "recursion", "loop", "variable", "compiler", "bitwise",
  "math", "calculus", "taylor", "jacobian", "matrix", "derivative", "integral", "differential",
  "physics", "quantum", "wave", "schrodinger", "optics", "energy", "electron", "mechanics",
  "electrical", "circuit", "kvl", "kcl", "mesh", "nodal", "current", "voltage", "resistance",
  "ia-1", "ia1", "exam", "syllabus", "psc", "design thinking", "ipr", "sprint", "task",
  "architecture", "git", "docker", "network", "performance", "complexity", "big o",
  "bug", "error", "debug", "deploy", "server", "desk", "overview", "status", "deadline"
]

function isEngineeringQuery(query: string): boolean {
  const lower = query.toLowerCase()
  return ENGINEERING_KEYWORDS.some((kw) => lower.includes(kw))
}

export async function POST(request: Request) {
  try {
    const { message, history } = await request.json()

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const trimmedMsg = message.trim()
    const lower = trimmedMsg.toLowerCase()

    // 1. Guardrail: Strictly restrict to engineering & technical coursework
    // Reject out-of-the-box non-engineering queries immediately with minimal tokens
    const isEng = isEngineeringQuery(lower)
    const isDeskCheck = lower.includes("summary") || lower.includes("overview") || lower.includes("task") || lower.includes("sprint")

    if (!isEng && !isDeskCheck) {
      return NextResponse.json({
        reply: "I strictly answer engineering and technical coursework questions. Please ask an engineering-related question.",
        provider: "engineering_guardrail",
        tokensUsed: 18,
      })
    }

    const geminiKey = process.env.GEMINI_API_KEY
    const model = process.env.AI_MODEL || "gemini-2.0-flash"

    // 2. Token-Minimized Compressed Desk Context (~90 tokens instead of full multi-KB JSON)
    const activeTasksCount = deskProjects.flatMap((p) => p.tasks).filter((t) => t.status !== "done").length
    const onlineDevs = teamMembers.filter((m) => m.status === "online" || m.status === "in_flow").map((m) => m.name).slice(0, 4).join(", ")
    const nextDeadline = deskEvents[0] ? `${deskEvents[0].title} (${deskEvents[0].deadline})` : "None"
    const compactContext = `Desk: Team Bhairava (Saptagiri NPS Univ). Active sprint: 75% complete, ${activeTasksCount} open tasks. Online devs: ${onlineDevs}. Next deadline: ${nextDeadline}. 17 verified IA-1 docs: PSC, Math (Calculus), Physics (Quantum), BEE (Circuits), DTI.`

    // 3. Live Gemini Call (Strictly token-budgeted)
    if (geminiKey && geminiKey.trim().length > 10) {
      try {
        // Ultra-dense system prompt: strictly engineering, minimal tokens, NO out-of-the-box follow-up questions
        const systemInstruction = `You are ForgeCopilot, an engineering AI assistant for Team Bhairava.
RULES:
1. DOMAIN: Strictly answer ONLY engineering, software engineering, programming (C, TS, Python, SQL), algorithms, mathematics, physics, and IA-1 coursework.
2. REJECT NON-ENGINEERING: If a question is not engineering, reply only: "I strictly answer engineering and technical coursework questions. Please ask an engineering-related question."
3. TOKEN EFFICIENCY: Be extremely concise and dense. Answer in 2-4 sentences or concise code snippets. Do NOT include greetings, preamble, conversational fluff, or filler.
4. NO FOLLOW-UP QUESTIONS: Do NOT ask out-of-the-box follow-up questions (e.g., do not ask "Would you like...", "How can I help further?"). Deliver the factual technical answer and stop.
Context: ${compactContext}`

        // Token optimization: only pass the last 3 turns of history to prevent token bloat
        const trimmedHistory = (history || [])
          .slice(-3)
          .map((h: { role: string; content: string }) => ({
            role: h.role === "assistant" ? "model" : "user",
            parts: [{ text: h.content.slice(0, 300) }], // limit past messages to 300 chars
          }))

        const contents = [
          ...trimmedHistory,
          { role: "user", parts: [{ text: trimmedMsg }] },
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
                temperature: 0.2, // low temperature for deterministic, direct answers
                maxOutputTokens: 250, // token budget capped at 250 tokens
              },
            }),
          }
        )

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json()
          const reply = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim()
          if (reply) {
            return NextResponse.json({
              reply,
              provider: "gemini",
              model,
              tokenBudget: 250,
            })
          }
        }
      } catch (geminiError) {
        console.warn("Gemini API call failed, falling back to local engineering engine:", geminiError)
      }
    }

    // 4. Local Deterministic Engineering Engine (Token-Dense & No Conversational Questions)
    let reply = ""

    if (lower.includes("psc") || lower.includes("c language") || lower.includes("pointer") || lower.includes("recursion")) {
      reply = `**Problem Solving with C (IA-1 Focus):**
- **Pointers & Memory:** Pointers store memory addresses (\`int *p = &var;\`). Dereferencing (\`*p\`) reads the value. Dynamic memory requires \`malloc()\` / \`free()\`.
- **Recursion:** Function calling itself with a base terminating condition and recursive step (e.g., factorial, binary search).
- **IA-1 Coverage:** Modules 1 & 2 covering Operators, Control Flow, Arrays, Strings, and Function Prototypes.`
    } else if (lower.includes("math") || lower.includes("calculus") || lower.includes("taylor") || lower.includes("jacobian")) {
      reply = `**Engineering Mathematics (IA-1 Focus):**
- **Taylor Series:** $f(x) = \\sum_{n=0}^{\\infty} \\frac{f^{(n)}(a)}{n!}(x-a)^n$. Expands smooth functions around a point $a$.
- **Jacobians:** Determinant of the partial derivatives matrix $J = \\frac{\\partial(u,v)}{\\partial(x,y)}$, used for coordinate transformations and variable changes in multiple integrals.`
    } else if (lower.includes("physics") || lower.includes("quantum") || lower.includes("wave")) {
      reply = `**Engineering Physics (IA-1 Focus):**
- **Wave-Particle Duality:** De Broglie wavelength $\\lambda = \\frac{h}{p} = \\frac{h}{mv}$.
- **Schrödinger Equation:** Time-independent form: $-\\frac{\\hbar^2}{2m}\\nabla^2\\psi + V\\psi = E\\psi$, describing quantum state probabilities in potential wells.`
    } else if (lower.includes("bee") || lower.includes("circuit") || lower.includes("kvl") || lower.includes("kcl")) {
      reply = `**Basic Electrical Engineering (IA-1 Focus):**
- **KCL (Kirchhoff's Current Law):** $\\sum I_{in} = \\sum I_{out}$ at any junction (charge conservation).
- **KVL (Kirchhoff's Voltage Law):** $\\sum V = 0$ around any closed loop (energy conservation). Use mesh analysis for planar circuits.`
    } else if (lower.includes("summary") || lower.includes("overview") || lower.includes("status")) {
      reply = `**Team Bhairava Sprint Status:**
- **Velocity:** Sprint 01 is 75% complete with 5 active developers.
- **Top Task:** Postgres index tuning and Realtime WebSocket channel sync.
- **Academic Vault:** 17 verified IA-1 documents across PSC, Math, Physics, BEE, and DTI.`
    } else if (lower.includes("task") || lower.includes("priorit") || lower.includes("todo")) {
      reply = `**Engineering Priority Matrix:**
1. **Critical:** Postgres EXPLAIN plan index tuning & Supabase RLS policies.
2. **High:** Mobile responsive drawer & viewport layout guard.
3. **Normal:** IA-1 question paper bank review & canvas PDF streaming.`
    } else {
      reply = `**ForgeCopilot Engineering Engine:**
Technical domain confirmed. For technical solutions, specify the algorithm, language, or IA-1 syllabus topic (C programming, Taylor series, Quantum mechanics, or Supabase architecture).`
    }

    return NextResponse.json({
      reply,
      provider: "engineering_engine",
      tokenBudget: 250,
    })
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : "Internal error"
    return NextResponse.json({ error: errorMsg }, { status: 500 })
  }
}
