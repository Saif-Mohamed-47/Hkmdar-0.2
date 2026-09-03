'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { LegalCategory, LawyerProfile } from '@/lib/types';
import { LEGAL_CATEGORIES_INFO, EGYPTIAN_GOVERNORATES } from '@/lib/data/legalData';
import { 
  Users, 
  Search, 
  Star, 
  ShieldCheck, 
  MapPin, 
  Award, 
  Send,
  SlidersHorizontal,
  Briefcase,
  Scale
} from 'lucide-react';
import LawyerMatchModal from '@/components/client/LawyerMatchModal';
import CaseSummaryModal from '@/components/client/CaseSummaryModal';
import MultiLocationSelect from '@/components/ui/MultiLocationSelect';
import MultiSpecialtySelect from '@/components/ui/MultiSpecialtySelect';
import { useRouter } from 'next/navigation';

export default function LawyersDirectoryPage() {
  const { lawyers, setSelectedLawyerId } = useApp();
  const router = useRouter();

  const [query, setQuery] = useState('');
  const [selectedSpecialties, setSelectedSpecialties] = useState<LegalCategory[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  
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
      selectedSpecialties.length === 0 ||
      selectedSpecialties.some((spec) => lawyer.specialties.includes(spec));

    const matchesLocation =
      selectedLocations.length === 0 ||
      selectedLocations.some((loc) => lawyer.location.includes(loc.split(' ')[0]));

    return matchesQuery && matchesSpecialty && matchesLocation;
  });

  const handleOpenCaseModal = (lawyer: LawyerProfile) => {
    setSelectedLawyerId(lawyer.id);
    setSelectedLawyerForCase(lawyer);
    setCaseModalOpen(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111c38] border border-[#c5a059]/30 text-[#dfba73] text-xs font-semibold">
            <Users className="w-3.5 h-3.5" />
            <span>دليل نخبة المحامين المعتمدين والمقيدين بالنقض</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            اختر المحامي المناسب لقضيتك
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            تصفح ملفات المحامين الموثقين وسجل إنجازاتهم القضائية، أو استخدم الترشيح الذكي لمطابقة قضيتك مع المحامي الأنسب.
          </p>
        </div>

        {/* Match Button */}
        <button
          onClick={() => setMatchModalOpen(true)}
          className="flex items-center gap-2 px-6 py-3.5 rounded-xl btn-legal-gold text-xs font-bold shrink-0 cursor-pointer shadow-lg"
        >
          <Scale className="w-4 h-4" />
          <span>الترشيح الذكي للمحامين</span>
        </button>
      </div>

      {/* Filter & Search Box */}
      <div className="p-4 sm:p-6 rounded-3xl legal-card space-y-4 shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Search Input */}
          <div className="relative sm:col-span-1">
            <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="ابحث بالاسم أو التخصص..."
              className="w-full pr-10 pl-3 py-2.5 rounded-xl bg-[#080e1c] border border-slate-800 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c5a059]"
            />
          </div>

          {/* Multi Specialty Select */}
          <div>
            <MultiSpecialtySelect
              selectedSpecialties={selectedSpecialties}
              onChange={setSelectedSpecialties}
              placeholder="تصفية حسب التخصصات..."
            />
          </div>

          {/* Multi Location Select */}
          <div>
            <MultiLocationSelect
              selectedLocations={selectedLocations}
              onChange={setSelectedLocations}
              placeholder="تصفية حسب المحافظات..."
            />
          </div>

        </div>
      </div>

      {/* Lawyers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredLawyers.map((lawyer) => (
          <div
            key={lawyer.id}
            className="p-6 rounded-3xl legal-card space-y-5 shadow-xl flex flex-col justify-between"
          >
            {/* Header: Photo + Info */}
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#111c38] border-2 border-[#c5a059]/30 p-0.5 shrink-0 overflow-hidden shadow-md">
                  <img
                    src={lawyer.avatar}
                    alt={lawyer.name}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white truncate">{lawyer.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#111c38] border border-[#c5a059]/30 text-[#dfba73] shrink-0 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      موثق
                    </span>
                  </div>
                  <p className="text-xs text-[#dfba73] font-medium mt-0.5">{lawyer.title}</p>
                  
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-400 flex-wrap">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" />
                      {lawyer.location}
                    </span>
                    <span className="text-slate-600">•</span>
                    <span className="font-mono text-[11px] text-slate-300">رقم القيد: {lawyer.barNumber}</span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-[#080e1c] border border-slate-800 text-center">
                <div>
                  <div className="text-xs font-black text-[#dfba73] flex items-center justify-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-[#dfba73] text-[#dfba73]" />
                    <span>{lawyer.rating}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">({lawyer.reviewCount} تقييم)</span>
                </div>
                <div className="border-r border-slate-800">
                  <div className="text-xs font-black text-emerald-400">
                    {lawyer.winRate}%
                  </div>
                  <span className="text-[10px] text-slate-400">نسبة النجاح</span>
                </div>
                <div className="border-r border-slate-800">
                  <div className="text-xs font-black text-white">
                    +{lawyer.experienceYears} عاماً
                  </div>
                  <span className="text-[10px] text-slate-400">الخبرة القضائية</span>
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
                      className="text-[10px] font-semibold bg-[#111c38] text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800"
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
                <span className="text-[10px] text-slate-400 block">أتعاب الاستشارة المبدئية</span>
                <span className="text-sm font-black text-white">
                  {lawyer.consultationFee} ج.م
                </span>
              </div>

              <button
                onClick={() => handleOpenCaseModal(lawyer)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-legal-gold text-xs font-bold cursor-pointer"
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
