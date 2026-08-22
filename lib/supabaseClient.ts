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
const USERS_DB_KEY = 'hakmdar_registered_users_db_v1';

function getRegisteredUsers(): Array<{ email: string; password: string; user: any }> {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_DB_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveRegisteredUser(record: { email: string; password: string; user: any }) {
  if (typeof window === 'undefined') return;
  try {
    const users = getRegisteredUsers().filter((u) => u.email.toLowerCase() !== record.email.toLowerCase());
    users.push(record);
    localStorage.setItem(USERS_DB_KEY, JSON.stringify(users));
  } catch {}
}

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
      if (error.message?.includes('fetch') || error.message?.includes('network') || !isSupabaseConfigured) {
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
        saveRegisteredUser({ email: params.email, password: params.password, user: mockUser });
        return { user: mockUser as any, session: { user: mockUser } as any, error: null, isDemo: true };
      }
      return { user: null, session: null, error, isDemo: false };
    }

    return { user: data.user, session: data.session, error: null, isDemo: false };
  } catch (err: any) {
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
    saveRegisteredUser({ email: params.email, password: params.password, user: mockUser });
    return { user: mockUser as any, session: { user: mockUser } as any, error: null, isDemo: true };
  }
}

/**
 * Sign in existing user with Supabase Authentication.
 * Rejects un-registered users strictly.
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
        const registeredUsers = getRegisteredUsers();
        const found = registeredUsers.find(
          (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );

        if (!found) {
          const emailExists = registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
          if (emailExists) {
            return { user: null, session: null, error: new Error('كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.'), isDemo: false };
          }
          return { user: null, session: null, error: new Error('هذا البريد الإلكتروني غير مسجل لدينا. يرجى إنشاء حساب جديد أولاً.'), isDemo: false };
        }

        return { user: found.user as any, session: { user: found.user } as any, error: null, isDemo: true };
      }
      return { user: null, session: null, error, isDemo: false };
    }

    return { user: data.user, session: data.session, error: null, isDemo: false };
  } catch (err: any) {
    const registeredUsers = getRegisteredUsers();
    const found = registeredUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (!found) {
      const emailExists = registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase());
      if (emailExists) {
        return { user: null, session: null, error: new Error('كلمة المرور غير صحيحة. يرجى المحاولة مرة أخرى.'), isDemo: false };
      }
      return { user: null, session: null, error: new Error('هذا البريد الإلكتروني غير مسجل لدينا. يرجى إنشاء حساب جديد أولاً.'), isDemo: false };
    }

    return { user: found.user as any, session: { user: found.user } as any, error: null, isDemo: true };
  }
}

/**
 * Sign out current user
 */
export async function signOutUser() {
  return await supabase.auth.signOut();
}
