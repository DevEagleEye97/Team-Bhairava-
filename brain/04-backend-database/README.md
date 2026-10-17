# Pillar 04: Backend & Database Architecture

**Domain:** PostgreSQL Relational Database, Schema Migrations & Supabase Configuration  
**Active Project ID:** `kbkasggnwispxwbafkpw`  

---

## 1. Database Overview & Connection
HackForge uses Supabase PostgreSQL for persistent team collaboration. Access is managed through client and server helpers with connection pooling and SSL encryption.

- **Supabase URL:** Configured in `.env.local` via `NEXT_PUBLIC_SUPABASE_URL`.
- **Anon Publishable Key:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` for client-side queries verified by Row Level Security.
- **Service Role Key:** `SUPABASE_SERVICE_ROLE_KEY` (strictly server-side, for maintenance and administrative migrations).

---

## 2. Table Schemas & Foreign Key Relationships

### `workspaces`
- `id` (text, primary key) — e.g. `ws-bhairava`
- `name` (text) — `Team Bhairava`
- `institution` (text) — `Saptagiri NPS University`
- `academic_context` (text) — `CSE General, Semester 1, P-Cycle, IA-1`
- `created_at` (timestamptz)

### `profiles`
- `id` (uuid, primary key, references `auth.users`)
- `full_name` (text)
- `avatar_url` (text)
- `role` (text) — `Lead`, `Full-Stack`, `Frontend`, `Contributor`
- `status` (text) — `online`, `in_flow`, `offline`
- `updated_at` (timestamptz)

### `study_materials`
- `id` (text, primary key)
- `workspace_id` (text, references `workspaces.id`)
- `title` (text)
- `subject` (text) — `Problem Solving with C (PSC)`, `Engineering Mathematics (MAT)`, etc.
- `semester` (text) — `Semester 1`
- `ia` (text) — `IA-1` (strictly enforced)
- `storage_path` (text) — Path in private Supabase Storage bucket `study-materials`
- `file_size_bytes` (bigint)
- `file_type` (text) — `application/pdf`
- `page_count` (int)
- `uploaded_by` (uuid, references `profiles.id`)
- `created_at` (timestamptz)

### `channels` & `messages`
- Multi-tenant messaging with `workspace_id`, channel slugs, and realtime subscriptions.

---

## 3. Storage Bucket Configuration
- **`study-materials`**: Private storage bucket. Public access disabled. Download and view operations require short-lived signed URLs.
- **`avatars`**: Profile photos bucket with 2MB upload limit and image MIME-type validation.
