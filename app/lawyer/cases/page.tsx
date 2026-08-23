'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { CaseStatus } from '@/lib/types';
import CaseStatusBadge from '@/components/lawyer/CaseStatusBadge';
import { 
  FolderKanban, 
  Search, 
  ChevronLeft, 
  FileText
} from 'lucide-react';

export default function LawyerCasesPage() {
  const { cases } = useApp();
  const [selectedStatus, setSelectedStatus] = useState<CaseStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter((c) => {
    const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
    const matchesQuery =
      !searchQuery.trim() ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
      c.executiveSummary.toLowerCase().includes(searchQuery.toLowerCase().trim());

    return matchesStatus && matchesQuery;
  });

  const countByStatus = (status: CaseStatus) => cases.filter((c) => c.status === status).length;

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--bg-surface-elevated)] border border-[var(--accent-gold)]/30 text-[var(--accent-gold)] text-xs font-semibold">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>إدارة قضايا المكتب والدعاوى المحولة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--text-primary)] tracking-tight">
            سجل ملفات القضايا والطلبات الواردة
          </h1>
          <p className="text-xs sm:text-sm text-[var(--text-secondary)]">
            مراجعة الوقائع القانونية والطلبات المقترحة وإدارة مراحل التقاضي والجلسات لكل دعوى.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 sm:p-6 rounded-3xl legal-card space-y-4 shadow-lg">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-[var(--text-muted)] absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الملف، اسم الموكل، أو موضوع الدعوى..."
            className="w-full pr-11 pl-4 py-3 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-gold)] transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedStatus === 'all'
                ? 'bg-[var(--bg-surface-elevated)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/40 shadow-sm'
                : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            جميع القضايا ({cases.length})
          </button>
          
          <button
            onClick={() => setSelectedStatus('new_intake')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedStatus === 'new_intake'
                ? 'bg-[var(--bg-surface-elevated)] text-amber-500 border border-amber-500/40 shadow-sm'
                : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            <span>طلبات واردة جديدة ({countByStatus('new_intake')})</span>
          </button>

          <button
            onClick={() => setSelectedStatus('under_review')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedStatus === 'under_review'
                ? 'bg-[var(--bg-surface-elevated)] text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-sm'
                : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            قيد الدراسة ({countByStatus('under_review')})
          </button>

          <button
            onClick={() => setSelectedStatus('accepted')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedStatus === 'accepted'
                ? 'bg-[var(--bg-surface-elevated)] text-blue-400 border border-blue-500/40 shadow-sm'
                : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            مقبولة للتجهيز ({countByStatus('accepted')})
          </button>

          <button
            onClick={() => setSelectedStatus('in_court')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              selectedStatus === 'in_court'
                ? 'bg-[var(--bg-surface-elevated)] text-purple-400 border border-purple-500/40 shadow-sm'
                : 'bg-[var(--bg-input)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]'
            }`}
          >
            منظورة بالمحكمة ({countByStatus('in_court')})
          </button>
        </div>

      </div>

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <div className="p-12 rounded-3xl legal-card text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-[var(--bg-surface-elevated)] border border-[var(--border-subtle)] mx-auto flex items-center justify-center text-[var(--text-muted)]">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-[var(--text-primary)]">لا توجد ملفات قضايا مطابقة لهذا التصنيف</h3>
          <p className="text-xs text-[var(--text-secondary)]">يمكنك مراجعة البحث أو اختيار تبويب تصنيف مختلف</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl legal-card space-y-4 shadow-lg hover:border-[var(--border-card-hover)] transition-all"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CaseStatusBadge status={c.status} />
                    <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[var(--bg-input)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                      {c.id}
                    </span>
                    <span className="text-xs text-[var(--text-secondary)]">
                      الموكل: <strong className="text-[var(--text-primary)]">{c.clientName}</strong> ({c.clientLocation})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-[var(--text-primary)]">{c.title}</h3>
                </div>

                <span className={`text-[11px] font-semibold px-3 py-1 rounded-full shrink-0 ${
                  c.urgency === 'urgent'
                    ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                    : c.urgency === 'high'
                    ? 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                    : 'bg-[var(--bg-surface-elevated)] text-[var(--text-secondary)]'
                }`}>
                  {c.urgency === 'urgent' ? 'أولوية قصوى' : c.urgency === 'high' ? 'عاجل' : 'استشارة عادية'}
                </span>
              </div>

              {/* Brief Summary */}
              <div className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)] leading-relaxed space-y-1">
                <span className="font-bold text-[var(--accent-gold)] block mb-0.5">
                  ملخص الواقعة:
                </span>
                <p className="text-[var(--text-primary)]">{c.executiveSummary}</p>
              </div>

              {/* Claims & Statutes Counts */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-secondary)] pt-1 border-t border-[var(--border-subtle)]">
                <div className="flex items-center gap-4 flex-wrap">
                  <span>المطالبات: <strong className="text-[var(--text-primary)]">{c.legalClaims.length} بنود</strong></span>
                  <span>السند التشريعي: <strong className="text-[var(--accent-gold)]">{c.relevantStatutes?.length || 1} مواد</strong></span>
                  <span>تاريخ الإرسال: <strong className="text-[var(--text-primary)]">{new Date(c.createdAt).toLocaleDateString('ar-EG')}</strong></span>
                </div>

                <Link
                  href={`/lawyer/cases/${c.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 font-bold text-xs transition-colors"
                >
                  <span>عرض ملف القضية والتحديث</span>
                  <ChevronLeft className="w-3.5 h-3.5" />
                </Link>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
}
