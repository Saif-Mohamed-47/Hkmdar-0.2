-- Migration: 20260814000001_initial_schema.sql
-- Description: Create 7 core tables for HAKMDAR with foreign keys, constraints, and timestamps.

-- 1. profiles table (1:1 with auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    bar_association_number TEXT,
    office_address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lawyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    address TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3. cases table
CREATE TABLE IF NOT EXISTS public.cases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    lawyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    case_number TEXT,
    court TEXT,
    status TEXT NOT NULL CHECK (status IN ('active', 'pending', 'closed')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 4. documents table
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    lawyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5. time_entries table
CREATE TABLE IF NOT EXISTS public.time_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    lawyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    duration_minutes INTEGER NOT NULL,
    hourly_rate DECIMAL(10,2) NOT NULL,
    date DATE NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 6. invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    lawyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    total_amount DECIMAL(10,2) NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('draft', 'sent', 'paid')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 7. invoice_items table
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    case_id UUID NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    hours DECIMAL(5,2) NOT NULL,
    rate DECIMAL(10,2) NOT NULL,
    line_total DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Indices for optimal foreign key lookups and queries
CREATE INDEX IF NOT EXISTS idx_clients_lawyer_id ON public.clients(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_cases_lawyer_id ON public.cases(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_cases_client_id ON public.cases(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_case_id ON public.documents(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_lawyer_id ON public.documents(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_case_id ON public.time_entries(case_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_lawyer_id ON public.time_entries(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_invoices_case_id ON public.invoices(case_id);
CREATE INDEX IF NOT EXISTS idx_invoices_lawyer_id ON public.invoices(lawyer_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_invoice_id ON public.invoice_items(invoice_id);
CREATE INDEX IF NOT EXISTS idx_invoice_items_case_id ON public.invoice_items(case_id);
