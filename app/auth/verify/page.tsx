'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Scale, Mail, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 w-full max-w-5xl flex items-center justify-between py-4 mb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-blue-500 to-amber-500 p-0.5 shadow-xl shadow-blue-900/40 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B132B] rounded-[14px] flex items-center justify-center">
              <Scale className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                حكمدار
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
                Legal AI
              </span>
            </div>
            <p className="text-[11px] text-slate-400">المساعد القضائي الذكي</p>
          </div>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <span>الرئيسية</span>
          <ArrowRight className="w-3.5 h-3.5 rotate-180" />
        </Link>
      </header>

      {/* Main Content */}
      <main className="relative z-10 w-full flex-1 flex items-center justify-center my-4">
        <div dir="rtl" className="w-full max-w-md mx-auto">
          <div className="relative bg-slate-900/80 backdrop-blur-2xl border border-white/5 rounded-3xl shadow-2xl shadow-black/60 overflow-hidden">
            {/* Top accent */}
            <div className="h-1 w-full bg-gradient-to-r from-emerald-600 via-teal-400 to-emerald-500" />

            <div className="p-8 space-y-6 text-center">
              {/* Icon */}
              <div className="flex items-center justify-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center shadow-inner">
                  <Mail className="w-9 h-9 text-emerald-400" />
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h1 className="text-2xl font-black text-white tracking-tight">
                  تحقق من بريدك الإلكتروني 📧
                </h1>
                <p className="text-sm text-slate-400 leading-relaxed">
                  تم إنشاء حسابك بنجاح في منصة حكمدار!
                  <br />
                  يرجى فتح رسالة التأكيد المرسلة إلى:
                </p>
                {email && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-mono font-medium">
                    <Mail className="w-4 h-4" />
                    {email}
                  </div>
                )}
                <p className="text-xs text-slate-500 leading-relaxed pt-1">
                  بعد الضغط على رابط التأكيد في البريد، سيتم تفعيل حسابك وتوجيهك تلقائياً للدخول.
                </p>
              </div>

              {/* Security note */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 text-[11px] text-slate-400">
                <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>البريد مشفر وآمن · الرابط صالح لمدة 24 ساعة</span>
              </div>

              {/* Divider */}
              <div className="relative flex items-center gap-3">
                <div className="flex-1 h-px bg-slate-800" />
                <span className="text-[10px] text-slate-500">أو</span>
                <div className="flex-1 h-px bg-slate-800" />
              </div>

              {/* Actions */}
              <div className="space-y-3">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl font-bold text-sm bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 hover:from-emerald-500 hover:to-teal-400 text-white shadow-lg shadow-emerald-950/50 transition-all hover:scale-[1.015]"
                >
                  <span>تسجيل الدخول بعد التأكيد</span>
                  <ArrowRight className="w-4 h-4 rotate-180" />
                </Link>

                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl text-xs text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700 bg-slate-900/60 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>إنشاء حساب بعنوان بريد مختلف</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-5xl py-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-900/80 mt-4">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            بيانات مشفرة وآمنة تماماً
          </span>
        </div>
        <p className="text-[11px]">جميع الحقوق محفوظة © {new Date().getFullYear()} منصة حكمدار</p>
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#070D1E] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
