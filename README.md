# HAKMDAR (حكمدار)

HAKMDAR is an AI-powered SaaS legal practice management platform built specifically for the Egyptian legal market. It combines comprehensive practice management (clients, cases, documents, scheduling, time tracking, billing) with an Egyptian legal AI assistant powered by the Google Gemini API.

## Tech Stack
- **Frontend:** Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui
- **Backend / DB:** Supabase (PostgreSQL + Auth + Row Level Security + Storage)
- **Hosting:** Vercel (Frontend) + Supabase (Backend/DB), zero-budget free tiers
- **AI:** Google Gemini API (with contextual RAG for Egyptian Labor Law)

## Documentation
Explore the complete architecture and design specs in the [`/docs`](./docs) directory:
- [Database ERD & RLS Policies](./docs/erd.md)
- [API Endpoints & Server Actions](./docs/api-endpoints.md)
- [Architecture & Folder Structure](./docs/architecture.md)
- [Team Task Breakdown & TDD Strategy](./docs/team-tasks.md)
