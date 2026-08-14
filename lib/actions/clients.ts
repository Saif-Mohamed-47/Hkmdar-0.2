'use server';

import { createServerClient } from '@/lib/supabase';
import { Client, ActionResult } from '@/types/database';
import { createClientSchema, updateClientSchema, CreateClientInput, UpdateClientInput } from '@/lib/validations/clients';

/**
 * List all clients for the authenticated lawyer (governed by RLS).
 */
export async function getClients(): Promise<ActionResult<Client[]>> {
  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'يجب تسجيل الدخول أولاً (Unauthorized)' };
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Client[] };
  } catch (err: any) {
    return { success: false, error: err.message || 'حدث خطأ أثناء جلب قائمة الموكلين' };
  }
}

/**
 * Get client by ID with related cases.
 */
export async function getClientById(id: string): Promise<ActionResult<any>> {
  if (!id) {
    return { success: false, error: 'معرف الموكل مطلوب' };
  }

  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'يجب تسجيل الدخول أولاً (Unauthorized)' };
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*, cases(*)')
      .eq('id', id)
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message || 'حدث خطأ أثناء جلب بيانات الموكل' };
  }
}

/**
 * Create a new client record.
 */
export async function createClientAction(input: CreateClientInput): Promise<ActionResult<Client>> {
  const parsed = createClientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' };
  }

  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'يجب تسجيل الدخول أولاً (Unauthorized)' };
    }

    const { data, error } = await supabase
      .from('clients')
      .insert({
        lawyer_id: user.id,
        name: parsed.data.name,
        email: parsed.data.email || null,
        phone: parsed.data.phone || null,
        address: parsed.data.address || null,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Client };
  } catch (err: any) {
    return { success: false, error: err.message || 'حدث خطأ أثناء إضافة الموكل' };
  }
}

/**
 * Update client details.
 */
export async function updateClientAction(id: string, input: UpdateClientInput): Promise<ActionResult<Client>> {
  if (!id) {
    return { success: false, error: 'معرف الموكل مطلوب' };
  }

  const parsed = updateClientSchema.safeParse(input);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' };
  }

  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'يجب تسجيل الدخول أولاً (Unauthorized)' };
    }

    const { data, error } = await supabase
      .from('clients')
      .update(parsed.data)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, data: data as Client };
  } catch (err: any) {
    return { success: false, error: err.message || 'حدث خطأ أثناء تعديل بيانات الموكل' };
  }
}

/**
 * Delete a client record.
 */
export async function deleteClientAction(id: string): Promise<ActionResult<void>> {
  if (!id) {
    return { success: false, error: 'معرف الموكل مطلوب' };
  }

  try {
    const supabase = createServerClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'يجب تسجيل الدخول أولاً (Unauthorized)' };
    }

    const { error } = await supabase
      .from('clients')
      .delete()
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || 'حدث خطأ أثناء حذف الموكل' };
  }
}
