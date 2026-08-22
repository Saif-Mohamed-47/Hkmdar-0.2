import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase';
import { createTimeEntrySchema } from '@/lib/validations/time-entries';

/**
 * GET /api/time-entries
 * Return time entries belonging to the authenticated lawyer.
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
      .from('time_entries')
      .select('*, cases(*)')
      .eq('lawyer_id', user.id)
      .order('date', { ascending: false });

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
 * POST /api/time-entries
 * Log a new time entry for a case.
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

    const parsed = createTimeEntrySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || 'بيانات غير صالحة' },
        { status: 400 }
      );
    }

    // Set lawyer_id strictly from authenticated user ID
    const newTimeEntryPayload = {
      lawyer_id: user.id,
      case_id: parsed.data.case_id,
      description: parsed.data.description,
      duration_minutes: parsed.data.duration_minutes,
      hourly_rate: parsed.data.hourly_rate,
      date: parsed.data.date,
    };

    const { data, error } = await supabase
      .from('time_entries')
      .insert(newTimeEntryPayload)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
