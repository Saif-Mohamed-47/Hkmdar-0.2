import { createClient } from '@supabase/supabase-js';
import { UserRole, LegalCategory } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hakmdar-demo.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.dummy-anon-key';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('hakmdar-demo')
);

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export interface SignUpParams {
  email: string;
  password: string;
  role: UserRole;
  fullName: string;
  phone: string;
  barNumber?: string;
  specialty?: LegalCategory;
  location?: string;
}

export interface SignInParams {
  email: string;
  password: string;
}

/**
 * Sign up a new user with Supabase Authentication.
 * Passes role and custom profile fields inside options.data.
 */
export async function signUpUser(params: SignUpParams) {
  const { email, password, role, fullName, phone, barNumber, specialty, location } = params;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role,
          full_name: fullName,
          phone,
          phone_number: phone,
          bar_number: barNumber || null,
          bar_association_number: barNumber || null,
          specialty: specialty || null,
          location: location || 'القاهرة',
          office_address: location || 'القاهرة',
          created_at: new Date().toISOString(),
        },
      },
    });

    if (error) {
      // If network/domain fails or dummy credentials, fallback to demo local session
      if (error.message?.includes('fetch') || error.message?.includes('network') || !isSupabaseConfigured) {
        return createMockUser(params);
      }
      return { user: null, session: null, error, isDemo: false };
    }

    return { user: data.user, session: data.session, error: null, isDemo: false };
  } catch (err: any) {
    return createMockUser(params);
  }
}

function createMockUser(params: SignUpParams) {
  const mockUser = {
    id: `usr_${Date.now()}`,
    email: params.email,
    user_metadata: {
      role: params.role,
      full_name: params.fullName,
      phone: params.phone,
      phone_number: params.phone,
      bar_number: params.barNumber || null,
      specialty: params.specialty || null,
      location: params.location || 'القاهرة',
    },
  };
  return { user: mockUser as any, session: { user: mockUser } as any, error: null, isDemo: true };
}

/**
 * Sign in existing user with Supabase Authentication.
 */
export async function signInUser(params: SignInParams) {
  const { email, password } = params;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message?.includes('fetch') || error.message?.includes('network') || !isSupabaseConfigured) {
        const mockRole: UserRole = email.includes('lawyer') ? 'lawyer' : 'client';
        const mockUser = {
          id: `usr_demo_${Date.now()}`,
          email,
          user_metadata: {
            role: mockRole,
            full_name: mockRole === 'lawyer' ? 'المستشار / طارق القاضي' : 'أحمد إبراهيم منصور',
          },
        };
        return { user: mockUser as any, session: { user: mockUser } as any, error: null, isDemo: true };
      }
      return { user: null, session: null, error, isDemo: false };
    }

    return { user: data.user, session: data.session, error: null, isDemo: false };
  } catch (err: any) {
    const mockRole: UserRole = email.includes('lawyer') ? 'lawyer' : 'client';
    const mockUser = {
      id: `usr_demo_${Date.now()}`,
      email,
      user_metadata: {
        role: mockRole,
        full_name: mockRole === 'lawyer' ? 'المستشار / طارق القاضي' : 'أحمد إبراهيم منصور',
      },
    };
    return { user: mockUser as any, session: { user: mockUser } as any, error: null, isDemo: true };
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  return await supabase.auth.signOut();
}
