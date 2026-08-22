'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { UserRole, LegalCategory, User } from '@/lib/types';
import { LEGAL_CATEGORIES_INFO } from '@/lib/data/legalData';
import { signUpUser, signInUser } from '@/lib/supabaseClient';
import { loginSchema, registerSchema, RegisterFormData } from '@/lib/validations/authSchemas';
import RoleSelector from './RoleSelector';
import {
  Mail,
  Lock,
  User as UserIcon,
  Phone,
  Eye,
  EyeOff,
  Award,
  MapPin,
  ChevronLeft,
  Loader2,
  AlertCircle,
  Sparkles,
  ShieldCheck,
  Building2,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface AuthFormProps {
  mode: 'login' | 'register';
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
    <div className="space-y-1.5">
      <label className="block text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
        {label}
        {required && <span className="text-rose-400 mr-0.5"> *</span>}
      </label>
      {children}
      {error && (
        <p className="text-[11px] text-rose-400 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

const inputBase =
  'w-full py-2.5 rounded-xl bg-slate-800/80 border text-sm text-white placeholder:text-slate-500 focus:outline-none transition-all duration-200 focus:ring-1';
const inputOk = 'border-slate-700 focus:border-blue-500 focus:ring-blue-500/20';
const inputErr = 'border-rose-500/70 focus:border-rose-500 focus:ring-rose-500/20';

export default function AuthForm({ mode, defaultRole = 'client' }: AuthFormProps) {
  const router = useRouter();
  const { setRole: setAppRole, addToast, setUser: setAppUser } = useApp();

  const [role, setSelectedRole] = useState<UserRole>(defaultRole);
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

  const clearErr = (field: string) => setErrors((prev) => ({ ...prev, [field]: '' }));

  const handleQuickFill = (targetRole: UserRole) => {
    setSelectedRole(targetRole);
    setErrors({});
    setServerError(null);
    if (mode === 'login') {
      if (targetRole === 'lawyer') {
        setEmail('email@example.com');
        setPassword('lawyer123456');
      } else {
        setEmail('email@example.com');
        setPassword('client123456');
      }
    } else {
      if (targetRole === 'lawyer') {
        setFullName('المستشار / طارق عبد العزيز القاضي');
        setEmail('tarek.kadi@hakmdar-law.eg');
        setPhone('01002345678');
        setBarNumber('EG-BAR-104928');
        setPassword('lawyer123456');
        setSpecialty('labor');
        setLocation('القاهرة');
      } else {
        setFullName('أحمد إبراهيم منصور');
        setEmail('ahmed.mansour@example.com');
        setPhone('01023349988');
        setPassword('client123456');
        setLocation('الجيزة');
      }
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
        addToast({ type: 'error', title: 'خطأ في المدخلات', message: 'يرجى مراجعة البيانات المدخلة وتصحيح الأخطاء.' });
        return;
      }

      setIsLoading(true);
      try {
        const { user, error } = await signInUser({ email, password });
        if (error) {
          const msg = error.message || 'فشل تسجيل الدخول. يرجى التأكد من صحة البريد وكلمة المرور.';
          setServerError(msg);
          addToast({ type: 'error', title: 'فشل تسجيل الدخول', message: msg });
          return;
        }
        const resolvedRole: UserRole = (user?.user_metadata?.role as UserRole) || 'client';
        setAppRole(resolvedRole);
        addToast({
          type: 'success',
          title: 'تم تسجيل الدخول بنجاح ✓',
          message: resolvedRole === 'lawyer' ? 'مرحباً بك في بوابة المحامي الرقمية' : 'مرحباً بك في بوابة الاستشارات القانونية',
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
        addToast({ type: 'error', title: 'خطأ في إنشاء الحساب', message: 'يرجى استكمال جميع الحقول المطلوبة والتأكد من صحتها.' });
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

        // Email confirmation required — session will be null
        if (!session) {
          addToast({
            type: 'info',
            title: 'تحقق من بريدك الإلكتروني 📧',
            message: 'تم إنشاء حسابك بنجاح. يرجى فتح رسالة التأكيد المُرسلة إلى بريدك لتفعيل الحساب.',
          });
          router.push(`/auth/verify?email=${encodeURIComponent(email)}`);
          return;
        }

        // Session exists — update context with real user data immediately
        const meta = newUser?.user_metadata || {};
        const realUser: User = {
          id: newUser?.id || '',
          name: meta.full_name || fullName,
          email: newUser?.email || email,
          phone: meta.phone || phone,
          role,
          location: meta.location || location,
          barNumber: meta.bar_number || barNumber,
          specialty: meta.specialty || specialty,
        };
        try {
          localStorage.setItem('hakmdar_user_data_v1', JSON.stringify(realUser));
          localStorage.setItem('hakmdar_role_v1', role);
        } catch {}
        setAppUser(realUser);
        setAppRole(role);
        addToast({
          type: 'success',
          title: 'تم إنشاء الحساب بنجاح ✓',
          message: role === 'lawyer' ? 'أهلاً بك زميلنا العزيز في منصة حكمدار للمحامين' : 'تم تجهيز حسابك بنجاح. أهلاً بك في حكمدار',
        });
        router.push(role === 'lawyer' ? '/dashboard' : '/client/dashboard');
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
    <div dir="rtl" className="w-full max-w-md mx-auto">
      <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
        {/* Top accent stripe */}
        <div
          className={`h-1 w-full ${
            isLawyer
              ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-orange-500'
              : 'bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-500'
          }`}
        />

        <div className="p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2.5">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-800 border border-white/5 shadow-inner mb-1">
              {mode === 'login' ? (
                <LogIn className="w-6 h-6 text-slate-300" />
              ) : (
                <UserPlus className="w-6 h-6 text-slate-300" />
              )}
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">
                {mode === 'login' ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
              </h1>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                {mode === 'login'
                  ? 'أدخل بريدك وكلمة المرور للوصول إلى حسابك'
                  : 'اختر نوع حسابك وأدخل بياناتك للانضمام إلى حكمدار'}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-white/5 text-[10px] font-medium text-slate-400">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>اتصال مشفر 256-bit · آمن تماماً</span>
            </div>
          </div>

          {/* Role Selector — register only */}
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

          {/* Server error banner */}
          {serverError && (
            <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs animate-in fade-in slide-in-from-top-2 duration-200">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">تنبيه المصادقة:</span>
                <span className="text-rose-300/80">{serverError}</span>
              </div>
            </div>
          )}

          {/* Main form */}
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            {mode === 'register' && (
              <>
                {/* Full name */}
                <Field label="الاسم بالكامل" required error={errors.fullName}>
                  <div className="relative">
                    <UserIcon className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      placeholder={isLawyer ? 'المستشار / طارق عبد العزيز' : 'أحمد إبراهيم منصور'}
                      value={fullName}
                      onChange={(e) => { setFullName(e.target.value); clearErr('fullName'); }}
                      disabled={isLoading}
                      className={`${inputBase} ${icc('fullName')} pr-10 pl-3`}
                    />
                  </div>
                </Field>

                {/* Phone */}
                <Field label="رقم الهاتف / الواتساب" required error={errors.phone}>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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

                {/* Lawyer credentials panel */}
                {isLawyer && (
                  <>
                    <div className="rounded-2xl bg-amber-950/20 border border-amber-500/25 p-4 space-y-4">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold text-amber-300">
                          بيانات الاعتماد المهني بنقابة المحامين
                        </span>
                      </div>

                      <Field label="رقم القيد بالنقابة" required error={errors.barNumber}>
                        <div className="relative">
                          <Building2 className="w-4 h-4 text-amber-400/60 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="text"
                            placeholder="EG-BAR-104928"
                            value={barNumber}
                            onChange={(e) => { setBarNumber(e.target.value); clearErr('barNumber'); }}
                            disabled={isLoading}
                            className={`${inputBase} ${
                              errors.barNumber
                                ? inputErr
                                : 'border-amber-500/30 focus:border-amber-400 focus:ring-amber-400/20'
                            } pr-10 pl-3`}
                          />
                        </div>
                      </Field>

                      <Field label="التخصص القانوني الرئيسي">
                        <select
                          value={specialty}
                          onChange={(e) => setSpecialty(e.target.value as LegalCategory)}
                          disabled={isLoading}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/20 transition-all duration-200"
                        >
                          {(Object.keys(LEGAL_CATEGORIES_INFO) as LegalCategory[]).map((k) => (
                            <option key={k} value={k}>
                              {LEGAL_CATEGORIES_INFO[k].labelAr}
                            </option>
                          ))}
                        </select>
                      </Field>
                    </div>

                    {/* Location (Lawyer only) */}
                    <Field label="المحافظة / النطاق الجغرافي للمكتب">
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  </>
                )}

                {/* Section divider */}
                <div className="relative flex items-center gap-3">
                  <div className="flex-1 h-px bg-slate-800" />
                  <span className="text-[10px] text-slate-500 font-medium">بيانات الدخول</span>
                  <div className="flex-1 h-px bg-slate-800" />
                </div>
              </>
            )}

            {/* Email (shared) */}
            <Field label="البريد الإلكتروني" required error={errors.email}>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  dir="ltr"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearErr('email'); }}
                  disabled={isLoading}
                  autoComplete="email"
                  className={`${inputBase} ${icc('email')} pr-10 pl-3 text-right`}
                />
              </div>
            </Field>

            {/* Password (shared) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-semibold tracking-wide text-slate-400 uppercase">
                  كلمة المرور <span className="text-rose-400">*</span>
                </label>
                {mode === 'login' && (
                  <button type="button" className="text-[11px] text-slate-500 hover:text-emerald-400 transition-colors">
                    نسيت كلمة المرور؟
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
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
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  aria-label={showPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3 h-3 shrink-0" />
                  {errors.password}
                </p>
              )}
            </div>

            {/* Checkbox options */}
            {mode === 'register' ? (
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => { setAgreeTerms(e.target.checked); clearErr('agreeTerms'); }}
                    disabled={isLoading}
                    className="mt-0.5 w-4 h-4 rounded bg-slate-800 border-slate-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
                  />
                  <span className="text-xs text-slate-400 leading-relaxed">
                    أوافق على{' '}
                    <span className="text-emerald-400 hover:underline cursor-pointer">شروط الاستخدام</span>
                    {' '}و{' '}
                    <span className="text-emerald-400 hover:underline cursor-pointer">سياسة سرية البيانات القانونية</span>
                  </span>
                </label>
                {errors.agreeTerms && (
                  <p className="text-[11px] text-rose-400 mt-1.5 flex items-center gap-1.5">
                    <AlertCircle className="w-3 h-3" />
                    {errors.agreeTerms}
                  </p>
                )}
              </div>
            ) : (
              <label className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isLoading}
                  className="w-4 h-4 rounded bg-slate-800 border-slate-600 text-emerald-600 focus:ring-emerald-500 focus:ring-offset-slate-900"
                />
                <span className="text-xs text-slate-400">تذكر تسجيل دخولي على هذا الجهاز</span>
              </label>
            )}

            {/* Submit button */}
            <button
              type="submit"
              id="auth-submit-btn"
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl font-bold text-sm shadow-lg transition-all duration-200 hover:scale-[1.015] active:scale-[0.985] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 cursor-pointer ${
                isLawyer
                  ? 'bg-gradient-to-r from-amber-600 via-amber-500 to-orange-500 hover:from-amber-500 hover:to-orange-400 text-white shadow-amber-950/50'
                  : 'bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-emerald-950/50'
              }`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>
                    {mode === 'login' ? 'جاري التحقق وتسجيل الدخول...' : 'جاري إنشاء الحساب وتوثيقه...'}
                  </span>
                </>
              ) : (
                <>
                  <span>
                    {mode === 'login'
                      ? 'الدخول إلى حسابي'
                      : `إنشاء حساب ${isLawyer ? 'المحامي' : 'العميل'}`}
                  </span>
                  <ChevronLeft className="w-4 h-4" />
                </>
              )}
            </button>
          </form>


          {/* Switch mode link */}
          <p className="text-center text-xs text-slate-500 pt-1 border-t border-white/5">
            {mode === 'login' ? (
              <>
                ليس لديك حساب بعد؟{' '}
                <Link href="/register" className="font-bold text-emerald-400 hover:underline">
                  إنشاء حساب جديد
                </Link>
              </>
            ) : (
              <>
                لديك حساب بالفعل؟{' '}
                <Link
                  href="/login"
                  className={`font-bold hover:underline ${isLawyer ? 'text-amber-400' : 'text-emerald-400'}`}
                >
                  تسجيل الدخول
                </Link>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}