'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  Scale, 
  Users, 
  ChevronLeft,
  Briefcase,
} from 'lucide-react';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { translations } from '@/lib/data/translations';

export default function LandingPage() {
  const { setRole, lang } = useApp();
  const t = translations[lang || 'ar'];

  return (
    <div className="h-screen w-screen overflow-hidden bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col selection:bg-[#c5a059] selection:text-[#060a14] transition-colors duration-200">
      
      {/* Top Brand Bar */}
      <header className="border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-md shrink-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3.5 group">
            <div className="w-12 h-12 rounded-xl bg-[var(--bg-input)] border border-[var(--accent-gold)]/40 p-1.5 flex items-center justify-center shadow-lg group-hover:border-[var(--accent-gold)] transition-colors overflow-hidden">
              <img src="/hakmdar-icon.png" alt={t.brand.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tight text-[var(--text-primary)] block leading-none">
                {t.brand.name}
              </span>
              <span className="text-[11px] font-semibold text-[var(--accent-gold)] tracking-normal">
                {t.brand.tagline}
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-2.5">
            <LanguageToggle />
            <ThemeToggle />

            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] transition-colors"
            >
              {t.nav.login}
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 rounded-xl text-xs font-bold btn-legal-gold"
            >
              {t.nav.register}
            </Link>
          </div>
        </div>
      </header>

      {/* Main Single-Screen Brand Showcase */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 relative bg-gradient-to-b from-[var(--bg-primary)] via-[#080f22] to-[var(--bg-surface)] overflow-hidden">
        
        {/* Ambient Gold Glow Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] sm:w-[700px] h-[550px] sm:h-[700px] rounded-full bg-[radial-gradient(circle,rgba(197,160,89,0.18)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-700">
          
          {/* Majestic Emblem Frame */}
          <div className="relative group mb-1">
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#c5a059]/40 via-[#dfba73]/50 to-[#c5a059]/40 blur-2xl opacity-80 group-hover:opacity-100 transition-opacity" />
            <div className="relative w-36 h-36 sm:w-48 sm:h-48 rounded-3xl bg-[#080e1c] border-2 border-[#c5a059]/60 p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(197,160,89,0.25)] flex items-center justify-center overflow-hidden">
              <img
                src="/hakmdar-icon.png"
                alt={t.brand.name}
                className="w-full h-full object-contain drop-shadow-[0_4px_16px_rgba(197,160,89,0.4)]"
              />
            </div>
          </div>

          {/* Grand Brand Name with Accurate Diacritics */}
          <div className="space-y-3">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-[var(--text-primary)] tracking-tight">
              {t.brand.name}
            </h1>
            <p className="text-base sm:text-xl font-bold text-[var(--accent-gold)] tracking-wide max-w-2xl mx-auto leading-relaxed">
              {t.brand.tagline}
            </p>
          </div>

          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs sm:text-sm font-semibold shadow-md">
            <Scale className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Dual Entrance Portals */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2 w-full max-w-xl mx-auto">
            
            {/* Client Portal Button */}
            <Link
              href="/register?role=client"
              onClick={() => setRole('client')}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl btn-legal-gold text-xs sm:text-sm font-bold shadow-xl cursor-pointer"
            >
              <Users className="w-4 h-4" />
              <span>{t.hero.clientCta}</span>
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </Link>

            {/* Lawyer Portal Button */}
            <Link
              href="/register?role=lawyer"
              onClick={() => setRole('lawyer')}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl btn-legal-navy text-xs sm:text-sm font-bold shadow-xl border border-[var(--accent-gold)]/40 cursor-pointer"
            >
              <Briefcase className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>{t.hero.lawyerCta}</span>
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </Link>

          </div>

        </div>
      </main>

    </div>
  );
}
