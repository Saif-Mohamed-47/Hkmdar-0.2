'use client';

import React, { useState, useRef } from 'react';
import { 
  X, 
  FileUp, 
  FileText, 
  Scale, 
  Plus, 
  Loader2, 
  AlertCircle,
  FileSpreadsheet,
  Check
} from 'lucide-react';
import { useApp } from '@/lib/context/AppContext';
import { LegalCategory, CaseUrgency, CaseIntake, CaseDocument } from '@/lib/types';
import SearchableSpecialtySelect from '@/components/ui/SearchableSpecialtySelect';
import SearchableLocationSelect from '@/components/ui/SearchableLocationSelect';

interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateCaseModal({ isOpen, onClose }: CreateCaseModalProps) {
  const { addCaseIntake, addToast, user } = useApp();

  const [title, setTitle] = useState('دعوى تعويض عن فسخ عقد توريد تجاري وإخلال بالتسليم');
  const [clientName, setClientName] = useState('شركة الأهرام للتجارة والتوزيع ش.م.م');
  const [clientPhone, setClientPhone] = useState('01012345678');
  const [clientLocation, setClientLocation] = useState('القاهرة');
  const [category, setCategory] = useState<LegalCategory>('commercial');
  const [urgency, setUrgency] = useState<CaseUrgency>('high');
  const [executiveSummary, setExecutiveSummary] = useState(
    'إخلال المدعى عليها ببنود عقد التوريد رقم 442 المؤرخ في يناير 2024 وعدم توريد الشحنات المتفق عليها بالرغم من استلام الدفعة المقدمة البالغة 450,000 جنيه، مما ترتب عليه أضرار تجارية جسيمة للموكل.'
  );
  const [uploadedFiles, setUploadedFiles] = useState<CaseDocument[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    const allowed = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'csv'];

    if (!allowed.includes(ext)) {
      addToast({
        type: 'error',
        title: 'صيغة غير مدعومة',
        message: 'يرجى رفع ملفات PDF أو Word أو Excel فقط.',
      });
      return;
    }

    let fileType: 'pdf' | 'word' | 'excel' | 'other' = 'other';
    if (ext === 'pdf') fileType = 'pdf';
    else if (['doc', 'docx'].includes(ext)) fileType = 'word';
    else if (['xls', 'xlsx', 'csv'].includes(ext)) fileType = 'excel';

    const newDoc: CaseDocument = {
      id: `doc-${Date.now()}`,
      caseId: 'temp',
      fileName: file.name,
      fileSize: file.size,
      fileType,
      uploadedAt: 'الآن',
      uploadedBy: user.name || 'المحامي',
      fileUrl: URL.createObjectURL(file),
    };

    setUploadedFiles((prev) => [newDoc, ...prev]);
    addToast({
      type: 'success',
      title: 'تم إرفاق المستند',
      message: `تم إرفاق "${file.name}" بالقضية.`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) {
      addToast({
        type: 'error',
        title: 'بيانات ناقصة',
        message: 'يرجى إدخال عنوان القضية واسم الموكل.',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await addCaseIntake({
        clientId: `client-${Date.now()}`,
        clientName: clientName.trim(),
        clientEmail: '',
        clientPhone: clientPhone.trim(),
        clientLocation,
        title: title.trim(),
        category,
        urgency,
        status: 'new_intake',
        executiveSummary: executiveSummary.trim() || 'تم تسجيل القضية والمستندات بنجاح من خلال المحامي.',
        legalClaims: ['المطالبة بالحقوق القانونية واستيفاء الإجراءات الرسمية'],
        relevantStatutes: [],
        clientTimeline: [
          {
            date: new Date().toLocaleDateString('ar-EG'),
            event: 'تسجيل الدعوى وحفظ المستندات المرفقة بنظام حكمدار',
            importance: 'normal',
          }
        ],
        aiStrategicRecommendation: 'مراجعة أوراق الحافظة وتجهيز عريضة الدعوى لتحديد موعد أول جلسة.',
        documents: uploadedFiles,
      });

      addToast({
        type: 'success',
        title: 'تم إنشاء ملف القضية بنجاح',
        message: `تم حفظ القضية "${title}" وربط كافة مستنداتها.`,
      });
      onClose();
    } catch (err: any) {
      addToast({
        type: 'error',
        title: 'خطأ',
        message: err.message || 'حدث خطأ أثناء إنشاء ملف القضية.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="w-full max-w-2xl bg-[#0b1224] border border-[#c5a059]/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-[#080e1c] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#111c38] border border-[#c5a059]/40 flex items-center justify-center">
              <Scale className="w-4 h-4 text-[#dfba73]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">تسجيل ملف قضية جديد مع المستندات</h2>
              <p className="text-[11px] text-slate-400">رفع عريضة الدعوى أو كشوف الحسابات والمذكرات (PDF / Word / Excel)</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1 custom-scrollbar text-right">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Case Title */}
            <div className="space-y-1 sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300">
                عنوان القضية أو موضوع النزاع <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: دعوى طرد للغصب / جنحة شيك / نزاع عمالي تعويض"
                className="w-full py-2.5 px-3 rounded-xl bg-[#080e1c] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            {/* Client Name */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                اسم الموكل / الخصم <span className="text-amber-500">*</span>
              </label>
              <input
                type="text"
                required
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="الاسم الثلاثي أو الرباعي"
                className="w-full py-2.5 px-3 rounded-xl bg-[#080e1c] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c5a059]"
              />
            </div>

            {/* Client Phone */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                رقم الهاتف (اختياري)
              </label>
              <input
                type="tel"
                dir="ltr"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                placeholder="+20 100 000 0000"
                className="w-full py-2.5 px-3 rounded-xl bg-[#080e1c] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c5a059] text-right"
              />
            </div>

            {/* Specialty */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                التخصص القضائي
              </label>
              <SearchableSpecialtySelect
                value={category}
                onChange={(c) => setCategory(c as LegalCategory)}
                allowAll={false}
              />
            </div>

            {/* Location */}
            <div className="space-y-1">
              <label className="block text-xs font-semibold text-slate-300">
                المحافظة / المحكمة المختصة
              </label>
              <SearchableLocationSelect
                value={clientLocation}
                onChange={setClientLocation}
                allowAll={false}
              />
            </div>
          </div>

          {/* Urgency */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">درجة الاستعجال</label>
            <div className="grid grid-cols-3 gap-2">
              {(['medium', 'high', 'urgent'] as CaseUrgency[]).map((urg) => (
                <button
                  key={urg}
                  type="button"
                  onClick={() => setUrgency(urg)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors ${
                    urgency === urg
                      ? urg === 'urgent'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-400'
                        : 'bg-[#111c38] border-[#c5a059] text-[#dfba73]'
                      : 'bg-[#080e1c] border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {urg === 'urgent' ? '🔴 أولوية قصوى' : urg === 'high' ? '🟡 عاجل' : '🟢 عادي'}
                </button>
              ))}
            </div>
          </div>

          {/* Executive Summary */}
          <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-300">
              ملخص الوقائع وطلبات الموكل
            </label>
            <textarea
              rows={3}
              value={executiveSummary}
              onChange={(e) => setExecutiveSummary(e.target.value)}
              placeholder="اكتب شرحاً موجزاً لوقائع الدعوى..."
              className="w-full py-2 px-3 rounded-xl bg-[#080e1c] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c5a059] resize-none"
            />
          </div>

          {/* Document Upload Box */}
          <div className="space-y-2 pt-2 border-t border-slate-800">
            <label className="block text-xs font-bold text-[#dfba73]">
              مرفقات القضية (PDF / Word / Excel)
            </label>
            
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.csv"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />

            <div
              onClick={() => fileInputRef.current?.click()}
              className="p-4 border border-dashed border-slate-700 hover:border-[#c5a059] rounded-2xl bg-[#080e1c] text-center cursor-pointer transition-colors"
            >
              <FileUp className="w-5 h-5 text-[#dfba73] mx-auto mb-1" />
              <p className="text-xs font-semibold text-slate-200">اضغط هنا لرفع ملف من جهازك (PDF / Word / Excel)</p>
              <p className="text-[10px] text-slate-500">الحد الأقصى 15 ميجابايت للملف</p>
            </div>

            {/* Quick Sample Attach Button */}
            <div className="flex items-center justify-between px-1">
              <span className="text-[11px] text-slate-400">أو جرب مستند تجريبي بضغطة واحدة:</span>
              <button
                type="button"
                onClick={() => {
                  const sampleDoc: CaseDocument = {
                    id: `doc-sample-${Date.now()}`,
                    caseId: 'temp',
                    fileName: 'عريضة_دعوى_تعويض_عقد_توريد.pdf',
                    fileSize: 1048576,
                    fileType: 'pdf',
                    uploadedAt: 'الآن',
                    uploadedBy: user.name || 'المحامي',
                    fileUrl: '/sample_case_lawsuit.pdf',
                  };
                  setUploadedFiles((prev) => [sampleDoc, ...prev]);
                  addToast({
                    type: 'success',
                    title: 'تم إرفاق ملف عريضة الدعوى (PDF)',
                    message: 'تم إدراج المستند التجريبي بنجاح.',
                  });
                }}
                className="text-[11px] font-bold text-[#dfba73] hover:underline cursor-pointer flex items-center gap-1 bg-[#111c38] px-2.5 py-1 rounded-lg border border-[#c5a059]/30 hover:border-[#c5a059]"
              >
                <FileText className="w-3.5 h-3.5 text-rose-400" />
                <span>+ إرفاق ملف PDF تجريبي فوراً</span>
              </button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="space-y-1.5 pt-2">
                {uploadedFiles.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-2 rounded-xl bg-[#111c38] border border-slate-700 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      {doc.fileType === 'pdf' ? (
                        <FileText className="w-4 h-4 text-rose-400" />
                      ) : doc.fileType === 'excel' ? (
                        <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <FileText className="w-4 h-4 text-blue-400" />
                      )}
                      <span className="truncate text-slate-200">{doc.fileName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setUploadedFiles((prev) => prev.filter((d) => d.id !== doc.id))}
                      className="text-rose-400 hover:text-rose-300 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Submit */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition-colors cursor-pointer"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl btn-legal-gold text-xs font-bold transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              <span>حفظ وإنشاء ملف القضية</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
}
