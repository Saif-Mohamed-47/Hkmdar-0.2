'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { LegalCategory, LawyerProfile } from '@/lib/types';
import { LEGAL_CATEGORIES_INFO } from '@/lib/data/legalData';
import { 
  Users, 
  Search, 
  Filter, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Sparkles, 
  CheckCircle2, 
  Phone, 
  Mail, 
  Send,
  SlidersHorizontal,
  Briefcase
} from 'lucide-react';
import LawyerMatchModal from '@/components/client/LawyerMatchModal';
import CaseSummaryModal from '@/components/client/CaseSummaryModal';
import { useRouter } from 'next/navigation';

export default function LawyersDirectoryPage() {
  const { lawyers, setSelectedLawyerId } = useApp();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<LegalCategory | 'all'>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');
  
  // Modals
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [caseModalOpen, setCaseModalOpen] = useState(false);
  const [selectedLawyerForCase, setSelectedLawyerForCase] = useState<LawyerProfile | null>(null);

  const filteredLawyers = lawyers.filter((lawyer) => {
    const matchesQuery =
      !query.trim() ||
      lawyer.name.toLowerCase().includes(query.toLowerCase().trim()) ||
      lawyer.title.toLowerCase().includes(query.toLowerCase().trim()) ||
      lawyer.bio.toLowerCase().includes(query.toLowerCase().trim());

    const matchesSpecialty =
      selectedSpecialty === 'all' || lawyer.specialties.includes(selectedSpecialty);

    const matchesLocation =
      selectedLocation === 'all' || lawyer.location.includes(selectedLocation);

    return matchesQuery && matchesSpecialty && matchesLocation;
  });

  const handleOpenCaseModal = (lawyer: LawyerProfile) => {
    setSelectedLawyerId(lawyer.id);
    setSelectedLawyerForCase(lawyer);
    setCaseModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>دليل نخبة المحامين المعتمدين والمقيدين بالنقض</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            اختر المحامي المناسب لقضيتك
          </h1>
          <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
            تصفح ملفات المحامين الموثقين وتاريخ إنجازاتهم، أو دع الذكاء الاصطناعي يطابق قضيتك مع المحامي الأنسب لاحتياجاتك.
          </p>
        </div>

        {/* AI Match Button */}
        <button
          onClick={() => setMatchModalOpen(true)}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold text-xs shadow-xl shadow-emerald-950/60 transition-all hover:scale-105 shrink-0"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span>الترشيح الذكي بالذكاء الاصطناعي</span>
        </button>
      </div>

      {/* Filter & Search Box */}
      <div className="p-4 sm:p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو التخصص..."
              className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Specialty Select */}
          <div>
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value as any)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">جميع التخصصات القانونية</option>
              {(Object.keys(LEGAL_CATEGORIES_INFO) as LegalCategory[]).map((key) => (
                <option key={key} value={key}>
                  {LEGAL_CATEGORIES_INFO[key].labelAr}
                </option>
              ))}
            </select>
          </div>

          {/* Location Select */}
          <div>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">جميع المحافظات والمناطق</option>
              <option value="القاهرة">القاهرة الكبرى</option>
              <option value="الجيزة">الجيزة</option>
              <option value="الإسكندرية">الإسكندرية</option>
              <option value="المنصورة">المنصورة والدلتا</option>
            </select>
          </div>

        </div>
      </div>

      {/* Lawyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLawyers.map((lawyer) => (
          <div
            key={lawyer.id}
            className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 transition-all shadow-xl flex flex-col justify-between space-y-5"
          >
            {/* Header: Photo + Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={lawyer.avatar}
                  alt={lawyer.name}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/40 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white truncate">{lawyer.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 shrink-0 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      موثق
                    </span>
                  </div>
                  <p className="text-xs text-amber-300/90 font-medium mt-0.5">{lawyer.title}</p>
                  
                  <div className="flex items-center gap-4 mt-2 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {lawyer.location}
                    </span>
                    <span className="text-slate-500">•</span>
                    <span className="font-mono text-[11px]">{lawyer.barNumber}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-center">
                <div>
                  <div className="text-xs font-extrabold text-amber-400 flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{lawyer.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">({lawyer.reviewCount} تقييم)</span>
                </div>
                <div className="border-r border-slate-700">
                  <div className="text-xs font-extrabold text-emerald-400">
                    {lawyer.winRate}%
                  </div>
                  <span className="text-[10px] text-slate-400">نسبة النجاح</span>
                </div>
                <div className="border-r border-slate-700">
                  <div className="text-xs font-extrabold text-white">
                    +{lawyer.experienceYears} عاماً
                  </div>
                  <span className="text-[10px] text-slate-400">الخبرة المهنية</span>
                </div>
              </div>

              {/* Bio */}
              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {lawyer.bio}
              </p>

              {/* Specialties Tags */}
              <div className="flex items-center gap-1.5 flex-wrap">
                {lawyer.specialties.map((specKey) => {
                  const spec = LEGAL_CATEGORIES_INFO[specKey];
                  return (
                    <span
                      key={specKey}
                      className="text-[10px] font-semibold bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700/60"
                    >
                      {spec ? spec.labelAr : specKey}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] text-slate-400 block">أتعاب الاستشارة الأولى</span>
                <span className="text-sm font-extrabold text-white">
                  {lawyer.consultationFee} ج.م
                </span>
              </div>

              <button
                onClick={() => handleOpenCaseModal(lawyer)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 transition-all hover:scale-105"
              >
                <Send className="w-3.5 h-3.5" />
                <span>إرسال ملف قضية</span>
              </button>
            </div>

          </div>
        ))}
      </div>

      {/* Modals */}
      <LawyerMatchModal
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
      />

      <CaseSummaryModal
        isOpen={caseModalOpen}
        onClose={() => setCaseModalOpen(false)}
        initialSummary={{
          lawyerId: selectedLawyerForCase?.id,
          lawyerName: selectedLawyerForCase?.name,
        }}
        onSuccessRedirect={() => router.push('/client/my-cases')}
      />

    </div>
  );
}
