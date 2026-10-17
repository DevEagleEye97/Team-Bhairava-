# Pillar 11: Security & Authentication Layer

**Domain:** Supabase Auth SSR, Row Level Security (RLS) & Storage Access Control  

---

## 1. Authentication Lifecycle & SSR Sessions

- **Middleware:** `src/middleware.ts` routes incoming requests through `updateSession` in `src/utils/supabase/middleware.ts`.
- **Session Refresh:** Refreshes Auth tokens via server-side cookies before passing to Server Components.
- **Client Access:** Initialized with `@supabase/ssr` `createBrowserClient` with public publishable keys.

---

## 2. Row Level Security (RLS) Policies

All tables in the public PostgreSQL schema enforce Row Level Security:

```sql
-- Workspace Membership Isolation
CREATE POLICY "Members can view workspace records"
ON public.workspaces
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.workspace_members
    WHERE workspace_id = workspaces.id
  )
);

-- Study Materials Read Policy
CREATE POLICY "Members can view verified study materials"
ON public.study_materials
FOR SELECT
USING (
  auth.uid() IN (
    SELECT user_id FROM public.workspace_members
    WHERE workspace_id = study_materials.workspace_id
  )
);
```

---

## 3. Storage Bucket Security & Signed URLs

- **Private Bucket:** `study-materials` bucket is marked `public = false`.
- **Short-Lived Signed URLs:** Direct access requires temporary tokens generated via `supabase.storage.from('study-materials').createSignedUrl(path, 900)`.
- **Stream Fallback:** Server endpoint `/api/study-materials/[id]/view` verifies user workspace access before piping document binaries directly to the client canvas viewer.
