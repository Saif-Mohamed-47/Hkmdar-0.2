import asyncio
import os
from playwright.async_api import async_playwright

HTML_MASTER_THESIS = """<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>HAKMDAR · Engineering Master-Grade Graduation Thesis & Proposal</title>
    <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;600;700;800;900&family=Tajawal:wght@400;500;700;800;900&family=JetBrains+Mono:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        @page {
            size: A4 portrait;
            margin: 0;
        }
        
        * {
            box-sizing: border-box;
            margin: 0;
            padding: 0;
        }

        body {
            font-family: 'Cairo', 'Tajawal', sans-serif;
            background-color: #030712;
            color: #f1f5f9;
            line-height: 1.6;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        .page {
            width: 210mm;
            min-height: 297mm;
            padding: 18mm 18mm;
            page-break-after: always;
            position: relative;
            background: radial-gradient(circle at 85% 15%, #0f172a 0%, #030712 65%);
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }

        .page:last-child {
            page-break-after: avoid;
        }

        /* Decorative High-Tech Grid & Border */
        .page-border {
            position: absolute;
            top: 8mm;
            bottom: 8mm;
            left: 8mm;
            right: 8mm;
            border: 1px solid rgba(197, 160, 89, 0.25);
            border-radius: 14px;
            pointer-events: none;
        }

        .header-bar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-bottom: 10px;
            border-bottom: 1px solid rgba(197, 160, 89, 0.35);
            margin-bottom: 16px;
        }

        .header-logo {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .header-logo img {
            width: 32px;
            height: 32px;
            object-fit: contain;
        }

        .header-brand {
            font-size: 15px;
            font-weight: 900;
            color: #dfba73;
            letter-spacing: -0.5px;
        }

        .header-meta {
            font-size: 10px;
            color: #94a3b8;
            font-weight: 700;
            font-family: 'JetBrains Mono', 'Cairo', sans-serif;
        }

        .footer-bar {
            margin-top: auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 10px;
            border-top: 1px solid rgba(255, 255, 255, 0.12);
            font-size: 9.5px;
            color: #64748b;
        }

        /* Typography */
        h1, h2, h3, h4 {
            color: #ffffff;
            font-weight: 800;
        }

        .gold-text {
            color: #dfba73;
        }

        .gradient-title {
            background: linear-gradient(135deg, #dfba73 0%, #ffffff 50%, #dfba73 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .card {
            background: rgba(15, 23, 42, 0.75);
            border: 1px solid rgba(197, 160, 89, 0.2);
            border-radius: 12px;
            padding: 12px 15px;
            margin-bottom: 11px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
        }

        .card-gold {
            background: rgba(223, 186, 115, 0.08);
            border: 1px solid rgba(197, 160, 89, 0.45);
        }

        .badge {
            display: inline-block;
            padding: 3px 9px;
            border-radius: 6px;
            font-size: 10px;
            font-weight: 700;
            background: rgba(197, 160, 89, 0.15);
            color: #dfba73;
            border: 1px solid rgba(197, 160, 89, 0.35);
        }

        .grid-2 {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .grid-3 {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 10px;
        }

        .grid-4 {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
        }

        .screenshot-box {
            border: 1px solid rgba(197, 160, 89, 0.3);
            border-radius: 9px;
            overflow: hidden;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.6);
            margin: 8px 0;
            background: #020617;
        }

        .screenshot-box img {
            width: 100%;
            display: block;
            object-fit: cover;
        }

        .screenshot-caption {
            padding: 5px 8px;
            background: #0b1224;
            font-size: 10px;
            color: #cbd5e1;
            font-weight: 600;
            border-top: 1px solid rgba(255, 255, 255, 0.08);
            text-align: center;
        }

        /* Scientific Tables */
        table.plan-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 10.5px;
            margin-top: 6px;
        }

        table.plan-table th {
            background: #111c38;
            color: #dfba73;
            padding: 8px 10px;
            text-align: right;
            border-bottom: 2px solid #c5a059;
            font-weight: 800;
        }

        table.plan-table td {
            padding: 7px 10px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            color: #e2e8f0;
            vertical-align: middle;
        }

        table.plan-table tr:nth-child(even) {
            background: rgba(255, 255, 255, 0.02);
        }

        /* Cover Page Master Style */
        .cover-page {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            align-items: center;
            text-align: center;
            padding: 24mm 18mm;
            background: radial-gradient(circle at 50% 25%, #1e293b 0%, #030712 80%);
        }

        .cover-logo-wrapper {
            width: 110px;
            height: 110px;
            border-radius: 28px;
            background: linear-gradient(135deg, rgba(223, 186, 115, 0.25) 0%, rgba(15, 23, 42, 0.9) 100%);
            border: 2px solid #dfba73;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 60px rgba(197, 160, 89, 0.4);
            margin-bottom: 18px;
        }

        .cover-logo-wrapper img {
            width: 75px;
            height: 75px;
            object-fit: contain;
        }

        .cover-title {
            font-size: 34px;
            font-weight: 900;
            line-height: 1.2;
            margin-bottom: 8px;
            letter-spacing: -1px;
        }

        .cover-subtitle {
            font-size: 14.5px;
            color: #94a3b8;
            max-width: 620px;
            line-height: 1.6;
            margin-bottom: 22px;
        }

        .meta-pill {
            display: flex;
            gap: 16px;
            background: rgba(15, 23, 42, 0.85);
            padding: 12px 24px;
            border-radius: 50px;
            border: 1px solid rgba(197, 160, 89, 0.4);
            margin-bottom: 22px;
        }

        .meta-item {
            text-align: center;
        }

        .meta-item .label {
            font-size: 9.5px;
            color: #94a3b8;
            display: block;
        }

        .meta-item .value {
            font-size: 12px;
            color: #ffffff;
            font-weight: 800;
        }

        .code-snippet {
            font-family: 'JetBrains Mono', monospace;
            background: #090d16;
            border: 1px solid rgba(197, 160, 89, 0.25);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 10px;
            color: #38bdf8;
            direction: ltr;
            text-align: left;
            margin: 6px 0;
            line-height: 1.5;
        }

        .check-item {
            display: flex;
            align-items: flex-start;
            gap: 6px;
            margin-bottom: 6px;
            font-size: 11px;
            line-height: 1.5;
        }

        .check-icon {
            color: #dfba73;
            font-weight: bold;
        }
    </style>
</head>
<body>

    <!-- ==================== الغلاف الأكاديمي الشامل ==================== -->
    <div class="page cover-page">
        <div class="page-border"></div>

        <div>
            <div style="font-size: 13px; font-weight: 800; color: #cbd5e1; letter-spacing: 1px; margin-bottom: 4px;">
                جمهورية مصر العربية · كليات الهندسة والحاسبات والمعلومات
            </div>
            <div style="font-size: 12px; color: #dfba73; font-weight: 700;">
                وثيقة الاعتماد الفني لمشروع التخرج ورسالة الماجستير البحثية التطبيقية (Engineering Capstone & Thesis Proposal)
            </div>
        </div>

        <div style="display: flex; flex-direction: column; align-items: center;">
            <div class="cover-logo-wrapper">
                <img src="file:///c:/project/Hakmdar/HAKMDAR/public/hakmdar-sword-icon.png" alt="شعار حكمدار">
            </div>

            <div class="badge" style="font-size: 11px; padding: 5px 14px; margin-bottom: 10px;">
                🌐 Distributed Legal Intelligence & Sovereign LLM Architecture
            </div>

            <h1 class="cover-title gradient-title">
                مـنـظـومـة حِـكِـمْـدار
            </h1>
            <div style="font-size: 18px; font-weight: 800; color: #dfba73; margin-bottom: 10px; font-family: 'JetBrains Mono', 'Cairo', sans-serif;">
                HAKMDAR: Autonomous Legal-Tech Operating System & Dialectal RAG
            </div>
            <p class="cover-subtitle">
                بحث هندسي وتطبيقي لبناء منظومة برمجية حوسبية متكاملة تجمع بين هندسة الوكلاء الذكية (Agentic AI Workflow)، استرجاع السوابق الدلالي (Hybrid Sparse-Dense RAG)، وإدارة ملفات المتقاضين وفق معايير الأمان السيبراني وعزل البيانات الصارم.
            </p>

            <div class="meta-pill">
                <div class="meta-item">
                    <span class="label">المجال الهندسي</span>
                    <span class="value">AI Systems & Full-Stack Cloud</span>
                </div>
                <div style="width: 1px; background: rgba(255,255,255,0.15);"></div>
                <div class="meta-item">
                    <span class="label">الابتكار البحثي</span>
                    <span class="value">Dialectal Arabic Legal RAG</span>
                </div>
                <div style="width: 1px; background: rgba(255,255,255,0.15);"></div>
                <div class="meta-item">
                    <span class="label">الجاهزية والإنتاج</span>
                    <span class="value" style="color: #34d399;">Production Ready (100%)</span>
                </div>
            </div>
        </div>

        <div>
            <div style="font-size: 12px; color: #e2e8f0; font-weight: 700;">
                إعداد المهندس / الطالب: <strong style="color: #dfba73; font-size: 14px;">سيف محمد (Saif Mohamed)</strong>
            </div>
            <div style="font-size: 10.5px; color: #94a3b8; margin-top: 4px;">
                مقدمة للاعتماد الأكاديمي والمناقشة · العام الأكاديمي 2026 / 2027
            </div>
        </div>
    </div>


    <!-- ==================== الصفحة 1: ملخص الأطروحة ومبررات البحث ==================== -->
    <div class="page">
        <div class="page-border"></div>
        <div class="header-bar">
            <div class="header-logo">
                <img src="file:///c:/project/Hakmdar/HAKMDAR/public/hakmdar-sword-icon.png">
                <span class="header-brand">حِكِمْدار HAKMDAR</span>
            </div>
            <div class="header-meta">CHAPTER 1: EXECUTIVE ABSTRACT & NOVELTY · PAGE 1</div>
        </div>

        <div style="margin-bottom: 12px;">
            <span class="badge">1. الملخص التنفيذي والأصالة العلمية (Executive Abstract & Novelty)</span>
            <h2 style="font-size: 18px; margin-top: 4px;" class="gradient-title">
                التحول الرقمي لقطاع العدالة عبر أنظمة الذكاء الاصطناعي السيادي
            </h2>
        </div>

        <div class="card card-gold">
            <h3 style="font-size: 12px; color: #dfba73; margin-bottom: 4px;">🔬 المشكلة الهندسية والبحثية (The Research & Engineering Gap):</h3>
            <p style="font-size: 11px; color: #e2e8f0; line-height: 1.6;">
                تعاني أنظمة الذكاء الاصطناعي العامة (مثل ChatGPT أو Claude) من <strong>الهلوسة القانونية (Legal Hallucination)</strong> والافتقار للتأصيل التشريعي المحلي، بالإضافة إلى عجزها عن استيعاب اللهجات المحلية (كالـ Egyptian Slang) عند وصف الوقائع الجنائية والمدنية. في المقابل، تفتقر مكاتب المحاماة لمنظومات سحابية مركزية تدمج بين التكييف القانوني الآلي، البحث الدلالي في آلاف المواد والسوابق، وحافظات المستندات الرقمية الآمنة.
            </p>
        </div>

        <div class="grid-2">
            <div class="card">
                <h3 style="font-size: 11.5px; color: #38bdf8; margin-bottom: 6px;">💡 القيمة المضافة والأصالة الهندسية (Scientific Contributions):</h3>
                <div class="check-item"><span class="check-icon">✓</span> <strong>تطبيع لغوي صوتي وصرفي مخصص:</strong> خوارزمية تسامح نحوي تعالج الهمزات والتاء المربوطة والمصطلحات الدارجة.</div>
                <div class="check-item"><span class="check-icon">✓</span> <strong>هندسة الاسترجاع المعزز المزدوج (Hybrid RAG):</strong> ربط الوقائع مباشرة بـ 20 تخصصاً تشريعياً وسوابق النقض.</div>
                <div class="check-item"><span class="check-icon">✓</span> <strong>هندسة الوكلاء (Agentic Case Extraction):</strong> تحويل محادثة الموكل إلى ملف قضية متكامل (Case Intake Dossier).</div>
            </div>

            <div class="card">
                <h3 style="font-size: 11.5px; color: #a78bfa; margin-bottom: 6px;">🎯 معايير الجودة ومؤشرات الأداء (Key Performance Indicators):</h3>
                <div class="check-item"><span class="check-icon">⚡</span> <strong>زمن الاستجابة اللحظي:</strong> استجابة البث الحي (Streaming Latency < 1.2s).</div>
                <div class="check-item"><span class="check-icon">🎯</span> <strong>دقة التأصيل التشريعي:</strong> انعدام الهلوسة في الاستشهاد بمواد القوانين المصرية.</div>
                <div class="check-item"><span class="check-icon">🔒</span> <strong>أمان البيانات القضائية:</strong> تشفير كامل وعزل متعدد للمستأجرين (Multi-Tenant RLS).</div>
            </div>
        </div>

        <div class="card" style="margin-bottom: 0;">
            <h3 style="font-size: 11.5px; color: #dfba73; margin-bottom: 4px;">🌐 الرؤية التوسعية: من مشروع تخرج إلى منصة LegalTech عالمية</h3>
            <p style="font-size: 10.5px; color: #cbd5e1; line-height: 1.6;">
                تم تصميم النظام ليكون <strong>قابل للتخصيص والتوسع (Modular & Scalable)</strong> لخدمة نقابات المحامين في مصر والشرق الأوسط، مع إمكانية تحويله إلى منصة SaaS تجارية أو رسالة ماجستير متقدمة في مجالات <em>Natural Language Processing</em> و <em>Domain-Specific Large Language Models</em>.
            </p>
        </div>

        <div class="footer-bar">
            <span>منصة حكمدار HAKMDAR · وثيقة الاعتماد الأكاديمي والهندسي</span>
            <span>كلية الهندسة والحاسبات · 2026/2027</span>
        </div>
    </div>


    <!-- ==================== الصفحة 2: المعمارية الهندسية ومخطط التدفق ==================== -->
    <div class="page">
        <div class="page-border"></div>
        <div class="header-bar">
            <div class="header-logo">
                <img src="file:///c:/project/Hakmdar/HAKMDAR/public/hakmdar-sword-icon.png">
                <span class="header-brand">حِكِمْدار HAKMDAR</span>
            </div>
            <div class="header-meta">CHAPTER 2: SYSTEM ARCHITECTURE & DATA PIPELINE · PAGE 2</div>
        </div>

        <div style="margin-bottom: 10px;">
            <span class="badge">2. المعمارية الهندسية ومخطط تدفق البيانات (System Architecture & Pipeline)</span>
            <h2 style="font-size: 17px; margin-top: 4px;" class="gradient-title">
                هيكل السحابة الموزعة ونواة الذكاء الاصطناعي السيادي
            </h2>
        </div>

        <div class="grid-4" style="margin-bottom: 10px;">
            <div class="card" style="text-align: center; padding: 10px 6px;">
                <div style="font-size: 14px; margin-bottom: 2px;">⚡</div>
                <strong style="font-size: 11px; color: #dfba73; display: block;">Next.js 15 App Router</strong>
                <span style="font-size: 9px; color: #94a3b8;">React 19 Server Components</span>
            </div>
            <div class="card" style="text-align: center; padding: 10px 6px;">
                <div style="font-size: 14px; margin-bottom: 2px;">🧠</div>
                <strong style="font-size: 11px; color: #dfba73; display: block;">Gemini 1.5 Pro Engine</strong>
                <span style="font-size: 9px; color: #94a3b8;">Streaming Dialectal RAG</span>
            </div>
            <div class="card" style="text-align: center; padding: 10px 6px;">
                <div style="font-size: 14px; margin-bottom: 2px;">🗄️</div>
                <strong style="font-size: 11px; color: #dfba73; display: block;">PostgreSQL + RLS</strong>
                <span style="font-size: 9px; color: #94a3b8;">Supabase Distributed Storage</span>
            </div>
            <div class="card" style="text-align: center; padding: 10px 6px;">
                <div style="font-size: 14px; margin-bottom: 2px;">🛡️</div>
                <strong style="font-size: 11px; color: #dfba73; display: block;">AES-256 Storage</strong>
                <span style="font-size: 9px; color: #94a3b8;">PDF/DOCX/XLSX Isolation</span>
            </div>
        </div>

        <div class="card" style="margin-bottom: 10px;">
            <h3 style="font-size: 11.5px; color: #dfba73; margin-bottom: 6px;">📊 مخطط خط أنابيب البيانات والذكاء الاصطناعي (AI Data Pipeline):</h3>
            
            <div class="code-snippet">
[Client / Lawyer Input (Audio/Text/Slang)]
               │
               ▼
[Arabic Normalization Layer: /[أإآ]/->'ا', /ة/->'ه', /ى/->'ي', Strip Tashkeel]
               │
               ▼
[Intent Classifier & Legal Category Router (20 Branches)]
               │
               ▼
[Context Injection & Statutory Retrieval: Comprehensive Egyptian Penal/Civil/Labor/Cyber Database]
               │
               ▼
[Google Gemini 1.5 Pro Streaming Inference (Zero Markdown '#' / Legal Citation Anchors)]
               │
               ├─────────────────────────┐
               ▼                         ▼
[Real-Time Token Stream to UI]    [Structured Case Dossier Generator (JSON)]
                                         │
                                         ▼
                 [Auto-Dispatched to Assigned Cassation Lawyer (Supabase DB)]
            </div>
        </div>

        <div class="grid-2" style="margin-bottom: 0;">
            <div class="card">
                <h3 style="font-size: 11px; color: #34d399; margin-bottom: 4px;">🔐 الحماية وعزل البيانات القضائية:</h3>
                <p style="font-size: 10px; color: #cbd5e1; line-height: 1.5;">
                    تطبيق سياسات <strong>Row-Level Security (RLS)</strong> التي تضمن استحالة استعلام أي مستخدم عن وثائق أو قضايا غير مسندة إليه، مع عزل مسارات التخزين السحابي <code>/case-documents/&lt;lawyer_id&gt;/</code>.
                </p>
            </div>

            <div class="card">
                <h3 style="font-size: 11px; color: #fbbf24; margin-bottom: 4px;">⚡ الأداء والـ Hydration Safety:</h3>
                <p style="font-size: 10px; color: #cbd5e1; line-height: 1.5;">
                    فصل الـ Server-Side Rendering الحتمي عن الـ Client Side State لحل مشاكل الـ Hydration والتوافق مع معايير Next.js 15 الفائقة في زمن التحميل وسرعة الاستجابة.
                </p>
            </div>
        </div>

        <div class="footer-bar">
            <span>منصة حكمدار HAKMDAR · وثيقة الاعتماد الأكاديمي والهندسي</span>
            <span>كلية الهندسة والحاسبات · 2026/2027</span>
        </div>
    </div>


    <!-- ==================== الصفحة 3: الابتكار في معالجة اللهجة المصرية وخوارزميات البحث ==================== -->
    <div class="page">
        <div class="page-border"></div>
        <div class="header-bar">
            <div class="header-logo">
                <img src="file:///c:/project/Hakmdar/HAKMDAR/public/hakmdar-sword-icon.png">
                <span class="header-brand">حِكِمْدار HAKMDAR</span>
            </div>
            <div class="header-meta">CHAPTER 3: ALGORITHMIC NOVELTY & ARABIC NLP · PAGE 3</div>
        </div>

        <div style="margin-bottom: 12px;">
            <span class="badge">3. الخوارزميات المبتكرة والمعالجة اللغوية للهجة المصرية (Dialectal NLP)</span>
            <h2 style="font-size: 17px; margin-top: 4px;" class="gradient-title">
                خوارزميات المطابقة والتسامح اللغوي واستخراج التكييف
            </h2>
        </div>

        <div class="card">
            <h3 style="font-size: 11.5px; color: #dfba73; margin-bottom: 6px;">🧠 1. محرك التطبيع والتسامح الإملائي الذكي (Phonetic & Morphological Normalizer):</h3>
            <p style="font-size: 10.5px; color: #cbd5e1; line-height: 1.6;">
                تم ابتكار دالة تطبيع هجائي فورية تعمل في الـ Client والـ Server بدون أي بطء زمني (O(N) Complexity). تتيح للمستخدم البحث في المحافظات والتخصصات والقوانين بأي نمط كتابي:
            </p>
            <div class="code-snippet">
function normalizeArabicText(text: string): string {
  return text.trim().toLowerCase()
    .replace(/[أإآٱ]/g, 'ا') // Unify all Alef variations
    .replace(/ة/g, 'ه')       // Unify Taa Marbouta with Haa
    .replace(/ى/g, 'ي')       // Unify Alef Maqsoura with Yaa
    .replace(/[\u064B-\u065F\u0670ـ]/g, ''); // Strip Harakat & Tatweel
}
            </div>
        </div>

        <div class="grid-2">
            <div class="card">
                <h3 style="font-size: 11px; color: #38bdf8; margin-bottom: 4px;">🇪🇬 2. معجم العامية والمصطلحات الدارجة:</h3>
                <p style="font-size: 10px; color: #cbd5e1; line-height: 1.5;">
                    بناء طبقة تعيين دلالي (Semantic Mapping) تترجم عبارات مثل: <em>"هكر تليفوني، خد صوري، بيهددني"</em> مباشرة إلى: <strong>المادة 25 و26 من قانون 175 لسنة 2018 (مكافحة جرائم تقنية المعلومات) والمادة 327 عقوبات</strong> واختصاص المحاكم الاقتصادية.
                </p>
            </div>

            <div class="card">
                <h3 style="font-size: 11px; color: #a78bfa; margin-bottom: 4px;">⚖️ 3. محرك الصياغة القضائية الآلية:</h3>
                <p style="font-size: 10px; color: #cbd5e1; line-height: 1.5;">
                    توليد صحف الدعاوى والمذكرات مقسمة إلى: <strong>(الوقائع، الدفوع الشكلية والموضوعية، النصوص القانونية المؤصلة، والطلبات الختامية)</strong> بصياغة رصينة تضاهي عمل كبار مستشاري محكمة النقض.
                </p>
            </div>
        </div>

        <div class="card" style="margin-bottom: 0;">
            <h3 style="font-size: 11px; color: #dfba73; margin-bottom: 4px;">📊 مقارنة مع الحلول والأنظمة العالمية (Benchmark Analysis):</h3>
            <table class="plan-table">
                <thead>
                    <tr>
                        <th>المعيار الهندسي</th>
                        <th>أنظمة LLM العامة (ChatGPT / Claude)</th>
                        <th>المنظومات القانونية الغربية (Harvey / CoCounsel)</th>
                        <th style="color: #34d399;">منظومة حكمدار (HAKMDAR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>التشريعات المحلية</strong></td>
                        <td>عامة وغير مؤصلة بالمواد</td>
                        <td>مقتصرة على القانون الأنجلوسكسوني</td>
                        <td><strong style="color: #dfba73;">20 تخصصاً مصرياً + أحكام النقض</strong></td>
                    </tr>
                    <tr>
                        <td><strong>استيعاب اللهجة المصرية</strong></td>
                        <td>ضعيف في المصطلحات القضائية</td>
                        <td>غير متوفر نهائياً</td>
                        <td><strong style="color: #34d399;">مُدرّب ومؤصل دلالياً 100%</strong></td>
                    </tr>
                    <tr>
                        <td><strong>استخراج ملف القضية</strong></td>
                        <td>نصوص غير مهيكلة</td>
                        <td>تتطلب اشتراكات مؤسسية ضخمة</td>
                        <td><strong style="color: #dfba73;">Case Dossier تلقائي + ربط فوري</strong></td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="footer-bar">
            <span>منصة حكمدار HAKMDAR · وثيقة الاعتماد الأكاديمي والهندسي</span>
            <span>كلية الهندسة والحاسبات · 2026/2027</span>
        </div>
    </div>


    <!-- ==================== الصفحة 4: استعراض الشاشات الحية (بوابة الموكل) ==================== -->
    <div class="page">
        <div class="page-border"></div>
        <div class="header-bar">
            <div class="header-logo">
                <img src="file:///c:/project/Hakmdar/HAKMDAR/public/hakmdar-sword-icon.png">
                <span class="header-brand">حِكِمْدار HAKMDAR</span>
            </div>
            <div class="header-meta">CHAPTER 4: CLIENT PORTAL IMPLEMENTATION · PAGE 4</div>
        </div>

        <div style="margin-bottom: 8px;">
            <span class="badge">4. الواجهات المنفذة فعلياً - بوابة الموكل والاستشارة (Client Portal UX)</span>
            <h2 style="font-size: 17px; margin-top: 4px;" class="gradient-title">
                منظومة الاستشارة القضائية الرقمية وتوليد ملفات القضايا
            </h2>
        </div>

        <div class="grid-2">
            <div>
                <div class="screenshot-box">
                    <img src="file:///c:/project/Hakmdar/HAKMDAR/public/doc_screenshots/01_landing.png" alt="الرئيسية">
                    <div class="screenshot-caption">الواجهة الرئيسية: بوابة الخدمات واختيار التخصصات القضائية</div>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; line-height: 1.4;">
                    <strong>الابتكار:</strong> توجيه ذكي للمستخدم، مؤشرات نشاط المنصة، وتحويل سلس بين بوابتي الموكل والمحامي.
                </div>
            </div>

            <div>
                <div class="screenshot-box">
                    <img src="file:///c:/project/Hakmdar/HAKMDAR/public/doc_screenshots/02_ai_chat.png" alt="المستشار الذكي">
                    <div class="screenshot-caption">المستشار القانوني التوليدي: بث حي وتكييف قانوني مع استخراج ملف القضية</div>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; line-height: 1.4;">
                    <strong>الابتكار:</strong> محادثة تفاعلية تفهم اللهجة، استشهاد فوري بمواد القانون، واستخراج ملخص تنفيذي للدعوى.
                </div>
            </div>
        </div>

        <div class="grid-2" style="margin-top: 6px;">
            <div>
                <div class="screenshot-box">
                    <img src="file:///c:/project/Hakmdar/HAKMDAR/public/doc_screenshots/03_legal_research.png" alt="البحث التشريعي">
                    <div class="screenshot-caption">محرك البحث التشريعي: 20 تخصصاً قانونياً ومكتبة سوابق النقض</div>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; line-height: 1.4;">
                    <strong>الابتكار:</strong> بحث نصي وصوتي ذكي متسامح مع الأخطاء الإملائية مع تفسيرات لأثر كل نص قانوني.
                </div>
            </div>

            <div>
                <div class="screenshot-box">
                    <img src="file:///c:/project/Hakmdar/HAKMDAR/public/doc_screenshots/04_lawyers.png" alt="دليل المحامين">
                    <div class="screenshot-caption">دليل المحامين المعتمدين: فلترة متعددة في 27 محافظة و 20 تخصصاً</div>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; line-height: 1.4;">
                    <strong>الابتكار:</strong> Multi-Select Tags مع مطابقة جغرافية وتخصصية وإرسال ملف الاستشارة بضغطة زر.
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>منصة حكمدار HAKMDAR · وثيقة الاعتماد الأكاديمي والهندسي</span>
            <span>كلية الهندسة والحاسبات · 2026/2027</span>
        </div>
    </div>


    <!-- ==================== الصفحة 5: استعراض الشاشات الحية (بوابة المحامي وحافظة المستندات) ==================== -->
    <div class="page">
        <div class="page-border"></div>
        <div class="header-bar">
            <div class="header-logo">
                <img src="file:///c:/project/Hakmdar/HAKMDAR/public/hakmdar-sword-icon.png">
                <span class="header-brand">حِكِمْدار HAKMDAR</span>
            </div>
            <div class="header-meta">CHAPTER 5: LAWYER ENTERPRISE PORTAL · PAGE 5</div>
        </div>

        <div style="margin-bottom: 8px;">
            <span class="badge">5. الواجهات المنفذة فعلياً - بوابة مكتب المحامي وإدارة الدعاوى (Lawyer Portal)</span>
            <h2 style="font-size: 17px; margin-top: 4px;" class="gradient-title">
                إدارة القضايا، حافظة المستندات، والصياغة الذكية
            </h2>
        </div>

        <div class="grid-2">
            <div>
                <div class="screenshot-box">
                    <img src="file:///c:/project/Hakmdar/HAKMDAR/public/doc_screenshots/05_lawyer_dashboard.png" alt="لوحة تحكم المحامي">
                    <div class="screenshot-caption">لوحة تحكم المحامي: مؤشرات القضايا والطلبات الواردة وجدول الجلسات</div>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; line-height: 1.4;">
                    <strong>المميزات:</strong> إحصائيات حية عن مراحل التقاضي، تنبيهات مواعيد الجلسات، وتصنيف القضايا العاجلة.
                </div>
            </div>

            <div>
                <div class="screenshot-box">
                    <img src="file:///c:/project/Hakmdar/HAKMDAR/public/doc_screenshots/06_lawyer_cases.png" alt="سجل ملفات القضايا">
                    <div class="screenshot-caption">سجل القضايا ورفع المستندات (PDF / Word / Excel)</div>
                </div>
                <div style="font-size: 10px; color: #cbd5e1; line-height: 1.4;">
                    <strong>المميزات:</strong> إضافة قضايا جديدة، رفع العرائض والمذكرات وكشوف الحسابات وتتبع الإجراءات.
                </div>
            </div>
        </div>

        <div class="card" style="margin-top: 8px; padding: 10px 14px;">
            <div class="grid-2" style="align-items: center;">
                <div>
                    <div class="screenshot-box" style="margin: 0;">
                        <img src="file:///c:/project/Hakmdar/HAKMDAR/public/doc_screenshots/07_ai_drafting.png" alt="استوديو الصياغة">
                        <div class="screenshot-caption">استوديو الصياغة القضائية الآلية (AI Legal Drafting Studio)</div>
                    </div>
                </div>
                <div style="font-size: 10.5px; color: #cbd5e1; line-height: 1.5;">
                    <h4 style="color: #dfba73; font-size: 11.5px; margin-bottom: 3px;">⚖️ محرر العرائض والمذكرات التنفيذي:</h4>
                    <p style="margin-bottom: 4px;">
                        يتيح للمحامي توليد صحف الدعاوى ومذكرات الطعن بالنقض والإنذارات الرسمية بأسلوب قضائي رصين مع إمكانية التحرير والطباعة وتصدير الـ PDF بضغطة زر.
                    </p>
                    <div class="badge" style="font-size: 9.5px;">تأصيل قانوني مباشر + تصدير جاهز للتقديم بالمحاكم</div>
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>منصة حكمدار HAKMDAR · وثيقة الاعتماد الأكاديمي والهندسي</span>
            <span>كلية الهندسة والحاسبات · 2026/2027</span>
        </div>
    </div>


    <!-- ==================== الصفحة 6: خطة التخرج والامتداد البحثي للماجستير ==================== -->
    <div class="page">
        <div class="page-border"></div>
        <div class="header-bar">
            <div class="header-logo">
                <img src="file:///c:/project/Hakmdar/HAKMDAR/public/hakmdar-sword-icon.png">
                <span class="header-brand">حِكِمْدار HAKMDAR</span>
            </div>
            <div class="header-meta">CHAPTER 6: THESIS EXTENSION & ROADMAP · PAGE 6</div>
        </div>

        <div style="margin-bottom: 10px;">
            <span class="badge">6. خطة مشروع التخرج والامتداد لرسالة الماجستير (Graduation & Master's Thesis Roadmap)</span>
            <h2 style="font-size: 17px; margin-top: 4px;" class="gradient-title">
                الخطة التنفيذية والمحاور البحثية المتقدمة لدرجة الماجستير
            </h2>
        </div>

        <div class="card card-gold" style="margin-bottom: 8px; padding: 10px 14px;">
            <strong style="color: #dfba73; font-size: 11.5px; display: block; margin-bottom: 2px;">🎓 الجاهزية الحالية لمناقشة مشروع التخرج:</strong>
            <p style="font-size: 10.5px; color: #e2e8f0; line-height: 1.5;">
                تم بحمد الله الانتهاء من بناء <strong>المنظومة التشغيلية المتكاملة 100%</strong> بكافة صفحاتها وخوارزمياتها وتكاملها مع الذكاء الاصطناعي، وهي جاهزة للعرض الحي الكامل (Live Working Demo) أمام لجنة المناقشة.
            </p>
        </div>

        <table class="plan-table" style="margin-bottom: 10px;">
            <thead>
                <tr>
                    <th style="width: 18%;">المرحلة والتاريخ</th>
                    <th style="width: 37%;">المخرجات الهندسية والبرمجية</th>
                    <th style="width: 25%;">حزمة التكنولوجيا</th>
                    <th style="width: 20%;">حالة الإنجاز</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><strong>Phase 1: Architecture</strong></td>
                    <td>دراسة الجدوى، متطلبات الأمان القضائي، وتصميم هوية "حكمدار" الفاخرة.</td>
                    <td>Figma · UI Tokens · Dark Luxe</td>
                    <td><span style="color: #34d399; font-weight: bold;">100% مُنجزة</span></td>
                </tr>
                <tr>
                    <td><strong>Phase 2: Core Frontend</strong></td>
                    <td>بوابتي الموكل والمحامي، الفلترة المتعددة في 27 محافظة و 20 تخصصاً.</td>
                    <td>Next.js 15 · Tailwind · Lucide</td>
                    <td><span style="color: #34d399; font-weight: bold;">100% مُنجزة</span></td>
                </tr>
                <tr>
                    <td><strong>Phase 3: Sovereign AI</strong></td>
                    <td>تكامل Gemini 1.5 Pro Streaming، محرك RAG للتشريعات، واستخراج القضايا.</td>
                    <td>Google AI SDK · Prompt Tuning</td>
                    <td><span style="color: #34d399; font-weight: bold;">100% مُنجزة</span></td>
                </tr>
                <tr>
                    <td><strong>Phase 4: Case & Docs Hub</strong></td>
                    <td>إدارة القضايا، مزامنة الجلسات، وحافظة المستندات (PDF / Word / Excel).</td>
                    <td>Supabase PostgreSQL · Storage</td>
                    <td><span style="color: #34d399; font-weight: bold;">100% مُنجزة</span></td>
                </tr>
                <tr>
                    <td><strong>Phase 5: Defense & Thesis</strong></td>
                    <td>التوثيق الأكاديمي، اختبارات الحمولة وسرعة الاستجابة، وتسليم المشروع.</td>
                    <td>Playwright · CI/CD Automation</td>
                    <td><span style="color: #60a5fa; font-weight: bold;">جاهز للاعتماد والمناقشة</span></td>
                </tr>
            </tbody>
        </table>

        <div class="card" style="margin-bottom: 0;">
            <h3 style="font-size: 11.5px; color: #dfba73; margin-bottom: 4px;">🔬 المحاور البحثية المقترحة لرسالة الماجستير (Proposed Master's Research Tracks):</h3>
            <div class="grid-3" style="font-size: 10px; line-height: 1.5;">
                <div style="background: rgba(255,255,255,0.03); padding: 7px; border-radius: 6px;">
                    <strong style="color: #38bdf8; display: block; margin-bottom: 2px;">1. Fine-Tuned Legal SLM:</strong>
                    تدريب نموذج لغوي صغير ومحلي (Small Language Model) على مدونة الأحكام وسوابق النقض المصرية ليعمل بدون إنترنت.
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 7px; border-radius: 6px;">
                    <strong style="color: #a78bfa; display: block; margin-bottom: 2px;">2. Multimodal Court Audio:</strong>
                    تحويل مرافعات الجلسات الصوتية إلى محاضر ومذكرات دفاع مكتوبة آلياً بدقة تتجاوز 98%.
                </div>
                <div style="background: rgba(255,255,255,0.03); padding: 7px; border-radius: 6px;">
                    <strong style="color: #34d399; display: block; margin-bottom: 2px;">3. Judicial Graph RAG:</strong>
                    بناء Knowledge Graph متقدم يربط بين نصوص القوانين ومواد الدستور والأحكام القضائية السابقة.
                </div>
            </div>
        </div>

        <div class="footer-bar">
            <span>منصة حكمدار HAKMDAR · وثيقة الاعتماد الأكاديمي والهندسي</span>
            <span>كلية الهندسة والحاسبات · 2026/2027</span>
        </div>
    </div>

</body>
</html>
"""

