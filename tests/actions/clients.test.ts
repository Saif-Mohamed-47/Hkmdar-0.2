import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getClients, getClientById, createClientAction, updateClientAction, deleteClientAction } from '@/lib/actions/clients';

vi.mock('@/lib/supabase', () => ({
  createServerClient: vi.fn(),
}));

import { createServerClient } from '@/lib/supabase';

describe('Clients Server Actions (TDD)', () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getClients', () => {
    it('should successfully return the list of clients for the authenticated lawyer', async () => {
      const mockClients = [
        { id: '1', name: 'أحمد علي', lawyer_id: 'lawyer-123' },
        { id: '2', name: 'شركة النيل', lawyer_id: 'lawyer-123' },
      ];

      mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockClients, error: null }),
          }),
        }),
      };
      (createServerClient as any).mockReturnValue(mockSupabase);

      const result = await getClients();
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockClients);
    });

    it('should return error if unauthenticated', async () => {
      mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: new Error('Unauthorized') }),
        },
      };
      (createServerClient as any).mockReturnValue(mockSupabase);

      const result = await getClients();
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/unauthorized|تسجيل الدخول/i);
    });
  });

  describe('getClientById', () => {
    it('should return client details with associated cases', async () => {
      const mockClient = {
        id: 'client-1',
        name: 'أحمد علي',
        cases: [{ id: 'case-1', title: 'قضية عمالية' }],
      };

      mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: mockClient, error: null }),
            }),
          }),
        }),
      };
      (createServerClient as any).mockReturnValue(mockSupabase);

      const result = await getClientById('client-1');
      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockClient);
    });

    it('should fail if id is missing', async () => {
      const result = await getClientById('');
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('createClientAction', () => {
    it('should successfully create a new client when input is valid', async () => {
      const newClientInput = {
        name: 'محمود حسن',
        email: 'mahmoud@example.com',
        phone: '01012345678',
        address: 'القاهرة، مصر',
      };

      const createdRecord = { id: 'client-99', lawyer_id: 'lawyer-123', ...newClientInput };

      mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          insert: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi.fn().mockResolvedValue({ data: createdRecord, error: null }),
            }),
          }),
        }),
      };
      (createServerClient as any).mockReturnValue(mockSupabase);

      const result = await createClientAction(newClientInput);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(createdRecord);
    });

    it('should reject creation if client name is missing', async () => {
      const invalidInput = { name: '', email: 'test@example.com' };
      const result = await createClientAction(invalidInput);
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/اسم الموكل مطلوب/);
    });
  });

  describe('updateClientAction', () => {
    it('should successfully update client info', async () => {
      const updateData = { name: 'محمود حسن المعدل' };
      const updatedRecord = { id: 'client-99', name: 'محمود حسن المعدل' };

      mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          update: vi.fn().mockReturnValue({
            eq: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: updatedRecord, error: null }),
              }),
            }),
          }),
        }),
      };
      (createServerClient as any).mockReturnValue(mockSupabase);

      const result = await updateClientAction('client-99', updateData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(updatedRecord);
    });
  });

  describe('deleteClientAction', () => {
    it('should delete a client record', async () => {
      mockSupabase = {
        auth: {
          getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'lawyer-123' } }, error: null }),
        },
        from: vi.fn().mockReturnValue({
          delete: vi.fn().mockReturnValue({
            eq: vi.fn().mockResolvedValue({ error: null }),
          }),
        }),
      };
      (createServerClient as any).mockReturnValue(mockSupabase);

      const result = await deleteClientAction('client-99');
      expect(result.success).toBe(true);
    });
  });
});
