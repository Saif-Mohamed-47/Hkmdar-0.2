# HAKMDAR Database Schema & ERD (Supabase / PostgreSQL)

## ERD Overview

```
[auth.users] (Supabase Auth)
  └── 1:1 ──> [profiles] (Lawyer Info)
                ├── 1:N ──> [clients]
                │             └── 1:N ──> [cases]
                │                           ├── 1:N ──> [documents] (Supabase Storage links)
                │                           ├── 1:N ──> [time_entries]
                │                           └── 1:N ──> [invoices]
                │                                         └── 1:N ──> [invoice_items]
```
*(Note: `ai_chats` and `audit_logs` are deferred to Phase 2 and excluded from the MVP ERD.)*

---

## Tables & Fields

### 1. `profiles`
Stores profile information for all platform users (both Lawyers and Customers/Clients) linked 1:1 with Supabase Auth users.
- `id` (uuid, PK, references `auth.users.id` ON DELETE CASCADE)
- `role` (text, NOT NULL, CHECK role IN ('lawyer', 'client'), DEFAULT 'lawyer')
- `full_name` (text, NOT NULL)
- `phone_number` (text)
- `bar_association_number` (text, NULL for clients)
- `office_address` (text, NULL for clients)
- `avatar_url` (text)
- `created_at` (timestamptz, DEFAULT now())
- `updated_at` (timestamptz, DEFAULT now())

### 2. `clients`
Stores client details for the practitioner.
- `id` (uuid, PK, DEFAULT gen_random_uuid())
- `lawyer_id` (uuid, NOT NULL, references `profiles.id`)
- `name` (text, NOT NULL)
- `email` (text)
- `phone` (text)
- `address` (text)
- `created_at` (timestamptz, DEFAULT now())

### 3. `cases`
Stores legal matters/cases linked to a client.
- `id` (uuid, PK, DEFAULT gen_random_uuid())
- `client_id` (uuid, NOT NULL, references `clients.id` ON DELETE CASCADE)
- `lawyer_id` (uuid, NOT NULL, references `profiles.id`)
- `title` (text, NOT NULL)
- `case_number` (text)
- `court` (text)
- `status` (text, NOT NULL, CHECK status IN ('active', 'pending', 'closed'))
- `description` (text)
- `created_at` (timestamptz, DEFAULT now())

### 4. `documents`
Stores metadata for files uploaded to Supabase Storage and linked to a case.
- `id` (uuid, PK, DEFAULT gen_random_uuid())
- `case_id` (uuid, NOT NULL, references `cases.id` ON DELETE CASCADE)
- `lawyer_id` (uuid, NOT NULL, references `profiles.id`)
- `file_name` (text, NOT NULL)
- `file_path` (text, NOT NULL)
- `file_size` (integer, NOT NULL)
- `created_at` (timestamptz, DEFAULT now())

### 5. `time_entries`
Tracks billable hours against a case.
- `id` (uuid, PK, DEFAULT gen_random_uuid())
- `case_id` (uuid, NOT NULL, references `cases.id` ON DELETE CASCADE)
- `lawyer_id` (uuid, NOT NULL, references `profiles.id`)
- `description` (text, NOT NULL)
- `duration_minutes` (integer, NOT NULL)
- `hourly_rate` (decimal(10,2), NOT NULL)
- `date` (date, NOT NULL)
- `created_at` (timestamptz, DEFAULT now())

### 6. `invoices`
Stores summary invoice records for cases.
- `id` (uuid, PK, DEFAULT gen_random_uuid())
- `case_id` (uuid, NOT NULL, references `cases.id` ON DELETE CASCADE)
- `lawyer_id` (uuid, NOT NULL, references `profiles.id`)
- `total_amount` (decimal(10,2), NOT NULL)
- `status` (text, NOT NULL, CHECK status IN ('draft', 'sent', 'paid'))
- `created_at` (timestamptz, DEFAULT now())

### 7. `invoice_items`
Stores itemized breakdown lines for an invoice.
- `id` (uuid, PK, DEFAULT gen_random_uuid())
- `invoice_id` (uuid, NOT NULL, references `invoices.id` ON DELETE CASCADE)
- `case_id` (uuid, NOT NULL, references `cases.id` ON DELETE CASCADE)
- `description` (text, NOT NULL)
- `hours` (decimal(5,2), NOT NULL)
- `rate` (decimal(10,2), NOT NULL)
- `line_total` (decimal(10,2), NOT NULL)
- `created_at` (timestamptz, DEFAULT now())

---

## Row Level Security (RLS) Policies

All tables have RLS enabled. Since MVP is single-lawyer accounts (no multi-user firm sharing yet), access policies ensure that a user can only access rows where `lawyer_id = auth.uid()`.

1. **`profiles`**
   - SELECT, INSERT, UPDATE: `auth.uid() = id`
2. **`clients`**
   - ALL: `auth.uid() = lawyer_id`
3. **`cases`**
   - ALL: `auth.uid() = lawyer_id`
4. **`documents`**
   - ALL: `auth.uid() = lawyer_id`
5. **`time_entries`**
   - ALL: `auth.uid() = lawyer_id`
6. **`invoices`**
   - ALL: `auth.uid() = lawyer_id`
7. **`invoice_items`**
   - ALL: `auth.uid() IN (SELECT lawyer_id FROM invoices WHERE invoices.id = invoice_id)`
