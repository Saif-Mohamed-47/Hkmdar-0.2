import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LAWYERS } from '@/lib/data/lawyersData';
import { LegalCategory } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const specialty = searchParams.get('specialty') as LegalCategory | 'all' | null;
    const location = (searchParams.get('location') || '').trim().toLowerCase();
    const query = (searchParams.get('q') || '').trim().toLowerCase();

    let filtered = MOCK_LAWYERS;

    if (specialty && specialty !== 'all') {
      filtered = filtered.filter((l) => l.specialties.includes(specialty));
    }

    if (location) {
      filtered = filtered.filter((l) => l.location.toLowerCase().includes(location));
    }

    if (query) {
      filtered = filtered.filter(
        (l) =>
          l.name.toLowerCase().includes(query) ||
          l.title.toLowerCase().includes(query) ||
          l.bio.toLowerCase().includes(query) ||
          l.location.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({
      lawyers: filtered,
      totalCount: filtered.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch lawyers', details: error.message }, { status: 500 });
  }
}
