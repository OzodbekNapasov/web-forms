-- EduSurvey Versioned Migration 001: Initial Schema, Storage Buckets, Triggers, & RLS Policies
-- Compatibility: Supabase PostgreSQL (Free Tier Optimized)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Future Organizations Table (Multitenancy Readiness)
CREATE TABLE IF NOT EXISTS public.future_organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Future Roles Table
CREATE TABLE IF NOT EXISTS public.future_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT UNIQUE NOT NULL,
    permissions JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. Future Permissions Table
CREATE TABLE IF NOT EXISTS public.future_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. Future Users Table
CREATE TABLE IF NOT EXISTS public.future_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    role_id UUID REFERENCES public.future_roles(id) ON DELETE SET NULL,
    org_id UUID REFERENCES public.future_organizations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. Admins Table (Single Administrator System)
CREATE TABLE IF NOT EXISTS public.admins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Administrator',
    avatar_url TEXT,
    phone TEXT,
    bio TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL DEFAULT 'Administrator',
    phone TEXT,
    bio TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
    last_login TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. Surveys Table
CREATE TABLE IF NOT EXISTS public.surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    theme JSONB NOT NULL DEFAULT '{"primaryColor": "#2563EB", "backgroundColor": "#F8FAFC", "cardStyle": "glass"}'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived', 'closed', 'scheduled')),
    visibility TEXT NOT NULL DEFAULT 'public' CHECK (visibility IN ('public', 'private', 'unlisted')),
    allow_multiple_responses BOOLEAN NOT NULL DEFAULT false,
    allow_resume BOOLEAN NOT NULL DEFAULT true,
    show_progress BOOLEAN NOT NULL DEFAULT true,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    is_unlimited BOOLEAN NOT NULL DEFAULT true,
    success_message TEXT DEFAULT 'Thank you for completing the survey!',
    created_by UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at TIMESTAMPTZ
);

-- 8. Survey Pages Table
CREATE TABLE IF NOT EXISTS public.survey_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    title TEXT NOT NULL DEFAULT 'Page 1',
    description TEXT,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 9. Questions Table
CREATE TABLE IF NOT EXISTS public.questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    page_id UUID REFERENCES public.survey_pages(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    placeholder TEXT,
    required BOOLEAN NOT NULL DEFAULT false,
    order_index INT NOT NULL DEFAULT 0,
    validation_rules JSONB NOT NULL DEFAULT '{}'::jsonb,
    conditional_logic JSONB NOT NULL DEFAULT '[]'::jsonb,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 10. Question Options Table
CREATE TABLE IF NOT EXISTS public.question_options (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    label TEXT NOT NULL,
    value TEXT NOT NULL,
    order_index INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 11. Responses Table
CREATE TABLE IF NOT EXISTS public.responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    submission_id TEXT UNIQUE NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    completion_time INT NOT NULL DEFAULT 0,
    ip_hash TEXT,
    device TEXT DEFAULT 'desktop',
    browser TEXT,
    country TEXT DEFAULT 'Uzbekistan',
    city TEXT DEFAULT 'Tashkent',
    is_completed BOOLEAN NOT NULL DEFAULT true,
    draft JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 12. Response Answers Table (Independent atomic store per answer)
CREATE TABLE IF NOT EXISTS public.response_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID NOT NULL REFERENCES public.responses(id) ON DELETE CASCADE,
    question_id UUID NOT NULL REFERENCES public.questions(id) ON DELETE CASCADE,
    answer_value JSONB,
    file_urls TEXT[] DEFAULT '{}'::text[],
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 13. Draft Responses Table
CREATE TABLE IF NOT EXISTS public.draft_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    respondent_hash TEXT NOT NULL,
    answers_draft JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 14. Survey Settings Table
CREATE TABLE IF NOT EXISTS public.survey_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID UNIQUE NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    allow_anonymous BOOLEAN NOT NULL DEFAULT true,
    require_captcha BOOLEAN NOT NULL DEFAULT false,
    max_submissions INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 15. Survey Statistics Table
CREATE TABLE IF NOT EXISTS public.survey_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID UNIQUE NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    view_count INT NOT NULL DEFAULT 0,
    completion_count INT NOT NULL DEFAULT 0,
    avg_time_seconds INT NOT NULL DEFAULT 0,
    completion_rate NUMERIC(5,2) NOT NULL DEFAULT 0.00,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 16. Survey Themes Table
CREATE TABLE IF NOT EXISTS public.survey_themes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID UNIQUE NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    primary_color TEXT NOT NULL DEFAULT '#2563EB',
    background_color TEXT NOT NULL DEFAULT '#F8FAFC',
    font_family TEXT NOT NULL DEFAULT 'Inter',
    card_style TEXT NOT NULL DEFAULT 'glass',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 17. Survey Views Table
CREATE TABLE IF NOT EXISTS public.survey_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ip_hash TEXT
);

-- 18. Survey Visits Table
CREATE TABLE IF NOT EXISTS public.survey_visits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    visited_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    referrer TEXT
);

