-- =========================================================================
-- JOBFLOW AI - SUPABASE SCHEMA V2 (CANDIDATE PROFILES, RESUMES & BYO APIS)
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New Query)
-- =========================================================================

-- 1. Resumes Management Table
CREATE TABLE IF NOT EXISTS public.resumes (
  id TEXT PRIMARY KEY DEFAULT ('res-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size_kb INT DEFAULT 0,
  is_default BOOLEAN DEFAULT false,
  uploaded_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on resumes
ALTER TABLE public.resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own resumes" ON public.resumes;
CREATE POLICY "Users can manage own resumes" ON public.resumes
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- 2. Extend app_settings with BYO API Keys (Cold Mailing & Job Search APIs)
ALTER TABLE public.app_settings 
  ADD COLUMN IF NOT EXISTS cold_mail_provider TEXT DEFAULT 'smtp',
  ADD COLUMN IF NOT EXISTS cold_mail_api_key TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS job_search_provider TEXT DEFAULT 'open_apis',
  ADD COLUMN IF NOT EXISTS rapidapi_key TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS adzuna_app_id TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS adzuna_app_key TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS serpapi_key TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS custom_job_search_url TEXT DEFAULT '';

-- 3. Ensure Candidate Profile has all professional fields
ALTER TABLE public.candidate_profile
  ADD COLUMN IF NOT EXISTS phone TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS experience TEXT DEFAULT '2 years',
  ADD COLUMN IF NOT EXISTS skills TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS notice_period TEXT DEFAULT 'Immediate Joiner',
  ADD COLUMN IF NOT EXISTS location TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS portfolio_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS linkedin_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS github_url TEXT DEFAULT '',
  ADD COLUMN IF NOT EXISTS bio TEXT DEFAULT '';
