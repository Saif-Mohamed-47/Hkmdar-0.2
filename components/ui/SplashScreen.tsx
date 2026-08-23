'use client';

import React, { useState, useEffect } from 'react';

export default function SplashScreen() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if the splash screen has already been shown in this tab session
    const hasShown = sessionStorage.getItem('hakmdar_splash_shown');
    if (hasShown) {
      setIsLoading(false);
      return;
    }

    // Timer to start fade out after assets / initial load
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      const removeTimer = setTimeout(() => {
        setIsLoading(false);
        try {
          sessionStorage.setItem('hakmdar_splash_shown', 'true');
        } catch {}
      }, 700); // 700ms fade transition duration

      return () => clearTimeout(removeTimer);
    }, 1800); // Show splash for 1.8 seconds

    return () => clearTimeout(timer);
  }, []);

  if (!mounted || !isLoading) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050811] transition-all duration-700 ease-out select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
      dir="rtl"
    >
      {/* Background ambient lighting effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(197,160,89,0.12)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute w-96 h-96 rounded-full bg-[#111c38]/40 blur-3xl pointer-events-none animate-pulse" />

      {/* Center Brand Container */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Emblem Frame with Gold Glow */}
        <div className="relative mb-6 group">
          <div className="absolute -inset-2 rounded-3xl bg-gradient-to-r from-[#c5a059]/30 via-[#dfba73]/40 to-[#c5a059]/30 blur-xl opacity-75 animate-pulse" />
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-[#080e1c] border-2 border-[#c5a059]/60 p-2 shadow-2xl flex items-center justify-center overflow-hidden">
            <img
              src="/hakmdar-icon.png"
              alt="حِكِمْدار"
              className="w-full h-full object-contain drop-shadow-[0_4px_12px_rgba(197,160,89,0.4)]"
            />
          </div>
        </div>

        {/* Brand Title with Diacritics */}
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white mb-2">
          حِكِمْدار
        </h1>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm font-semibold text-[#dfba73] max-w-xs leading-relaxed mb-6">
          المنظومة الرقمية لإدارة القضايا والاستشارات القانونية
        </p>

        {/* Animated Loading Bar */}
        <div className="w-48 sm:w-56 h-1 rounded-full bg-slate-800/80 overflow-hidden relative border border-white/5">
          <div className="h-full bg-gradient-to-r from-[#9e7b36] via-[#dfba73] to-[#c5a059] rounded-full splash-progress-bar" />
        </div>

        {/* Subtle Legal Seal Text */}
        <span className="text-[10px] text-slate-500 mt-4 tracking-wider">
          جاري تجهيز المنصة الذكية...
        </span>
      </div>
    </div>
  );
}
