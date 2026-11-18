-- =========================================================================
-- COMPLETE SUPABASE SAAS SCHEMA FOR JOBFLOW AI (WITH AUTHENTICATION & RLS)
-- Run this entire script in your Supabase SQL Editor
-- =========================================================================

-- 1. Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
  id TEXT PRIMARY KEY DEFAULT ('job-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  contact_name TEXT,
  contact_email TEXT,
  job_url TEXT,
  location TEXT DEFAULT 'Remote',
  salary TEXT,
  status TEXT DEFAULT 'wishlist',
  applied_date TEXT,
  last_contact_date TEXT,
  notes TEXT,
  email_history JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Candidate Profiles Table (One profile per user)
CREATE TABLE IF NOT EXISTS public.candidate_profile (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  title TEXT NOT NULL DEFAULT 'Software Engineer',
  email TEXT NOT NULL DEFAULT '',
  phone TEXT DEFAULT '',
  experience TEXT DEFAULT '2 years',
  skills TEXT DEFAULT '',
  notice_period TEXT DEFAULT 'Immediate Joiner',
  location TEXT DEFAULT '',
  portfolio_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 3. Email Templates Table (Personalized per user)
CREATE TABLE IF NOT EXISTS public.email_templates (
  id TEXT PRIMARY KEY DEFAULT ('tpl-' || extract(epoch from now())::bigint || '-' || substr(md5(random()::text), 1, 6)),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  subject TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. App Settings Table (One SMTP setting per user)
CREATE TABLE IF NOT EXISTS public.app_settings (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  smtp_host TEXT DEFAULT 'smtp-relay.brevo.com',
  smtp_port TEXT DEFAULT '587',
  smtp_user TEXT DEFAULT '',
  smtp_key TEXT DEFAULT '',
  sender_email TEXT DEFAULT '',
  sender_name TEXT DEFAULT '',
  reply_to_email TEXT DEFAULT '',
  reply_to_name TEXT DEFAULT '',
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) for SaaS Multi-Tenant Isolation
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_profile ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.app_settings ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any to avoid duplicates
DROP POLICY IF EXISTS "Users can manage own jobs" ON public.jobs;
DROP POLICY IF EXISTS "Users can manage own profile" ON public.candidate_profile;
DROP POLICY IF EXISTS "Users can manage own templates" ON public.email_templates;
DROP POLICY IF EXISTS "Users can manage own settings" ON public.app_settings;

-- RLS Policies: Allows authenticated users to manage their own records, and handles unassigned rows
CREATE POLICY "Users can manage own jobs" ON public.jobs
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage own profile" ON public.candidate_profile
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can manage own templates" ON public.email_templates
  FOR ALL USING (auth.uid() = user_id OR user_id IS NULL)
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can manage own settings" ON public.app_settings
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
