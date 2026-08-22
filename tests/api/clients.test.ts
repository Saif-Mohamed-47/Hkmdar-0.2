import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET, POST } from '@/app/api/clients/route';

vi.mock('@/lib/supabase', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase';

describe('GET /api/clients', () => {
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

    const req = new NextRequest('http://localhost:3000/api/clients', {
      method: 'GET',
    });

    const res = await GET(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toMatch(/Unauthorized|تسجيل الدخول/i);
  });

  it('should return HTTP 200 with clients belonging to the authenticated lawyer', async () => {
    const mockClients = [
      { id: 'c1', name: 'أحمد علي', lawyer_id: 'lawyer-123', email: 'ahmed@example.com' },
      { id: 'c2', name: 'شركة النيل', lawyer_id: 'lawyer-123', email: null },
    ];

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockClients, error: null }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients', {
      method: 'GET',
      headers: {
        authorization: 'Bearer fake-token',
      },
    });

    const res = await GET(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(mockClients);
    expect(mockSupabase.from).toHaveBeenCalledWith('clients');
  });

  it('should return HTTP 500 when database query fails', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database failure' } }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients', {
      method: 'GET',
    });

    const res = await GET(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe('Database failure');
  });
});

describe('POST /api/clients', () => {
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

    const req = new NextRequest('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify({ name: 'مستثمر جديد' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(401);

    const json = await res.json();
    expect(json.error).toMatch(/Unauthorized|تسجيل الدخول/i);
  });

  it('should return HTTP 400 when name is missing', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify({ email: 'test@example.com' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/اسم الموكل مطلوب|Invalid input/i);
  });

  it('should return HTTP 400 when body is invalid JSON', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients', {
      method: 'POST',
      body: 'invalid-json{',
    });

    const res = await POST(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/Invalid JSON|غير صالحة/);
  });

  it('should successfully create client and return HTTP 201 when payload is valid', async () => {
    const createdClient = {
      id: 'client-55',
      lawyer_id: 'lawyer-123',
      name: 'محمود حسن',
      email: 'mahmoud@example.com',
      phone: '01012345678',
      address: 'القاهرة',
      created_at: new Date().toISOString(),
    };

    let insertedPayload: any = null;

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation((payload) => {
          insertedPayload = payload;
          return {
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: createdClient, error: null }),
            }),
          };
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify({
        name: 'محمود حسن',
        email: 'mahmoud@example.com',
        phone: '01012345678',
        address: 'القاهرة',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json).toEqual(createdClient);
    expect(insertedPayload).toEqual({
      lawyer_id: 'lawyer-123',
      name: 'محمود حسن',
      email: 'mahmoud@example.com',
      phone: '01012345678',
      address: 'القاهرة',
    });
  });

  it('should override lawyer_id with authenticated user id even if lawyer_id is sent in request body', async () => {
    const createdClient = {
      id: 'client-56',
      lawyer_id: 'lawyer-123',
      name: 'محمود حسن',
      email: null,
      phone: null,
      address: null,
      created_at: new Date().toISOString(),
    };

    let insertedPayload: any = null;

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockImplementation((payload) => {
          insertedPayload = payload;
          return {
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: createdClient, error: null }),
            }),
          };
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify({
        lawyer_id: 'malicious-lawyer-999',
        name: 'محمود حسن',
      }),
    });

    const res = await POST(req);
    expect(res.status).toBe(201);
    expect(insertedPayload.lawyer_id).toBe('lawyer-123');
    expect(insertedPayload.lawyer_id).not.toBe('malicious-lawyer-999');
  });

  it('should return HTTP 500 when database insertion fails', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        insert: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'DB Error' } }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/clients', {
      method: 'POST',
      body: JSON.stringify({ name: 'عميل جديد' }),
    });

    const res = await POST(req);
    expect(res.status).toBe(500);

    const json = await res.json();
    expect(json.error).toBe('DB Error');
  });
});
