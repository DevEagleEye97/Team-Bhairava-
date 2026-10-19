-- Migration: 20261018000001_create_access_requests.sql
-- Description: Create access_requests table for invite-only authentication and admin review

CREATE TABLE IF NOT EXISTS public.access_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email_normalized text NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'invite_sent', 'accepted')),
  created_at timestamptz NOT NULL DEFAULT now(),
  reviewed_at timestamptz,
  reviewed_by uuid REFERENCES auth.users(id),
  invitation_sent_at timestamptz,
  last_error text
);

-- Partial unique index: prevent duplicate pending requests for the same email
CREATE UNIQUE INDEX IF NOT EXISTS idx_access_requests_pending_email 
ON public.access_requests (email_normalized) 
WHERE status = 'pending';

-- Index for admin dashboard chronological sorting
CREATE INDEX IF NOT EXISTS idx_access_requests_status_created 
ON public.access_requests (status, created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.access_requests ENABLE ROW LEVEL SECURITY;

-- Policy 1: Anonymous and authenticated users can insert pending requests with valid data
CREATE POLICY "Allow public submission of pending invitation requests"
ON public.access_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (
  status = 'pending' 
  AND full_name IS NOT NULL 
  AND length(trim(full_name)) >= 2 
  AND email_normalized IS NOT NULL 
  AND email_normalized = lower(trim(email_normalized))
);

-- Policy 2: Only authorized administrators can view and review access requests
CREATE POLICY "Allow authorized administrators to view and review access requests"
ON public.access_requests
FOR ALL
TO authenticated
USING (
  (select auth.jwt() ->> 'email') = 'om@saptagirinps.edu.in'
  OR (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
)
WITH CHECK (
  (select auth.jwt() ->> 'email') = 'om@saptagirinps.edu.in'
  OR (select auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

-- Grant appropriate permissions
GRANT SELECT, INSERT, UPDATE ON public.access_requests TO anon, authenticated;
