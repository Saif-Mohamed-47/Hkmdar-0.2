import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createInvoiceSchema } from '@/lib/validations/invoices';

/**
 * GET /api/invoices
 * List invoices belonging to the authenticated lawyer.
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
      .from('invoices')
      .select('*, invoice_items(*), cases(*)')
      .eq('lawyer_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
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
 * POST /api/invoices
 * Generate an itemized invoice for a case using unbilled time entries.
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

    const parsed = createInvoiceSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' },
        { status: 400 }
      );
    }

    const { case_id, status } = parsed.data;

    // Verify case ownership for lawyer
    const { data: caseRecord, error: caseError } = await supabase
      .from('cases')
      .select('id')
      .eq('id', case_id)
      .eq('lawyer_id', user.id)
      .single();

    if (caseError || !caseRecord) {
      return NextResponse.json(
        { error: 'القضية غير موجودة أو غير مصرح بالوصول إليها' },
        { status: 404 }
      );
    }

    // Fetch all time entries for this case
    const { data: timeEntries, error: teError } = await supabase
      .from('time_entries')
      .select('*')
      .eq('case_id', case_id)
      .eq('lawyer_id', user.id);

    if (teError) {
      return NextResponse.json(
        { error: teError.message },
        { status: 500 }
      );
    }

    if (!timeEntries || timeEntries.length === 0) {
      return NextResponse.json(
        { error: 'لا توجد ساعات عمل غير مفوترة لهذا الملف' },
        { status: 400 }
      );
    }

    // Fetch existing invoice items for this case to filter out already billed entries
    const { data: existingItems, error: itemsError } = await supabase
      .from('invoice_items')
      .select('description, hours, rate')
      .eq('case_id', case_id);

    if (itemsError) {
      return NextResponse.json(
        { error: itemsError.message },
        { status: 500 }
      );
    }

    // Create frequency map of existing billed items
    const billedCounts = new Map<string, number>();
    (existingItems || []).forEach((item: any) => {
      const key = `${item.description}|${Number(item.hours)}|${Number(item.rate)}`;
      billedCounts.set(key, (billedCounts.get(key) || 0) + 1);
    });

    // Filter unbilled time entries
    const unbilledEntries: typeof timeEntries = [];
    for (const entry of timeEntries) {
      const hours = Number((entry.duration_minutes / 60).toFixed(2));
      const rate = Number(entry.hourly_rate);
      const key = `${entry.description}|${hours}|${rate}`;

      const billed = billedCounts.get(key) || 0;
      if (billed > 0) {
        billedCounts.set(key, billed - 1);
      } else {
        unbilledEntries.push(entry);
      }
    }

    if (unbilledEntries.length === 0) {
      return NextResponse.json(
        { error: 'لا توجد ساعات عمل غير مفوترة لهذا الملف' },
        { status: 400 }
      );
    }

    // Calculate line totals and grand total
    const itemPayloads = unbilledEntries.map((entry) => {
      const hours = Number((entry.duration_minutes / 60).toFixed(2));
      const rate = Number(entry.hourly_rate);
      const line_total = Number((hours * rate).toFixed(2));
      return {
        case_id: entry.case_id,
        description: entry.description,
        hours,
        rate,
        line_total,
      };
    });

    const totalAmount = Number(
      itemPayloads.reduce((sum, item) => sum + item.line_total, 0).toFixed(2)
    );

    // Create summary invoice record in 'invoices' table
    const { data: invoiceRecord, error: invError } = await supabase
      .from('invoices')
      .insert({
        case_id,
        lawyer_id: user.id,
        total_amount: totalAmount,
        status: status || 'draft',
      })
      .select()
      .single();

    if (invError || !invoiceRecord) {
      return NextResponse.json(
        { error: invError?.message || 'حدث خطأ أثناء إنشاء الفاتورة' },
        { status: 500 }
      );
    }

    // Create itemized breakdown in 'invoice_items' table
    const itemsToInsert = itemPayloads.map((item) => ({
      ...item,
      invoice_id: invoiceRecord.id,
    }));

    const { data: insertedInvoiceItems, error: insertItemsError } = await supabase
      .from('invoice_items')
      .insert(itemsToInsert)
      .select();

    if (insertItemsError) {
      return NextResponse.json(
        { error: insertItemsError.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        ...invoiceRecord,
        invoice: invoiceRecord,
        invoice_items: insertedInvoiceItems,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
