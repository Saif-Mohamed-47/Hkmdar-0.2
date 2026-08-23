'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function LanguageToggle({ className = '', showLabel = false }: LanguageToggleProps) {
  const { lang, setLang } = useApp();
  const isArabic = lang === 'ar';

  const toggleLanguage = () => {
    const nextLang = isArabic ? 'en' : 'ar';
    setLang(nextLang);
  };

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all duration-200 cursor-pointer ${
        isArabic
          ? 'bg-[var(--bg-surface)] text-[var(--text-secondary)] border-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:border-[var(--accent-gold)]'
          : 'bg-[var(--bg-surface-elevated)] text-[var(--accent-gold)] border-[var(--accent-gold)]/40 hover:bg-[var(--bg-surface-hover)]'
      } ${className}`}
      aria-label="تبديل اللغة / Switch Language"
      title={isArabic ? 'Switch to English' : 'التحويل إلى اللغة العربية'}
    >
      <Globe className="w-3.5 h-3.5 text-[var(--accent-gold)] shrink-0" />
      <span className="font-semibold">{isArabic ? 'EN' : 'عربي'}</span>
      {showLabel && (
        <span className="text-[11px] font-medium hidden sm:inline">
          {isArabic ? 'English' : 'العربية'}
        </span>
      )}
    </button>
  );
}
