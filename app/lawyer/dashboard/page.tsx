'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  FolderKanban, 
  Sparkles, 
  Scale, 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Award, 
  ShieldCheck, 
  ChevronLeft, 
  FileText, 
  AlertCircle,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import CaseStatusBadge from '@/components/lawyer/CaseStatusBadge';

export default function LawyerDashboardPage() {
  const { user, cases, updateCaseStatus } = useApp();

  const newIntakes = cases.filter((c) => c.status === 'new_intake');
  const activeCases = cases.filter((c) => c.status === 'accepted' || c.status === 'in_court');

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/50 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>بوابة المحامي الرقمية • قيد محكمة النقض والدستورية العليا</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              لوحة تحكم المكتب القضائي | {user.name} ⚖️
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              استلم ملفات القضايا الجاهزة والمستخلصة آلياً من استشارات الموكلين مع الذكاء الاصطناعي، وتابع جلسات التقاضي وصياغة المذكرات القانونية.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/lawyer/cases"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white text-xs font-bold shadow-lg shadow-amber-950/60 transition-all hover:scale-105"
            >
              <FolderKanban className="w-4 h-4" />
              <span>إدارة ملفات القضايا ({cases.length})</span>
            </Link>
            <Link
              href="/lawyer/ai-drafting"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>صياغة مذكرة بالذكاء الاصطناعي</span>
            </Link>
          </div>
        </div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">طلبات واردة جديدة (AI)</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400">
            {newIntakes.length}
          </div>
          <p className="text-[11px] text-slate-400">ملخصات قضايا محولة من الموكلين</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">القضايا المتداولة والنشطة</span>
            <Scale className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            {activeCases.length}
          </div>
          <p className="text-[11px] text-slate-400">قضايا منظورة أمام المحاكم</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">نسبة كسب الأحكام</span>
            <TrendingUp className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-teal-400">
            94.2%
          </div>
          <p className="text-[11px] text-slate-400">في القضايا العمالية والتجارية</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-xs font-medium">إجمالي الموكلين المسجلين</span>
            <Users className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-white">
            380+
          </div>
          <p className="text-[11px] text-slate-400">استشارات وقضايا منفذة</p>
        </div>

      </div>

      {/* Main Content Grid: Incoming AI Intakes Queue & Court Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Incoming AI Case Intakes Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">
                طلبات القضايا الواردة من المساعد الذكي (AI Case Intakes)
              </h2>
              {newIntakes.length > 0 && (
                <span className="text-xs bg-red-500 text-white font-bold px-2 py-0.5 rounded-full animate-pulse">
                  {newIntakes.length} جديد
                </span>
              )}
            </div>
            <Link
              href="/lawyer/cases"
              className="text-xs font-medium text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>عرض كل القضايا</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {cases.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CaseStatusBadge status={c.status} />
                      <span className="text-xs font-mono text-slate-400">{c.id}</span>
                      <span className="text-[11px] text-slate-400">
                        من: <strong className="text-white">{c.clientName}</strong> ({c.clientLocation})
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white">{c.title}</h3>
                  </div>

                  <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0 ${
                    c.urgency === 'urgent'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                      : c.urgency === 'high'
                      ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      : 'bg-slate-800 text-slate-300'
                  }`}>
                    {c.urgency === 'urgent' ? '🚨 أولوية قصوى' : c.urgency === 'high' ? '⚡ عاجل' : 'عادي'}
                  </span>
                </div>

                {/* AI Executive Summary Preview */}
                <div className="p-3.5 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-300 leading-relaxed">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-400 mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>ملخص الذكاء الاصطناعي:</span>
                  </div>
                  <p className="line-clamp-2">{c.executiveSummary}</p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 gap-3">
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <span>الهاتف: {c.clientPhone}</span>
                    <span>• {new Date(c.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.status === 'new_intake' && (
                      <button
                        onClick={() => updateCaseStatus(c.id, 'accepted', 'تمت مراجعة الملخص وقبول القضية لتجهيز صحيفة الدعوى')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
                      >
                        قبول القضية
                      </button>
                    )}
                    <Link
                      href={`/lawyer/cases/${c.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
                    >
                      فتح الملف الكامل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Calendar & Quick Drafting Tool */}
        <div className="space-y-6">
          
          {/* Upcoming Court Sessions */}
          <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-white">
                <Calendar className="w-4 h-4 text-purple-400" />
                <span>أجندة الجلسات القادمة</span>
              </div>
              <span className="text-[11px] text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded-full">
                3 جلسات هذا الأسبوع
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300">الأحد 17 أغسطس</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                    محكمة شمال القاهرة
                  </span>
                </div>
                <p className="font-semibold text-white">جلسة نطق بالحكم - دعوى تعويض عمالي</p>
                <p className="text-[11px] text-slate-400">القضية رقم: 4421/2023 عمالي كلي</p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-purple-300">الثلاثاء 19 أغسطس</span>
                  <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded">
                    المحكمة الاقتصادية
                  </span>
                </div>
                <p className="font-semibold text-white">جلسة خبير حسابي - نزاع عقد شراكة</p>
                <p className="text-[11px] text-slate-400">القضية رقم: 1089/2024 اقتصادي</p>
              </div>
            </div>
          </div>

          {/* Quick Legal Drafting Banner */}
          <div className="p-5 rounded-3xl bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30 shadow-xl space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-indigo-400" />
            </div>
            <h3 className="text-sm font-bold text-white">مساعد الصياغة القانونية الذكية</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              قم بتوليد صحف الدعاوى، المذكرات الجوابية، والإنذارات الرسمية بأسلوب قضائي رصين مع الإحالة التلقائية لمواد القانون وأحكام النقض.
            </p>
            <Link
              href="/lawyer/ai-drafting"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300"
            >
              <span>فتح استوديو الصياغة</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
