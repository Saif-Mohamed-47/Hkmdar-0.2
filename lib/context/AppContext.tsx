'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, CaseIntake, LawyerProfile, CaseStatus } from '../types';
import { MOCK_LAWYERS } from '../data/lawyersData';
import { INITIAL_CASES } from '../data/initialCases';
import { supabase } from '../supabaseClient';

interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
}

interface AppContextType {
  role: UserRole;
  user: User;
  setRole: (role: UserRole) => void;
  setUser: (user: User) => void;
  cases: CaseIntake[];
  lawyers: LawyerProfile[];
  selectedLawyerId: string;
  setSelectedLawyerId: (id: string) => void;
  activeLawyer: LawyerProfile;
  addCaseIntake: (newCase: Omit<CaseIntake, 'id' | 'createdAt' | 'updatedAt'>) => CaseIntake;
  updateCaseStatus: (caseId: string, status: CaseStatus, lawyerNotes?: string, courtDate?: string) => void;
  deleteCase: (caseId: string) => void;
  getCaseById: (caseId: string) => CaseIntake | undefined;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  isRTL: boolean;
}

const DEFAULT_CLIENT_USER: User = {
  id: 'guest-client',
  name: 'موكل جديد',
  email: '',
  phone: '',
  role: 'client',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
  location: 'القاهرة',
};

