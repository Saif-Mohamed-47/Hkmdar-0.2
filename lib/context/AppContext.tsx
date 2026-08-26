'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, CaseIntake, LawyerProfile, CaseStatus, LegalCategory, CaseUrgency } from '../types';
import { MOCK_LAWYERS } from '../data/lawyersData';
import { supabase } from '../supabaseClient';

export type AppTheme = 'dark' | 'light';

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
  addCaseIntake: (newCase: Omit<CaseIntake, 'id' | 'createdAt' | 'updatedAt'>) => Promise<CaseIntake>;
  updateCaseStatus: (caseId: string, status: CaseStatus, lawyerNotes?: string, courtDate?: string) => Promise<void>;
  deleteCase: (caseId: string) => Promise<void>;
  getCaseById: (caseId: string) => CaseIntake | undefined;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  isRTL: boolean;
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
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

const LOCAL_STORAGE_LANG_KEY = 'hakmdar_lang_v1';
const LOCAL_STORAGE_THEME_KEY = 'hakmdar_theme_v1';

let toastIdCounter = 0;
function createToastNotification(toast: Omit<ToastNotification, 'id' | 'timestamp'>): ToastNotification {
  toastIdCounter += 1;
  return {
    ...toast,
    id: `toast-${toastIdCounter}`,
    timestamp: 0,
  };
}

