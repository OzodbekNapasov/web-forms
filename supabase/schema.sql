-- EduSurvey SaaS Enterprise PostgreSQL Database Schema
-- Built for Supabase (UUIDs, Foreign Keys, Indexes, Cascading Rules, RLS Policies)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Organizations Table (Future Multitenancy Support)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS public.roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Permissions Table
CREATE TABLE IF NOT EXISTS public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Admins Table
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role_id UUID REFERENCES public.roles(id) ON DELETE SET NULL,
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Profiles Table (Administrator)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Administrator',
    avatar_url TEXT,
    org_id UUID REFERENCES public.organizations(id) ON DELETE SET NULL,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Surveys Table
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID REFERENCES public.organizations(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'closed', 'scheduled')),
    custom_url TEXT UNIQUE,
    scheduled_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    is_multistep BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 7. Survey Pages Table
CREATE TABLE IF NOT EXISTS public.survey_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Page 1',
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 8. Survey Questions Table
CREATE TABLE IF NOT EXISTS public.survey_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    page_id UUID REFERENCES public.survey_pages(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    placeholder TEXT,
    help_text TEXT,
    required BOOLEAN NOT NULL DEFAULT false,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Question Options Table
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.survey_questions(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Responses Table
CREATE TABLE IF NOT EXISTS public.responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    submission_id TEXT UNIQUE NOT NULL,
    respondent_meta JSONB NOT NULL DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'partial')),
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 11. Response Answers Table
CREATE TABLE IF NOT EXISTS public.response_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES public.responses(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.survey_questions(id) ON DELETE CASCADE,
    value JSONB,
    file_urls TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Draft Responses Table (Auto-Save Resume Later)
CREATE TABLE IF NOT EXISTS public.draft_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    respondent_hash TEXT NOT NULL,
    answers_draft JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Survey Settings Table
CREATE TABLE IF NOT EXISTS public.survey_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID UNIQUE NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    allow_anonymous BOOLEAN NOT NULL DEFAULT true,
    require_captcha BOOLEAN NOT NULL DEFAULT false,
    max_submissions INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. Survey Themes Table
CREATE TABLE IF NOT EXISTS public.survey_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID UNIQUE NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    primary_color TEXT NOT NULL DEFAULT '#2563EB',
    background_color TEXT NOT NULL DEFAULT '#F8FAFC',
    font_family TEXT NOT NULL DEFAULT 'Inter',
    card_style TEXT NOT NULL DEFAULT 'glass',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. Survey Logs Table
CREATE TABLE IF NOT EXISTS public.survey_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
    event TEXT NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. Survey Statistics Table
CREATE TABLE IF NOT EXISTS public.survey_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID UNIQUE NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    view_count INT NOT NULL DEFAULT 0,
    completion_count INT NOT NULL DEFAULT 0,
    avg_time_seconds INT NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. Google Sheet Connections Table
CREATE TABLE IF NOT EXISTS public.google_sheet_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID UNIQUE NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    spreadsheet_id TEXT,
    sheet_name TEXT,
    webhook_url TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    synced_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 18. Export Logs Table
CREATE TABLE IF NOT EXISTS public.export_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
    format TEXT NOT NULL,
    row_count INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 19. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. Uploaded Files Table
CREATE TABLE IF NOT EXISTS public.uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT NOT NULL,
    mime_type TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 22. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    action TEXT NOT NULL,
    user_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 23. System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indexes for Fast Query Execution
CREATE INDEX IF NOT EXISTS idx_surveys_status ON public.surveys(status);
CREATE INDEX IF NOT EXISTS idx_surveys_custom_url ON public.surveys(custom_url);
CREATE INDEX IF NOT EXISTS idx_survey_questions_survey_id ON public.survey_questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON public.responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_response_answers_response_id ON public.response_answers(response_id);

-- Enable RLS Security Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.response_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Published Surveys" ON public.surveys FOR SELECT USING (status = 'published' OR status = 'scheduled');
CREATE POLICY "Public Read Questions" ON public.survey_questions FOR SELECT USING (true);
CREATE POLICY "Public Submit Responses" ON public.responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Submit Answers" ON public.response_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Full Access Profiles" ON public.profiles FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Admin Full Access Surveys" ON public.surveys FOR ALL USING (auth.role() = 'authenticated');
