import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { updateCaseSchema } from '@/lib/validations/cases';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/cases/[id]
 * Fetch single case with associated client, documents, time_entries, and invoices.
 */
export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'معرف القضية مطلوب' }, { status: 400 });
    }

    const supabase = createServerClient(req);
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'يجب تسجيل الدخول أولاً (Unauthorized)' },
        { status: 401 }
      );
    }

    const { data, error } = await supabase
      .from('cases')
      .select('*, clients(*), documents(*), time_entries(*), invoices(*)')
      .eq('id', id)
      .eq('lawyer_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || 'القضية غير موجودة' },
        { status: 404 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/cases/[id]
 * Update case details or status.
 */
export async function PUT(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'معرف القضية مطلوب' }, { status: 400 });
    }

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

    const parsed = updateCaseSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' },
        { status: 400 }
      );
    }

    // Strip lawyer_id and client_id to prevent ownership/relationship manipulation
    const { lawyer_id: _, client_id: __, ...updateData } = parsed.data as any;

    const { data, error } = await supabase
      .from('cases')
      .update(updateData)
      .eq('id', id)
      .eq('lawyer_id', user.id)
      .select()
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || 'تعذر تعديل بيانات القضية' },
        { status: error?.code === 'PGRST116' ? 404 : 500 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
