'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { 
  UserCheck, 
  Bell, 
  ChevronDown, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';
import { signOutUser } from '@/lib/supabaseClient';
import ThemeToggle from '@/components/ui/ThemeToggle';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { translations } from '@/lib/data/translations';

interface NavLinkItem {
  href: string;
  label: string;
  badge?: number;
}

export default function Navbar() {
  const { role, user, cases, addToast, lang } = useApp();
  const t = translations[lang || 'ar'];
  const pathname = usePathname();
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pendingCasesCount = cases.filter((c) => c.status === 'new_intake').length;
  const isLawyer = role === 'lawyer';

  const handleLogout = async () => {
    try {
      await signOutUser();
      addToast({
        type: 'info',
        title: lang === 'en' ? 'Logged Out' : 'تم تسجيل الخروج',
        message: lang === 'en' ? 'Session ended successfully.' : 'تم إنهاء الجلسة بنجاح.',
      });
      router.push('/login');
    } catch (e) {
      router.push('/login');
    }
  };

  const clientNavLinks: NavLinkItem[] = [
    { href: '/client/dashboard', label: t.nav.home },
    { href: '/client/ai-chat', label: t.nav.legalAdvisor },
    { href: '/client/legal-research', label: t.nav.legalResearch },
    { href: '/client/lawyers', label: t.nav.lawyersDirectory },
    { href: '/client/my-cases', label: t.nav.myCases },
  ];

  const lawyerNavLinks: NavLinkItem[] = [
    { href: '/lawyer/dashboard', label: t.nav.dashboard },
    { href: '/lawyer/cases', label: t.nav.caseFiles, badge: pendingCasesCount },
    { href: '/lawyer/ai-drafting', label: t.nav.aiDrafting },
    { href: '/lawyer/profile', label: t.nav.lawyerProfile },
  ];

  const currentNavLinks = isLawyer ? lawyerNavLinks : clientNavLinks;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/95 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-input)] border border-[var(--accent-gold)]/40 p-1 flex items-center justify-center shadow-md group-hover:border-[var(--accent-gold)] transition-colors overflow-hidden">
              <img src="/hakmdar-icon.png" alt={t.brand.name} className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-[var(--text-primary)] block leading-none">
                {t.brand.name}
              </span>
              <span className="text-[10px] text-[var(--accent-gold)] font-medium">
                {isLawyer ? t.brand.lawyerPortal : t.brand.clientPortal}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {currentNavLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== '/lawyer/dashboard' && link.href !== '/client/dashboard' && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--accent-gold)]/40 shadow-sm'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge !== undefined && link.badge > 0 ? (
                    <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-amber-600 text-slate-950 font-mono">
                      {link.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side: Language Toggle + Theme Toggle + Role Switcher + Notifications + Profile */}
        <div className="flex items-center gap-2">
          
          {/* Language Switcher */}
          <LanguageToggle />

          {/* Global Theme Toggle */}
          <ThemeToggle />

          {/* Active Role Badge (Locked) */}
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 text-xs text-[var(--text-primary)]"
          >
            <span className="w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
            <span className="font-medium text-xs">
              {isLawyer ? t.brand.lawyerPortal : t.brand.clientPortal}
            </span>
          </div>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] relative transition-colors border border-[var(--border-subtle)] cursor-pointer"
              aria-label="الإشعارات"
            >
              <Bell className="w-4 h-4" />
              {pendingCasesCount > 0 && isLawyer && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--accent-gold)]" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-2xl p-4 z-50 animate-in fade-in">
                <div className="flex items-center justify-between pb-2 border-b border-[var(--border-subtle)]">
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">إشعارات القضايا</h4>
                  <span className="text-[10px] text-[var(--accent-gold)] bg-[var(--bg-surface-elevated)] px-2 py-0.5 rounded-full border border-[var(--accent-gold)]/20">
                    مباشر
                  </span>
                </div>
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {isLawyer ? (
                    cases.slice(0, 4).map((c) => (
                      <Link
                        key={c.id}
                        href={`/lawyer/cases/${c.id}`}
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-3 rounded-xl bg-[var(--bg-input)] hover:bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] transition-colors text-right"
                      >
                        <p className="text-xs font-bold text-[var(--text-primary)] truncate">{c.title}</p>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-1">
                          الموكل: {c.clientName} • {c.urgency === 'urgent' ? 'أولوية قصوى' : 'طلب وارد'}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="p-4 text-center text-xs text-[var(--text-muted)]">
                      لا توجد تنبيهات جديدة في الوقت الحالي
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Pill */}
          <div className="relative">
            <button
              onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              className="flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[var(--bg-input)] border border-[var(--border-subtle)] hover:border-[var(--accent-gold)]/40 transition-all cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)] font-bold text-xs">
                {user.name ? user.name[0] : 'ح'}
              </div>
              <span className="text-xs font-semibold text-[var(--text-primary)] hidden sm:block max-w-[120px] truncate">
                {user.name || 'المستخدم'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute left-0 mt-2 w-60 rounded-2xl bg-[var(--bg-surface)] border border-[var(--border-card)] shadow-2xl p-2 z-50 text-right animate-in fade-in">
                <div className="p-3 border-b border-[var(--border-subtle)]">
                  <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user.name}</p>
                  <p className="text-[10px] text-[var(--text-muted)] truncate mt-0.5">{user.email}</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/20">
                    {isLawyer ? 'حساب محامٍ معتمد' : 'حساب موكل موثق'}
                  </span>
                </div>

                <div className="py-1 space-y-1">
                  <Link
                    href={isLawyer ? '/lawyer/profile' : '/client/dashboard'}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-[var(--text-secondary)] hover:bg-[var(--bg-surface-elevated)] hover:text-[var(--text-primary)] rounded-lg transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-[var(--accent-gold)]" />
                    <span>الملف الشخصي</span>
                  </Link>
                  <div className="my-1 border-t border-[var(--border-subtle)]" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-rose-500/10 rounded-lg text-right transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-xl text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)] border border-[var(--border-subtle)] cursor-pointer"
            aria-label="القائمة الرئيسية"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-surface)] px-4 py-4 space-y-2 animate-in fade-in">
          {currentNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold ${
                  isActive
                    ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--accent-gold)]/40'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <span>{link.label}</span>
                {link.badge !== undefined && link.badge > 0 ? (
                  <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-600 text-slate-950 font-mono">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
