'use client';

import React, { useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useApp } from '@/lib/context/AppContext';
import { CaseStatus } from '@/lib/types';
import CaseStatusBadge from '@/components/lawyer/CaseStatusBadge';
import CaseDocumentManager from '@/components/lawyer/CaseDocumentManager';
import { 
  ArrowRight, 
  FileText, 
  Scale, 
  User, 
  Phone, 
  MapPin, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Printer, 
  Save,
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
      <div className="p-12 rounded-3xl legal-card text-center space-y-4 max-w-xl mx-auto">
        <AlertCircle className="w-12 h-12 text-[var(--accent-gold)] mx-auto" />
        <h2 className="text-lg font-bold text-[var(--text-primary)]">لم يتم العثور على ملف القضية المطلوب</h2>
        <p className="text-xs text-[var(--text-secondary)]">قد يكون رقم الملف غير صحيح أو تم نقله</p>
        <Link
          href="/lawyer/cases"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl btn-legal-navy text-xs font-semibold"
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
      addToast({
        type: 'success',
        title: 'تم حفظ التحديثات',
        message: 'تم تحديث حالة القضية وبيانات الجلسة بنجاح',
      });
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200 pb-12">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <Link
          href="/lawyer/cases"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة لسجل ملفات القضايا</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--bg-surface-elevated)] hover:bg-[var(--bg-surface-hover)] text-[var(--text-primary)] text-xs font-semibold border border-[var(--border-subtle)] transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
            <span>طباعة ملف القضية (PDF)</span>
          </button>
        </div>
      </div>

      {/* Main Case Dossier Header */}
      <div className="p-6 sm:p-8 rounded-3xl legal-card space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <CaseStatusBadge status={status} size="md" />
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-[var(--bg-input)] text-[var(--text-secondary)] border border-[var(--border-subtle)]">
                رقم الملف: {caseData.id}
              </span>
              <span className="text-xs text-[var(--text-secondary)]">
                تاريخ التسجيل: {new Date(caseData.createdAt).toLocaleDateString('ar-EG')}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-primary)] leading-tight">
              {caseData.title}
            </h1>
          </div>

          <span className={`text-xs font-bold px-3 py-1.5 rounded-full shrink-0 ${
            caseData.urgency === 'urgent'
              ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
              : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
          }`}>
            {caseData.urgency === 'urgent' ? 'أولوية قصوى' : 'طلب عادي'}
          </span>
        </div>

        {/* Client Info Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>الموكل: <strong className="text-[var(--text-primary)]">{caseData.clientName}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>الهاتف: <strong className="text-[var(--text-primary)]">{caseData.clientPhone}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[var(--accent-gold)]" />
            <span>الموقع: <strong className="text-[var(--text-primary)]">{caseData.clientLocation}</strong></span>
          </div>
        </div>
      </div>

      {/* Lawyer Action & Status Update Box */}
      <div className="p-6 rounded-3xl bg-[var(--bg-input)] border border-[var(--accent-gold)]/30 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Gavel className="w-4 h-4 text-[var(--accent-gold)]" />
          <span>إدارة مرحلة التقاضي وبيانات الجلسة</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              تحديث مرحلة التقاضي / الحالة الإجرائية:
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as CaseStatus)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
            >
              <option value="new_intake">طلب جديد (وارد للمراجعة)</option>
              <option value="under_review">قيد الدراسة والتحليل</option>
              <option value="accepted">تم قبول القضية وإعداد صحيفة الدعوى</option>
              <option value="in_court">منظورة بالجلسات أمام المحكمة</option>
              <option value="resolved">تم كسب الحكم / إنهاء النزاع</option>
              <option value="closed">مغلقة ومؤرشفة</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
              تاريخ الجلسة القادمة ومقر الدائرة:
            </label>
            <input
              type="text"
              value={courtDate}
              onChange={(e) => setCourtDate(e.target.value)}
              placeholder="مثال: الأحد 14 سبتمبر 2024 - الدائرة 3 عمالي"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
            ملاحظات وتوجيهات المحامي (تظهر للموكل في حسابه لمتابعة الإجراءات):
          </label>
          <textarea
            rows={2}
            value={lawyerNotes}
            onChange={(e) => setLawyerNotes(e.target.value)}
            placeholder="اكتب التوجيهات أو المستندات الإضافية المطلوبة من الموكل..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
          />
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={handleSaveChanges}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-legal-gold text-xs font-bold cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'جاري الحفظ...' : 'حفظ التحديثات'}</span>
          </button>
        </div>
      </div>

      {/* Dossier Structured Sections */}
      <div className="space-y-6">
        
        {/* Section 1: Executive Summary */}
        <div className="p-6 rounded-3xl legal-card space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-gold)]">
            <FileText className="w-4 h-4" />
            <span>1. الملخص التنفيذي للوقائع القانونية</span>
          </div>
          <p className="text-xs text-[var(--text-primary)] leading-relaxed p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] font-medium">
            {caseData.executiveSummary}
          </p>
        </div>

        {/* Section 2: Formulated Legal Claims */}
        <div className="p-6 rounded-3xl legal-card space-y-3 shadow-lg">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-gold)]">
            <Scale className="w-4 h-4" />
            <span>2. بنود الطلبات القضائية والتعويضات</span>
          </div>
          <div className="space-y-2">
            {caseData.legalClaims.map((claim, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] flex items-start gap-2.5"
              >
                <span className="w-5 h-5 rounded-full bg-[var(--bg-surface-elevated)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/30 font-bold flex items-center justify-center shrink-0 text-[10px]">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{claim}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Uploaded Case Documents & Attachments (PDF / Word / Excel) */}
        <CaseDocumentManager
          caseId={caseData.id}
          initialDocuments={caseData.documents || [
            {
              id: 'doc-sample-1',
              caseId: caseData.id,
              fileName: 'صحيفة_الدعوى_وعريضة_الافتتاح.pdf',
              fileSize: 1420000,
              fileType: 'pdf',
              uploadedAt: 'اليوم، 10:30 ص',
              uploadedBy: 'المحامي المسند إليه',
            },
            {
              id: 'doc-sample-2',
              caseId: caseData.id,
              fileName: 'مذكرة_الدفاع_والدفوع_الشكلية.docx',
              fileSize: 580000,
              fileType: 'word',
              uploadedAt: 'اليوم، 11:15 ص',
              uploadedBy: 'المحامي المسند إليه',
            },
            {
              id: 'doc-sample-3',
              caseId: caseData.id,
              fileName: 'كشف_حساب_المستحقات_والتعويضات_المالية.xlsx',
              fileSize: 320000,
              fileType: 'excel',
              uploadedAt: 'اليوم، 11:45 ص',
              uploadedBy: 'المحامي المسند إليه',
            }
          ]}
        />

        {/* Section 3: Statutory Citations */}
        {caseData.relevantStatutes && caseData.relevantStatutes.length > 0 && (
          <div className="p-6 rounded-3xl legal-card space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-gold)]">
              <BookOpen className="w-4 h-4" />
              <span>3. الأسانيد والمواد القانونية وسوابق النقض المرتبطة</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {caseData.relevantStatutes.map((st) => (
                <div
                  key={st.id}
                  className="p-4 rounded-2xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs space-y-1.5"
                >
                  <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
                    <span>{st.title}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-surface-elevated)] text-[var(--accent-gold)] border border-[var(--accent-gold)]/20 font-mono">
                      {st.articleNumber || 'مادة تشريعية'}
                    </span>
                  </div>
                  <p className="text-[var(--text-secondary)] text-[11px] leading-relaxed">
                    {st.summary}
                  </p>
                  <p className="text-[10px] text-[var(--text-muted)] pt-1">
                    المرجع: {st.court || st.lawName}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Chronological Fact Timeline */}
        {caseData.clientTimeline && caseData.clientTimeline.length > 0 && (
          <div className="p-6 rounded-3xl legal-card space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-gold)]">
              <Clock className="w-4 h-4" />
              <span>4. التسلسل الزمني للوقائع وتواريخ النزاع</span>
            </div>
            <div className="space-y-2">
              {caseData.clientTimeline.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[var(--bg-input)] border border-[var(--border-subtle)] text-xs flex items-center justify-between gap-4"
                >
                  <span className="text-[var(--text-primary)] font-medium">{item.event}</span>
                  <span className="text-[11px] font-mono text-[var(--accent-gold)] shrink-0 bg-[var(--bg-surface-elevated)] px-2.5 py-0.5 rounded border border-[var(--accent-gold)]/20">
                    {item.date}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Legal Strategy Recommendation */}
        <div className="p-6 rounded-3xl bg-[var(--bg-input)] border border-[var(--accent-gold)]/30 shadow-lg space-y-2">
          <div className="flex items-center gap-2 text-sm font-bold text-[var(--accent-gold)]">
            <ShieldCheck className="w-4 h-4" />
            <span>5. خطة التقاضي والاستراتيجية القانونية المقترحة</span>
          </div>
          <p className="text-xs text-[var(--text-primary)] leading-relaxed font-medium">
            {caseData.aiStrategicRecommendation}
          </p>
        </div>

      </div>

    </div>
  );
}
