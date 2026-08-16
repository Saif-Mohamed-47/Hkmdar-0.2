import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';

type Props = {
  params: Promise<{ id: string }>;
};

/**
 * GET /api/invoices/[id]
 * Fetch invoice details and line items.
 */
export async function GET(req: NextRequest, { params }: Props) {
  try {
    const { id } = await params;
    if (!id) {
      return NextResponse.json({ error: 'معرف الفاتورة مطلوب' }, { status: 400 });
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
      .from('invoices')
      .select('*, invoice_items(*), cases(*)')
      .eq('id', id)
      .eq('lawyer_id', user.id)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: error?.message || 'الفاتورة غير موجودة' },
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
