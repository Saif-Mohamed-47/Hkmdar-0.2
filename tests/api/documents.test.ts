import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as uploadDocument } from '@/app/api/documents/upload/route';
import { DELETE as deleteDocument } from '@/app/api/documents/[id]/route';

vi.mock('@/lib/supabase', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase';

describe('POST /api/documents/upload', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return HTTP 401 if user is unauthenticated', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Unauthorized') }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const formData = new FormData();
    formData.append('case_id', 'case-1');
    const file = new File(['dummy content'], 'doc.pdf', { type: 'application/pdf' });
    formData.append('file', file);

    const req = new NextRequest('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await uploadDocument(req);
    expect(res.status).toBe(401);
  });

  it('should return HTTP 400 if file is missing or invalid type', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const formData = new FormData();
    formData.append('case_id', 'case-1');
    const file = new File(['executable'], 'virus.exe', { type: 'application/x-msdownload' });
    formData.append('file', file);

    const req = new NextRequest('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await uploadDocument(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/PDF|DOCX|نوع الملف/i);
  });

  it('should return HTTP 400 if file size exceeds 10MB', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const largeBuffer = new Uint8Array(11 * 1024 * 1024);
    const largeFile = new File([largeBuffer], 'large.pdf', { type: 'application/pdf' });

    const formData = new FormData();
    formData.append('case_id', 'case-1');
    formData.append('file', largeFile);

    const req = new NextRequest('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await uploadDocument(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/10MB|حجم الملف/i);
  });

  it('should successfully upload file to storage and insert database row', async () => {
    const mockCreatedDoc = {
      id: 'doc-100',
      case_id: 'case-1',
      lawyer_id: 'lawyer-1',
      file_name: 'test_doc.pdf',
      file_path: 'lawyer-1/uuid_test_doc.pdf',
      file_size: 100,
    };

    const mockStorageRemove = vi.fn().mockResolvedValue({ error: null });

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn((table) => {
        if (table === 'cases') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: { id: 'case-1' }, error: null }),
                }),
              }),
            }),
          };
        }
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockCreatedDoc, error: null }),
            }),
          }),
        };
      }),
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: { path: 'lawyer-1/uuid_test_doc.pdf' }, error: null }),
          remove: mockStorageRemove,
        }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const file = new File(['valid pdf content'], 'test_doc.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('case_id', 'case-1');
    formData.append('file', file);

    const req = new NextRequest('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await uploadDocument(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json).toEqual(mockCreatedDoc);
  });

  it('should clean up uploaded storage object if database insert fails', async () => {
    const mockStorageRemove = vi.fn().mockResolvedValue({ error: null });

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn((table) => {
        if (table === 'cases') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: { id: 'case-1' }, error: null }),
                }),
              }),
            }),
          };
        }
        return {
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database insert failed' } }),
            }),
          }),
        };
      }),
      storage: {
        from: vi.fn().mockReturnValue({
          upload: vi.fn().mockResolvedValue({ data: { path: 'lawyer-1/uuid_test_doc.pdf' }, error: null }),
          remove: mockStorageRemove,
        }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const file = new File(['valid pdf content'], 'test_doc.pdf', { type: 'application/pdf' });
    const formData = new FormData();
    formData.append('case_id', 'case-1');
    formData.append('file', file);

    const req = new NextRequest('http://localhost:3000/api/documents/upload', {
      method: 'POST',
      body: formData,
    });

    const res = await uploadDocument(req);
    expect(res.status).toBe(500);
    expect(mockStorageRemove).toHaveBeenCalled();
  });
});

describe('DELETE /api/documents/[id]', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return HTTP 401 if unauthenticated', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Unauthorized') }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/documents/doc-100', {
      method: 'DELETE',
    });
    const params = Promise.resolve({ id: 'doc-100' });

    const res = await deleteDocument(req, { params });
    expect(res.status).toBe(401);
  });

  it('should delete storage file and database row, returning HTTP 200', async () => {
    const mockDoc = {
      id: 'doc-100',
      file_path: 'lawyer-1/uuid_test_doc.pdf',
      lawyer_id: 'lawyer-1',
    };

    const mockRemove = vi.fn().mockResolvedValue({ error: null });

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockDoc, error: null }),
            }),
          }),
        }),
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      }),
      storage: {
        from: vi.fn().mockReturnValue({
          remove: mockRemove,
        }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/documents/doc-100', {
      method: 'DELETE',
    });
    const params = Promise.resolve({ id: 'doc-100' });

    const res = await deleteDocument(req, { params });
    expect(res.status).toBe(200);
    expect(mockRemove).toHaveBeenCalledWith(['lawyer-1/uuid_test_doc.pdf']);
  });
});
