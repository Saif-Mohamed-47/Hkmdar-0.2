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
  Share2,
  Calendar,
  DollarSign
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
    <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
      
      {/* Top Banner Card */}
      <div className="relative rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-right">
            <img
              src={activeLawyer.avatar}
              alt={activeLawyer.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover ring-4 ring-amber-500/40 shadow-2xl shrink-0"
            />
            <div className="space-y-2">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-extrabold text-white">
                  {activeLawyer.name}
                </h1>
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  مقيد بالنقض والدستورية
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-300 font-medium">{activeLawyer.title}</p>
              
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
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>حفظ التغييرات</span>
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs border border-slate-700 transition-colors"
              >
                <Edit3 className="w-4 h-4 text-amber-400" />
                <span>تعديل الملف</span>
              </button>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-800 text-center">
          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-xl font-extrabold text-amber-400 flex items-center justify-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              <span>{activeLawyer.rating}</span>
            </div>
            <span className="text-[10px] text-slate-400">({activeLawyer.reviewCount} تقييم موثق)</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-xl font-extrabold text-emerald-400">
              {activeLawyer.winRate}%
            </div>
            <span className="text-[10px] text-slate-400">نسبة نجاح الأحكام</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-xl font-extrabold text-white">
              +{activeLawyer.experienceYears} عاماً
            </div>
            <span className="text-[10px] text-slate-400">الخبرة القضائية</span>
          </div>

          <div className="p-3 rounded-2xl bg-slate-800/40 border border-slate-700/40">
            <div className="text-xl font-extrabold text-teal-400">
              {activeLawyer.totalResolvedCases}+
            </div>
            <span className="text-[10px] text-slate-400">قضية منجزة بنجاح</span>
          </div>
        </div>

      </div>

      {/* Main Grid: Details + Cases & Reviews */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 1 Col: Bio, Specialties, Fees, Contact */}
        <div className="space-y-6">
          
          {/* Bio & Specialties */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-amber-400" />
              <span>النبذة المهنية والتخصصات</span>
            </h3>

            {isEditing ? (
              <textarea
                rows={4}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white"
              />
            ) : (
              <p className="text-xs text-slate-300 leading-relaxed">{bio}</p>
            )}

            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-400 block">مجالات الترافع المعتمدة:</span>
              <div className="flex flex-wrap gap-1.5">
                {activeLawyer.specialties.map((specKey) => {
                  const spec = LEGAL_CATEGORIES_INFO[specKey];
                  return (
                    <span
                      key={specKey}
                      className="text-[10px] font-bold bg-slate-800 text-slate-200 px-2.5 py-1 rounded-lg border border-slate-700"
                    >
                      {spec ? spec.labelAr : specKey}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Consultation Fee & Contact Info */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-400" />
              <span>أتعاب الاستشارة وبيانات التواصل</span>
            </h3>

            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/20 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block">قيمة الاستشارة المبدئية</span>
                <span className="text-lg font-extrabold text-white">
                  {isEditing ? (
                    <input
                      type="number"
                      value={fee}
                      onChange={(e) => setFee(Number(e.target.value))}
                      className="w-24 p-1 rounded bg-slate-800 border border-slate-700 text-sm"
                    />
                  ) : (
                    `${fee} ج.م`
                  )}
                </span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded">
                شاملة دراسة ملف القضية
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
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-amber-400" />
              <span>سجل القضايا الكبرى والأحكام الباتة المكتسبة</span>
            </h3>

            <div className="space-y-3">
              {activeLawyer.featuredCases.map((fc, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2"
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
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400" />
              <span>آراء وتقييمات الموكلين الموثقة</span>
            </h3>

            <div className="space-y-3">
              {activeLawyer.reviews.map((rev) => (
                <div
                  key={rev.id}
                  className="p-4 rounded-2xl bg-slate-800/50 border border-slate-700/60 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.clientName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300">
                        {rev.caseCategory}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                      <span>⭐ {rev.rating}</span>
                      <span className="text-[10px] text-slate-500 font-normal">• {rev.date}</span>
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
