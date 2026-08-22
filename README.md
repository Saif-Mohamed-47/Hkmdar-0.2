<<<<<<< HEAD
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
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
>>>>>>> master
