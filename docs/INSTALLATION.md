# EduSurvey - Installation & System Setup Guide

This guide covers local environment setup, dependency installation, environment variable configuration, and production build execution.

---

## 1. Prerequisites

- **Node.js**: `v18.17.0` or higher (Node.js 20+ recommended)
- **npm**: `v9.0.0` or higher
- **Git**: Latest version

---

## 2. Step-by-Step Installation

### Step 1: Clone Repository & Install Dependencies
```bash
cd "d:/01. Antigravity/Online so'rovnoma"
npm install
```

### Step 2: Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Populate the required credentials in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE=your-service-role-key-here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Step 3: Launch Local Development Server
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## 3. Production Build & Quality Verification

To verify type safety and build the optimized production bundle:

```bash
# Type check
npx tsc --noEmit

# Production build
npm run build

# Start production server
npm run start
```
