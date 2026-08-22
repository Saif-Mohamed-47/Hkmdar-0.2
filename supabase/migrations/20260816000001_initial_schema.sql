-- Migration: 20260816000001_initial_schema.sql
-- Description: Implement custom ENUM types, extend profiles table, convert status columns to ENUMs, setup user signup and updated_at triggers, and add role index.

-- 1. Create custom ENUM types if they do not exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('lawyer', 'client');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'case_status') THEN
        CREATE TYPE public.case_status AS ENUM ('active', 'pending', 'closed');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'invoice_status') THEN
        CREATE TYPE public.invoice_status AS ENUM ('draft', 'sent', 'paid');
    END IF;
END $$;

-- 2. Extend profiles table with role, phone_number, avatar_url, and updated_at
ALTER TABLE public.profiles
    ADD COLUMN IF NOT EXISTS role public.user_role NOT NULL DEFAULT 'lawyer',
    ADD COLUMN IF NOT EXISTS phone_number TEXT,
    ADD COLUMN IF NOT EXISTS avatar_url TEXT,
    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- 3. Convert cases.status column from TEXT to case_status ENUM
ALTER TABLE public.cases DROP CONSTRAINT IF EXISTS cases_status_check;
ALTER TABLE public.cases
    ALTER COLUMN status TYPE public.case_status USING status::public.case_status;

-- 4. Convert invoices.status column from TEXT to invoice_status ENUM
ALTER TABLE public.invoices DROP CONSTRAINT IF EXISTS invoices_status_check;
ALTER TABLE public.invoices
    ALTER COLUMN status TYPE public.invoice_status USING status::public.invoice_status;

-- 5. Trigger function to automatically create profile record upon auth.users creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    assigned_role public.user_role;
    extracted_role text;
BEGIN
    extracted_role := NEW.raw_user_meta_data->>'role';
    IF extracted_role = 'client' THEN
        assigned_role := 'client'::public.user_role;
    ELSE
        assigned_role := 'lawyer'::public.user_role;
    END IF;

    INSERT INTO public.profiles (
        id,
        full_name,
        role,
        phone_number,
        avatar_url,
        bar_association_number,
        office_address
    )
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', NEW.email, ''),
        assigned_role,
        NEW.raw_user_meta_data->>'phone_number',
        NEW.raw_user_meta_data->>'avatar_url',
        NEW.raw_user_meta_data->>'bar_association_number',
        NEW.raw_user_meta_data->>'office_address'
    )
    ON CONFLICT (id) DO UPDATE SET
        full_name = EXCLUDED.full_name,
        role = EXCLUDED.role,
        phone_number = COALESCE(EXCLUDED.phone_number, public.profiles.phone_number),
        avatar_url = COALESCE(EXCLUDED.avatar_url, public.profiles.avatar_url),
        bar_association_number = COALESCE(EXCLUDED.bar_association_number, public.profiles.bar_association_number),
        office_address = COALESCE(EXCLUDED.office_address, public.profiles.office_address),
        updated_at = now();

    RETURN NEW;
END;
$$;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- 6. Trigger function to automatically update updated_at timestamp on profiles
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

-- Create trigger on public.profiles table
DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- 7. Add index for role lookup on profiles table
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
