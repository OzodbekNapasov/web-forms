# EduSurvey - Supabase Setup & Security Migration Guide

This guide covers PostgreSQL database migration execution, storage bucket setup, and Row Level Security (RLS) policies.

---

## 1. Execute SQL Migration Script

1. Open your [Supabase Dashboard](https://app.supabase.com).
2. Select your project and navigate to **SQL Editor**.
3. Create a new query and paste the contents of [`supabase/migrations/001_initial_schema.sql`](file:///d:/01.%20Antigravity/Online%20so%27rovnoma/supabase/migrations/001_initial_schema.sql).
4. Click **Run** to execute migration creating 26 PostgreSQL tables, indexes, triggers, and functions.

---

## 2. Storage Buckets Creation

Create the following storage buckets under **Storage**:
1. `avatars` (Public)
2. `survey-covers` (Public)
3. `survey-files` (Authenticated insert, Public read)
4. `temporary` (Private)

---

## 3. Row Level Security (RLS) Verification

Ensure RLS is enabled on:
- `surveys`: Anonymous read for published surveys, full access for authenticated admins.
- `questions` & `question_options`: Public read access.
- `responses` & `response_answers`: Public insert access.
