import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getCases, POST as createCase } from '@/app/api/cases/route';
import { GET as getCaseById, PUT as updateCase } from '@/app/api/cases/[id]/route';

vi.mock('@/lib/supabase', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase';

describe('GET /api/cases', () => {
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

    const req = new NextRequest('http://localhost:3000/api/cases');
    const res = await getCases(req);
    expect(res.status).toBe(401);
  });

  it('should return HTTP 200 with lawyer cases including client info', async () => {
    const mockCases = [
      { id: 'case-1', title: 'قضية تعويض', status: 'active', client_id: 'c-1', clients: { name: 'علي حسن' } },
    ];

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockCases, error: null }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/cases');
    const res = await getCases(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(mockCases);
  });
});

describe('POST /api/cases', () => {
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

    const req = new NextRequest('http://localhost:3000/api/cases', {
      method: 'POST',
      body: JSON.stringify({ client_id: 'c-1', title: 'قضية جديدة', status: 'active' }),
    });
    const res = await createCase(req);
    expect(res.status).toBe(401);
  });

  it('should return HTTP 400 when status is invalid', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/cases', {
      method: 'POST',
      body: JSON.stringify({ client_id: 'c-1', title: 'قضية جديدة', status: 'invalid-status' }),
    });
    const res = await createCase(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/حالة القضية غير صالحة|Invalid/);
  });

  it('should create case and return HTTP 201, overriding lawyer_id with authenticated user id', async () => {
    const createdCase = {
      id: 'case-99',
      lawyer_id: 'lawyer-1',
      client_id: 'c-1',
      title: 'نزاع عمالي',
      status: 'active',
    };

    let insertedPayload: any = null;

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation((payload) => {
          insertedPayload = payload;
          return {
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: createdCase, error: null }),
            }),
          };
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/cases', {
      method: 'POST',
      body: JSON.stringify({
        lawyer_id: 'malicious-lawyer-9',
        client_id: 'c-1',
        title: 'نزاع عمالي',
        status: 'active',
      }),
    });
    const res = await createCase(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json).toEqual(createdCase);
    expect(insertedPayload.lawyer_id).toBe('lawyer-1');
  });
});

describe('GET /api/cases/[id]', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return case with associated client, documents, time_entries', async () => {
    const mockFullCase = {
      id: 'case-1',
      title: 'نزاع تجاري',
      status: 'active',
      clients: { name: 'شركة النيل' },
      documents: [{ id: 'doc-1', file_name: 'عقد_التأسيس.pdf' }],
      time_entries: [{ id: 'te-1', description: 'جلسة الاستماع' }],
    };

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockFullCase, error: null }),
            }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/cases/case-1');
    const params = Promise.resolve({ id: 'case-1' });

    const res = await getCaseById(req, { params });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(mockFullCase);
  });
});

describe('PUT /api/cases/[id]', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update case and return HTTP 200', async () => {
    const updatedCase = {
      id: 'case-1',
      lawyer_id: 'lawyer-1',
      title: 'عنوان جديد',
      status: 'closed',
    };

    let updatedPayload: any = null;

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        update: vi.fn().mockImplementation((payload) => {
          updatedPayload = payload;
          return {
            eq: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: updatedCase, error: null }),
                }),
              }),
            }),
          };
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/cases/case-1', {
      method: 'PUT',
      body: JSON.stringify({ title: 'عنوان جديد', status: 'closed' }),
    });
    const params = Promise.resolve({ id: 'case-1' });

    const res = await updateCase(req, { params });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(updatedCase);
    expect(updatedPayload.lawyer_id).toBeUndefined();
    expect(updatedPayload.client_id).toBeUndefined();
  });
});
