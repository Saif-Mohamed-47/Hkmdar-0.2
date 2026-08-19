import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_CASES } from '@/lib/data/initialCases';

let memoryCases = [...INITIAL_CASES];

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lawyerId = searchParams.get('lawyerId');
  const clientId = searchParams.get('clientId');
  const status = searchParams.get('status');

  let results = memoryCases;

  if (lawyerId) {
    results = results.filter((c) => c.lawyerId === lawyerId);
  }
  if (clientId) {
    results = results.filter((c) => c.clientId === clientId);
  }
  if (status && status !== 'all') {
    results = results.filter((c) => c.status === status);
  }

  return NextResponse.json({
    cases: results,
    totalCount: results.length,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const newCase = {
      ...body,
      id: `case-intake-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryCases.unshift(newCase);

    return NextResponse.json({ success: true, case: newCase }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to create case', details: error.message }, { status: 500 });
  }
}
