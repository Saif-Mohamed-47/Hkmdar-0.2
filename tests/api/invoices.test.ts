import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { GET as getInvoices, POST as createInvoice } from '@/app/api/invoices/route';
import { GET as getInvoiceById } from '@/app/api/invoices/[id]/route';

vi.mock('@/lib/supabase', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase';

describe('GET /api/invoices', () => {
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

    const req = new NextRequest('http://localhost:3000/api/invoices');
    const res = await getInvoices(req);
    expect(res.status).toBe(401);
  });

  it('should return HTTP 200 with lawyer invoices and line items', async () => {
    const mockInvoices = [
      { id: 'inv-1', case_id: 'case-1', total_amount: 1500, status: 'draft', invoice_items: [] },
    ];

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockInvoices, error: null }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/invoices');
    const res = await getInvoices(req);
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(mockInvoices);
  });
});

describe('POST /api/invoices', () => {
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

    const req = new NextRequest('http://localhost:3000/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ case_id: 'case-1' }),
    });

    const res = await createInvoice(req);
    expect(res.status).toBe(401);
  });

  it('should return HTTP 400 if no unbilled time entries exist for the case', async () => {
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
        if (table === 'time_entries') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: [], error: null }),
              }),
            }),
          };
        }
        if (table === 'invoice_items') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
          };
        }
        return {};
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ case_id: 'case-1' }),
    });

    const res = await createInvoice(req);
    expect(res.status).toBe(400);

    const json = await res.json();
    expect(json.error).toMatch(/غير مفوترة|no unbilled/i);
  });

  it('should generate invoice and invoice_items from unbilled time entries, returning HTTP 201', async () => {
    const unbilledTimeEntries = [
      { id: 'te-1', case_id: 'case-1', description: 'جلسة محكمة', duration_minutes: 120, hourly_rate: 500 }, // 2 hrs * 500 = 1000
      { id: 'te-2', case_id: 'case-1', description: 'دراسة القضية', duration_minutes: 60, hourly_rate: 400 }, // 1 hr * 400 = 400
    ];

    const mockInvoice = {
      id: 'inv-10',
      case_id: 'case-1',
      lawyer_id: 'lawyer-1',
      total_amount: 1400,
      status: 'draft',
    };

    const mockInvoiceItems = [
      { id: 'ii-1', invoice_id: 'inv-10', case_id: 'case-1', description: 'جلسة محكمة', hours: 2, rate: 500, line_total: 1000 },
      { id: 'ii-2', invoice_id: 'inv-10', case_id: 'case-1', description: 'دراسة القضية', hours: 1, rate: 400, line_total: 400 },
    ];

    let insertedInvoice: any = null;
    let insertedItems: any = null;

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
        if (table === 'time_entries') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                eq: vi.fn().mockResolvedValue({ data: unbilledTimeEntries, error: null }),
              }),
            }),
          };
        }
        if (table === 'invoice_items') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockResolvedValue({ data: [], error: null }),
            }),
            insert: vi.fn().mockImplementation((items) => {
              insertedItems = items;
              return {
                select: vi.fn().mockResolvedValue({ data: mockInvoiceItems, error: null }),
              };
            }),
          };
        }
        if (table === 'invoices') {
          return {
            insert: vi.fn().mockImplementation((payload) => {
              insertedInvoice = payload;
              return {
                select: vi.fn().mockReturnValue({
                  single: vi.fn().mockResolvedValue({ data: mockInvoice, error: null }),
                }),
              };
            }),
          };
        }
        return {};
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/invoices', {
      method: 'POST',
      body: JSON.stringify({ case_id: 'case-1' }),
    });

    const res = await createInvoice(req);
    expect(res.status).toBe(201);

    const json = await res.json();
    expect(json.invoice).toEqual(mockInvoice);
    expect(insertedInvoice.total_amount).toBe(1400);
    expect(insertedItems.length).toBe(2);
  });
});

describe('GET /api/invoices/[id]', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return invoice details with line items', async () => {
    const mockInvoiceDetail = {
      id: 'inv-10',
      case_id: 'case-1',
      total_amount: 1400,
      status: 'draft',
      invoice_items: [{ id: 'ii-1', description: 'جلسة محكمة', line_total: 1000 }],
      cases: { title: 'قضية تعويض' },
    };

    mockSupabase = {
      auth: {
        getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-1' } }, error: null }),
      },
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockInvoiceDetail, error: null }),
            }),
          }),
        }),
      }),
    };
    (createServerClient as any).mockReturnValue(mockSupabase);

    const req = new NextRequest('http://localhost:3000/api/invoices/inv-10');
    const params = Promise.resolve({ id: 'inv-10' });

    const res = await getInvoiceById(req, { params });
    expect(res.status).toBe(200);

    const json = await res.json();
    expect(json).toEqual(mockInvoiceDetail);
  });
});
