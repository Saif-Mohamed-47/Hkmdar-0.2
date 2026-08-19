'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { CaseStatus } from '@/lib/types';
import CaseStatusBadge from '@/components/lawyer/CaseStatusBadge';
import { 
  FolderKanban, 
  Sparkles, 
  Search, 
  Filter, 
  Calendar, 
  Clock, 
  User, 
  ChevronLeft, 
  ShieldCheck, 
  FileText,
  AlertTriangle
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
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>إدارة قضايا المكتب والطلبات المحولة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ملفات القضايا والطلبات الواردة من الذكاء الاصطناعي
          </h1>
          <p className="text-sm text-slate-400">
            راجع الملخصات التنفيذية والأسانيد القانونية المستخلصة من استشارات الموكلين وقرر قبول الدعوى أو اتخاذ إجراءات التقاضي.
          </p>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        
        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث برقم الملف، اسم الموكل، أو موضوع الدعوى..."
            className="w-full pr-11 pl-4 py-3 rounded-2xl bg-slate-800/90 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-bold">
          <button
            onClick={() => setSelectedStatus('all')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedStatus === 'all'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            الكل ({cases.length})
          </button>
          
          <button
            onClick={() => setSelectedStatus('new_intake')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedStatus === 'new_intake'
                ? 'bg-emerald-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>طلبات AI جديدة ({countByStatus('new_intake')})</span>
          </button>

          <button
            onClick={() => setSelectedStatus('under_review')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedStatus === 'under_review'
                ? 'bg-amber-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            قيد المراجعة ({countByStatus('under_review')})
          </button>

          <button
            onClick={() => setSelectedStatus('accepted')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedStatus === 'accepted'
                ? 'bg-blue-500 text-slate-950 shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            مقبولة للتجهيز ({countByStatus('accepted')})
          </button>

          <button
            onClick={() => setSelectedStatus('in_court')}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedStatus === 'in_court'
                ? 'bg-purple-500 text-white shadow-md'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            منظورة بالمحكمة ({countByStatus('in_court')})
          </button>
        </div>

      </div>

      {/* Cases List */}
      {filteredCases.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-sm font-bold text-white">لا توجد قضايا مطابقة لهذا التصنيف</h3>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all space-y-4 shadow-xl"
            >
              {/* Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <CaseStatusBadge status={c.status} />
                    <span className="text-xs font-mono font-bold text-slate-400">{c.id}</span>
                    <span className="text-xs text-slate-400">
                      الموكل: <strong className="text-white">{c.clientName}</strong> ({c.clientLocation})
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{c.title}</h3>
                </div>

                <span className={`text-[11px] font-bold px-3 py-1 rounded-full shrink-0 ${
                  c.urgency === 'urgent'
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                    : c.urgency === 'high'
                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                    : 'bg-slate-800 text-slate-300'
                }`}>
                  {c.urgency === 'urgent' ? '🚨 أولوية قصوى' : c.urgency === 'high' ? '⚡ عاجل' : 'استشارة عادية'}
                </span>
              </div>

              {/* AI Brief Summary */}
              <div className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 text-xs text-slate-200 leading-relaxed space-y-2">
                <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>الملخص التنفيذي المُعد عبر الذكاء الاصطناعي:</span>
                </div>
                <p>{c.executiveSummary}</p>
              </div>

              {/* Claims & Statutes Counts */}
              <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-1">
                <div className="flex items-center gap-4 flex-wrap">
                  <span>📜 المطالبات: <strong className="text-slate-200">{c.legalClaims.length} بنود</strong></span>
                  <span>🏛️ السند التشريعي: <strong className="text-emerald-400">{c.relevantStatutes?.length || 1} مواد</strong></span>
                  <span>📅 تاريخ الإرسال: <strong className="text-slate-200">{new Date(c.createdAt).toLocaleDateString('ar-EG')}</strong></span>
                </div>

                <Link
                  href={`/lawyer/cases/${c.id}`}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-bold text-xs transition-colors"
                >
                  <span>عرض ملف القضية واتخاذ إجراء</span>
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
