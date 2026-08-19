'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  Sparkles, 
  Scale, 
  Search, 
  Users, 
  FolderKanban, 
  ArrowLeft, 
  Clock, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle,
  FileText,
  Briefcase,
  Star,
  ChevronLeft
} from 'lucide-react';
import LawyerMatchModal from '@/components/client/LawyerMatchModal';
import CaseStatusBadge from '@/components/lawyer/CaseStatusBadge';

export default function ClientDashboardPage() {
  const { user, cases, lawyers } = useApp();
  const [matchModalOpen, setMatchModalOpen] = useState(false);

  const clientCases = cases.filter((c) => c.clientId === user.id || !c.clientId);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/60 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>الذكاء الاصطناعي القانوني في خدمتك 24/7</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              أهلاً بك، {user.name} ⚖️
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              منظومة **حُكمدار** تمنحك استشارات قانونية فورية مدعومة بمواد القانون وأحكام محكمة النقض، وترشيحاً ذكياً لأفضل المحامين، وإمكانية إرسال ملخص قضيتك مباشرة للمحامي.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/client/ai-chat"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/60 transition-all hover:scale-105"
            >
              <Sparkles className="w-4 h-4" />
              <span>استشر المساعد الذكي الآن</span>
            </Link>
            <button
              onClick={() => setMatchModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-bold transition-all hover:scale-105"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>الترشيح الذكي للمحامين</span>
            </button>
          </div>
        </div>

        {/* Decorative subtle background elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* 3 Core Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: Legal AI Chat */}
        <Link
          href="/client/ai-chat"
          className="group p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
              المستشار القانوني الذكي
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              اطرح أسئلتك القانونية باللغة الطبيعية واحصل على إجابات موثقة بالمواد التشريعية وأحكام النقض وسوابق المحاكم مع إمكانية استخراج ملف قضية بضغطة زر.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-emerald-400 group-hover:gap-2 transition-all">
            <span>بدء استشارة جديدة</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </Link>

        {/* Pillar 2: AI Legal Research */}
        <Link
          href="/client/legal-research"
          className="group p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6 text-blue-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
              محرك البحث في القوانين والسوابق
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              ابحث في نصوص القانون المدني، الجنائي، العمل، والشركات مع ملخصات ذكية وتفسيرات مبسطة توفر ساعات من البحث اليدوي.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-blue-400 group-hover:gap-2 transition-all">
            <span>استكشاف المواد القانونية</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </Link>

        {/* Pillar 3: AI Lawyer Match & Directory */}
        <div
          onClick={() => setMatchModalOpen(true)}
          className="cursor-pointer group p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition-all hover:-translate-y-1 shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
              الترشيح الذكي واختيار المحامي
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              محرك ذكي يحلل نوع قضيتك وموقعك وميزانيتك ليرشح لك أفضل 3 محامين مقيدين بالنقض مع إرسال ملخص المحادثة مباشرة لمكتبهم.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:gap-2 transition-all">
            <span>بدء مطابقة المحامين</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </div>

      </div>

      {/* Main Grid: My Active Cases & Top Lawyers */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: My Active Cases Tracker */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-emerald-400" />
              <h2 className="text-base font-bold text-white">ملفات قضاياي المرفوعة</h2>
              <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full">
                {clientCases.length}
              </span>
            </div>
            <Link
              href="/client/my-cases"
              className="text-xs font-medium text-emerald-400 hover:underline flex items-center gap-1"
            >
              <span>عرض كل القضايا</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {clientCases.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-300">لا توجد قضايا مرفوعة بعد</p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                يمكنك التحدث مع المستشار الذكي لاستخراج ملف قضية جاهز وإرساله إلى أحد المحامين المعتمدين.
              </p>
              <Link
                href="/client/ai-chat"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>بدء استشارة لإنشاء قضية</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {clientCases.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CaseStatusBadge status={c.status} />
                      <span className="text-[11px] text-slate-400 font-mono">
                        {c.id}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">{c.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">
                      {c.executiveSummary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
                      <span>المحامي: <strong className="text-slate-200">{c.lawyerName || 'بانتظار التعيين'}</strong></span>
                      <span>• {new Date(c.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>

                  <Link
                    href="/client/my-cases"
                    className="shrink-0 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 text-center transition-colors"
                  >
                    تفاصيل الملف
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: Top Recommended Lawyers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-amber-400" />
              <h2 className="text-base font-bold text-white">نخبة المحامين المعتمدين</h2>
            </div>
            <Link
              href="/client/lawyers"
              className="text-xs font-medium text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>دليل المحامين</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {lawyers.slice(0, 3).map((lawyer) => (
              <div
                key={lawyer.id}
                className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-amber-500/30 transition-all flex items-start gap-3.5"
              >
                <img
                  src={lawyer.avatar}
                  alt={lawyer.name}
                  className="w-12 h-12 rounded-xl object-cover ring-1 ring-slate-700 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white truncate">{lawyer.name}</h4>
                    <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      {lawyer.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate mt-0.5">{lawyer.title}</p>
                  <p className="text-[10px] text-emerald-400 mt-1">
                    نسبة نجاح: {lawyer.winRate}% • {lawyer.location.split('(')[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Legal Tip Box */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/20 text-xs space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-300">
              <ShieldCheck className="w-4 h-4" />
              <span>نصيحة حُكمدار القانونية</span>
            </div>
            <p className="text-slate-300 leading-relaxed">
              في قضايا العمل، احرص على تحرير محضر إثبات حالة بقسم الشرطة خلال 10 أيام من واقعة المنع من العمل لضمان عدم سقوط حقك في مهلة الإخطار والتعويض.
            </p>
          </div>

        </div>

      </div>

      {/* AI Lawyer Matchmaker Modal */}
      <LawyerMatchModal
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
      />

    </div>
  );
}
