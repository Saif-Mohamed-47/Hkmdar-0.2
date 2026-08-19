'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/context/AppContext';
import {  Scale, 
  Sparkles, 
  BookOpen, 
  Users, 
  FolderKanban, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Award, 
  TrendingUp, 
  FileText, 
  Lock, 
  ChevronLeft,
  Briefcase,
  Layers,
  ArrowRightLeft
} from 'lucide-react';
/*import Navbar from '@/components/layout/Navbar';*/

export default function LandingPage() {
  const { setRole } = useApp();

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-white">
      {/*<Navbar />*/}

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:py-28">
        
        {/* Glowing atmospheric circles */}
        <div className="absolute top-1/4 right-1/2 translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-emerald-600/15 via-indigo-600/15 to-amber-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">

          {/* Main Headline */}
          <div className="max-w-4xl mx-auto space-y-4">
            <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.25]">
             رفيقك الذكي في القانون{' '}
              <span className="bg-gradient-to-r from-white-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                حكمدار
              </span>
            </h1>
            <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
              استشارات قانونية فورية مدعومة بنصوص التشريعات وأحكام محكمة النقض، وترشيح ذكي لأفضل المحامين، مع تحويل محادثتك تلقائياً إلى ملف قضية متكامل لمكتب المحامي.
            </p>
          </div>

          {/* Role Entry CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            
            {/* Client Portal Button */}
            <Link
              href="/register?role=client"
              onClick={() => setRole('client')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-white-600 hover:from-white-500 hover:to-blue-500 text-white font-extrabold text-sm shadow-xl shadow-emerald-950/60 transition-all hover:scale-105"
            >
              <Users className="w-5 h-5" />
              <span>دخول بوابة الموكل (استشارة قانونية)</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>

            {/* Lawyer Portal Button */}
            <Link
              href="/register?role=lawyer"
              onClick={() => setRole('lawyer')}
              className="w-full sm:w-auto flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-slate-800/90 hover:bg-slate-800 text-blue-300 border border-blue-500/40 font-extrabold text-sm shadow-xl transition-all hover:scale-105"
            >
              <Briefcase className="w-5 h-5 text-blue-400" />
              <span>دخول بوابة المحامي (إدارة القضايا)</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>

          </div>

          {/* Trust Highlights */}
          <div className="pt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-semibold text-slate-400">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>سند تشريعي وسوابق قضائية موثقة</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-400" />
              <span>نخبة محامين مقيدين بالنقض</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-400" />
              <span>سرية تامة وتشفير لبيانات الموكلين</span>
            </div>
          </div>

        </div>
      </section>

      {/* 4 Feature Pillars Section */}
      <section className="py-16 bg-slate-950/60 border-y border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              منظومة متكاملة تخدم الموكل والمحامي
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              كل ما تحتاجه للتعامل القانوني الذكي في منصة واحدة
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">1. المستشار القانوني الذكي</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                محادثة تفاعلية باللغة الطبيعية تجيب على استفساراتك مع توثيق فوري بالمواد القانونية وأحكام النقض.
              </p>
              <Link
                href="/register?role=client"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline pt-2"
              >
                <span>جرب المحادثة الذكية</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 2 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">2. البحث في التشريعات</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                محرك بحث متطور في نصوص القوانين واللوائح التنفيذية والمبادئ القضائية مع استخلاص الأثر القانوني.
              </p>
              <Link
                href="/register?role=client"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline pt-2"
              >
                <span>ابحث في القوانين</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 3 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">3. الترشيح الذكي للمحامين</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                خوارزمية ذكية تطابق نوع قضيتك وموقعك وميزانيتك مع نخبة المحامين المعتمدين وسجل نسب نجاحهم.
              </p>
              <Link
                href="/register?role=client"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline pt-2"
              >
                <span>دليل المحامين</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Feature 4 */}
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-blue-500/40 transition-all space-y-3 shadow-xl">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">4. تحويل المحادثة لقضية</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                يقوم الذكاء الاصطناعي بتلخيص وقائع استشارتك وصياغة المطالبات وإرسالها فوراً لملف المحامي للبدء بالدعوى.
              </p>
              <Link
                href="/register?role=client"
                className="inline-flex items-center gap-1 text-xs font-bold text-blue-400 hover:underline pt-2"
              >
                <span>بوابة ملفات القضايا</span>
                <ChevronLeft className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* Dual Journey Showcase (Client vs Lawyer) */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            رحلة متناغمة من الاستشارة حتى كسب الحكم
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            شاهد كيف تنتقل القضية بسلاسة بين الموكل ومكتب المحامي
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Client Side Card */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-blue-500/30 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-2">
              <div className="space-y-2">
              <span className="text-xs font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                بوابة الموكل (Client Experience)
              </span>
              </div>
              <h3 className="text-xl font-bold text-white">سهولة، وضوح، وحماية حقوق</h3>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>اطرح مشكلتك بلغة عامية بسيطة وسيقوم المساعد بتحليلها فوراً.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>اطلع على نصوص القوانين والتعويضات المقدرة بالأرقام والمواد.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>اختر المحامي المناسب وأرسل له ملخصاً تنفيذياً بضغطة زر واحدة.</span>
              </div>
            </div>

            <Link
              href="/register?role=client"
              onClick={() => setRole('client')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg transition-all hover:scale-105"
            >
              <span>تجربة بوابة الموكل</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

          {/* Lawyer Side Card */}
          <div className="p-8 rounded-3xl bg-slate-900/80 border border-blue-500/30 space-y-6 shadow-2xl relative overflow-hidden">
            <div className="space-y-2">
              <div className="space-y-2">
              <span className="text-xs font-extrabold text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                بوابة المحامي (Lawyer Command Center)
              </span>
              </div>
              <h3 className="text-xl font-bold text-white">إدارة قضايا ذكية وتوفير 80% من وقت الإعداد</h3>
            </div>

            <div className="space-y-4 text-xs text-slate-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>استقبال ملفات قضايا مفلترة ومجهزة بالوقائع والطلبات والمستندات.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>استوديو صياغة ذكي للمذكرات والإنذارات وصحف الدعاوى بأحكام النقض.</span>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <span>أجندة لمتابعة جلسات المحاكم والتواصل المباشر مع الموكلين.</span>
              </div>
            </div>

            <Link
              href="/register?role=lawyer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-slate-950 text-white font-bold text-xs shadow-lg transition-all hover:scale-105"
            >
              <span>تجربة بوابة المحامي</span>
              <ChevronLeft className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-slate-800 bg-[#050914] text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            <span className="font-extrabold text-white text-sm">حكمدار (Hakmdar)</span>
          </div>
          <p className="text-center sm:text-left text-slate-500">
            جميع الحقوق محفوظة © {new Date().getFullYear()} حكمدار، رفيقك الذكي في القانون.
          </p>
        </div>
      </footer>

    </div>
  );
}
