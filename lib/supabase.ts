import { createServerClient as createSsrClient } from '@supabase/ssr';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

/**
 * Standard Supabase client for client-side and generic usage.
 */
export const supabase = createClient();

/**
 * Factory to create a Supabase client instance using standard environment variables.
 */
export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  }
  return createSupabaseClient(supabaseUrl, supabaseAnonKey);
}

/**
 * Helper to get a configured Supabase client for Server Actions & App Router API endpoints.
 * Integrates @supabase/ssr for Next.js App Router while passing Authorization Bearer tokens
 * to global headers so database queries respect PostgreSQL Row Level Security (RLS).
 */
export function createServerClient(context?: NextRequest | Request | Headers | string) {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)');
  }

  let token: string | undefined;

  if (typeof context === 'string') {
    token = context.startsWith('Bearer ') ? context.substring(7) : context;
  } else if (context instanceof Headers) {
    const authHeader = context.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  } else if (context && 'headers' in context && context.headers) {
    const authHeader = typeof context.headers.get === 'function' 
      ? context.headers.get('authorization')
      : (context.headers as any)['authorization'];
    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }

  const globalHeaders: Record<string, string> = {};
  if (token) {
    globalHeaders['Authorization'] = `Bearer ${token}`;
  }

  return createSsrClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      async getAll() {
        try {
          const cookieStore = await cookies();
          return cookieStore.getAll();
        } catch {
          return [];
        }
      },
      async setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
        try {
          const cookieStore = await cookies();
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Ignored when setting cookies is unsupported
        }
      },
    },
    global: {
      headers: globalHeaders,
    },
  });
}
