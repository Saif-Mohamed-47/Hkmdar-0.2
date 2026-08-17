import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createClientSchema } from '@/lib/validations/clients';
import { Client } from '@/types/database';

/**
 * GET /api/clients
 * Fetch clients belonging to the authenticated lawyer.
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = createServerClient(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً (Unauthorized)' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('clients')
      .select('*')
      .eq('lawyer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Client[], { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/clients
 * Create a new client for the authenticated lawyer.
 */
export async function POST(req: NextRequest) {
  try {
    const supabase = createServerClient(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً (Unauthorized)' },
        { status: 401 }
      );
    }

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: 'بيانات غير صالحة (Invalid JSON)' },
        { status: 400 }
      );
    }

    const parsed = createClientSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' },
        { status: 400 }
      );
    }

    // Always set lawyer_id from the authenticated user ID and ignore any lawyer_id in request body
    const newClientPayload = {
      lawyer_id: user.id,
      name: parsed.data.name,
      email: parsed.data.email || null,
      phone: parsed.data.phone || null,
      address: parsed.data.address || null,
    };

    const { data, error } = await supabase
      .from('clients')
      .insert(newClientPayload)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data as Client, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
