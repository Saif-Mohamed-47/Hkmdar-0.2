'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Scale, ChevronDown, Check, X } from 'lucide-react';
import { LegalCategory } from '@/lib/types';
import { LEGAL_CATEGORIES_INFO } from '@/lib/data/legalData';

// Helper function to normalize Arabic text (Alef with hamzas, Taa marbouta, Yaa vs Alef maqsoura, etc.)
function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    // Unify all Alef forms (أ, إ, آ, ٱ -> ا)
    .replace(/[أإآٱ]/g, 'ا')
    // Unify Taa Marbouta and Haa (ة -> ه)
    .replace(/ة/g, 'ه')
    // Unify Yaa and Alef Maqsoura (ى -> ي)
    .replace(/ى/g, 'ي')
    // Remove Tashkeel / Harakat
    .replace(/[\u064B-\u065F\u0670]/g, '')
    // Remove Tatweel (ـ)
    .replace(/ـ/g, '');
}

interface SearchableSpecialtySelectProps {
  value: LegalCategory | 'all';
  onChange: (specialty: LegalCategory | 'all') => void;
  allowAll?: boolean;
  allLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export default function SearchableSpecialtySelect({
  value,
  onChange,
  allowAll = false,
  allLabel = 'جميع التخصصات القانونية (20 تخصصاً)',
  placeholder = 'اختر أو اكتب التخصص القانوني...',
  disabled = false,
  className = '',
}: SearchableSpecialtySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const allCategories = Object.keys(LEGAL_CATEGORIES_INFO) as LegalCategory[];
  const normalizedSearch = normalizeArabicText(searchTerm);

  const filteredCategories = allCategories.filter((catKey) => {
    if (!normalizedSearch) return true;
    const cat = LEGAL_CATEGORIES_INFO[catKey];
    const normalizedAr = normalizeArabicText(cat.labelAr);
    const normalizedEn = (cat.labelEn || '').toLowerCase();
    return normalizedAr.includes(normalizedSearch) || normalizedEn.includes(normalizedSearch);
  });

  const selectedLabel =
    value === 'all'
      ? allLabel
      : LEGAL_CATEGORIES_INFO[value as LegalCategory]?.labelAr || placeholder;

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
        className={`w-full py-2.5 px-3.5 rounded-xl bg-[#080e1c] border border-slate-800 text-xs text-white flex items-center justify-between cursor-pointer hover:border-[#c5a059]/60 transition-colors ${
          isOpen ? 'border-[#c5a059] ring-1 ring-[#c5a059]/20' : ''
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex items-center gap-2 truncate">
          <Scale className="w-4 h-4 text-[#dfba73] shrink-0" />
          <span className={`truncate ${!value && !allowAll ? 'text-slate-500' : 'text-slate-100 font-medium'}`}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#dfba73]' : ''}`} />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl bg-[#0b1224] border border-[#c5a059]/30 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          
          {/* Quick Search Input with Arabic normalization */}
          <div className="p-2 border-b border-slate-800/80 bg-[#060a14]/90 sticky top-0">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="اكتب التخصص مثل (جنائي، ضرائب، عمال، اسره، بحري)..."
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
          </div>

          {/* List Options */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
            {allowAll && (
              <div
                onClick={() => {
                  onChange('all');
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                  value === 'all'
                    ? 'bg-[#111c38] text-[#dfba73] font-bold border border-[#c5a059]/30'
                    : 'text-slate-300 hover:bg-[#111c38]/60 hover:text-white'
                }`}
              >
                <span>{allLabel}</span>
                {value === 'all' && <Check className="w-3.5 h-3.5 text-[#dfba73]" />}
              </div>
            )}

            {filteredCategories.length > 0 ? (
              filteredCategories.map((catKey) => {
                const cat = LEGAL_CATEGORIES_INFO[catKey];
                const isSelected = value === catKey;
                return (
                  <div
                    key={catKey}
                    onClick={() => {
                      onChange(catKey);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#111c38] text-[#dfba73] font-bold border border-[#c5a059]/30'
                        : 'text-slate-300 hover:bg-[#111c38]/60 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                      <span>{cat.labelAr}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#dfba73]" />}
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
