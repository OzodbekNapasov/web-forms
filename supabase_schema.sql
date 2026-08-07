-- ==============================================================================
-- EDUSURVEY - SUPABASE DATABASE SCHEMA MIGRATION SCRIPT
-- Copy and paste this whole script into Supabase SQL Editor and click RUN
-- ==============================================================================

-- 1. Create Surveys Table
CREATE TABLE IF NOT EXISTS public.surveys (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    custom_url TEXT UNIQUE,
    status TEXT DEFAULT 'published',
    questions_count INTEGER DEFAULT 0,
    responses_count INTEGER DEFAULT 0,
    theme_config JSONB,
    settings JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Survey Questions Table
CREATE TABLE IF NOT EXISTS public.survey_questions (
    id TEXT PRIMARY KEY,
    survey_id TEXT REFERENCES public.surveys(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    label TEXT NOT NULL,
    placeholder TEXT,
    help_text TEXT,
    required BOOLEAN DEFAULT false,
    order_index INTEGER DEFAULT 0,
    config JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Responses Table
CREATE TABLE IF NOT EXISTS public.responses (
    id TEXT PRIMARY KEY,
    survey_id TEXT REFERENCES public.surveys(id) ON DELETE CASCADE,
    submission_id TEXT NOT NULL,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    respondent_meta JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 4. Create Response Answers Table
CREATE TABLE IF NOT EXISTS public.response_answers (
    id TEXT PRIMARY KEY,
    response_id TEXT REFERENCES public.responses(id) ON DELETE CASCADE,
    question_id TEXT NOT NULL,
    value TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. Create Admins Table (Adminlar Login va Parollarini Boshqarish)
CREATE TABLE IF NOT EXISTS public.admins (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'admin',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. Open Permissions (Disable RLS for public app access)
ALTER TABLE public.surveys DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.survey_questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.responses DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.response_answers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admins DISABLE ROW LEVEL SECURITY;

-- Dastlabki Bosh Admin foydalanuvchisini kiritish
INSERT INTO public.admins (id, username, full_name, password, role)
VALUES ('admin-001', 'Ozodbek', 'Ozodbek Napasov', 'Eua5gd007', 'super_admin')
ON CONFLICT (username) DO NOTHING;
