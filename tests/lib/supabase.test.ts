import { describe, it, expect } from 'vitest';
import { NextRequest } from 'next/server';
import { createServerClient } from '@/lib/supabase';

describe('createServerClient utility', () => {
  it('should extract Bearer token from NextRequest and attach Authorization header', () => {
    const req = new NextRequest('http://localhost:3000/api/clients', {
      headers: {
        authorization: 'Bearer token-abc-123',
      },
    });

    const client = createServerClient(req);
    expect(client).toBeDefined();

    // In SupabaseClient instance, headers passed via global.headers are attached to rest.headers or auth
    const restHeaders = (client as any).rest?.headers || (client as any).headers || (client as any).global?.headers;
    // Check if global headers were configured
    expect((client as any).global?.headers?.['Authorization'] || (client as any).rest?.headers?.['Authorization'] || (client as any).auth?.headers?.['Authorization']).toBeDefined();
  });

  it('should accept direct string token', () => {
    const client = createServerClient('token-xyz-789');
    expect(client).toBeDefined();

    const authHeader = (client as any).global?.headers?.['Authorization'] || (client as any).rest?.headers?.['Authorization'] || (client as any).auth?.headers?.['Authorization'];
    expect(authHeader).toBe('Bearer token-xyz-789');
  });

  it('should handle unauthenticated context gracefully', () => {
    const client = createServerClient();
    expect(client).toBeDefined();
  });
});
