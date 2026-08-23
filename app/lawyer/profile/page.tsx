'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { LEGAL_CATEGORIES_INFO } from '@/lib/data/legalData';
import { 
  Award, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Star, 
  Building, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2, 
  Edit3, 
  Save, 
  DollarSign,
  Scale
} from 'lucide-react';

export default function LawyerProfilePage() {
  const { activeLawyer, addToast } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [fee, setFee] = useState(activeLawyer.consultationFee);
  const [bio, setBio] = useState(activeLawyer.bio);

  const handleSave = () => {
    setIsEditing(false);
    addToast({
      type: 'success',
      title: 'تم حفظ التعديلات',
      message: 'تم تحديث بيانات الملف المهني بنجاح',
    });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-200">
      
      {/* Top Banner Card */}
      <div className="rounded-3xl bg-[#0b1224] border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-[#111c38] border-2 border-[#c5a059]/40 p-1 flex items-center justify-center shrink-0 overflow-hidden shadow-xl">
              <img
                src={activeLawyer.avatar}
                alt={activeLawyer.name}
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeLawyer.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#111c38] border border-[#c5a059]/30 text-[#dfba73]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  مقيد بالنقض والدستورية
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#dfba73] font-medium">{activeLawyer.title}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  {activeLawyer.address}
                </span>
                <span>•</span>
                <span className="font-mono text-slate-300">رقم القيد: {activeLawyer.barNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 shrink-0">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-legal-gold text-xs font-bold cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التغييرات</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl btn-legal-navy text-xs font-semibold cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-[#dfba73]" />
                <span>تعديل الملف المهني</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800 text-center">
          <div className="p-3.5 rounded-2xl bg-[#080e1c] border border-slate-800">
            <div className="text-lg font-black text-[#dfba73] flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-[#dfba73] text-[#dfba73]" />
              <span>{activeLawyer.rating}</span>
            </div>
            <span className="text-[10px] text-slate-400">({activeLawyer.reviewCount} تقييم موثق)</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080e1c] border border-slate-800">
            <div className="text-lg font-black text-emerald-400">
              {activeLawyer.winRate}%
            </div>
            <span className="text-[10px] text-slate-400">نسبة كسب الأحكام</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080e1c] border border-slate-800">
            <div className="text-lg font-black text-white">
              +{activeLawyer.experienceYears} عاماً
            </div>
            <span className="text-[10px] text-slate-400">الخبرة القضائية</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-[#080e1c] border border-slate-800">
            <div className="text-lg font-black text-[#dfba73]">
              {activeLawyer.totalResolvedCases}+
            </div>
            <span className="text-[10px] text-slate-400">دعوى مفصولة بحكم</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Details + Cases & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 1 Col: Bio, Specialties, Fees, Contact */}
        <div className="space-y-6">
          
          {/* Bio & Specialties */}
          <div className="p-6 rounded-3xl legal-card space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-[#dfba73]" />
              <span>النبذة المهنية والتخصصات</span>
            </h3>

            {isEditing ? (
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#080e1c] border border-slate-700 text-xs text-white"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">{bio}</p>
            )}

            <div className="space-y-2 pt-3 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block">مجالات الترافع المعتمدة:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeLawyer.specialties.map((specKey) => {
                  const spec = LEGAL_CATEGORIES_INFO[specKey];
                  return (
                    <span
                      key={specKey}
                      className="text-[10px] font-bold bg-[#111c38] text-[#dfba73] border border-[#c5a059]/20 px-2.5 py-1 rounded-lg"
                    >
                      {spec ? spec.labelAr : specKey}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Consultation Fee & Contact Info */}
          <div className="p-6 rounded-3xl legal-card space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Scale className="w-4 h-4 text-[#dfba73]" />
              <span>أتعاب الاستشارة وبيانات الاتصال</span>
            </h3>

            <div className="p-4 rounded-2xl bg-[#080e1c] border border-[#c5a059]/25 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">قيمة الاستشارة المبدئية</span>
                <span className="text-lg font-extrabold text-white">
                  {isEditing ? (
                    <input
                      type="number"
                      value={fee}
                      onChange={(e) => setFee(Number(e.target.value))}
                      className="w-24 p-1 rounded bg-[#0b1224] border border-slate-700 text-sm"
                    />
                  ) : (
                    `${fee} ج.م`
                  )}
                </span>
              </div>
              <span className="text-[10px] text-[#dfba73] bg-[#111c38] px-2 py-1 rounded border border-[#c5a059]/20 font-medium">
                شاملة دراسة الأوراق
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{activeLawyer.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{activeLawyer.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-slate-500" />
                <span>{activeLawyer.location}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right 2 Cols: Featured Landmark Cases & Client Reviews */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Featured Landmark Cases */}
          <div className="p-6 rounded-3xl legal-card space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-[#dfba73]" />
              <span>سجل القضايا والأحكام القضائية الباتة</span>
            </h3>

            <div className="space-y-3">
              {activeLawyer.featuredCases.map((fc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#080e1c] border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white">{fc.title}</h4>
                    <span className="text-[10px] font-mono text-slate-400">{fc.year}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-emerald-400">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>النتيجة: {fc.outcome}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Client Testimonials */}
          <div className="p-6 rounded-3xl legal-card space-y-4 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-[#dfba73]" />
              <span>آراء وتقييمات الموكلين المعتمدة</span>
            </h3>

            <div className="space-y-3">
              {activeLawyer.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-[#080e1c] border border-slate-800 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.clientName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#111c38] text-[#dfba73]">
                        {rev.caseCategory}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#dfba73] font-bold">
                      <Star className="w-3.5 h-3.5 fill-[#dfba73]" />
                      <span>{rev.rating}</span>
                      <span className="text-[10px] text-slate-500 font-normal mr-2">• {rev.date}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-serif">
                    &ldquo;{rev.comment}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
