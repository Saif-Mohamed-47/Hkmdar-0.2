'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { LegalCategory, LawyerMatchResult } from '@/lib/types';
import { 
  Sparkles, 
  X, 
  Search, 
  CheckCircle2, 
  MapPin, 
  Star, 
  Award, 
  ArrowLeft, 
  Send,
  SlidersHorizontal,
  DollarSign
} from 'lucide-react';
import { LEGAL_CATEGORIES_INFO } from '@/lib/data/legalData';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSelectLawyer?: (lawyerId: string) => void;
}

export default function LawyerMatchModal({ isOpen, onClose, onSelectLawyer }: Props) {
  const { setSelectedLawyerId, addToast } = useApp();

  const [category, setCategory] = useState<LegalCategory>('labor');
  const [location, setLocation] = useState('القاهرة');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('standard');
  const [isLoading, setIsLoading] = useState(false);
  const [matches, setMatches] = useState<LawyerMatchResult[] | null>(null);

  if (!isOpen) return null;

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          location,
          caseDescription: description,
          budget,
        }),
      });
      const data = await res.json();
      setMatches(data.matches || []);
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'حدث خطأ',
        message: 'تعذر تشغيل محرك الترشيح الذكي',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChoose = (lawyerId: string, lawyerName: string) => {
    setSelectedLawyerId(lawyerId);
    if (onSelectLawyer) {
      onSelectLawyer(lawyerId);
    }
    addToast({
      type: 'success',
      title: 'تم اختيار المحامي',
      message: `تم تحديد ${lawyerName} لمتابعة استشارتك وقضيتك`,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-500 p-0.5 shadow-lg shadow-indigo-900/30">
              <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
              </div>
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                الترشيح الذكي للمحامين (AI Lawyer Matcher)
                <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-500/30">
                  خوارزمية الملاءمة
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                يقوم الذكاء الاصطناعي بمطابقة تفاصيل قضيتك مع سجل خبرات ونسب نجاح نخبة المحامين
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!matches ? (
            /* Input Form */
            <form onSubmit={handleMatch} className="space-y-5 max-w-2xl mx-auto">
              
              {/* Category Select */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  نوع القضية / التخصص القانوني المطلوب:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {(Object.keys(LEGAL_CATEGORIES_INFO) as LegalCategory[]).map((catKey) => {
                    const info = LEGAL_CATEGORIES_INFO[catKey];
                    const isSelected = category === catKey;
                    return (
                      <button
                        type="button"
                        key={catKey}
                        onClick={() => setCategory(catKey)}
                        className={`p-3 rounded-xl border text-right transition-all flex flex-col justify-between h-20 ${
                          isSelected
                            ? 'bg-emerald-950/50 border-emerald-500 text-emerald-200 ring-1 ring-emerald-500/50'
                            : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                        }`}
                      >
                        <span className="text-xs font-bold leading-tight">{info.labelAr}</span>
                        <span className="text-[10px] text-slate-400">{info.labelEn}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Location and Budget */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    الموقع الجغرافي / المحافظة:
                  </label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="القاهرة">القاهرة الكبرى (مصر الجديدة، المعادي، التجمع)</option>
                    <option value="الجيزة">الجيزة (الدقي، المهندسين، الشيخ زايد، أكتوبر)</option>
                    <option value="الإسكندرية">الإسكندرية (سموحة، المنشية، سيدي جابر)</option>
                    <option value="المنصورة">المنصورة والدقهلية</option>
                    <option value="أسيوط">أسيوط ومحافظات الصعيد</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    مستوى الأتعاب والميزانية:
                  </label>
                  <select
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="flexible">مرن / أفضل كفاءة وخبرة بغض النظر عن الأتعاب</option>
                    <option value="standard">متوسط / أتعاب قياسية (500 - 800 ج.م)</option>
                    <option value="budget">اقتصادي / مناسب للميزانية المحدودة</option>
                  </select>
                </div>
              </div>

              {/* Brief Case Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  نبذة مختصرة عن موضوع النزاع أو الاستشارة (اختياري):
                </label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="مثال: تم فصلي من العمل بدون إنذار بعد 5 سنوات خدمة، وأرغب في محامٍ متمرس في القضايا العمالية بالقاهرة..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500 leading-relaxed placeholder:text-slate-500"
                />
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-emerald-600 hover:from-indigo-500 hover:to-emerald-500 text-white font-bold text-sm shadow-xl shadow-indigo-950/50 transition-all hover:scale-[1.02] disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>جاري تحليل البيانات ومطابقة المحامين...</span>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>بدء الترشيح الذكي والمطابقة</span>
                    </>
                  )}
                </button>
              </div>

            </form>
          ) : (
            /* Results View */
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white">
                    أفضل {matches.length} ترشيحات موصى بها من الذكاء الاصطناعي
                  </h4>
                  <p className="text-xs text-slate-400">
                    تم الترتيب حسب نسبة الملاءمة لموضوع قضيتك وسجل النجاح القضائي
                  </p>
                </div>
                <button
                  onClick={() => setMatches(null)}
                  className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>تعديل معايير البحث</span>
                </button>
              </div>

              <div className="space-y-4">
                {matches.map((item, idx) => {
                  const lawyer = item.lawyer;
                  return (
                    <div
                      key={lawyer.id}
                      className="p-5 rounded-2xl bg-slate-800/60 border border-slate-700/70 hover:border-emerald-500/50 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden"
                    >
                      {/* Top Rank Badge */}
                      {idx === 0 && (
                        <div className="absolute top-0 right-0 bg-gradient-to-l from-amber-500 to-amber-600 text-slate-950 text-[10px] font-extrabold px-4 py-1 rounded-bl-xl shadow-md">
                          🏆 الترشيح الأول (أعلى ملاءمة)
                        </div>
                      )}

                      {/* Lawyer Info */}
                      <div className="flex items-start gap-4 flex-1">
                        <img
                          src={lawyer.avatar}
                          alt={lawyer.name}
                          className="w-16 h-16 rounded-2xl object-cover ring-2 ring-emerald-500/40 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-white">{lawyer.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                              {lawyer.barNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-300 font-medium mt-0.5">{lawyer.title}</p>
                          <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
                            <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{lawyer.location}</span>
                          </p>

                          {/* Match Reasons Pills */}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {item.matchReasons.map((reason, rIdx) => (
                              <span
                                key={rIdx}
                                className="text-[11px] bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 px-2 py-0.5 rounded-lg flex items-center gap-1"
                              >
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                                {reason}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Score & Action */}
                      <div className="flex md:flex-col items-center md:items-end justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-700 shrink-0 gap-3">
                        <div className="text-right">
                          <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-extrabold text-emerald-400">
                              {item.matchScore}%
                            </span>
                            <span className="text-[10px] text-slate-400">نسبة التطابق</span>
                          </div>
                          <p className="text-[11px] text-slate-300 font-medium">
                            {item.estimatedCostRange}
                          </p>
                        </div>

                        <button
                          onClick={() => handleChoose(lawyer.id, lawyer.name)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/50 transition-all hover:scale-105"
                        >
                          <span>اختيار هذا المحامي</span>
                          <ArrowLeft className="w-3.5 h-3.5" />
                        </button>
                      </div>

                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
