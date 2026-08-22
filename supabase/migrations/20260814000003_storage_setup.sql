-- Migration: 20260814000003_storage_setup.sql
-- Description: Create 'case-documents' storage bucket with mime restrictions (PDF, DOCX) and 10MB limit + simplified RLS policies.

-- 1. Create the storage bucket if it does not already exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'case-documents',
    'case-documents',
    false,
    10485760, -- 10MB in bytes
    ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword']
)
ON CONFLICT (id) DO UPDATE SET
    file_size_limit = 10485760,
    allowed_mime_types = ARRAY['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/msword'],
    public = false;

-- 2. Storage RLS Policies for case-documents bucket
-- Standardized folder path convention: <lawyer_id>/<file_name>
-- Enforces that a lawyer can only view, upload, update, and delete files inside their own top-level folder (<auth.uid()>/*).

-- Allow authenticated users to view files in their own folder
CREATE POLICY "Lawyers can view own case documents in storage"
    ON storage.objects
    FOR SELECT
    TO authenticated
    USING (
        bucket_id = 'case-documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Lawyers can upload case documents in storage"
    ON storage.objects
    FOR INSERT
    TO authenticated
    WITH CHECK (
        bucket_id = 'case-documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow authenticated users to update files in their own folder
CREATE POLICY "Lawyers can update own case documents in storage"
    ON storage.objects
    FOR UPDATE
    TO authenticated
    USING (
        bucket_id = 'case-documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    )
    WITH CHECK (
        bucket_id = 'case-documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );

-- Allow authenticated users to delete files in their own folder
CREATE POLICY "Lawyers can delete own case documents in storage"
    ON storage.objects
    FOR DELETE
    TO authenticated
    USING (
        bucket_id = 'case-documents'
        AND (storage.foldername(name))[1] = auth.uid()::text
    );
