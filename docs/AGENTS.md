# EduSurvey - Senior AI Engineering Guidelines & Protocol

This document defines the core operational standards, architectural constraints, and execution protocols for AI coding assistants in this repository.

---

## 🎯 Primary Mandates

1. **Production-Ready Code Only**: Never output placeholder UI, stubbed functions, mock fallbacks, `TODO`, or `FIXME` comments.
2. **Strict Component Sizing Limits**:
   - **Components (`.tsx`)**: Maximum **250 lines**. Split sub-views into modular files.
   - **Hooks (`use*.ts`)**: Maximum **200 lines**.
   - **Services & Utilities (`.ts`)**: Maximum **200 lines**.
3. **Feature-First Architecture**: Group code by feature module inside `src/features/<feature-name>/`.
4. **Zero-Error Guarantee**: Every change must pass `npx tsc --noEmit` with **0 errors** and compile cleanly in `npm run build`.

---

## 🏗️ Code Quality Checklist

- [x] TypeScript strict mode enabled (`noImplicitAny`, `strictNullChecks`).
- [x] All props typed explicitly with Interfaces.
- [x] Tailwind CSS glassmorphism design tokens used (`glass-card`, `glass-nav`).
- [x] Accessibility attributes (`aria-label`, `role`, keyboard navigation) applied to interactive elements.
- [x] Debounced auto-save & exponential backoff queue mechanisms implemented.
