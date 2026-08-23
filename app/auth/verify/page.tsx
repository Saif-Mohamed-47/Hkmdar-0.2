'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Mail, ArrowRight, RefreshCw, ShieldCheck } from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';

function VerifyContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between items-center px-4 py-8 relative transition-colors duration-200">
      
      {/* Header */}
      <header className="w-full max-w-4xl flex items-center justify-between py-4 mb-4">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/40 flex items-center justify-center p-1">
            <img src="/hakmdar-logo.png" alt="حكمدار" className="w-full h-full object-contain" />
          </div>
          <div className="text-right">
            <span className="font-extrabold text-xl tracking-tight text-[var(--text-primary)] block">
              حكمدار
            </span>
            <p className="text-[10px] text-[var(--accent-gold)] font-medium">للمحاماة والاستشارات القانونية</p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] px-3 py-1.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] transition-colors"
          >
            <span>الرئيسية</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full flex-1 flex items-center justify-center my-4">
        <div dir="rtl" className="w-full max-w-md mx-auto">
          <div className="relative bg-[var(--bg-surface)] border border-[var(--border-card)] rounded-3xl shadow-2xl overflow-hidden">
            {/* Top gold accent line */}
            <div className="h-1 w-full bg-gradient-to-r from-[#9e7b36] via-[#dfba73] to-[#9e7b36]" />

            <div className="p-8 space-y-6 text-center">
              {/* Icon */}
              <div className="flex items-center justify-center">
                <div className="w-16 h-16 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center shadow-inner">
                  <Mail className="w-8 h-8 text-[var(--accent-gold)]" />
                </div>
              </div>

              {/* Title & Body */}
              <div className="space-y-2.5">
                <h1 className="text-xl font-bold text-[var(--text-primary)] tracking-tight">
                  تأكيد الحساب عبر البريد الإلكتروني
                </h1>
                <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  تم تسجيل حسابك بنجاح في منصة حكمدار.
                  <br />
                  يرجى التحقق من صندوق الوارد في بريدك الإلكتروني والضغط على رابط التفعيل:
                </p>
                {email && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[var(--bg-input)] border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs font-mono font-medium">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{email}</span>
                  </div>
                )}
                <p className="text-[11px] text-[var(--text-muted)] pt-1">
                  بعد إتمام التأكيد، يمكنك تسجيل الدخول والوصول المباشر إلى لوحة التحكم.
                </p>
              </div>

              {/* Security note */}
              <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-[11px] text-[var(--text-secondary)]">
                <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)] shrink-0" />
                <span>رابط التأكيد صالح لمدة 24 ساعة لضمان أمان الحساب</span>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <Link
                  href="/login"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-xs btn-legal-gold"
                >
                  <span>تسجيل الدخول بعد التفعيل</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                <Link
                  href="/register"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] hover:bg-[var(--bg-surface-hover)] transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>استخدام بريد إلكتروني آخر</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-4xl py-4 text-center text-xs text-[var(--text-muted)] border-t border-[var(--border-subtle)] mt-4">
        <p className="text-[11px]">جميع الحقوق محفوظة © {new Date().getFullYear()} حكمدار للمحاماة والاستشارات القانونية</p>
      </footer>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--accent-gold)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <VerifyContent />
    </Suspense>
  );
}
