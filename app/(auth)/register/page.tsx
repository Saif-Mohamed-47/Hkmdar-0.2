'use client';

import React from 'react';
import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';
import { Scale, ArrowRight, ShieldCheck, Sparkles, Award } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col justify-between items-center px-4 py-8 relative overflow-hidden">
      
      {/* Background Decorative Ambient Glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-slate-900/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header / Brand Logo */}
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

      {/* Main Content Area */}
      <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center my-4">
        <AuthForm mode="register" />
      </main>

      {/* Footer / Trust Badges */}
      <footer className="relative z-10 w-full max-w-5xl py-4 text-center text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-900/80 mt-4">
        <div className="flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            بيانات مشفرة وآمنة تماماً
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-blue-400" />
            توثيق رسمي للمحامين الممارسين
          </span>
        </div>
        <p className="text-[11px]">جميع الحقوق محفوظة © {new Date().getFullYear()} منصة حكمدار</p>
      </footer>

    </div>
  );
}
