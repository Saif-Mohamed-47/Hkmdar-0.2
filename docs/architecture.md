# HAKMDAR Architecture & Folder Structure

## Tech Stack
- **Frontend & Routing:** Next.js (App Router) + React + TypeScript + Tailwind CSS + shadcn/ui.
- **Backend & Database:** Supabase (PostgreSQL, Auth, Row Level Security, Storage).
- **Hosting:** Vercel (Frontend) + Supabase (Backend/DB/Storage), both on free tiers.
- **AI Integration:** Google Gemini API (Free tier / Generative AI SDK).
- **Testing:** Vitest + React Testing Library.

## Clean Folder Structure

```text
hakmdar/
├── docs/                       # Project documentation & design specs
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/             # Login & Register pages
│   │   ├── (dashboard)/        # Protected layout & shell
│   │   │   ├── page.tsx        # Dashboard overview
│   │   │   ├── clients/        # Client management UI
│   │   │   ├── cases/          # Case management & detail view
│   │   │   ├── documents/      # Document vault & upload
│   │   │   ├── ai-legal/       # Gemini AI legal assistant chat
│   │   │   ├── billing/        # Time tracking & invoice generator
│   │   │   └── profile/        # Lawyer profile settings
│   │   ├── api/                # API routes / Server Actions
│   │   │   ├── ai/             # AI chat endpoint
│   │   │   ├── documents/      # File upload handling
│   │   │   └── ...             # Other resource handlers
│   │   └── layout.tsx          # Root layout with providers
│   ├── components/             # Reusable UI components (shadcn/ui + custom)
│   ├── lib/                    # Supabase clients, Gemini client, utils
│   ├── types/                  # TypeScript database & app types
│   └── tests/                  # Unit & integration test suites (Vitest)
├── supabase/                   # Supabase migrations & initial schema SQL
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```
