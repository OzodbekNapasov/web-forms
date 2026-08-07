# EduSurvey - Vercel Production Deployment Guide

This guide details deploying EduSurvey to Vercel.

---

## 1. Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel --prod
```

---

## 2. Configure Environment Variables in Vercel

In the Vercel Dashboard under **Project Settings > Environment Variables**, add:

| Key | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Public Anon Key |
| `SUPABASE_SERVICE_ROLE` | Supabase Secret Service Role Key |
| `NEXT_PUBLIC_SITE_URL` | Production Domain URL |
