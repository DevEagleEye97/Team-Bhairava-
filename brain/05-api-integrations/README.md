# Pillar 05: API Integrations & Server Routes

**Domain:** REST API Endpoints, Document Streaming & AI Provider Integrations  

---

## 1. Study Materials API (`/api/study-materials`)

- **Method:** `GET`
- **Location:** `src/app/api/study-materials/route.ts`
- **Query Parameters:**
  - `semester` (optional, defaults to `Semester 1`)
  - `ia` (optional, defaults to `IA-1`)
  - `subject` (optional filter, e.g. `Problem Solving with C (PSC)`)
  - `q` (search string for titles, tags, and descriptions)
- **Response Format:**
  ```json
  {
    "data": [
      {
        "id": "mat-psc-ia1-qp",
        "title": "Problem Solving with C: IA-1 Question Paper",
        "subject": "Problem Solving with C (PSC)",
        "semester": "Semester 1",
        "ia": "IA-1",
        "fileSizeBytes": 987954,
        "pageCount": 4
      }
    ],
    "count": 1,
    "source": "supabase_postgresql | seed_fallback",
    "databaseStatus": "live_ready | table_pending_migration"
  }
  ```

---

## 2. In-App PDF Streamer & Authorizer (`/api/study-materials/[id]/view`)

- **Method:** `GET`
- **Location:** `src/app/api/study-materials/[id]/view/route.ts`
- **Parameters:**
  - `id` (Document ID in route URL)
  - `format` (Optional query param: `url` returns JSON signed URL; otherwise streams raw PDF binary)
- **Headers:**
  - `Content-Type: application/pdf`
  - `Content-Disposition: inline; filename="document.pdf"`
  - `Cache-Control: private, max-age=3600`

---

## 3. ForgeCopilot AI Chatbot API (`/api/ai/chat`)

- **Method:** `POST`
- **Location:** `src/app/api/ai/chat/route.ts`
- **Environment Key:** `OPENROUTER_API_KEY` (or `GEMINI_API_KEY`)
- **Payload:**
  ```json
  {
    "message": "Summarize upcoming IA-1 subjects and deadlines",
    "history": [
      { "role": "user", "content": "Hello" },
      { "role": "assistant", "content": "How can I help Team Bhairava today?" }
    ]
  }
  ```
- **Context Injection:** Injects live workspace metadata (active tasks, total IA-1 documents, team lead identity) into the system prompt securely on the server.
