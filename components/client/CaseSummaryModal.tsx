'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { CaseIntake, LegalCitation, LegalCategory } from '@/lib/types';
import { 
  X, 
  Send, 
  Scale, 
  FileText, 
  CheckCircle2,
  User,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialSummary?: Partial<CaseIntake>;
  onSuccessRedirect?: () => void;
}

export default function CaseSummaryModal({
  isOpen,
  onClose,
  initialSummary,
  onSuccessRedirect,
}: Props) {
  const { lawyers, addCaseIntake, user, addToast } = useApp();

  const [title, setTitle] = useState(
    initialSummary?.title || 'طلب دعوى عمالية وتعويض عن إنهاء الخدمة التعسفي'
  );
  const [category, setCategory] = useState<LegalCategory>(
    initialSummary?.category || 'labor'
  );
  const [urgency, setUrgency] = useState<CaseIntake['urgency']>(
    initialSummary?.urgency || 'high'
  );
  const [selectedLawyerId, setSelectedLawyerId] = useState(
    initialSummary?.lawyerId || lawyers[0]?.id || 'lawyer-1'
  );
  const [executiveSummary, setExecutiveSummary] = useState(
    initialSummary?.executiveSummary ||
      'قام صاحب العمل بإنهاء علاقة العمل دون مسوغ مشروع أو تحقيق كتابي، مع المطالبة بكافة المستحقات القانونية والتعويضات المنصوص عليها في قانون العمل.'
  );
  const [legalClaimsText, setLegalClaimsText] = useState(
    (initialSummary?.legalClaims || [
      'المطالبة بالتعويض عن الفصل التعسفي عملاً بالمادة 122 من قانون العمل 12 لسنة 2003.',
      'مقابل مهلة الإخطار ومستحقات رصيد الإجازات السنوية.',
      'تسليم شهادة الخبرة وإخلاء الطرف ورد أصل المؤهل والمستندات.',
    ]).join('\n')
  );

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const targetLawyer = lawyers.find((l) => l.id === selectedLawyerId) || lawyers[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const claims = legalClaimsText
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    const relevantStatutes: LegalCitation[] = initialSummary?.relevantStatutes || [
      {
        id: 'cit-auto-1',
        title: 'المادة 69 من قانون العمل 12 لسنة 2003',
        lawName: 'قانون العمل المصري',
        court: 'التشريع الساري',
        articleNumber: 'م 69',
        summary: 'حظر إنهاء العقد إلا لخطأ جسيم مثبت بنصوص حصرية.',
        category: category,
        relevanceScore: 98,
      },
    ];

    addCaseIntake({
      clientId: user.id,
      clientName: user.name,
      clientEmail: user.email,
      clientPhone: user.phone || '+20 102 334 9988',
      clientLocation: user.location || 'القاهرة',
      lawyerId: targetLawyer.id,
      lawyerName: targetLawyer.name,
      title,
      category,
      urgency,
      status: 'new_intake',
      executiveSummary,
      legalClaims: claims,
      relevantStatutes,
      clientTimeline: initialSummary?.clientTimeline || [
        { date: 'منذ شهرين', event: 'بداية النزاع والإخلال بالحقوق' },
        { date: 'اليوم', event: 'تحليل الواقعة قانونياً وإرسال ملف القضية' },
      ],
      aiStrategicRecommendation:
        initialSummary?.aiStrategicRecommendation ||
        'إقامة الدعوى أمام المحكمة الابتدائية مع توجيه إنذار رسمي بالإعذار على يد محضر لقطع مدة التقادم.',
      feeEstimate: targetLawyer.consultationFee
        ? `أتعاب الاستشارة المبدئية: ${targetLawyer.consultationFee} ج.م`
        : undefined,
    });

    try {
      confetti({
        particleCount: 60,
        spread: 60,
        origin: { y: 0.6 },
      });
    } catch (err) {
      // safe
    }

    setTimeout(() => {
      setIsSubmitting(false);
      addToast({
        type: 'success',
        title: 'تم إرسال ملف القضية بنجاح',
        message: `تم إحالة الملف إلى مكتب ${targetLawyer.name} لبدء دراسته وتجهيز صحيفة الدعوى`,
      });
      onClose();
      if (onSuccessRedirect) {
        onSuccessRedirect();
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#0b1224] border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080f20]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#111c38] border border-[#c5a059]/30 flex items-center justify-center text-[#dfba73]">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                ملف القضية المُعد للمحامي
                <span className="text-[10px] bg-[#111c38] text-[#dfba73] px-2 py-0.5 rounded-full border border-[#c5a059]/20">
                  Case Brief
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                مراجعة البيانات المستخلصة من استشارتك قبل إرسالها لمكتب الدفاع
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Target Lawyer Selection */}
          <div className="p-4 rounded-2xl bg-[#080e1c] border border-slate-800 space-y-2">
            <label className="block text-xs font-semibold text-slate-300">
              اختر المحامي المستلم لملف القضية:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {lawyers.slice(0, 4).map((lawyer) => {
                const isSelected = lawyer.id === selectedLawyerId;
                return (
                  <div
                    key={lawyer.id}
                    onClick={() => setSelectedLawyerId(lawyer.id)}
                    className={`cursor-pointer flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      isSelected
                        ? 'bg-[#111c38] border-[#c5a059]/60 shadow-md'
                        : 'bg-[#0b1224] border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={lawyer.avatar}
                      alt={lawyer.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-700"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-white truncate">{lawyer.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{lawyer.location}</p>
                      <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#dfba73]">
                        <span>⭐ {lawyer.rating}</span>
                        <span>• نسبة نجاح {lawyer.winRate}%</span>
                      </div>
                    </div>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-[#dfba73] shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Case Title & Urgency */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                عنوان القضية / موضوع الدعوى:
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1c] border border-slate-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                درجة الأهمية / الاستعجال:
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as CaseIntake['urgency'])}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1c] border border-slate-800 text-sm text-white focus:outline-none focus:border-[#c5a059]"
              >
                <option value="urgent">أولوية قصوى (خلال 24 ساعة)</option>
                <option value="high">عاجل (خلال يومين)</option>
                <option value="medium">عادي / استشارة قياسية</option>
                <option value="low">منخفض</option>
              </select>
            </div>
          </div>

          {/* Executive Summary */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span>الملخص التنفيذي لوقائع الدعوى:</span>
              <span className="text-[11px] text-[#dfba73]">قابل للتعديل</span>
            </label>
            <textarea
              rows={3}
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1c] border border-slate-800 text-sm text-white focus:outline-none focus:border-[#c5a059] leading-relaxed"
            />
          </div>

          {/* Legal Claims */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              المطالبات القضائية والتعويضات المقترحة (سطر لكل مطلب):
            </label>
            <textarea
              rows={3}
              value={legalClaimsText}
              onChange={(e) => setLegalClaimsText(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#080e1c] border border-slate-800 text-sm text-white focus:outline-none focus:border-[#c5a059] font-mono text-xs leading-relaxed"
            />
          </div>

          {/* Client Info Banner */}
          <div className="p-3.5 rounded-xl bg-[#080e1c] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#dfba73]" />
              <span>مقدم الطلب: <strong>{user.name}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <span>الهاتف: <strong>{user.phone || '+20 102 334 9988'}</strong></span>
            </div>
            <div className="flex items-center gap-1.5 text-[#dfba73]">
              <ShieldCheck className="w-4 h-4" />
              <span>بيانات مشفرة وسرية تامة</span>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-[#080e1c] hover:bg-slate-800 text-slate-300 text-sm font-medium transition-colors cursor-pointer border border-slate-800"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl btn-legal-gold text-sm font-bold disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري إرسال الملف...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>إرسال ملف القضية للمحامي</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
