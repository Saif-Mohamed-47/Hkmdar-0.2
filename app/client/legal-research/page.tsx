'use client';

import React, { useState, useMemo } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { LegalArticleSearchItem, LegalCategory } from '@/lib/types';
import { LEGAL_CATEGORIES_INFO, MOCK_LEGAL_DATABASE } from '@/lib/data/legalData';
import { 
  Search, 
  BookOpen, 
  Scale, 
  Copy, 
  Check, 
  ChevronDown, 
  ChevronUp, 
  Tag,
  Building2,
  FileText
} from 'lucide-react';

export default function LegalResearchPage() {
  const { addToast } = useApp();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<LegalCategory | 'all'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const results = useMemo(() => {
    let filtered = MOCK_LEGAL_DATABASE;

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (query.trim()) {
      const q = query.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(q) ||
          item.code.toLowerCase().includes(q) ||
          item.articleNumber.toLowerCase().includes(q) ||
          item.text.toLowerCase().includes(q) ||
          item.keyTakeaway.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    return filtered;
  }, [query, selectedCategory]);

  const handleCopyCitation = (item: LegalArticleSearchItem) => {
    const citationText = `[السند القانوني: ${item.title} - ${item.courtName}]: ${item.keyTakeaway}`;
    navigator.clipboard.writeText(citationText);
    setCopiedId(item.id);
    addToast({
      type: 'success',
      title: 'تم نسخ السند القانوني',
      message: 'تم نسخ نص المادة والتخريج القضائي إلى الحافظة',
    });
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111c38] border border-[#c5a059]/30 text-[#dfba73] text-xs font-semibold">
          <BookOpen className="w-3.5 h-3.5" />
          <span>محرك البحث والتحليل التشريعي</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          البحث في التشريعات والقوانين وسوابق محكمة النقض
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          قاعدة بيانات تشمل مئات المواد القانونية واللوائح التنفيذية والمبادئ القضائية المستقرة، مع استخلاص الأثر القانوني المباشر لكل مادة.
        </p>
      </div>

      {/* Search & Filters Bar */}
      <div className="p-4 sm:p-6 rounded-3xl legal-card space-y-4 shadow-lg">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="ابحث برقم المادة أو الكلمات المفتاحية (مثال: فصل تعسفي، شيك بدون رصيد، المادة 147، خلع، عقد إيجار)..."
            className="w-full pr-11 pl-4 py-3.5 rounded-xl bg-[#080e1c] border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c5a059] transition-all"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-[#111c38] text-[#dfba73] border border-[#c5a059]/40 shadow-sm'
                : 'bg-[#080e1c] text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            جميع القوانين ({MOCK_LEGAL_DATABASE.length})
          </button>
          {(Object.keys(LEGAL_CATEGORIES_INFO) as LegalCategory[]).map((catKey) => {
            const info = LEGAL_CATEGORIES_INFO[catKey];
            const isSelected = selectedCategory === catKey;
            const count = MOCK_LEGAL_DATABASE.filter((i) => i.category === catKey).length;
            return (
              <button
                key={catKey}
                onClick={() => setSelectedCategory(catKey)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isSelected
                    ? 'bg-[#111c38] text-[#dfba73] border border-[#c5a059]/40 shadow-sm'
                    : 'bg-[#080e1c] text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {info.labelAr} {count > 0 && `(${count})`}
              </button>
            );
          })}
        </div>

      </div>

      {/* Results List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <span className="text-xs font-semibold text-slate-400">
            نتائج البحث: <strong className="text-white">{results.length}</strong> مادة وسند قانوني
          </span>
        </div>

        {results.length === 0 ? (
          <div className="p-12 rounded-3xl legal-card text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-[#111c38] border border-slate-800 mx-auto flex items-center justify-center text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-sm font-bold text-slate-200">لم يتم العثور على مواد مطابقة للبحث</p>
            <p className="text-xs text-slate-400">جرب البحث بكلمات عامة مثل (عمل، عقد، تعويض، شيك، إيجار)</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((item) => {
              const isExpanded = expandedId === item.id;
              const isCopied = copiedId === item.id;

              return (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 rounded-3xl legal-card space-y-4 shadow-lg"
                >
                  {/* Top Bar: Code Tag + Court */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-bold px-3 py-1 rounded-lg bg-[#111c38] border border-[#c5a059]/30 text-[#dfba73]">
                        {item.code}
                      </span>
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-[#080e1c] text-slate-300 border border-slate-800">
                        {item.articleNumber}
                      </span>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-slate-500" />
                        {item.courtName}
                      </span>
                    </div>

                    <button
                      onClick={() => handleCopyCitation(item)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#080e1c] hover:bg-[#111c38] text-xs font-medium text-slate-300 border border-slate-800 transition-colors cursor-pointer"
                      title="نسخ السند القانوني"
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">تم النسخ</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#dfba73]" />
                          <span>نسخ السند</span>
                        </>
                      )}
                    </button>
                  </div>

                  {/* Title & Key Takeaway */}
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white">{item.title}</h3>
                    
                    {/* Key Takeaway Box */}
                    <div className="p-3.5 rounded-2xl bg-[#080e1c] border border-slate-800 flex items-start gap-2.5">
                      <Scale className="w-4 h-4 text-[#dfba73] shrink-0 mt-0.5" />
                      <div>
                        <span className="text-[11px] font-bold text-[#dfba73] block mb-0.5">
                          المغزى القانوني المستخلص:
                        </span>
                        <p className="text-xs text-slate-200 leading-relaxed font-medium">
                          {item.keyTakeaway}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Full Text (Collapsible) */}
                  <div className="space-y-2">
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : item.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-[#dfba73] hover:underline transition-colors cursor-pointer"
                    >
                      <span>{isExpanded ? 'إخفاء النص التشريعي الكامل' : 'عرض النص التشريعي والحيثيات القضائية'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 rounded-2xl bg-[#060a14] border border-slate-800 text-xs text-slate-200 leading-loose whitespace-pre-line font-serif animate-in fade-in">
                        {item.text}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-800/60">
                    <Tag className="w-3.5 h-3.5 text-slate-500" />
                    {item.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        onClick={() => setQuery(tag)}
                        className="cursor-pointer text-[10px] bg-[#080e1c] hover:bg-[#111c38] text-slate-400 hover:text-slate-200 px-2 py-0.5 rounded-md border border-slate-800 transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

    </div>
  );
}