const DEFAULT_LAWYER_USER: User = {
  id: 'guest-lawyer',
  name: 'المحامي العام',
  email: '',
  phone: '',
  role: 'lawyer',
  avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=400',
  location: 'القاهرة',
  specialty: 'استشارات قانونية وقضايا عامة',
  barNumber: '',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_CASES_KEY = 'hakmdar_cases_v1';
const LOCAL_STORAGE_ROLE_KEY = 'hakmdar_role_v1';
const LOCAL_STORAGE_LANG_KEY = 'hakmdar_lang_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('client');
  const [lang, setLangState] = useState<'ar' | 'en'>('ar');
  const [cases, setCases] = useState<CaseIntake[]>(INITIAL_CASES);
  const [lawyers] = useState<LawyerProfile[]>(MOCK_LAWYERS);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>('lawyer-1');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<User>(DEFAULT_CLIENT_USER);

  // Sync Supabase Auth Session and local storage after mount
  useEffect(() => {
    setIsHydrated(true);
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const localUserData = localStorage.getItem('hakmdar_user_data_v1');

      if (session?.user) {
        const meta = session.user.user_metadata;
        const resolvedRole = (meta.role as UserRole) || 'client';
        setRoleState(resolvedRole);
        setUser({
          id: session.user.id,
          name: meta.full_name || meta.name || session.user.email || 'مستخدم',
          email: session.user.email || '',
          phone: meta.phone || meta.phone_number || '',
          role: resolvedRole,
          location: meta.location || meta.office_address || '',
          barNumber: meta.bar_number || meta.bar_association_number || '',
          specialty: meta.specialty || '',
          avatar: meta.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        });
      } else if (localUserData) {
        try {
          const parsed = JSON.parse(localUserData);
          setUser(parsed);
          setRoleState(parsed.role || 'client');
        } catch {
          setUser(DEFAULT_CLIENT_USER);
        }
      } else {
        const savedRole = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY) as UserRole;
        const activeRole = savedRole || role;
        setUser(activeRole === 'lawyer' ? DEFAULT_LAWYER_USER : DEFAULT_CLIENT_USER);
      }
    };

    syncSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata;
        const resolvedRole = (meta.role as UserRole) || 'client';
        setRoleState(resolvedRole);
        setUser({
          id: session.user.id,
          name: meta.full_name || meta.name || session.user.email || 'مستخدم',
          email: session.user.email || '',
          phone: meta.phone || meta.phone_number || '',
          role: resolvedRole,
          location: meta.location || meta.office_address || '',
          barNumber: meta.bar_number || meta.bar_association_number || '',
          specialty: meta.specialty || '',
          avatar: meta.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300',
        });
      } else {
        const localUserData = localStorage.getItem('hakmdar_user_data_v1');
        if (localUserData) {
          try {
            const parsed = JSON.parse(localUserData);
            setUser(parsed);
            setRoleState(parsed.role || 'client');
            return;
          } catch {}
        }
        setUser(role === 'lawyer' ? DEFAULT_LAWYER_USER : DEFAULT_CLIENT_USER);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [role]);

  // Hydrate from localStorage
  useEffect(() => {
    try {
      const savedCases = localStorage.getItem(LOCAL_STORAGE_CASES_KEY);
      if (savedCases) {
        setCases(JSON.parse(savedCases));
      }
      const savedRole = localStorage.getItem(LOCAL_STORAGE_ROLE_KEY) as UserRole;
      if (savedRole && (savedRole === 'client' || savedRole === 'lawyer')) {
        setRoleState(savedRole);
      }
      const savedLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY) as 'ar' | 'en';
      if (savedLang) {
        setLangState(savedLang);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    setIsHydrated(true);
  }, []);

  // Sync cases to localStorage
  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem(LOCAL_STORAGE_CASES_KEY, JSON.stringify(cases));
    }
  }, [cases, isHydrated]);

  // Sync role to localStorage
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_ROLE_KEY, newRole);
    }
    // Also update mock user if no Supabase session is active
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        setUser(newRole === 'lawyer' ? DEFAULT_LAWYER_USER : DEFAULT_CLIENT_USER);
      }
    });
    addToast({
      type: 'info',
      title: newRole === 'lawyer' ? 'تم التبديل إلى بوابة المحامي' : 'تم التبديل إلى بوابة الموكل',
      message: newRole === 'lawyer' ? 'أنت الآن في وضع المحامي مع صلاحيات إدارة القضايا' : 'أنت الآن في وضع الموكل واستخدام المساعد الذكي',
    });
  };

  const setLang = (newLang: 'ar' | 'en') => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem(LOCAL_STORAGE_LANG_KEY, newLang);
    }
  };

  const addToast = (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast: ToastNotification = {
      ...toast,
      id,
      timestamp: Date.now(),
    };
    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addCaseIntake = (newCaseData: Omit<CaseIntake, 'id' | 'createdAt' | 'updatedAt'>): CaseIntake => {
    const newCase: CaseIntake = {
      ...newCaseData,
      id: `case-intake-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setCases((prev) => [newCase, ...prev]);

    addToast({
      type: 'success',
      title: 'تم إرسال ملخص القضية للمحامي بنجاح',
      message: `تم تحويل القضية (${newCase.title}) إلى مكتب ${newCase.lawyerName || 'المحامي المختار'}`,
    });

    return newCase;
  };

  const updateCaseStatus = (
    caseId: string,
    status: CaseStatus,
    lawyerNotes?: string,
    courtDate?: string
  ) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id === caseId) {
          return {
            ...c,
            status,
            lawyerNotes: lawyerNotes !== undefined ? lawyerNotes : c.lawyerNotes,
            courtDate: courtDate !== undefined ? courtDate : c.courtDate,
            updatedAt: new Date().toISOString(),
          };
        }
        return c;
      })
    );

    const statusLabels: Record<CaseStatus, string> = {
      new_intake: 'طلب جديد',
      under_review: 'قيد المراجعة والدراسة',
      accepted: 'تم قبول القضية وتجهيز الإجراءات',
      in_court: 'مرفوعة أمام المحكمة المختصة',
      resolved: 'تم كسب القضية / التسوية',
      closed: 'مغلقة',
    };

    addToast({
      type: 'success',
      title: 'تم تحديث حالة القضية',
      message: `تم تغيير الحالة إلى: ${statusLabels[status]}`,
    });
  };

  const deleteCase = (caseId: string) => {
    setCases((prev) => prev.filter((c) => c.id !== caseId));
    addToast({
      type: 'warning',
      title: 'تم حذف القضية',
      message: 'تم إزالة ملف القضية من النظام',
    });
  };

  const getCaseById = (caseId: string) => {
    return cases.find((c) => c.id === caseId);
  };

  const activeLawyer = lawyers.find((l) => l.id === selectedLawyerId) || lawyers[0];
  const isRTL = lang === 'ar';

  return (
    <AppContext.Provider
      value={{
        role,
        user,
        setRole,
        setUser,
        cases,
        lawyers,
        selectedLawyerId,
        setSelectedLawyerId,
        activeLawyer,
        addCaseIntake,
        updateCaseStatus,
        deleteCase,
        getCaseById,
        toasts,
        addToast,
        removeToast,
        lang,
        setLang,
        isRTL,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
