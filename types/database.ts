import type { Database, UserRole, CaseStatus, InvoiceStatus } from './database.types';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type { UserRole, CaseStatus, InvoiceStatus, Database };

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Client = Database['public']['Tables']['clients']['Row'];
export type Case = Database['public']['Tables']['cases']['Row'];
export type Document = Database['public']['Tables']['documents']['Row'];
export type TimeEntry = Database['public']['Tables']['time_entries']['Row'];
export type Invoice = Database['public']['Tables']['invoices']['Row'];
export type InvoiceItem = Database['public']['Tables']['invoice_items']['Row'];

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
