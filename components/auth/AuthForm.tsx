'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { UserRole, LegalCategory, User } from '@/lib/types';
import { LEGAL_CATEGORIES_INFO } from '@/lib/data/legalData';
import { signUpUser, signInUser } from '@/lib/supabaseClient';
import { loginSchema, registerSchema, RegisterFormData } from '@/lib/validations/authSchemas';
import RoleSelector from './RoleSelector';
import ThemeToggle from '@/components/ui/ThemeToggle';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  Award,
  MapPin,
  Loader2,
  AlertCircle,
  ShieldCheck,
  Building2,
  Scale,
  Gavel,
  ArrowRight
} from 'lucide-react';

interface AuthFormProps {
  initialMode?: 'login' | 'register';
  defaultRole?: UserRole;
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5 text-right">
      <label className="block text-xs font-semibold text-[var(--text-secondary)]">
        {label}
        {required && <span className="text-amber-500 mr-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-rose-500 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150 justify-start">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  );
}

const inputBase =
  'w-full py-2.5 rounded-xl bg-[var(--bg-input)] border text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none transition-all duration-200';
const inputOk = 'border-[var(--border-subtle)] focus:border-[var(--accent-gold)] focus:ring-1 focus:ring-[var(--accent-gold)]/20';
const inputErr = 'border-rose-500/70 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/20';