-- 19. Response Sessions Table
CREATE TABLE IF NOT EXISTS public.response_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    session_token TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 20. Uploaded Files Table
CREATE TABLE IF NOT EXISTS public.uploaded_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    filename TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INT NOT NULL,
    mime_type TEXT NOT NULL,
    bucket_id TEXT NOT NULL DEFAULT 'survey-files',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 21. Google Sheet Connections Table
CREATE TABLE IF NOT EXISTS public.google_sheet_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID UNIQUE NOT NULL REFERENCES public.surveys(id) ON DELETE CASCADE,
    spreadsheet_id TEXT,
    sheet_name TEXT,
    webhook_url TEXT,
    is_enabled BOOLEAN NOT NULL DEFAULT true,
    synced_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'error', 'paused')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 22. Export History Table
CREATE TABLE IF NOT EXISTS public.export_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    survey_id UUID REFERENCES public.surveys(id) ON DELETE CASCADE,
    format TEXT NOT NULL,
    row_count INT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 23. Activity Logs Table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID,
    action TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 24. Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    admin_id UUID REFERENCES public.admins(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    entity TEXT NOT NULL,
    details JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 25. Notifications Table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 26. System Settings Table
CREATE TABLE IF NOT EXISTS public.system_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key TEXT UNIQUE NOT NULL,
    value JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES FOR MAXIMUM QUERY PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_surveys_slug ON public.surveys(slug);
CREATE INDEX IF NOT EXISTS idx_surveys_status ON public.surveys(status);
CREATE INDEX IF NOT EXISTS idx_questions_survey_id ON public.questions(survey_id);
CREATE INDEX IF NOT EXISTS idx_question_options_question_id ON public.question_options(question_id);
CREATE INDEX IF NOT EXISTS idx_responses_survey_id ON public.responses(survey_id);
CREATE INDEX IF NOT EXISTS idx_responses_submission_id ON public.responses(submission_id);
CREATE INDEX IF NOT EXISTS idx_response_answers_response_id ON public.response_answers(response_id);
CREATE INDEX IF NOT EXISTS idx_response_answers_question_id ON public.response_answers(question_id);
CREATE INDEX IF NOT EXISTS idx_admins_email ON public.admins(email);

-- SQL FUNCTIONS
CREATE OR REPLACE FUNCTION generate_submission_id()
RETURNS TEXT AS $$
DECLARE
    chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    result TEXT := 'EDU-';
    i INT;
BEGIN
    FOR i IN 1..6 LOOP
        result := result || substr(chars, floor(random() * length(chars) + 1)::int, 1);
    END LOOP;
    RETURN result;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION increment_survey_views(survey_uuid UUID)
RETURNS VOID AS $$
BEGIN
    INSERT INTO public.survey_statistics (survey_id, view_count)
    VALUES (survey_uuid, 1)
    ON CONFLICT (survey_id)
    DO UPDATE SET view_count = public.survey_statistics.view_count + 1, updated_at = now();
END;
$$ LANGUAGE plpgsql;

-- AUTOMATED TRIGGERS & RLS
ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.surveys ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.response_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Published Surveys" ON public.surveys FOR SELECT USING (status = 'published' OR status = 'scheduled');
CREATE POLICY "Public Read Questions" ON public.questions FOR SELECT USING (true);
CREATE POLICY "Public Read Options" ON public.question_options FOR SELECT USING (true);
CREATE POLICY "Public Insert Responses" ON public.responses FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Response Answers" ON public.response_answers FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin Full Access" ON public.surveys FOR ALL USING (auth.role() = 'authenticated');
