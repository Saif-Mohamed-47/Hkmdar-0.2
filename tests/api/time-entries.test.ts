import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getTimeEntries, POST as createTimeEntry } from '@/app/api/time-entries/route';

vi.mock('@/lib/supabase', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase';

describe('GET /api/time-entries', () => {
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

    const req = new NextRequest('http://localhost:3000/api/time-entries');
    const res = await getTimeEntries(req);
    expect(res.status).toBe(401);
  });

  it('should return HTTP 200 with lawyer time entries', async () => {
    const mockEntries = [
      { id: 'te-1', case_id: 'case-1', lawyer_id: 'lawyer-1', description: 'صياغة المذكرة', duration_minutes: 120, hourly_rate: 500, date: '2026-08-15' },
    ];

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockEntries, error: null }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/time-entries');
    const res = await getTimeEntries(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(mockEntries);
  });
});

describe('POST /api/time-entries', () => {
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

    const req = new NextRequest('http://localhost:3000/api/time-entries', {
      method: 'POST',
      body: JSON.stringify({
        case_id: 'case-1',
        description: 'جلسة استشارة',
        duration_minutes: 60,
        hourly_rate: 400,
        date: '2026-08-16',
      }),
    });
    const res = await createTimeEntry(req);
    expect(res.status).toBe(401);
  });

  it('should return HTTP 400 when duration_minutes <= 0', async () => {
    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/time-entries', {
      method: 'POST',
      body: JSON.stringify({
        case_id: 'case-1',
        description: 'جلسة استشارة',
        duration_minutes: 0,
        hourly_rate: 400,
        date: '2026-08-16',
      }),
    });
    const res = await createTimeEntry(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/أكبر من صفر|duration_minutes/i);
  });

  it('should successfully create time entry and return HTTP 201', async () => {
    const createdEntry = {
      id: 'te-99',
      lawyer_id: 'lawyer-1',
      case_id: 'case-1',
      description: 'حضور الجلسة',
      duration_minutes: 90,
      hourly_rate: 600,
      date: '2026-08-16',
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
              single: vi.fn().mockResolvedValue({ data: createdEntry, error: null }),
            }),
          };
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/time-entries', {
      method: 'POST',
      body: JSON.stringify({
        lawyer_id: 'malicious-user',
        case_id: 'case-1',
        description: 'حضور الجلسة',
        duration_minutes: 90,
        hourly_rate: 600,
        date: '2026-08-16',
      }),
    });

    const res = await createTimeEntry(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json).toEqual(createdEntry);
    expect(insertedPayload.lawyer_id).toBe('lawyer-1');
  });
});