function mapDbCaseToCaseIntake(dbCase: Record<string, unknown>): CaseIntake {
  const statusMap: Record<string, CaseStatus> = {
    active: 'accepted',
    pending: 'new_intake',
    closed: 'closed',
    new_intake: 'new_intake',
    under_review: 'under_review',
    accepted: 'accepted',
    in_court: 'in_court',
    resolved: 'resolved',
  };

  const clientInfo = dbCase.clients as Record<string, string> | undefined;

  return {
    id: String(dbCase.id || ''),
    clientId: String(dbCase.client_id || ''),
    clientName: clientInfo?.name || 'موكل',
    clientEmail: clientInfo?.email || '',
    clientPhone: clientInfo?.phone || '',
    clientLocation: clientInfo?.address || 'القاهرة',
    lawyerId: String(dbCase.lawyer_id || ''),
    title: String(dbCase.title || 'قضية جديدة'),
    category: (dbCase.category as LegalCategory) || 'labor',
    urgency: (dbCase.urgency as CaseUrgency) || 'high',
    status: statusMap[String(dbCase.status)] || (dbCase.status as CaseStatus) || 'new_intake',
    executiveSummary: String(dbCase.description || ''),
    legalClaims: [],
    relevantStatutes: [],
    clientTimeline: [],
    aiStrategicRecommendation: '',
    createdAt: String(dbCase.created_at || new Date().toISOString()),
    updatedAt: String(dbCase.updated_at || dbCase.created_at || new Date().toISOString()),
    lawyerNotes: dbCase.lawyer_notes ? String(dbCase.lawyer_notes) : undefined,
    courtDate: dbCase.court_date ? String(dbCase.court_date) : undefined,
  };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('client');
  const [lang, setLangState] = useState<'ar' | 'en'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedLang = localStorage.getItem(LOCAL_STORAGE_LANG_KEY) as 'ar' | 'en';
        if (savedLang) return savedLang;
      } catch {}
    }
    return 'ar';
  });

  const applyThemeClass = (t: AppTheme) => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (t === 'dark') {
        root.classList.add('dark');
        root.classList.remove('light');
        root.setAttribute('data-theme', 'dark');
      } else {
        root.classList.remove('dark');
        root.classList.add('light');
        root.setAttribute('data-theme', 'light');
      }
    }
  };

  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTheme = localStorage.getItem(LOCAL_STORAGE_THEME_KEY) as AppTheme | null;
        if (savedTheme === 'light' || savedTheme === 'dark') {
          return savedTheme;
        }
      } catch {}
    }
    return 'dark';
  });

  const [cases, setCases] = useState<CaseIntake[]>([]);
  const [lawyers] = useState<LawyerProfile[]>(MOCK_LAWYERS);
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>('lawyer-1');
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [user, setUser] = useState<User>(DEFAULT_CLIENT_USER);

  // Sync DOM with current theme
  useEffect(() => {
    applyThemeClass(theme);
  }, [theme]);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    applyThemeClass(newTheme);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_THEME_KEY, newTheme);
      } catch {}
    }
  };

  const toggleTheme = () => {
    const nextTheme: AppTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  // Fetch cases belonging to the authenticated lawyer from backend
  const fetchUserCases = async (accessToken?: string) => {
    try {
      const headers: Record<string, string> = {};
      if (accessToken) {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }
      const res = await fetch('/api/cases', { headers });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data)) {
          setCases(data.map(mapDbCaseToCaseIntake));
        }
      }
    } catch (e) {
      console.warn('Failed to fetch cases from backend:', e);
    }
  };

  // Sync Supabase Auth Session
  useEffect(() => {
    const syncSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const meta = session.user.user_metadata || {};
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
        fetchUserCases(session.access_token);
      } else {
        setUser(DEFAULT_CLIENT_USER);
        setCases([]);
      }
    };

    syncSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const meta = session.user.user_metadata || {};
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
        fetchUserCases(session.access_token);
      } else {
        setUser(DEFAULT_CLIENT_USER);
        setCases([]);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
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

  const applyLanguageSettings = (l: 'ar' | 'en') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.setAttribute('lang', l);
      root.setAttribute('dir', l === 'ar' ? 'rtl' : 'ltr');
      if (l === 'en') {
        root.classList.add('font-sans-en');
      } else {
        root.classList.remove('font-sans-en');
      }
    }
  };

  useEffect(() => {
    applyLanguageSettings(lang);
  }, [lang]);

  const setLang = (newLang: 'ar' | 'en') => {
    setLangState(newLang);
    applyLanguageSettings(newLang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_LANG_KEY, newLang);
      } catch {}
    }
  };

  const addToast = (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const newToast = createToastNotification(toast);
    setToasts((prev) => [...prev.slice(-3), newToast]);

    setTimeout(() => {
      removeToast(newToast.id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const addCaseIntake = async (
    newCaseData: Omit<CaseIntake, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CaseIntake> => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      // Step 1: Ensure Client record exists or create one
      let clientId = newCaseData.clientId;
      if (!clientId || clientId === 'guest-client') {
        const clientRes = await fetch('/api/clients', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            name: newCaseData.clientName || 'موكل جديد',
            email: newCaseData.clientEmail || null,
            phone: newCaseData.clientPhone || null,
            address: newCaseData.clientLocation || null,
          }),
        });
        if (clientRes.ok) {
          const clientObj = await clientRes.json();
          clientId = clientObj.id;
        }
      }

      // Step 2: Post Case record to backend
      const caseRes = await fetch('/api/cases', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          client_id: clientId,
          title: newCaseData.title,
          status: 'pending',
          description: newCaseData.executiveSummary || null,
        }),
      });

      if (caseRes.ok) {
        const createdDbCase = await caseRes.json();
        const createdCase = mapDbCaseToCaseIntake(createdDbCase);

        setCases((prev) => [createdCase, ...prev]);

        addToast({
          type: 'success',
          title: 'تم إرسال ملخص القضية للمحامي بنجاح',
          message: `تم تحويل القضية (${createdCase.title}) إلى القضايا المسجلة`,
        });

        return createdCase;
      }
    } catch (err) {
      console.error('Error creating case intake:', err);
    }

    // Fallback in-memory representation if network or backend fail
    const fallbackCase: CaseIntake = {
      ...newCaseData,
      id: `case-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setCases((prev) => [fallbackCase, ...prev]);
    return fallbackCase;
  };

  const updateCaseStatus = async (
    caseId: string,
    status: CaseStatus,
    lawyerNotes?: string,
    courtDate?: string
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const dbStatus = (status === 'accepted' || status === 'in_court') ? 'active' : status === 'closed' ? 'closed' : 'pending';

      await fetch(`/api/cases/${caseId}`, {
        method: 'PUT',
        headers,
        body: JSON.stringify({
          status: dbStatus,
          description: lawyerNotes,
        }),
      });
    } catch (err) {
      console.error('Error updating case status:', err);
    }

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

  const deleteCase = async (caseId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      await fetch(`/api/cases/${caseId}`, {
        method: 'DELETE',
        headers,
      });
    } catch (err) {
      console.error('Error deleting case:', err);
    }

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
        theme,
        setTheme,
        toggleTheme,
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
