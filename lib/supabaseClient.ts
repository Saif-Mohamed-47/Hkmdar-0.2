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
        bar_number: barNumber || null,
        specialty: specialty || null,
        location: location || 'القاهرة',
        created_at: new Date().toISOString(),
      },
    },
  });

  if (error) {
    // If not configured, we provide simulated success for demo purposes if it was a network failure to placeholder
    if (!isSupabaseConfigured && (error.message.includes('FetchError') || error.message.includes('Failed to fetch') || error.message.includes('Invalid API key') || error.status === 401 || error.status === 400)) {
      return {
        user: {
          id: `user-${Date.now()}`,
          email,
          user_metadata: {
            role,
            full_name: fullName,
            phone,
            bar_number: barNumber,
            specialty,
            location,
          },
        },
        session: null,
        error: null,
        isDemo: true,
      };
    }
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
    // Fallback demo simulation if Supabase credentials are placeholders
    if (!isSupabaseConfigured && (error.message.includes('FetchError') || error.message.includes('Failed to fetch') || error.message.includes('Invalid API key') || error.status === 401 || error.status === 400)) {
      const isLawyer = email.includes('lawyer') || email.includes('tarek') || email.includes('kadi');
      return {
        user: {
          id: isLawyer ? 'lawyer-demo-1' : 'client-demo-1',
          email,
          user_metadata: {
            role: isLawyer ? ('lawyer' as UserRole) : ('client' as UserRole),
            full_name: isLawyer ? 'المستشار / طارق عبد العزيز القاضي' : 'أحمد إبراهيم منصور',
            phone: isLawyer ? '+20 100 234 5678' : '+20 102 334 9988',
            bar_number: isLawyer ? 'EG-BAR-104928' : undefined,
          },
        },
        session: null,
        error: null,
        isDemo: true,
      };
    }
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
