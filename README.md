# EduSurvey - Production-Ready Academic Survey SaaS Platform

EduSurvey is an enterprise-grade survey platform designed for educational institutions. Built with Next.js 15, React 19, Tailwind CSS, shadcn/ui, Supabase, TanStack Query, Recharts, and Google Sheets live integration.

---

## 🌟 Key Features Matrix

- **Visual Survey Builder Studio**:
  - 35+ Question Types (Short text, Long text, Email, Phone, Number, Currency, Date, Time, Radio, Checkbox, Dropdown, Multi-select, Rating Stars, Linear Scale, Slider, Image upload, File upload, Canvas Digital Signature, GPS Location, Address, Password, Student ID, Passport AA1234567, JSHSHIR 14-digit PINFL).
  - 1500ms debounced AutoSave and unlimited **Undo/Redo history stack** (`Ctrl+Z`, `Ctrl+Shift+Z`, `Ctrl+S`).
  - Conditional branching logic engine (`IF / AND / OR` with target actions `show`, `hide`, `jump_to_page`, `skip_page`).
  - 10 Pre-built Educational Templates & Reusable Question Library.

- **Student Survey Response Portal**:
  - Multi-step wizard with LocalStorage draft auto-save and resume later.
  - Hashed IP tracking (no raw IPs stored), device, browser, language, timezone metadata capture.
  - Unique submission IDs (`EDU-XXXXXX`).

- **Google Sheets Live Sync Queue**:
  - Non-blocking server-side queue worker with **5x exponential backoff retry policy**.
  - Google Apps Script receiver appending student answers live without overwriting existing rows.
  - Admin force-retry monitor panel.

- **Enterprise Analytics & Exports**:
  - Interactive Recharts visualization dashboard with custom demographic field grouping (Group, Gender, Course, Region).
  - **Excel (.xlsx)**: 100,000+ row chunked exporter with frozen top header row, dynamic column widths, and Uzbek UTF-8 support.
  - **PDF Executive Report**: Multi-page report via `pdf-lib` with cover page, institutional logo, statistics summary, and page numbers (`Page X of Y`).
  - Browser print stylesheet (`@media print`) optimized for A4/Letter bounds.

---

## 🚀 Quickstart Guide

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 📚 Documentation Index

- [Installation Guide](file:///d:/01.%20Antigravity/Online%20so'rovnoma/docs/INSTALLATION.md)
- [Supabase Setup & Migrations](file:///d:/01.%20Antigravity/Online%20so'rovnoma/docs/SUPABASE_SETUP.md)
- [Google Sheets Webhook Sync](file:///d:/01.%20Antigravity/Online%20so'rovnoma/docs/GOOGLE_SHEETS_SYNC.md)
- [Vercel Deployment Guide](file:///d:/01.%20Antigravity/Online%20so'rovnoma/docs/VERCEL_DEPLOYMENT.md)
- [Backup & Disaster Recovery](file:///d:/01.%20Antigravity/Online%20so'rovnoma/docs/BACKUP_AND_RECOVERY.md)
