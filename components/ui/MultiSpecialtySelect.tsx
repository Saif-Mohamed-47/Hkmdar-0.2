'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Scale, ChevronDown, Check, X } from 'lucide-react';
import { LegalCategory } from '@/lib/types';
import { LEGAL_CATEGORIES_INFO } from '@/lib/data/legalData';

// Helper function to normalize Arabic text
function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[أإآٱ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F\u0670]/g, '')
    .replace(/ـ/g, '');
}

interface MultiSpecialtySelectProps {
  selectedSpecialties: LegalCategory[];
  onChange: (specialties: LegalCategory[]) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function MultiSpecialtySelect({
  selectedSpecialties = [],
  onChange,
  placeholder = 'اختر التخصصات القانونية...',
  disabled = false,
  className = '',
}: MultiSpecialtySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const allCategories = Object.keys(LEGAL_CATEGORIES_INFO) as LegalCategory[];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizedSearch = normalizeArabicText(searchTerm);

  const filteredCategories = allCategories.filter((catKey) => {
    if (!normalizedSearch) return true;
    const cat = LEGAL_CATEGORIES_INFO[catKey];
    const normalizedAr = normalizeArabicText(cat.labelAr);
    const normalizedEn = (cat.labelEn || '').toLowerCase();
    return normalizedAr.includes(normalizedSearch) || normalizedEn.includes(normalizedSearch);
  });

  const toggleSpecialty = (catKey: LegalCategory) => {
    if (selectedSpecialties.includes(catKey)) {
      onChange(selectedSpecialties.filter((item) => item !== catKey));
    } else {
      onChange([...selectedSpecialties, catKey]);
    }
  };

  const selectAll = () => {
    onChange([...allCategories]);
  };

  const clearAll = () => {
    onChange([]);
  };

  return (
    <div ref={containerRef} className={`relative w-full text-right ${className}`}>
      {/* Trigger Button */}
      <div
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearchTerm('');
          }
        }}
        className={`w-full min-h-[42px] py-1.5 px-3 rounded-xl bg-[#080e1c] border border-slate-800 text-xs text-white flex items-center justify-between cursor-pointer hover:border-[#c5a059]/60 transition-colors ${
          isOpen ? 'border-[#c5a059] ring-1 ring-[#c5a059]/20' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-1.5 flex-wrap flex-1 min-w-0 pr-1">
          <Scale className="w-3.5 h-3.5 text-[#dfba73] shrink-0" />
          {selectedSpecialties.length === 0 ? (
            <span className="text-slate-400 font-normal">{placeholder}</span>
          ) : selectedSpecialties.length === allCategories.length ? (
            <span className="px-2 py-0.5 rounded-md bg-[#111c38] text-[#dfba73] border border-[#c5a059]/30 font-semibold">
              جميع التخصصات (20)
            </span>
          ) : (
            selectedSpecialties.map((catKey) => {
              const cat = LEGAL_CATEGORIES_INFO[catKey];
              return (
                <span
                  key={catKey}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleSpecialty(catKey);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#111c38] text-[#dfba73] border border-[#c5a059]/30 text-[11px] font-semibold hover:bg-rose-500/20 hover:text-rose-300 hover:border-rose-500/40 transition-colors"
                >
                  <span>{cat?.labelAr?.split(' ')[0] || catKey}</span>
                  <X className="w-2.5 h-2.5" />
                </span>
              );
            })
          )}
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 mr-1.5 transition-transform ${isOpen ? 'rotate-180 text-[#dfba73]' : ''}`} />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl bg-[#0b1224] border border-[#c5a059]/30 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          
          {/* Quick Search Input */}
          <div className="p-2 border-b border-slate-800/80 bg-[#060a14]/90 sticky top-0 space-y-2">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="ابحث بالتخصص (جنائي، عمال، شركات)..."
                className="w-full py-1.5 pr-3 pl-8 rounded-lg bg-[#111c38] border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c5a059]"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Bulk Actions */}
            <div className="flex items-center justify-between text-[11px] px-1 text-slate-400">
              <button
                type="button"
                onClick={selectAll}
                className="text-[#dfba73] hover:underline cursor-pointer font-semibold"
              >
                تحديد الكل ({allCategories.length})
              </button>
              {selectedSpecialties.length > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-rose-400 hover:underline cursor-pointer"
                >
                  إلغاء التحديد ({selectedSpecialties.length})
                </button>
              )}
            </div>
          </div>

          {/* List Options with Checkboxes */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {filteredCategories.length > 0 ? (
              filteredCategories.map((catKey) => {
                const cat = LEGAL_CATEGORIES_INFO[catKey];
                const isSelected = selectedSpecialties.includes(catKey);
                return (
                  <div
                    key={catKey}
                    onClick={() => toggleSpecialty(catKey)}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#111c38] text-[#dfba73] font-bold border border-[#c5a059]/30'
                        : 'text-slate-300 hover:bg-[#111c38]/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#c5a059] border-[#c5a059] text-[#060a14]'
                          : 'border-slate-700 bg-[#060a14]'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span>{cat.labelAr}</span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                لا يوجد تخصص مطابق لـ "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
