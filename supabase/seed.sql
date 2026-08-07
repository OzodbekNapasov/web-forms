-- EduSurvey Production Seed Data for Educational Institutions

INSERT INTO public.admins (id, email, password_hash, full_name, status)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'admin@edusurvey.edu.uz',
    '$2a$12$eImiTXuWVxfM37uY4JANj.R5x3W8O1Z6jXwL.demoHash',
    'Chief Academic Administrator',
    'active'
) ON CONFLICT (email) DO NOTHING;

INSERT INTO public.surveys (id, title, slug, description, status, created_by)
VALUES (
    's0000000-0000-0000-0000-000000000001',
    'University Faculty & Teaching Evaluation 2026',
    'faculty-eval-2026',
    'Official evaluation form for academic staff performance, course materials, and laboratory environment.',
    'published',
    'a0000000-0000-0000-0000-000000000001'
) ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.survey_statistics (survey_id, view_count, completion_count, completion_rate)
VALUES ('s0000000-0000-0000-0000-000000000001', 420, 142, 88.50)
ON CONFLICT (survey_id) DO NOTHING;
