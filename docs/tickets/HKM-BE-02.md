# HKM-BE-02 — إنشاء وترحيل جداول قاعدة البيانات (Database Schema Migrations)

| الحقل | القيمة |
|---|---|
| **المعرف (Ticket ID)** | HKM-BE-02 |
| **النوع (Type)** | Feature / Infrastructure |
| **بند المرجعية (PRD / SRS)** | docs/erd.md |
| **الدور المسؤول (Role)** | `BE-DEV` (@mariem-sayed145) |
| **نقاط التقدير (Story Points)** | 3 |
| **الوقت المتوقع (Estimated Time)** | 4 ساعات |
| **الاعتماديات (Dependencies)** | لا يوجد |

---

## 1. الهدف والسياق (Description & Context)
إنشاء وترحيل مخطط قاعدة البيانات PostgreSQL على Supabase يشمل كافة الجداول المحددة في ملف ERD:
(`profiles`, `clients`, `cases`, `documents`, `time_entries`, `invoices`, `invoice_items`) مع العلاقات والمفاتيح الأجنبية والفهارس.

## 2. الملفات والمكونات المستهدفة (Target Components & Files)
- `supabase/migrations/20260816000001_initial_schema.sql`
- `types/database.types.ts`

## 3. معايير القبول الإلزامية (Acceptance Criteria - AC)
- [ ] إنشاء جميع الجداول السبعة مع الحقول المحددة في `docs/erd.md`.
- [ ] ضبط الـ Foreign Keys والـ Cascading Rules بدقة.
- [ ] توليد ملف أنواع TypeScript المحدث (`database.types.ts`).
- [ ] إضافة فهارس (Indexes) على الأعمدة الأكثر استخداماً (`user_id`, `client_id`, `case_id`).

## 4. متطلبات التفاعل والحالات / القيود (UX / Technical Invariants)
- **Default / Success:** ترحيل الـ SQL بنجاح محلياً وعلى Supabase Remote بدون أي خطأ.
- **Constraints:** استخدام `UUID` كمفاتيح أساسية واستخدام الـ Enum المناسب للحالات.

## 5. الاختبارات والفحوصات المطلوبة (Required Quality Checks)
- [ ] نجاح فحص الـ Typescript (`npm run type-check` أو `tsc --noEmit`).
- [ ] خلو ملفات الـ SQL من أي تعارضات في المفاتيح.

## 6. تعريف الإنجاز (Definition of Done - DoD)
- [ ] تم كتابة السكربت وتجريبه بنجاح.
- [ ] لا يوجد Dead Code.
- [ ] اجتياز مراجعة الـ PR.
