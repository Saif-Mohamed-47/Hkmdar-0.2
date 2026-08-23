'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { 
  FolderKanban, 
  Scale, 
  Users, 
  Calendar, 
  TrendingUp, 
  Award, 
  ChevronLeft, 
  FileText, 
  Gavel
} from 'lucide-react';
import CaseStatusBadge from '@/components/lawyer/CaseStatusBadge';

export default function LawyerDashboardPage() {
  const { user, cases, updateCaseStatus } = useApp();

  const newIntakes = cases.filter((c) => c.status === 'new_intake');
  const activeCases = cases.filter((c) => c.status === 'accepted' || c.status === 'in_court');

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Lawyer Command Center Header Banner */}
      <div className="rounded-3xl legal-card p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs font-semibold">
              <Award className="w-3.5 h-3.5" />
              <span>المكتب القضائي الرقمي · مقيد بجدول محكمة النقض</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
              لوحة تحكم المكتب القضائي | {user.name}
            </h1>
            <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
              استقبال ملفات الدعاوى المستخلصة آلياً من استشارات الموكلين، متابعة أجندة الجلسات، وصياغة المذكرات القضائية بأحكام النقض.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 shrink-0">
            <Link
              href="/lawyer/cases"
              className="flex items-center gap-2 px-5 py-3 rounded-xl btn-legal-gold text-xs font-bold"
            >
              <FolderKanban className="w-4 h-4" />
              <span>إدارة ملفات القضايا ({cases.length})</span>
            </Link>
            <Link
              href="/lawyer/ai-drafting"
              className="flex items-center gap-2 px-5 py-3 rounded-xl btn-legal-navy text-xs font-bold"
            >
              <FileText className="w-4 h-4 text-[var(--accent-gold)]" />
              <span>استوديو الصياغة القضائية</span>
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="p-5 rounded-2xl legal-card space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">طلبات واردة جديدة</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/20 flex items-center justify-center text-[var(--accent-gold)]">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            {newIntakes.length}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">ملفات دعاوى جديدة بانتظار المراجعة</p>
        </div>

        <div className="p-5 rounded-2xl legal-card space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">القضايا المتداولة والنشطة</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Scale className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            {activeCases.length}
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">دعاوى منظورة أمام دوائر المحاكم</p>
        </div>

        <div className="p-5 rounded-2xl legal-card space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">نسبة كسب الأحكام</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-500">
            94.2%
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">في القضايا العمالية والتجارية</p>
        </div>

        <div className="p-5 rounded-2xl legal-card space-y-2">
          <div className="flex items-center justify-between text-[var(--text-muted)]">
            <span className="text-xs font-medium">إجمالي الموكلين المسجلين</span>
            <div className="w-8 h-8 rounded-lg bg-[var(--bg-surface-elevated)] border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
            380+
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">استشارات وقضايا منفذة بالمكتب</p>
        </div>

      </div>

      {/* Main Content Grid: Incoming Intakes Queue & Court Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Incoming Case Intakes Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderKanban className="w-5 h-5 text-[var(--accent-gold)]" />
              <h2 className="text-base font-bold text-[var(--text-primary)]">
                طلبات القضايا الواردة من الموكلين
              </h2>
              {newIntakes.length > 0 && (
                <span className="text-[11px] bg-amber-500/15 border border-amber-500/40 text-amber-500 font-bold px-2 py-0.5 rounded-full">
                  {newIntakes.length} طلب جديد
                </span>
              )}
            </div>
            <Link
              href="/lawyer/cases"
              className="text-xs font-semibold text-[var(--accent-gold)] hover:underline flex items-center gap-1"
            >
              <span>عرض كافة القضايا</span>
              <ChevronLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3.5">
            {cases.slice(0, 3).map((c) => (
              <div
                key={c.id}
                className="p-5 rounded-2xl legal-card space-y-4 shadow-lg"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CaseStatusBadge status={c.status} />
                      <span className="text-xs font-mono text-[var(--text-secondary)] bg-[var(--bg-input)] px-2 py-0.5 rounded border border-[var(--border-subtle)]">{c.id}</span>
                      <span className="text-xs text-[var(--text-secondary)]">
                        الموكل: <strong className="text-[var(--text-primary)]">{c.clientName}</strong> ({c.clientLocation})
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-[var(--text-primary)]">{c.title}</h3>
                  </div>

                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0 ${
                    c.urgency === 'urgent'
                      ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                      : c.urgency === 'high'
                      ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
                  }`}>
                    {c.urgency === 'urgent' ? 'أولوية قصوى' : c.urgency === 'high' ? 'عاجل' : 'عادي'}
                  </span>
                </div>

                {/* Executive Summary Preview */}
                <div className="p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed">
                  <span className="font-bold text-[var(--accent-gold)] block mb-1">
                    ملخص الواقعة القانونية:
                  </span>
                  <p className="line-clamp-2 text-[var(--text-primary)]">{c.executiveSummary}</p>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-2 border-t border-[var(--border-subtle)] gap-3 text-xs">
                  <div className="text-[11px] text-[var(--text-muted)] flex items-center gap-2">
                    <span>الهاتف: {c.clientPhone}</span>
                    <span>• {new Date(c.createdAt).toLocaleDateString('ar-EG')}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {c.status === 'new_intake' && (
                      <button
                        onClick={() => updateCaseStatus(c.id, 'accepted', 'تمت مراجعة وقائع القضية وقبولها لتجهيز صحيفة الدعوى')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors cursor-pointer"
                      >
                        قبول القضية
                      </button>
                    )}
                    <Link
                      href={`/lawyer/cases/${c.id}`}
                      className="px-3.5 py-1.5 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] text-xs font-semibold border border-[var(--border-subtle)] transition-colors"
                    >
                      فتح الملف الكامل
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right 1 Col: Upcoming Court Schedule & Quick Studio */}
        <div className="space-y-6">
          
          {/* Upcoming Court Sessions */}
          <div className="p-6 rounded-3xl legal-card space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--text-primary)]">
                <Calendar className="w-4 h-4 text-[var(--accent-gold)]" />
                <span>أجندة الجلسات القضائية</span>
              </div>
              <span className="text-[11px] text-[var(--accent-gold)] bg-[var(--bg-surface-elevated)] px-2 py-0.5 rounded-full border border-[var(--accent-gold)]/20">
                هذا الأسبوع
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--accent-gold)]">الأحد 17 أغسطس</span>
                  <span className="text-[10px] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] px-2 py-0.5 rounded">
                    شمال القاهرة
                  </span>
                </div>
                <p className="font-semibold text-[var(--text-primary)]">جلسة مرافعة - دعوى تعويض عمالي</p>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">القضية رقم: 4421/2024 عمالي كلي</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[var(--accent-gold)]">الثلاثاء 19 أغسطس</span>
                  <span className="text-[10px] bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)] px-2 py-0.5 rounded">
                    المحكمة الاقتصادية
                  </span>
                </div>
                <p className="font-semibold text-[var(--text-primary)]">جلسة خبير حسابي - نزاع عقد توريد</p>
                <p className="text-[11px] text-[var(--text-muted)] font-mono">القضية رقم: 1089/2024 اقتصادي</p>
              </div>
            </div>
          </div>

          {/* Quick Legal Drafting Banner */}
          <div className="p-6 rounded-3xl bg-[var(--bg-input)] border border-[var(--accent-gold)]/30 space-y-3.5">
            <div className="w-10 h-10 rounded-xl bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 flex items-center justify-center text-[var(--accent-gold)]">
              <Gavel className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-[var(--text-primary)]">استوديو الصياغة القضائية</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              صياغة مذكرات الدفاع والإنذارات الرسمية وعرائض الدعاوى بأسلوب قضائي رصين مع الإحالة التلقائية لمواد القانون وأحكام النقض.
            </p>
            <Link
              href="/lawyer/ai-drafting"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[var(--accent-gold)] hover:underline"
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
