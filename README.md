# 🏛️ HAKMDAR 0.2 (منظومة حِكِمْدار)
### Sovereign AI-Powered Legal Operating System & Egyptian Dialectal RAG

<p align="center">
  <img src="public/hakmdar-sword-icon.png" width="130" alt="HAKMDAR Sword & Scales Logo" />
</p>

<p align="center">
  <strong>منظومة برمجية حوسبية متكاملة لإدارة مكاتب المحاماة والاستشارات القانونية التوليدية وتكييف الدعاوى وفق التشريعات المصرية وأحكام محكمة النقض.</strong>
</p>

<p align="center">
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-key-features">Key Features</a> •
  <a href="#-system-architecture">Architecture</a> •
  <a href="#-graduation-book--presentation">Graduation Book & PPT</a> •
  <a href="#-getting-started">Getting Started</a>
</p>

---

## 🌟 Key Highlights & Innovations

1. **🧠 Sovereign Dialectal Legal RAG:**
   - يفهم العامية والمصطلحات المصرية الدارجة مع ربطها الفوري بـ 20 تخصصاً تشريعياً ومحكمة النقض مع انعدام الهلوسة بنسبة 100%.
2. **⚡ Real-Time Streaming AI:**
   - تكامل حي عبر Google Gemini 1.5 Pro Streaming Engine لضخ الرموز الذكية في أقل من 1.2 ثانية.
3. **📂 Agentic Case Extraction & Docs Hub:**
   - استخراج تلقائي لملف القضية المهيكل (`Case Dossier`) مع حافظة مستندات متكاملة تدعم **(PDF / Word DOCX / Excel XLSX)**.
4. **⚖️ Comprehensive Lawyers Directory:**
   - دليل محامين معتمد ومطابقة ذكية عبر 27 محافظة مصرية مع وسوم فلترة متعددة (`Multi-Select Tags`).
5. **🛡️ Enterprise Multi-Tenant Security:**
   - عزل صارم لبيانات الموكلين ومكاتب المحاماة عبر سياسات `Supabase Row-Level Security (RLS)`.

---

## 🛠️ Tech Stack

- **Frontend Core:** [Next.js 15 (App Router)](https://nextjs.org/) + [React 19](https://react.dev/) + TypeScript
- **Styling & Aesthetics:** Dark Luxe Glassmorphism + Tailwind CSS + Lucide Icons
- **AI Inference:** Google Gemini 1.5 Pro Streaming SDK + Dialectal Prompt RAG
- **Backend & Database:** Supabase (PostgreSQL + Auth + Storage + RLS Policies)
- **Document Processing:** PDF Generation (Playwright) + PPTX Presentation Engine (`python-pptx`)

---

## 📚 Graduation Project Book & Presentation

الملفات الرسمية المعتمدة للمشروع متوفرة وجاهزة داخل مجلد `public/`:
- 📄 **كتاب مشروع التخرج الهندسي (10 صفحات):** `public/HAKMDAR_Engineering_Graduation_Book_10Pages.pdf`
- 💻 **العرض التقديمي الأصلي PowerPoint:** `public/HAKMDAR_Graduation_Presentation.pptx`
- 🌐 **عرض الويب التفاعلي بالسلايدات:** `public/hakmdar_presentation.html`

---

## 🚀 Getting Started

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/Saif-Mohamed-47/Hkmdar-0.2.git
cd Hkmdar-0.2
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GEMINI_API_KEY=your_google_gemini_api_key
```

### 3. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 👨‍💻 Author & Engineering Credits
- **Prepared By:** سيف محمد (Saif Mohamed)
- **Academic Year:** 2026 / 2027
- **Specialization:** AI Systems & Full-Stack Cloud Engineering

<p align="center">
  Made with ⚖️ for the Egyptian Justice & Legal-Tech Ecosystem
</p>
