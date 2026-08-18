export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'lawyer' | 'client'
export type CaseStatus = 'active' | 'pending' | 'closed'
export type InvoiceStatus = 'draft' | 'sent' | 'paid'

export type Database = {
  public: {
    Tables: {
      cases: {
        Row: {
          case_number: string | null
          client_id: string
          court: string | null
          created_at: string
          description: string | null
          id: string
          lawyer_id: string
          status: Database['public']['Enums']['case_status']
          title: string
        }
        Insert: {
          case_number?: string | null
          client_id: string
          court?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lawyer_id: string
          status?: Database['public']['Enums']['case_status']
          title: string
        }
        Update: {
          case_number?: string | null
          client_id?: string
          court?: string | null
          created_at?: string
          description?: string | null
          id?: string
          lawyer_id?: string
          status?: Database['public']['Enums']['case_status']
          title?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          address: string | null
          created_at: string
          email: string | null
          id: string
          lawyer_id: string
          name: string
          phone: string | null
        }
        Insert: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          lawyer_id: string
          name: string
          phone?: string | null
        }
        Update: {
          address?: string | null
          created_at?: string
          email?: string | null
          id?: string
          lawyer_id?: string
          name?: string
          phone?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          case_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number
          id: string
          lawyer_id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size: number
          id?: string
          lawyer_id: string
        }
        Update: {
          case_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number
          id?: string
          lawyer_id?: string
        }
        Relationships: []
      }
      invoice_items: {
        Row: {
          case_id: string
          created_at: string
          description: string
          hours: number
          id: string
          invoice_id: string
          line_total: number
          rate: number
        }
        Insert: {
          case_id: string
          created_at?: string
          description: string
          hours: number
          id?: string
          invoice_id: string
          line_total: number
          rate: number
        }
        Update: {
          case_id?: string
          created_at?: string
          description?: string
          hours?: number
          id?: string
          invoice_id?: string
          line_total?: number
          rate?: number
        }
        Relationships: []
      }
      invoices: {
        Row: {
          case_id: string
          created_at: string
          id: string
          lawyer_id: string
          status: Database['public']['Enums']['invoice_status']
          total_amount: number
        }
        Insert: {
          case_id: string
          created_at?: string
          id?: string
          lawyer_id: string
          status?: Database['public']['Enums']['invoice_status']
          total_amount: number
        }
        Update: {
          case_id?: string
          created_at?: string
          id?: string
          lawyer_id?: string
          status?: Database['public']['Enums']['invoice_status']
          total_amount?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bar_association_number: string | null
          created_at: string
          full_name: string
          id: string
          office_address: string | null
          phone_number: string | null
          role: Database['public']['Enums']['user_role']
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bar_association_number?: string | null
          created_at?: string
          full_name: string
          id: string
          office_address?: string | null
          phone_number?: string | null
          role?: Database['public']['Enums']['user_role']
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bar_association_number?: string | null
          created_at?: string
          full_name?: string
          id?: string
          office_address?: string | null
          phone_number?: string | null
          role?: Database['public']['Enums']['user_role']
          updated_at?: string
        }
        Relationships: []
      }
      time_entries: {
        Row: {
          case_id: string
          created_at: string
          date: string
          description: string
          duration_minutes: number
          hourly_rate: number
          id: string
          lawyer_id: string
        }
        Insert: {
          case_id: string
          created_at?: string
          date: string
          description: string
          duration_minutes: number
          hourly_rate: number
          id?: string
          lawyer_id: string
        }
        Update: {
          case_id?: string
          created_at?: string
          date?: string
          description?: string
          duration_minutes?: number
          hourly_rate?: number
          id?: string
          lawyer_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      case_status: CaseStatus
      invoice_status: InvoiceStatus
      user_role: UserRole
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