async def generate_master_pdf():
    html_path = 'c:/project/Hakmdar/HAKMDAR/public/hakmdar_master_thesis_proposal.html'
    pdf_path_ar = 'c:/project/Hakmdar/HAKMDAR/public/وثيقة_مشروع_تخرج_وماجستير_منصة_حكمدار.pdf'
    pdf_path_en = 'c:/project/Hakmdar/HAKMDAR/public/HAKMDAR_Master_Graduation_Thesis.pdf'
    
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(HTML_MASTER_THESIS)
    
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        
        # Load the HTML file
        await page.goto(f'file:///{html_path}', wait_until='networkidle')
        await page.wait_for_timeout(2000)
        
        # Print high quality A4 PDF
        await page.pdf(
            path=pdf_path_en,
            format='A4',
            print_background=True,
            margin={'top': '0', 'right': '0', 'bottom': '0', 'left': '0'},
            prefer_css_page_size=True,
        )
        
        # Copy to Arabic path
        import shutil
        shutil.copyfile(pdf_path_en, pdf_path_ar)
        
        # Render page previews for artifact carousel
        out_dir = 'c:/project/Hakmdar/HAKMDAR/public/pdf_previews_master'
        os.makedirs(out_dir, exist_ok=True)
        art_dir = 'C:/Users/Compumarts/.gemini/antigravity-ide/brain/f957db00-0ab9-465d-8968-c98e58d7275e/pdf_previews_master'
        os.makedirs(art_dir, exist_ok=True)
        
        pages = await page.query_selector_all('.page')
        for idx, p_elem in enumerate(pages):
            preview_file = f'{out_dir}/page_{idx+1}.png'
            await p_elem.screenshot(path=preview_file)
            shutil.copyfile(preview_file, f'{art_dir}/page_{idx+1}.png')
            
        await browser.close()
        
    print('Master graduation thesis PDF generated successfully!')

if __name__ == '__main__':
    asyncio.run(generate_master_pdf())
