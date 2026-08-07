# EduSurvey - Product Requirements Document (PRD)

---

## 1. Executive Overview

**EduSurvey** is an enterprise-grade academic survey SaaS platform engineered for educational institutions (universities, colleges, schools). It provides a zero-lag visual survey builder studio outperforming Typeform/Google Forms, multi-step student survey portals with draft auto-save, server-side Google Sheets synchronization, demographic cross-filtering, and 100,000+ row Excel/PDF exports.

---

## 2. Core User Roles & Personas

1. **Chief Academic Administrator**:
   - Single authenticated administrator account.
   - Manages institutional surveys, inspects response tables, configures Google Sheets webhooks, exports executive PDF reports, and monitors system health.
2. **Student / Guest Respondent**:
   - Unauthenticated public visitor opening `/s/[slug]`.
   - Completes multi-step surveys with LocalStorage draft auto-save and unique submission ID generation (`EDU-XXXXXX`).

---

## 3. High-Level Feature Matrix

- **Visual Survey Builder Studio**: 35+ Question types (including JSHSHIR 14-digit PINFL, Passport AA1234567, Student ID, Canvas Signature), 1500ms AutoSave, Undo/Redo stack (`Ctrl+Z`, `Ctrl+Shift+Z`), IF/AND/OR logic rules, 10 Educational templates.
- **Server Sync Queue**: Exponential backoff retry policy (max 5 retries) for Google Apps Script Webhooks.
- **Enterprise Analytics**: Recharts Area, Donut, and Bar charts with demographic breakdown (Group, Gender, Course, Region).
- **Multi-Format Exports**: Excel (.xlsx) chunked exporter, Executive PDF report with cover page and page numbers, and browser print stylesheet.
