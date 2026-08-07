# EduSurvey - Database Schema & ERD Architecture

---

## 1. Relational Entity Overview (26 PostgreSQL Tables)

EduSurvey operates on a PostgreSQL database optimized for Supabase Free Tier.

### Core Survey Tables:
1. `admins`: Single administrator account credentials, avatar, phone, bio, status.
2. `profiles`: Admin profile links referencing `auth.users(id)`.
3. `surveys`: Master survey definitions (title, slug, cover_image, status, theme, is_multistep).
4. `survey_pages`: Multi-step page breaks.
5. `questions`: 35+ question field schemas with JSONB validation & conditional branching rules.
6. `question_options`: Choice labels & values for radio/checkbox/dropdown questions.
7. `responses`: Recorded student submissions (submission_id, started_at, completed_at, respondent_meta).
8. `response_answers`: Atomic independent storage for each question answer (supports analytics filtering).
9. `draft_responses`: Respondent hash & incomplete answer drafts for resume later functionality.
10. `survey_statistics`: Real-time aggregated statistics (view_count, completion_count, completion_rate).
11. `google_sheet_connections`: Survey webhook configurations.
12. `export_history`: Audit trail for generated Excel, CSV, PDF, and print exports.
13. `audit_logs` & `activity_logs`: Administrative system activity audit trail.
