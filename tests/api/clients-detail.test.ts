import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, PUT, DELETE } from '@/app/api/clients/[id]/route';

vi.mock('@/lib/supabase', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase';

describe('GET /api/clients/[id]', () => {
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

    const req = new NextRequest('http://localhost:3000/api/clients/client-123');
    const params = Promise.resolve({ id: 'client-123' });

    const res = await GET(req, { params });
    expect(res.status).toBe(401);
  });

  it('should return HTTP 200 with client details and associated cases', async () => {
    const mockClient = {
      id: 'client-123',
      name: 'أحمد علي',
      lawyer_id: 'lawyer-1',
      cases: [{ id: 'case-1', title: 'نزاع عقاري' }],
    };

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockClient, error: null }),
            }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients/client-123');
    const params = Promise.resolve({ id: 'client-123' });

    const res = await GET(req, { params });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(mockClient);
  });

  it('should return HTTP 404 if client does not exist or belongs to another lawyer', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116', message: 'Not found' } }),
            }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients/non-existent');
    const params = Promise.resolve({ id: 'non-existent' });

    const res = await GET(req, { params });
    expect(res.status).toBe(404);
  });
});

describe('PUT /api/clients/[id]', () => {
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

    const req = new NextRequest('http://localhost:3000/api/clients/client-123', {
      method: 'PUT',
      body: JSON.stringify({ name: 'اسم معدل' }),
    });
    const params = Promise.resolve({ id: 'client-123' });

    const res = await PUT(req, { params });
    expect(res.status).toBe(401);
  });

  it('should return HTTP 400 when input validation fails', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients/client-123', {
      method: 'PUT',
      body: JSON.stringify({ name: '' }),
    });
    const params = Promise.resolve({ id: 'client-123' });

    const res = await PUT(req, { params });
    expect(res.status).toBe(400);
  });

  it('should update client and return HTTP 200, ignoring lawyer_id in body', async () => {
    const updatedClient = {
      id: 'client-123',
      lawyer_id: 'lawyer-1',
      name: 'اسم معدل',
      email: 'updated@example.com',
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
                  single: vi.fn().mockResolvedValue({ data: updatedClient, error: null }),
                }),
              }),
            }),
          };
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients/client-123', {
      method: 'PUT',
      body: JSON.stringify({
        lawyer_id: 'malicious-id',
        name: 'اسم معدل',
        email: 'updated@example.com',
      }),
    });
    const params = Promise.resolve({ id: 'client-123' });

    const res = await PUT(req, { params });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(updatedClient);
    expect(updatedPayload.lawyer_id).toBeUndefined();
  });
});

describe('DELETE /api/clients/[id]', () => {
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

    const req = new NextRequest('http://localhost:3000/api/clients/client-123', {
      method: 'DELETE',
    });
    const params = Promise.resolve({ id: 'client-123' });

    const res = await DELETE(req, { params });
    expect(res.status).toBe(401);
  });

  it('should delete client and return HTTP 200', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        delete: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients/client-123', {
      method: 'DELETE',
    });
    const params = Promise.resolve({ id: 'client-123' });

    const res = await DELETE(req, { params });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json.success).toBe(true);
  });
});
