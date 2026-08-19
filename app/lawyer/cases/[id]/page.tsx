'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { CaseStatus } from '@/lib/types';
import CaseStatusBadge from '@/components/lawyer/CaseStatusBadge';
import { 
  ArrowRight, 
  Sparkles, 
  FileText, 
  Scale, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Printer, 
  Save,
  MessageSquare,
  ChevronLeft,
  Gavel,
  BookOpen
} from 'lucide-react';

export default function LawyerCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const caseId = resolvedParams.id;
  const { getCaseById, updateCaseStatus, addToast } = useApp();
  const router = useRouter();

  const caseData = getCaseById(caseId);

  const [status, setStatus] = useState<CaseStatus>(caseData?.status || 'new_intake');
  const [courtDate, setCourtDate] = useState(caseData?.courtDate || '');
  const [lawyerNotes, setLawyerNotes] = useState(caseData?.lawyerNotes || '');
  const [isSaving, setIsSaving] = useState(false);

  if (!caseData) {
    return (
      <div className="p-12 rounded-3xl bg-slate-900/50 border border-slate-800 text-center space-y-4 max-w-xl mx-auto">
        <AlertCircle className="w-12 h-12 text-amber-400 mx-auto" />
        <h2 className="text-lg font-bold text-white">لم يتم العثور على ملف القضية المطلوب</h2>
        <p className="text-xs text-slate-400">قد يكون رقم الملف غير صحيح أو تم حذفه</p>
        <Link
          href="/lawyer/cases"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-xs font-semibold"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لقائمة القضايا</span>
        </Link>
      </div>
    );
  }

  const handleSaveChanges = () => {
    setIsSaving(true);
    updateCaseStatus(caseData.id, status, lawyerNotes, courtDate);
    setTimeout(() => {
      setIsSaving(false);
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300 pb-12">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/lawyer/cases"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لملفات القضايا</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>طباعة ملف القضية (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Case Intake Header Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <CaseStatusBadge status={status} size="md" />
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
                {caseData.id}
              </span>
              <span className="text-xs text-slate-400">
                تاريخ الاستلام: {new Date(caseData.createdAt).toLocaleDateString('ar-EG')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {caseData.title}
            </h1>
          </div>

          <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${
            caseData.urgency === 'urgent'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
          }`}>
            {caseData.urgency === 'urgent' ? '🚨 أولوية قصوى' : '⚡ عاجل'}
          </span>
        </div>

        {/* Client Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-400" />
            <span>الموكل: <strong>{caseData.clientName}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-emerald-400" />
            <span>الهاتف: <strong>{caseData.clientPhone}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>الموقع: <strong>{caseData.clientLocation}</strong></span>
          </div>
        </div>
      </div>

      {/* Lawyer Action & Status Update Box */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/30 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Gavel className="w-4 h-4 text-amber-400" />
          <span>إدارة ومتابعة حالة القضية</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              تحديث مرحلة التقاضي / الحالة:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="new_intake">طلب جديد (AI Intake)</option>
              <option value="under_review">قيد الدراسة والمراجعة</option>
              <option value="accepted">تم قبول القضية وتجهيز صحيفة الدعوى</option>
              <option value="in_court">منظورة بالجلسات أمام المحكمة</option>
              <option value="resolved">تم كسب الحكم / إنهاء النزاع</option>
              <option value="closed">مغلقة ومؤرشفة</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              تاريخ الجلسة القادمة بالمحكمة (اختياري):
            </label>
            <input
              type="text"
              value={courtDate}
              onChange={(e) => setCourtDate(e.target.value)}
              placeholder="مثال: الأحد 14 سبتمبر 2024 - الدائرة 3 عمالي"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            ملاحظات وتوجيهات المحامي (تظهر للموكل في حسابه):
          </label>
          <textarea
            rows={2}
            value={lawyerNotes}
            onChange={(e) => setLawyerNotes(e.target.value)}
            placeholder="اكتب التوجيهات أو المستندات الإضافية المطلوبة من الموكل..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-lg transition-all hover:scale-105"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التحديثات'}</span>
          </button>
        </div>
      </div>

      {/* AI Case Intake Body Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Executive Summary */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>1. الملخص التنفيذي لوقائع الدعوى (AI Executive Summary)</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 font-medium">
            {caseData.executiveSummary}
          </p>
        </div>

        {/* Section 2: Formulated Legal Claims */}
        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-amber-400">
            <Scale className="w-4 h-4" />
            <span>2. بنود الطلبات القضائية والتعويضات المقترحة</span>
          </div>
          <div className="space-y-2">
            {caseData.legalClaims.map((claim, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-800/40 border border-slate-700/50 text-xs text-slate-200 flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{claim}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Statutory Citations */}
        {caseData.relevantStatutes && caseData.relevantStatutes.length > 0 && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-blue-400">
              <BookOpen className="w-4 h-4" />
              <span>3. الأسانيد والمواد القانونية وسوابق النقض المرتبطة</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseData.relevantStatutes.map((st) => (
                <div
                  key={st.id}
                  className="p-4 rounded-2xl bg-slate-800/60 border border-blue-500/20 text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-white">
                    <span>{st.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      {st.articleNumber || 'مادة تشريعية'}
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px] leading-relaxed">
                    {st.summary}
                  </p>
                  <p className="text-[10px] text-slate-400 pt-1">
                    المرجع: {st.court || st.lawName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Chronological Fact Timeline */}
        {caseData.clientTimeline && caseData.clientTimeline.length > 0 && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-purple-400">
              <Clock className="w-4 h-4" />
              <span>4. التسلسل الزمني للوقائع وتواريخ النزاع</span>
            </div>
            <div className="space-y-2.5">
              {caseData.clientTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/40 text-xs flex items-center justify-between gap-4"
                >
                  <span className="text-slate-200 font-medium">{item.event}</span>
                  <span className="text-[11px] font-mono text-purple-400 shrink-0 bg-purple-500/10 px-2 py-0.5 rounded">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: AI Strategic Recommendation */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 shadow-xl space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>5. توصية واستراتيجية الترافع المقترحة من المساعد الذكي</span>
          </div>
          <p className="text-xs text-slate-200 leading-relaxed font-medium">
            {caseData.aiStrategicRecommendation}
          </p>
        </div>

      </div>

    </div>
  );
}
