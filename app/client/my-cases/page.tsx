'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import { CaseIntake } from '@/lib/types';
import CaseStatusBadge from '@/components/lawyer/CaseStatusBadge';
import { 
  FolderKanban, 
  Sparkles, 
  FileText, 
  Calendar, 
  User, 
  MapPin, 
  Scale, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MessageSquare
} from 'lucide-react';

export default function MyCasesPage() {
  const { cases, user, lawyers } = useApp();
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(cases[0]?.id || null);

  const clientCases = cases.filter((c) => c.clientId === user.id || !c.clientId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>متابعة القضايا والاستشارات المرسلة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            ملفات قضاياي والطلبات الواردة للمحامين
          </h1>
          <p className="text-sm text-slate-400">
            تتبع حالة قضاياك المحولة من الذكاء الاصطناعي وردود مكاتب المحامين عليها.
          </p>
        </div>

        <Link
          href="/client/ai-chat"
          className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all hover:scale-105 shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>استشارة جديدة وإنشاء قضية</span>
        </Link>
      </div>

      {/* Cases List */}
      {clientCases.length === 0 ? (
        <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 mx-auto flex items-center justify-center text-slate-400">
            <FolderKanban className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">لا توجد قضايا مسجلة حتى الآن</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            عندما تتحدث مع المستشار القانوني الذكي وتختار &quot;تحويل لملف قضية&quot;، ستظهر القضية هنا بكامل تفاصيلها وأسانيدها وردود المحامي.
          </p>
          <Link
            href="/client/ai-chat"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg"
          >
            <Sparkles className="w-4 h-4" />
            <span>بدء محادثة قانونية الآن</span>
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {clientCases.map((c) => {
            const isExpanded = expandedCaseId === c.id;
            const assignedLawyer = lawyers.find((l) => l.id === c.lawyerId);

            return (
              <div
                key={c.id}
                className="rounded-3xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xl transition-all"
              >
                {/* Summary Header Row */}
                <div
                  onClick={() => setExpandedCaseId(isExpanded ? null : c.id)}
                  className="p-5 sm:p-6 cursor-pointer hover:bg-slate-800/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <CaseStatusBadge status={c.status} />
                      <span className="text-xs font-mono font-bold text-slate-400">
                        {c.id}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(c.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{c.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-slate-400">
                      <span>المحامي المختار: <strong className="text-slate-200">{c.lawyerName || 'لم يحدد'}</strong></span>
                      {c.courtDate && (
                        <span className="text-purple-400 font-semibold">
                          📅 موعد الجلسة: {c.courtDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-emerald-400 font-semibold hidden sm:inline">
                      {isExpanded ? 'طي التفاصيل' : 'عرض الملف الكامل'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="p-6 border-t border-slate-800/80 bg-slate-900/40 space-y-6 animate-in fade-in">
                    
                    {/* Executive Summary Box */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-emerald-400" />
                        <span>الملخص التنفيذي للواقعة:</span>
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60">
                        {c.executiveSummary}
                      </p>
                    </div>

                    {/* Legal Claims */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-amber-400" />
                        <span>المطالبات القضائية والتعويضات المقترحة:</span>
                      </h4>
                      <div className="space-y-2">
                        {c.legalClaims.map((claim, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs text-slate-200 flex items-start gap-2"
                          >
                            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{claim}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Relevant Statutes & Precedents */}
                    {c.relevantStatutes && c.relevantStatutes.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-emerald-400" />
                          <span>الأسانيد والمواد القانونية المرفقة بالملف:</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {c.relevantStatutes.map((st) => (
                            <div
                              key={st.id}
                              className="p-3.5 rounded-2xl bg-slate-800/60 border border-emerald-500/20 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between font-bold text-white">
                                <span>{st.title}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                                  {st.articleNumber || 'سند'}
                                </span>
                              </div>
                              <p className="text-slate-400 text-[11px] leading-relaxed">
                                {st.summary}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* AI Strategic Recommendation */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
                        <ShieldCheck className="w-4 h-4" />
                        <span>توصية خطة التقاضي الاستراتيجية (AI Strategy):</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {c.aiStrategicRecommendation}
                      </p>
                    </div>

                    {/* Lawyer Feedback / Notes */}
                    {c.lawyerNotes && (
                      <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/30 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                          <MessageSquare className="w-4 h-4" />
                          <span>ملاحظات مكتب المحامي ({c.lawyerName}):</span>
                        </div>
                        <p className="text-xs text-amber-100 leading-relaxed">
                          {c.lawyerNotes}
                        </p>
                      </div>
                    )}

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
