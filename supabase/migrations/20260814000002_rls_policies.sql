-- Migration: 20260814000002_rls_policies.sql
-- Description: Enable RLS and define access policies on all 7 tables based on lawyer_id = auth.uid().

-- Enable Row Level Security on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.time_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- 1. profiles policies (lawyer manages own profile linked to auth.uid())
CREATE POLICY "Users can view own profile"
    ON public.profiles
    FOR SELECT
    TO authenticated
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 2. clients policies (lawyer has full control over own clients)
CREATE POLICY "Lawyers can view own clients"
    ON public.clients
    FOR SELECT
    TO authenticated
    USING (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can insert own clients"
    ON public.clients
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can update own clients"
    ON public.clients
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = lawyer_id)
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can delete own clients"
    ON public.clients
    FOR DELETE
    TO authenticated
    USING (auth.uid() = lawyer_id);

-- 3. cases policies (lawyer has full control over own cases)
CREATE POLICY "Lawyers can view own cases"
    ON public.cases
    FOR SELECT
    TO authenticated
    USING (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can insert own cases"
    ON public.cases
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can update own cases"
    ON public.cases
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = lawyer_id)
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can delete own cases"
    ON public.cases
    FOR DELETE
    TO authenticated
    USING (auth.uid() = lawyer_id);

-- 4. documents policies (lawyer has full control over own documents)
CREATE POLICY "Lawyers can view own documents"
    ON public.documents
    FOR SELECT
    TO authenticated
    USING (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can insert own documents"
    ON public.documents
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can update own documents"
    ON public.documents
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = lawyer_id)
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can delete own documents"
    ON public.documents
    FOR DELETE
    TO authenticated
    USING (auth.uid() = lawyer_id);

-- 5. time_entries policies (lawyer has full control over own time entries)
CREATE POLICY "Lawyers can view own time entries"
    ON public.time_entries
    FOR SELECT
    TO authenticated
    USING (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can insert own time entries"
    ON public.time_entries
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can update own time entries"
    ON public.time_entries
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = lawyer_id)
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can delete own time entries"
    ON public.time_entries
    FOR DELETE
    TO authenticated
    USING (auth.uid() = lawyer_id);

-- 6. invoices policies (lawyer has full control over own invoices)
CREATE POLICY "Lawyers can view own invoices"
    ON public.invoices
    FOR SELECT
    TO authenticated
    USING (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can insert own invoices"
    ON public.invoices
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can update own invoices"
    ON public.invoices
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = lawyer_id)
    WITH CHECK (auth.uid() = lawyer_id);

CREATE POLICY "Lawyers can delete own invoices"
    ON public.invoices
    FOR DELETE
    TO authenticated
    USING (auth.uid() = lawyer_id);

-- 7. invoice_items policies (checked via parent invoice or case)
CREATE POLICY "Lawyers can view own invoice items"
    ON public.invoice_items
    FOR SELECT
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE invoices.id = invoice_items.invoice_id
              AND invoices.lawyer_id = auth.uid()
        )
    );

CREATE POLICY "Lawyers can insert own invoice items"
    ON public.invoice_items
    FOR INSERT
    TO authenticated
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE invoices.id = invoice_items.invoice_id
              AND invoices.lawyer_id = auth.uid()
        )
    );

CREATE POLICY "Lawyers can update own invoice items"
    ON public.invoice_items
    FOR UPDATE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE invoices.id = invoice_items.invoice_id
              AND invoices.lawyer_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE invoices.id = invoice_items.invoice_id
              AND invoices.lawyer_id = auth.uid()
        )
    );

CREATE POLICY "Lawyers can delete own invoice items"
    ON public.invoice_items
    FOR DELETE
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM public.invoices
            WHERE invoices.id = invoice_items.invoice_id
              AND invoices.lawyer_id = auth.uid()
        )
    );
