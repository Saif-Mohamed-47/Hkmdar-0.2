import { createClient } from '@supabase/supabase-js';
import { UserRole, LegalCategory } from './types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseUrl.includes('hakmdar-demo')
);

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);

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

  if (!isSupabaseConfigured) {
    return {
      user: null,
      session: null,
      error: new Error('تعذر الاتصال بـ Supabase. يرجى التأكد من إعداد متغيرات البيئة بشكل صحيح.'),
    };
  }

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
    return { user: null, session: null, error };
  }

  return { user: data.user, session: data.session, error: null };
}

/**
 * Sign in existing user with Supabase Authentication.
 */
export async function signInUser(params: SignInParams) {
  const { email, password } = params;

  if (!isSupabaseConfigured) {
    return {
      user: null,
      session: null,
      error: new Error('تعذر الاتصال بـ Supabase. يرجى التأكد من إعداد متغيرات البيئة بشكل صحيح.'),
    };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { user: null, session: null, error };
  }

  return { user: data.user, session: data.session, error: null };
}

/**
 * Sign out current user.
 */
export async function signOutUser() {
  return await supabase.auth.signOut();
}
