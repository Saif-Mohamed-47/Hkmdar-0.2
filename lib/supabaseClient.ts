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

  // Supabase Auth signUp with metadata in options.data
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
    return { user: null, session: null, error, isDemo: false };
  }

  return { user: data.user, session: data.session, error: null, isDemo: false };
}

/**
 * Sign in existing user with Supabase Authentication.
 */
export async function signInUser(params: SignInParams) {
  const { email, password } = params;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error, isDemo: false };
  }

  return { user: data.user, session: data.session, error: null, isDemo: false };
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  return await supabase.auth.signOut();
}
