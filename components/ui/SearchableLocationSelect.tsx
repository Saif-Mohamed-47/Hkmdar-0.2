'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MapPin, ChevronDown, Check, X } from 'lucide-react';
import { EGYPTIAN_GOVERNORATES } from '@/lib/data/legalData';

interface SearchableLocationSelectProps {
  value: string;
  onChange: (location: string) => void;
  allowAll?: boolean;
  allLabel?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

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

export default function SearchableLocationSelect({
  value,
  onChange,
  allowAll = false,
  allLabel = 'جميع المحافظات والمناطق (27 محافظة)',
  placeholder = 'اختر أو اكتب اسم المحافظة...',
  disabled = false,
  className = '',
}: SearchableLocationSelectProps) {
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

  const normalizedSearch = normalizeArabicText(searchTerm);

  const filteredGovernorates = EGYPTIAN_GOVERNORATES.filter((gov) => {
    if (!normalizedSearch) return true;
    const normalizedGov = normalizeArabicText(gov);
    return normalizedGov.includes(normalizedSearch);
  });

  const selectedLabel =
    value === 'all'
      ? allLabel
      : EGYPTIAN_GOVERNORATES.find((g) => g === value || value.includes(g)) || value || placeholder;

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
          <MapPin className="w-4 h-4 text-[#dfba73] shrink-0" />
          <span className={`truncate ${!value && !allowAll ? 'text-slate-500' : 'text-slate-100 font-medium'}`}>
            {selectedLabel}
          </span>
        </div>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${isOpen ? 'rotate-180 text-[#dfba73]' : ''}`} />
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 mt-1.5 w-full rounded-2xl bg-[#0b1224] border border-[#c5a059]/30 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
          
          {/* Quick Search Input */}
          <div className="p-2 border-b border-slate-800/80 bg-[#060a14]/90 sticky top-0">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="اكتب أول حرفين مثل (قاهـ، إسكـ، منصـ)..."
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

            {filteredGovernorates.length > 0 ? (
              filteredGovernorates.map((gov) => {
                const isSelected = value === gov;
                return (
                  <div
                    key={gov}
                    onClick={() => {
                      onChange(gov);
                      setIsOpen(false);
                    }}
                    className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#111c38] text-[#dfba73] font-bold border border-[#c5a059]/30'
                        : 'text-slate-300 hover:bg-[#111c38]/60 hover:text-white'
                    }`}
                  >
                    <span>{gov}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#dfba73]" />}
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs text-slate-400">
                لا توجد محافظة مطابقة لـ "{searchTerm}"
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