export default function AuthForm({ initialMode = 'login', defaultRole = 'client' }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setRole: setAppRole, addToast, setUser: setAppUser } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [role, setSelectedRole] = useState<UserRole>(defaultRole);
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [location, setLocation] = useState('القاهرة');
  const [barNumber, setBarNumber] = useState('');
  const [specialty, setSpecialty] = useState<LegalCategory>('labor');
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [rememberMe, setRememberMe] = useState(true);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Sync role from query params if available
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'lawyer' || roleParam === 'client') {
      setSelectedRole(roleParam);
    }
  }, [searchParams]);

  const clearErr = (field: string) => setErrors((prev) => ({ ...prev, [field]: '' }));

  const handleModeSwitch = (targetMode: 'login' | 'register') => {
    setMode(targetMode);
    setErrors({});
    setServerError(null);
    if (targetMode === 'login') {
      router.replace('/login');
    } else {
      router.replace(role === 'lawyer' ? '/register?role=lawyer' : '/register?role=client');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setServerError(null);

    if (mode === 'login') {
      const result = loginSchema.safeParse({ email, password, rememberMe });
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.issues.forEach((i) => {
          if (i.path[0]) errs[i.path[0].toString()] = i.message;
        });
        setErrors(errs);
        addToast({ type: 'error', title: 'بيانات غير مكتملة', message: 'يرجى إدخال البريد الإلكتروني وكلمة المرور بشكل صحيح.' });
        return;
      }

      setIsLoading(true);
      try {
        const { user, error } = await signInUser({ email, password });
        if (error) {
          const msg = error.message || 'فشل تسجيل الدخول. يرجى التحقق من صحة البيانات.';
          setServerError(msg);
          addToast({ type: 'error', title: 'تعذر تسجيل الدخول', message: msg });
          return;
        }
        const resolvedRole: UserRole = (user?.user_metadata?.role as UserRole) || 'client';
        const savedName = user?.user_metadata?.full_name || (email.split('@')[0]);
        const loggedUser: User = {
          id: user?.id || `usr_${Date.now()}`,
          name: savedName,
          email,
          phone: user?.user_metadata?.phone || '',
          role: resolvedRole,
          location: user?.user_metadata?.location || 'القاهرة',
        };

        setAppUser(loggedUser);
        setAppRole(resolvedRole);
        addToast({
          type: 'success',
          title: 'تم تسجيل الدخول بنجاح',
          message: resolvedRole === 'lawyer' ? 'مرحباً بك في لوحة تحكم المحامي' : 'مرحباً بك في بوابة الاستشارات القانونية',
        });
        router.push(resolvedRole === 'lawyer' ? '/dashboard' : '/client/dashboard');
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء الاتصال بالخادم';
        setServerError(msg);
        addToast({ type: 'error', title: 'خطأ في النظام', message: msg });
      } finally {
        setIsLoading(false);
      }
    } else {
      const registerData: RegisterFormData = {
        fullName,
        email,
        phone,
        password,
        location,
        role,
        barNumber: role === 'lawyer' ? barNumber : undefined,
        specialty: role === 'lawyer' ? specialty : undefined,
        agreeTerms,
      };
      const result = registerSchema.safeParse(registerData);
      if (!result.success) {
        const errs: Record<string, string> = {};
        result.error.issues.forEach((i) => {
          if (i.path[0]) errs[i.path[0].toString()] = i.message;
        });
        setErrors(errs);
        addToast({ type: 'error', title: 'بيانات غير مستوفاة', message: 'يرجى استكمال الحقول المطلوبة بالشكل الصحيح.' });
        return;
      }

      setIsLoading(true);
      try {
        const { user: newUser, session, error } = await signUpUser({
          email,
          password,
          role,
          fullName,
          phone,
          barNumber: role === 'lawyer' ? barNumber : undefined,
          specialty: role === 'lawyer' ? specialty : undefined,
          location,
        });
        if (error) {
          const msg = error.message || 'فشل إنشاء الحساب عبر مزود المصادقة.';
          setServerError(msg);
          addToast({ type: 'error', title: 'تعذر إنشاء الحساب', message: msg });
          return;
        }

        // Email confirmation check
        if (!session) {
          addToast({
            type: 'info',
            title: 'تأكيد الحساب',
            message: 'تم إرسال رابط تأكيد الحساب إلى بريدك الإلكتروني لتفعيله.',
          });
          router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
          return;
        }

        const meta = newUser?.user_metadata || {};
        const savedUserName = meta.full_name || fullName || email.split('@')[0];
        const realUser: User = {
          id: newUser?.id || `usr_${Date.now()}`,
          name: savedUserName,
          email: newUser?.email || email,
          phone: meta.phone || phone,
          role,
          location: meta.location || location,
          barNumber: meta.bar_number || barNumber,
          specialty: meta.specialty || specialty,
        };

        setAppUser(realUser);
        setAppRole(role);
        addToast({
          type: 'success',
          title: 'تم إنشاء الحساب بنجاح',
          message: role === 'lawyer' ? 'أهلاً بك في منصة حكمدار للمحامين' : 'تم تفعيل حسابك بنجاح في حكمدار',
        });
        window.location.href = role === 'lawyer' ? '/dashboard' : '/client/dashboard';
        return;
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'حدث خطأ غير متوقع أثناء إنشاء الحساب';
        setServerError(msg);
        addToast({ type: 'error', title: 'خطأ في الاتصال', message: msg });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const isLawyer = role === 'lawyer';
  const icc = (field: string) => (errors[field] ? inputErr : inputOk);

  return (
    <div className="w-full max-w-5xl mx-auto rounded-2xl legal-card shadow-xl overflow-hidden relative border border-[var(--border-card)]">
      
      {/* Top Header Floating Controls */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <ThemeToggle />
      </div>

      <div className="absolute top-4 right-4 z-20">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition-colors"
        >
          <ArrowRight className="w-3.5 h-3.5" />
          <span>الرئيسية</span>
        </Link>
      </div>

      {/* Two-column layout: Brand + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">
        
        {/* BRAND PANEL (right side in RTL) */}
        <div className="bg-gradient-to-b from-[#060a14] via-[#091122] to-[#04070e] p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden order-first lg:order-last">
          
          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#1e293b20,transparent_70%)] pointer-events-none" />

          {/* Brand content */}
          <div className="relative z-10 my-auto flex flex-col items-center text-center py-6">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-2xl p-3 bg-black/50 border border-[#c5a059]/25 shadow-lg flex items-center justify-center">
              <img
                src="/hakmdar-logo.png"
                alt="حكمدار للمحاماة والاستشارات القانونية"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mt-5 space-y-1.5">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                حُكْمَدَار
              </h2>
              <p className="text-xs sm:text-sm font-semibold text-[#dfba73]">
                للمحاماة والاستشارات القانونية وإدارة القضايا
              </p>
            </div>
          </div>

          {/* Trust highlights */}
          <div className="relative z-10 pt-5 space-y-2.5 border-t border-slate-800/60">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-md bg-[#111c38] border border-[#c5a059]/20 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-[#dfba73]" />
              </div>
              <span>سرية تامة وتشفير بيانات الموكلين</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-md bg-[#111c38] border border-[#c5a059]/20 flex items-center justify-center shrink-0">
                <Scale className="w-3.5 h-3.5 text-[#dfba73]" />
              </div>
              <span>توثيق بنصوص التشريعات وأحكام النقض</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <div className="w-6 h-6 rounded-md bg-[#111c38] border border-[#c5a059]/20 flex items-center justify-center shrink-0">
                <Gavel className="w-3.5 h-3.5 text-[#dfba73]" />
              </div>
              <span>نخبة المحامين المعتمدين بجدول النقض</span>
            </div>
          </div>
        </div>

        {/* AUTH FORM PANEL (left side in RTL) */}
        <div className="p-6 sm:p-10 flex flex-col justify-center bg-[var(--bg-surface)] pt-14 lg:pt-10">
          <div className="max-w-md w-full mx-auto space-y-5">
            
            {/* Form Title */}
            <div className="space-y-1 text-right">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
                {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h1>
              <p className="text-xs text-[var(--text-secondary)]">
                {mode === 'login'
                  ? 'أدخل بيانات حسابك للوصول إلى لوحة التحكم'
                  : 'أنشئ حسابك لمتابعة قضاياك واستشاراتك القانونية'}
              </p>
            </div>

            {/* Role Selector (register only) */}
            {mode === 'register' && (
              <RoleSelector
                selectedRole={role}
                onChange={(r) => {
                  setSelectedRole(r);
                  setErrors({});
                  setServerError(null);
                }}
                disabled={isLoading}
              />
            )}

            {/* Server Error */}
            {serverError && (
              <div className="flex items-start gap-2.5 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs text-right">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <span className="font-bold block mb-0.5">تنبيه:</span>
                  <span>{serverError}</span>
                </div>
              </div>
            )}

            {/* Main Form */}
            <form onSubmit={handleSubmit} className="space-y-3.5" noValidate>
              
              {/* Register-only fields */}
              {mode === 'register' && (
                <>
                  <Field label="الاسم الكامل" required error={errors.fullName}>
                    <div className="relative">
                      <UserIcon className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        placeholder={isLawyer ? 'الأستاذ / محمد عبد الرحمن' : 'أحمد إبراهيم منصور'}
                        value={fullName}
                        onChange={(e) => { setFullName(e.target.value); clearErr('fullName'); }}
                        disabled={isLoading}
                        className={`${inputBase} ${icc('fullName')} pr-10 pl-3`}
                      />
                    </div>
                  </Field>

                  <Field label="رقم الهاتف" required error={errors.phone}>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="tel"
                        dir="ltr"
                        placeholder="01012345678"
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); clearErr('phone'); }}
                        disabled={isLoading}
                        className={`${inputBase} ${icc('phone')} pr-10 pl-3 text-right`}
                      />
                    </div>
                  </Field>

                  {/* Lawyer Credentials */}
                  {isLawyer && (
                    <div className="p-4 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-3">
                      <div className="flex items-center gap-2 text-xs font-bold text-[var(--accent-gold)]">
                        <Award className="w-4 h-4" />
                        <span>بيانات الاعتماد بنقابة المحامين</span>
                      </div>

                      <Field label="رقم القيد بجدول المحامين" required error={errors.barNumber}>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="مثال: EG-BAR-104928"
                            value={barNumber}
                            onChange={(e) => { setBarNumber(e.target.value); clearErr('barNumber'); }}
                            disabled={isLoading}
                            className={`${inputBase} ${icc('barNumber')} pr-10 pl-3`}
                          />
                        </div>
                      </Field>

                      <Field label="التخصص القضائي الرئيسي">
                        <select
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value as LegalCategory)}
                          disabled={isLoading}
                          className="w-full px-3.5 py-2.5 rounded-lg bg-[var(--bg-input)] border border-[var(--border-subtle)] text-sm text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                        >
                          {(Object.keys(LEGAL_CATEGORIES_INFO) as LegalCategory[]).map((k) => (
                            <option key={k} value={k}>
                              {LEGAL_CATEGORIES_INFO[k].labelAr}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="المحافظة ومقر المكتب">
                        <div className="relative">
                          <MapPin className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            disabled={isLoading}
                            className={`${inputBase} ${inputOk} pr-10 pl-3`}
                          >
                            <option value="القاهرة">القاهرة</option>
                            <option value="الجيزة">الجيزة</option>
                            <option value="الإسكندرية">الإسكندرية</option>
                            <option value="المنصورة والدقهلية">المنصورة والدقهلية</option>
                            <option value="طنطا والغربية">طنطا والغربية</option>
                            <option value="أسيوط والصعيد">أسيوط والصعيد</option>
                          </select>
                        </div>
                      </Field>
                    </div>
                  )}
                </>
              )}

              {/* Email */}
              <Field label="البريد الإلكتروني" required error={errors.email}>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="email"
                    dir="ltr"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clearErr('email'); }}
                    disabled={isLoading}
                    autoComplete="email"
                    className={`${inputBase} ${icc('email')} pr-10 pl-3 text-right`}
                  />
                </div>
              </Field>

              {/* Password */}
              <div className="space-y-1.5 text-right">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-[var(--text-secondary)]">
                    كلمة المرور <span className="text-amber-500">*</span>
                  </label>
                  {mode === 'login' && (
                    <button type="button" className="text-[11px] text-[var(--text-muted)] hover:text-[var(--accent-gold)] transition-colors">
                      نسيت كلمة المرور؟
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[var(--text-muted)] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    dir="ltr"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); clearErr('password'); }}
                    disabled={isLoading}
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    className={`${inputBase} ${icc('password')} pr-10 pl-10`}
                  />
                  <button
                    type="button"
                    tabIndex={-1}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                    aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Checkboxes */}
              {mode === 'register' ? (
                <div className="text-right">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={agreeTerms}
                      onChange={(e) => { setAgreeTerms(e.target.checked); clearErr('agreeTerms'); }}
                      disabled={isLoading}
                      className="mt-1 w-4 h-4 rounded bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
                    />
                    <span className="text-xs text-[var(--text-secondary)] leading-relaxed">
                      أوافق على{' '}
                      <span className="text-[var(--accent-gold)] font-semibold hover:underline">شروط الاستخدام</span>
                      {' '}و{' '}
                      <span className="text-[var(--accent-gold)] font-semibold hover:underline">ميثاق سرية البيانات القضائية</span>
                    </span>
                  </label>
                  {errors.agreeTerms && (
                    <p className="text-xs text-rose-500 mt-1 flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{errors.agreeTerms}</span>
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-right">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      disabled={isLoading}
                      className="w-4 h-4 rounded bg-[var(--bg-input)] border-[var(--border-subtle)] text-[var(--accent-gold)] focus:ring-[var(--accent-gold)]"
                    />
                    <span className="text-xs text-[var(--text-secondary)]">تذكر تسجيل دخولي على هذا الجهاز</span>
                  </label>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                id="auth-submit-btn"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-sm btn-legal-gold disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>
                      {mode === 'login' ? 'جاري التحقق من البيانات...' : 'جاري إنشاء الحساب...'}
                    </span>
                  </>
                ) : (
                  <span>
                    {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء الحساب'}
                  </span>
                )}
              </button>
            </form>

            {/* Mode Switch */}
            <div className="text-center text-xs text-[var(--text-secondary)] pt-4 border-t border-[var(--border-subtle)]">
              {mode === 'login' ? (
                <p>
                  ليس لديك حساب؟{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('register')}
                    className="font-bold text-[var(--accent-gold)] hover:underline cursor-pointer"
                  >
                    إنشاء حساب
                  </button>
                </p>
              ) : (
                <p>
                  لديك حساب بالفعل؟{' '}
                  <button
                    type="button"
                    onClick={() => handleModeSwitch('login')}
                    className="font-bold text-[var(--accent-gold)] hover:underline cursor-pointer"
                  >
                    تسجيل الدخول
                  </button>
                </p>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}