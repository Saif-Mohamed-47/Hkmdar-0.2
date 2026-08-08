# HAKMDAR API Endpoints & Server Actions (Next.js App Router)

## 1. Authentication (`/app/auth`)
- `POST /api/auth/register` — Registers a new lawyer via Supabase Auth & initializes profile record.
- `POST /api/auth/login` — Authenticates lawyer credentials.

## 2. Lawyer Profile (`/app/dashboard/profile`)
- `GET /api/profile` — Fetch current lawyer profile details.
- `PUT /api/profile` — Update lawyer profile info (full name, bar association number, office address).

## 3. Clients (`/app/dashboard/clients`)
- `GET /api/clients` — List all clients for the authenticated lawyer.
- `POST /api/clients` — Create a new client record.
- `GET /api/clients/[id]` — Retrieve client details and associated cases.
- `PUT /api/clients/[id]` — Update client information.
- `DELETE /api/clients/[id]` — Delete client record (cascades or restricts based on cases).

## 4. Cases / Matters (`/app/dashboard/cases`)
- `GET /api/cases` — List all cases (with client info and status).
- `POST /api/cases` — Create a new case linked to a client.
- `GET /api/cases/[id]` — Fetch case details, attached documents, time entries, and invoices.
- `PUT /api/cases/[id]` — Update case details or status (`active`, `pending`, `closed`).

## 5. Documents (`/app/dashboard/cases/[id]/documents`)
- `POST /api/documents/upload` — Upload file (PDF/DOCX max 10MB) to Supabase Storage bucket and create record in `documents` table.
- `DELETE /api/documents/[id]` — Delete file from Supabase Storage bucket and remove table record.

## 6. AI Legal Assistant & RAG Architecture (`/app/dashboard/ai-legal`)
- `POST /api/ai/chat` — Queries the Gemini API.

### AI RAG & Context Strategy for Egyptian Labor Law
To operate effectively within zero budget and avoid external vector database infrastructure (like Pinecone) or paid embeddings API costs, HAKMDAR uses **Structured Prompt Augmentation (Simple RAG)** for Egyptian Labor Law (Law No. 12 of 2003):
1. **Curated Knowledge Base:** A structured JSON/Markdown file containing key articles, termination rules, end-of-service benefits, working hours, and leave regulations from Egyptian Labor Law (Law No. 12 of 2003) is embedded directly into the application codebase.
2. **Context Injection:** When the lawyer sends a query via `POST /api/ai/chat`, the backend retrieves relevant law articles based on keyword matching or semantic relevance and injects them into the system prompt alongside strict instructions to cite specific articles and advise consultation of official court rulings.
3. **Model:** Google Gemini API (`gemini-1.5-flash` or latest free tier equivalent).

## 7. Billing & Invoicing (`/app/dashboard/billing`)
- `GET /api/time-entries` — List time entries across cases.
- `POST /api/time-entries` — Log a new time entry (description, duration, hourly rate, date).
- `POST /api/invoices` — Generate an itemized invoice for a case from unbilled time entries (populates `invoices` and `invoice_items`).
- `GET /api/invoices/[id]` — Fetch invoice details and line items for rendering/exporting.
