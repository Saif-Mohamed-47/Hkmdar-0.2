'use client';

import React from 'react';
import { useApp } from '@/lib/context/AppContext';
import { Sun, Moon } from 'lucide-react';

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = '', showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useApp();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center gap-2 p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
        isDark
          ? 'bg-[#0b1224] text-amber-300 border-slate-800 hover:border-[#c5a059]/40 hover:bg-[#111c38]'
          : 'bg-white text-slate-700 border-slate-200 hover:border-[#b0893f]/40 hover:bg-slate-50 shadow-sm'
      } ${className}`}
      aria-label={isDark ? 'التبديل إلى الوضع النهاري (Light Mode)' : 'التبديل إلى الوضع الليلي (Dark Mode)'}
      title={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
    >
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-300 transition-transform duration-200 hover:rotate-45" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 transition-transform duration-200 hover:-rotate-12" />
      )}
      {showLabel && (
        <span className="text-xs font-semibold">
          {isDark ? 'الوضع النهاري' : 'الوضع الليلي'}
        </span>
      )}
    </button>
  );
}
