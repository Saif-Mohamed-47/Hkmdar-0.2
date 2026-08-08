# HAKMDAR Team Task Breakdown (6-Person Team, Part-Time MVP)

## 1. Tech Lead (1 person)
- [ ] Initialize project scaffolding (Next.js, TypeScript, Tailwind, shadcn/ui).
- [ ] Configure Supabase project, environment variables, and connection utilities.
- [ ] Set up CI/CD pipeline (Vercel deployment + Supabase migration workflows).
- [ ] Establish testing harness (Vitest, React Testing Library).
- [ ] Code reviews and architectural governance.

## 2. Backend Engineer 1 - Database & Storage (1 person)
- [ ] Write PostgreSQL migration scripts for all MVP tables (`profiles`, `clients`, `cases`, `documents`, `time_entries`, `invoices`, `invoice_items`).
- [ ] Implement and test Row Level Security (RLS) policies for all tables.
- [ ] Configure Supabase Storage bucket (`case-documents`) with MIME type (PDF/DOCX) and file size restrictions (10MB).

## 3. Backend Engineer 2 - API & Server Actions (1 person)
- [ ] Implement Server Actions / API routes for Client CRUD operations.
- [ ] Implement Server Actions / API routes for Case management.
- [ ] Implement Server Actions / API routes for Time Tracking and Itemized Invoice generation.
- [ ] Write integration tests for API routes.

## 4. Frontend Engineer 1 - Core UI & Shell (1 person)
- [ ] Build authentication pages (Login & Register) integrated with Supabase Auth.
- [ ] Build responsive dashboard layout, navigation sidebar, and header.
- [ ] Build Lawyer Profile settings view.
- [ ] Write unit tests for auth and dashboard shell.

## 5. Frontend Engineer 2 - Practice Management UI (1 person)
- [ ] Build Client management views (list, create, detail view).
- [ ] Build Case management views (list, create, case details with linked tabs).
- [ ] Build Document upload component with Supabase Storage integration.
- [ ] Build Billing & Time Tracking UI + Invoice generator view.

## 6. AI Engineer - Legal Assistant (1 person)
- [ ] Curate Egyptian Labor Law (Law No. 12 of 2003) knowledge base snippets.
- [ ] Integrate Google Gemini API client and implement system prompt RAG retrieval logic.
- [ ] Build AI Legal Assistant chat UI (`/dashboard/ai-legal`).
- [ ] Write unit & integration tests for AI query handling.

---

## TDD Strategy
- **Framework:** Vitest + React Testing Library.
- **Workflow:**
  1. **Red:** Write failing tests for components or server actions before writing implementation code.
  2. **Green:** Write minimal code to pass tests.
  3. **Refactor:** Clean up code, type check with `tsc`, and verify RLS policies.
