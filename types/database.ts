export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Profile {
  id: string;
  full_name: string;
  bar_association_number: string | null;
  office_address: string | null;
  created_at: string;
}

export interface Client {
  id: string;
  lawyer_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
}

export interface Case {
  id: string;
  client_id: string;
  lawyer_id: string;
  title: string;
  case_number: string | null;
  court: string | null;
  status: 'active' | 'pending' | 'closed';
  description: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  case_id: string;
  lawyer_id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  created_at: string;
}

export interface TimeEntry {
  id: string;
  case_id: string;
  lawyer_id: string;
  description: string;
  duration_minutes: number;
  hourly_rate: number;
  date: string;
  created_at: string;
}

export interface Invoice {
  id: string;
  case_id: string;
  lawyer_id: string;
  total_amount: number;
  status: 'draft' | 'sent' | 'paid';
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  case_id: string;
  description: string;
  hours: number;
  rate: number;
  line_total: number;
  created_at: string;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
