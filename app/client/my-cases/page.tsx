'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import CaseStatusBadge from '@/components/lawyer/CaseStatusBadge';
import { 
  FolderKanban, 
  FileText, 
  Scale, 
  Clock, 
  MessageSquare,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  BookOpen
} from 'lucide-react';

export default function MyCasesPage() {
  const { cases, user, lawyers } = useApp();
  const [expandedCaseId, setExpandedCaseId] = useState<string | null>(cases[0]?.id || null);

  const clientCases = cases.filter((c) => c.clientId === user.id || !c.clientId);

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111c38] border border-[#c5a059]/30 text-[#dfba73] text-xs font-semibold">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>متابعة ملفات الدعاوى والاستشارات المرسلة</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            سجل ملفات قضاياي ومتابعة المحامي
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            تتبع المراحل الإجرائية لقضاياك المحولة للمحامين وتوجيهات مكتب الدفاع ومواعيد الجلسات.
          </p>
        </div>

        <Link
          href="/client/ai-chat"
          className="flex items-center gap-2 px-5 py-3 rounded-xl btn-legal-gold text-xs font-bold shrink-0"
        >
          <Scale className="w-4 h-4" />
          <span>استشارة جديدة وإنشاء قضية</span>
        </Link>
      </div>

      {/* Cases List */}
      {clientCases.length === 0 ? (
        <div className="p-12 rounded-3xl legal-card text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-[#111c38] border border-slate-800 mx-auto flex items-center justify-center text-slate-400">
            <FolderKanban className="w-8 h-8 text-[#dfba73]" />
          </div>
          <h3 className="text-base font-bold text-white">لا توجد قضايا مسجلة حتى الآن</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            عندما تقوم باستشارة المستشار القانوني واختيار تحويل لملف قضية، ستظهر الدعوى هنا بكامل تفاصيلها وأسانيدها وردود المحامي.
          </p>
          <div className="pt-2">
            <Link
              href="/client/ai-chat"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-legal-gold text-xs font-bold"
            >
              <Scale className="w-4 h-4" />
              <span>بدء استشارة قانونية الآن</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {clientCases.map((c) => {
            const isExpanded = expandedCaseId === c.id;

            return (
              <div
                key={c.id}
                className="rounded-3xl legal-card overflow-hidden shadow-xl transition-all"
              >
                {/* Summary Header Row */}
                <div
                  onClick={() => setExpandedCaseId(isExpanded ? null : c.id)}
                  className="p-5 sm:p-6 cursor-pointer hover:bg-[#111c38]/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-2 flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <CaseStatusBadge status={c.status} />
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-[#080e1c] text-slate-300 border border-slate-800">
                        {c.id}
                      </span>
                      <span className="text-xs text-slate-400">
                        {new Date(c.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{c.title}</h3>

                    <div className="flex items-center gap-4 text-xs text-slate-400 flex-wrap">
                      <span>المحامي المسؤول: <strong className="text-slate-200">{c.lawyerName || 'لم يحدد بعد'}</strong></span>
                      {c.courtDate && (
                        <span className="text-[#dfba73] font-semibold bg-[#111c38] px-2.5 py-0.5 rounded border border-[#c5a059]/20">
                          موعد الجلسة: {c.courtDate}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-xs text-[#dfba73] font-semibold hidden sm:inline">
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
                  <div className="p-6 border-t border-slate-800/80 bg-[#080e1c] space-y-6 animate-in fade-in">
                    
                    {/* Executive Summary Box */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#dfba73]" />
                        <span>الملخص التنفيذي للواقعة:</span>
                      </h4>
                      <p className="text-xs text-slate-200 leading-relaxed p-4 rounded-2xl bg-[#0b1224] border border-slate-800">
                        {c.executiveSummary}
                      </p>
                    </div>

                    {/* Legal Claims */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-300 flex items-center gap-2">
                        <Scale className="w-4 h-4 text-[#dfba73]" />
                        <span>المطالبات القضائية والتعويضات المقترحة:</span>
                      </h4>
                      <div className="space-y-2">
                        {c.legalClaims.map((claim, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-[#0b1224] border border-slate-800 text-xs text-slate-200 flex items-start gap-2.5"
                          >
                            <span className="w-5 h-5 rounded-full bg-[#111c38] text-[#dfba73] border border-[#c5a059]/30 font-bold flex items-center justify-center shrink-0 text-[10px]">
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
                          <BookOpen className="w-4 h-4 text-[#dfba73]" />
                          <span>الأسانيد والمواد القانونية المرفقة بالملف:</span>
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {c.relevantStatutes.map((st) => (
                            <div
                              key={st.id}
                              className="p-3.5 rounded-2xl bg-[#0b1224] border border-slate-800 text-xs space-y-1"
                            >
                              <div className="flex items-center justify-between font-bold text-white">
                                <span>{st.title}</span>
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#111c38] text-[#dfba73] font-mono">
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

                    {/* Strategy Recommendation */}
                    <div className="p-4 rounded-2xl bg-[#0b1224] border border-[#c5a059]/25 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-bold text-[#dfba73]">
                        <ShieldCheck className="w-4 h-4" />
                        <span>خطة التقاضي المقترحة:</span>
                      </div>
                      <p className="text-xs text-slate-200 leading-relaxed font-medium">
                        {c.aiStrategicRecommendation}
                      </p>
                    </div>

                    {/* Lawyer Feedback / Notes */}
                    {c.lawyerNotes && (
                      <div className="p-4 rounded-2xl bg-[#111c38] border border-[#c5a059]/40 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-[#dfba73]">
                          <MessageSquare className="w-4 h-4" />
                          <span>ملاحظات مكتب المحامي ({c.lawyerName}):</span>
                        </div>
                        <p className="text-xs text-slate-100 leading-relaxed">
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
