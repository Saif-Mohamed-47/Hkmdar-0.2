'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { 
  Scale, 
  Sparkles, 
  UserCheck, 
  Briefcase, 
  ArrowRightLeft, 
  Bell, 
  ChevronDown, 
  BookOpen, 
  MessageSquare, 
  Users, 
  FolderKanban,
  FileText,
  ShieldAlert,
  Search
} from 'lucide-react';

export default function Navbar() {
  const { role, user, setRole, cases, lang, setLang } = useApp();
  const pathname = usePathname();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const pendingCasesCount = cases.filter((c) => c.status === 'new_intake').length;
  const isLawyer = role === 'lawyer';

  const toggleRole = () => {
    setRole(isLawyer ? 'client' : 'lawyer');
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#070D1E]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Brand & Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 p-0.5 shadow-lg shadow-emerald-900/30 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B132B] rounded-[10px] flex items-center justify-center">
                <Scale className="w-5 h-5 text-emerald-400 group-hover:text-amber-400 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                  حكمدار
                </span>
              </div>
            </div>
          </Link>

          {/* Quick Nav Links (Role-Aware) */}
          <nav className="hidden md:flex items-center gap-1">
            {!isLawyer ? (
              <>
                <Link
                  href="/client/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/client/dashboard'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  الرئيسية
                </Link>
                <Link
                  href="/client/ai-chat"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/client/ai-chat'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  المستشار القانوني الذكي
                </Link>
                <Link
                  href="/client/legal-research"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/client/legal-research'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  البحث في التشريعات
                </Link>
                <Link
                  href="/client/lawyers"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/client/lawyers'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  دليل وترشيح المحامين
                </Link>
                <Link
                  href="/client/my-cases"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/client/my-cases'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  قضاياي
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/lawyer/dashboard"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/lawyer/dashboard'
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  لوحة تحكم المحامي
                </Link>
                <Link
                  href="/lawyer/cases"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors relative ${
                    pathname.startsWith('/lawyer/cases')
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <FolderKanban className="w-4 h-4 text-amber-400" />
                  ملفات القضايا والطلبات
                  {pendingCasesCount > 0 && (
                    <span className="px-1.5 py-0.2 text-[11px] font-bold rounded-full bg-red-500 text-white">
                      {pendingCasesCount}
                    </span>
                  )}
                </Link>
                <Link
                  href="/lawyer/profile"
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/lawyer/profile'
                      ? 'bg-slate-800 text-amber-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  الملف المهني
                </Link>
                <Link
                  href="/lawyer/ai-drafting"
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    pathname === '/lawyer/ai-drafting'
                      ? 'bg-slate-800 text-emerald-400'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  الصياغة القانونية الذكية
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Right Side: Role Toggle + Notifications + User Avatar */}
        <div className="flex items-center gap-3">
          
          {/* Quick Role Switcher Button */}
          <button
            onClick={toggleRole}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all duration-300 shadow-md ${
              isLawyer
                ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300 hover:border-amber-400'
                : 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300 hover:border-emerald-400'
            }`}
            title="انقر للتبديل بين دور الموكل ودور المحامي للتجربة السريعة"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
            <span>الوضع الحالي:</span>
            <span className="underline underline-offset-2">
              {isLawyer ? 'بوابة المحامي ⚖️' : 'بوابة الموكل 👤'}
            </span>
          </button>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 relative transition-colors"
            >
              <Bell className="w-5 h-5" />
              {pendingCasesCount > 0 && isLawyer && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-[#070D1E] animate-ping" />
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute left-0 mt-2 w-80 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-300">الإشعارات والتحديثات</h4>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                    مباشر
                  </span>
                </div>
                <div className="mt-3 space-y-2 max-h-64 overflow-y-auto">
                  {isLawyer ? (
                    cases.slice(0, 3).map((c) => (
                      <Link
                        key={c.id}
                        href={`/lawyer/cases/${c.id}`}
                        onClick={() => setNotificationsOpen(false)}
                        className="block p-2.5 rounded-xl bg-slate-800/50 hover:bg-slate-800 border border-slate-700/40 transition-colors"
                      >
                        <p className="text-xs font-semibold text-white truncate">{c.title}</p>
                        <p className="text-[11px] text-slate-400 mt-1">
                          من: {c.clientName} • {c.urgency === 'urgent' ? '🚨 عاجل جداً' : '⚡ طلب وارد'}
                        </p>
                      </Link>
                    ))
                  ) : (
                    <div className="p-3 text-center text-xs text-slate-400">
                      لا توجد إشعارات جديدة حالياً
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
              className="flex items-center gap-2.5 p-1.5 pr-2.5 rounded-full bg-slate-800/80 border border-slate-700/60 hover:border-slate-600 transition-all"
            >
              <img
                src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                alt={user.name}
                className="w-7 h-7 rounded-full object-cover ring-1 ring-emerald-500/40"
              />
              <span className="text-xs font-medium text-slate-200 hidden sm:block max-w-[110px] truncate">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute left-0 mt-2 w-56 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-2 z-50">
                <div className="p-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white truncate">{user.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                    {isLawyer ? 'محامٍ معتمد بالنقض' : 'حساب موكل موثق'}
                  </span>
                </div>

                <div className="py-1 space-y-0.5">
                  <Link
                    href={isLawyer ? '/lawyer/profile' : '/client/dashboard'}
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:bg-slate-800 rounded-lg"
                  >
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    الملف الشخصي
                  </Link>
                  <button
                    onClick={() => {
                      toggleRole();
                      setProfileDropdownOpen(false);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-xs text-amber-300 hover:bg-slate-800 rounded-lg text-right"
                  >
                    <ArrowRightLeft className="w-4 h-4 text-amber-400" />
                    التبديل إلى {isLawyer ? 'حساب الموكل' : 'حساب المحامي'}
                  </button>
                  <div className="my-1 border-t border-slate-800" />
                  <Link
                    href="/login"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg"
                  >
                    <span>تسجيل الدخول</span>
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 text-xs text-emerald-400 hover:bg-slate-800 rounded-lg font-bold"
                  >
                    <span>إنشاء حساب جديد</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </header>
  );
}
