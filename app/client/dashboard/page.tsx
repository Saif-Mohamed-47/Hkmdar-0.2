'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  Scale, 
  Users, 
  FolderKanban, 
  ShieldCheck, 
  BookOpen, 
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
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="rounded-3xl legal-card p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs font-semibold">
              <Scale className="w-3.5 h-3.5" />
              <span>بوابة الموكل · منصة حكمدار</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              أهلاً بك، {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              استشارات قانونية موثقة بنصوص التشريعات وأحكام محكمة النقض، وترشيح مباشر للمحامين المعتمدين مع إرسال ملف قضيتك لمكتب الدفاع.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/client/ai-chat"
              className="flex items-center gap-2 px-5 py-3 rounded-xl btn-legal-gold text-xs font-bold"
            >
              <Scale className="w-4 h-4" />
              <span>بدء استشارة قانونية</span>
            </Link>
            <button
              onClick={() => setMatchModalOpen(true)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl btn-legal-navy text-xs font-bold cursor-pointer"
            >
              <Users className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>الترشيح الذكي للمحامين</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3 Core Pillars Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        
        {/* Pillar 1: Legal Consultation */}
        <Link
          href="/client/ai-chat"
          className="p-6 rounded-3xl legal-card-interactive shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
              <Scale className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              المستشار القانوني الرقمي
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              اطرح أسئلتك وتفاصيل الواقعة القانونية للحصول على التكييف القانوني وسوابق محكمة النقض مع استخراج ملف قضية جاهز.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[var(--accent-gold)]">
            <span>بدء استشارة جديدة</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </Link>

        {/* Pillar 2: Legislative Research */}
        <Link
          href="/client/legal-research"
          className="p-6 rounded-3xl legal-card-interactive shadow-lg flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              البحث في القوانين والسوابق
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              محرك بحث متقدم في نصوص القانون المدني، العمل، التجارة، والجنائي مع تفسيرات لأثر كل نص قانوني.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[var(--accent-gold)]">
            <span>استكشاف المواد القانونية</span>
            <ChevronLeft className="w-4 h-4" />
          </div>
        </Link>

        {/* Pillar 3: Lawyers Directory & Match */}
        <div
          onClick={() => setMatchModalOpen(true)}
          className="p-6 rounded-3xl legal-card-interactive shadow-lg flex flex-col justify-between cursor-pointer"
        >
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              ترشيح واختيار المحامي
            </h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              مطابقة نوع قضيتك وموقعك مع نخبة المحامين المعتمدين والمقيدين بالنقض مع إرسال ملف الاستشارة مباشرة لمكتبهم.
            </p>
          </div>
          <div className="mt-5 flex items-center gap-1 text-xs font-bold text-[var(--accent-gold)]">
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
              <FolderKanban className="w-5 h-5 text-[var(--accent-gold)]" />
              <h2 className="text-base font-bold text-[var(--text-primary)]">ملفات قضاياي المرفوعة</h2>
              <span className="text-xs bg-[var(--bg-surface-elevated)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 px-2.5 py-0.5 rounded-full font-bold">
                {clientCases.length}
              </span>
            </div>
            <Link
              href="/client/my-cases"
              className="text-xs font-semibold text-[var(--accent-gold)] hover:underline flex items-center gap-1"
            >
              <span>سجل القضايا الكامل</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          {clientCases.length === 0 ? (
            <div className="p-8 rounded-3xl legal-card text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] mx-auto flex items-center justify-center text-[var(--text-muted)]">
                <FileText className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[var(--text-primary)]">لا توجد قضايا مسجلة حتى الآن</p>
              <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto">
                يمكنك التحدث مع المستشار القانوني لاستخراج ملف قضية وإرساله إلى المحامي المعتمد.
              </p>
              <div className="pt-2">
                <Link
                  href="/client/ai-chat"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-legal-gold text-xs font-bold"
                >
                  <Scale className="w-4 h-4" />
                  <span>بدء استشارة جديدة</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {clientCases.slice(0, 3).map((c) => (
                <div
                  key={c.id}
                  className="p-5 rounded-2xl legal-card flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-md"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CaseStatusBadge status={c.status} />
                      <span className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-input)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">
                        {c.id}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-[var(--text-primary)] truncate">{c.title}</h4>
                    <p className="text-xs text-[var(--text-secondary)] line-clamp-1">
                      {c.executiveSummary}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-[var(--text-secondary)] pt-1">
                      <span>المحامي: <strong className="text-[var(--text-primary)]">{c.lawyerName || 'بانتظار التعيين'}</strong></span>
                      <span>• {new Date(c.createdAt).toLocaleDateString('ar-EG')}</span>
                    </div>
                  </div>

                  <Link
                    href="/client/my-cases"
                    className="shrink-0 px-4 py-2 rounded-xl btn-legal-navy text-xs font-semibold text-center"
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
              <Briefcase className="w-5 h-5 text-[var(--accent-gold)]" />
              <h2 className="text-base font-bold text-[var(--text-primary)]">نخبة المحامين المعتمدين</h2>
            </div>
            <Link
              href="/client/lawyers"
              className="text-xs font-semibold text-[var(--accent-gold)] hover:underline flex items-center gap-1"
            >
              <span>دليل المحامين</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {lawyers.slice(0, 3).map((lawyer) => (
              <div
                key={lawyer.id}
                className="p-4 rounded-2xl legal-card flex items-start gap-3.5"
              >
                <div className="w-12 h-12 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 p-0.5 shrink-0 overflow-hidden">
                  <img
                    src={lawyer.avatar}
                    alt={lawyer.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-[var(--text-primary)] truncate">{lawyer.name}</h4>
                    <span className="text-[11px] text-[var(--accent-gold)] font-semibold flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-[var(--accent-gold)] text-[var(--accent-gold)]" />
                      {lawyer.rating}
                    </span>
                  </div>
                  <p className="text-[11px] text-[var(--text-secondary)] truncate mt-0.5">{lawyer.title}</p>
                  <p className="text-[10px] text-emerald-500 mt-1 font-semibold">
                    نسبة نجاح: {lawyer.winRate}% • {lawyer.location.split('(')[0]}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Institutional Legal Tip Box */}
          <div className="p-5 rounded-3xl bg-[var(--bg-input)] border border-[var(--accent-gold)]/25 text-xs space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-[var(--accent-gold)]">
              <ShieldCheck className="w-4 h-4" />
              <span>إرشاد إجرائي</span>
            </div>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              في دعاوى العمل، احرص على تقديم شكوى لمكتب العمل المختص خلال المواعيد المقررة قانوناً لضمان عدم سقوط الحق في المطالبة بالتعويض ومهلة الإخطار.
            </p>
          </div>

        </div>

      </div>

      {/* Matchmaker Modal */}
      <LawyerMatchModal
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
      />

    </div>
  );
}
