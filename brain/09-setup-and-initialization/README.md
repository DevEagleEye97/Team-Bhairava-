# Pillar 09: Setup & Initialization Guide

**Domain:** Environment Configuration, Dependencies & Development Scripts  

---

## 1. Quickstart Commands

```bash
# 1. Clone repository
git clone https://github.com/DevEagleEye97/Team-Bhairava-.git
cd Team-Bhairava-

# 2. Install dependencies (Node 18+ or 20+)
npm install

# 3. Setup environment variables
cp .env.example .env.local

# 4. Start local development server with Turbopack
npm run dev

# 5. Open browser
# Navigate to http://localhost:3000/desk
```

---

## 2. Environment Variables Matrix

| Variable | Scope | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Public / Client | Supabase Project URL (`https://xxx.supabase.co`) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public / Client | Anon publishable key with RLS enforcement |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only | Administrative key for background functions & storage |
| `SUPABASE_JWKS_URL` | Server-only | JSON Web Key Set URL for token verification |
| `OPENROUTER_API_KEY` | Server-only | API key for ForgeCopilot LLM integration |
| `GEMINI_API_KEY` | Server-only | Fallback Google Gemini API key |

---

## 3. Production Build Validation

```bash
# Run TypeScript compilation
npx tsc --noEmit

# Run ESLint verification
npm run lint

# Compile optimized production bundle
npm run build
```
