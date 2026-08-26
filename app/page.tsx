'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  Scale, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  Award, 
  FileText, 
  Lock, 
  ChevronLeft,
  Briefcase
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 md:py-24 border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">

          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs font-semibold shadow-sm">
            <Scale className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>{t.hero.badge}</span>
          </div>

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tight leading-[1.25]">
              {t.hero.title1}{' '}
              <span className="text-[var(--accent-gold)]">
                {t.hero.title2}
              </span>
            </h1>
            <p className="text-sm sm:text-lg text-[var(--text-secondary)] max-w-3xl mx-auto leading-relaxed">
              {t.hero.description}
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
              className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl btn-legal-gold text-xs font-bold shadow-lg"
            >
              <Users className="w-4 h-4" />
              <span>{t.hero.clientCta}</span>
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </Link>

            {/* Lawyer Portal Button */}
            <Link
              href="/register?role=lawyer"
              onClick={() => setRole('lawyer')}
              className="w-full sm:w-1/2 flex items-center justify-center gap-2.5 px-6 py-4 rounded-2xl btn-legal-navy text-xs font-bold shadow-lg border border-[var(--accent-gold)]/40"
            >
              <Briefcase className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>{t.hero.lawyerCta}</span>
              <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
            </Link>

          </div>

          {/* Institutional Trust Highlights */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-medium text-[var(--text-secondary)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>{t.hero.trust1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>{t.hero.trust2}</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>{t.hero.trust3}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Core Operational Pillars */}
      <section className="py-20 bg-[var(--bg-primary)] border-b border-[var(--border-subtle)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
              {t.pillars.heading}
            </h2>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
              {t.pillars.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Pillar 1 */}
            <div className="p-6 rounded-3xl legal-card-interactive space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{t.pillars.p1Title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.pillars.p1Desc}
              </p>
              <Link
                href="/register?role=client"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent-gold)] hover:underline pt-1"
              >
                <span>{t.pillars.p1Cta}</span>
                <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </Link>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-3xl legal-card-interactive space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{t.pillars.p2Title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.pillars.p2Desc}
              </p>
              <Link
                href="/register?role=client"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent-gold)] hover:underline pt-1"
              >
                <span>{t.pillars.p2Cta}</span>
                <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </Link>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-3xl legal-card-interactive space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{t.pillars.p3Title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.pillars.p3Desc}
              </p>
              <Link
                href="/register?role=client"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent-gold)] hover:underline pt-1"
              >
                <span>{t.pillars.p3Cta}</span>
                <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </Link>
            </div>

            {/* Pillar 4 */}
            <div className="p-6 rounded-3xl legal-card-interactive space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--text-primary)]">{t.pillars.p4Title}</h3>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {t.pillars.p4Desc}
              </p>
              <Link
                href="/register?role=lawyer"
                className="inline-flex items-center gap-1 text-xs font-bold text-[var(--accent-gold)] hover:underline pt-1"
              >
                <span>{t.pillars.p4Cta}</span>
                <ChevronLeft className="w-3.5 h-3.5 rtl:rotate-0 ltr:rotate-180" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Dual Journey Comparison */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)]">
            {t.dual.heading}
          </h2>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            {t.dual.subheading}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Client Side Card */}
          <div className="p-8 rounded-3xl legal-card space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--accent-gold)] bg-[var(--bg-surface-elevated)] px-3 py-1 rounded-full border border-[var(--accent-gold)]/20">
                {t.dual.clientBadge}
              </span>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{t.dual.clientTitle}</h3>
            </div>

            <div className="space-y-3.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <span>{t.dual.clientFeat1}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <span>{t.dual.clientFeat2}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <span>{t.dual.clientFeat3}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register?role=client"
                onClick={() => setRole('client')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-legal-gold text-xs font-bold"
              >
                <span>{t.dual.clientButton}</span>
                <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              </Link>
            </div>
          </div>

          {/* Lawyer Side Card */}
          <div className="p-8 rounded-3xl legal-card space-y-6">
            <div className="space-y-2">
              <span className="text-xs font-bold text-[var(--accent-gold)] bg-[var(--bg-surface-elevated)] px-3 py-1 rounded-full border border-[var(--accent-gold)]/20">
                {t.dual.lawyerBadge}
              </span>
              <h3 className="text-xl font-bold text-[var(--text-primary)]">{t.dual.lawyerTitle}</h3>
            </div>

            <div className="space-y-3.5 text-xs text-[var(--text-secondary)]">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <span>{t.dual.lawyerFeat1}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <span>{t.dual.lawyerFeat2}</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-[var(--accent-gold)] shrink-0 mt-0.5" />
                <span>{t.dual.lawyerFeat3}</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/register?role=lawyer"
                onClick={() => setRole('lawyer')}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-legal-navy text-xs font-bold"
              >
                <span>{t.dual.lawyerButton}</span>
                <ChevronLeft className="w-4 h-4 rtl:rotate-0 ltr:rotate-180" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] text-xs text-[var(--text-secondary)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/40 p-1 flex items-center justify-center overflow-hidden">
                <img src="/hakmdar-icon.png" alt={t.brand.name} className="w-full h-full object-contain" />
              </div>
              <span className="font-extrabold text-[var(--text-primary)] text-sm">{t.brand.fullTitle}</span>
            </div>
            <p className="text-[var(--text-muted)] text-center sm:text-left">
              {t.brand.copyright}
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
}
