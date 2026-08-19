import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LEGAL_DATABASE } from '@/lib/data/legalData';
import { LegalCategory } from '@/lib/types';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = (searchParams.get('q') || '').trim().toLowerCase();
    const category = searchParams.get('category') as LegalCategory | 'all' | null;

    let results = MOCK_LEGAL_DATABASE;

    if (category && category !== 'all') {
      results = results.filter((item) => item.category === category);
    }

    if (query) {
      results = results.filter((item) => {
        return (
          item.title.toLowerCase().includes(query) ||
          item.code.toLowerCase().includes(query) ||
          item.articleNumber.toLowerCase().includes(query) ||
          item.text.toLowerCase().includes(query) ||
          item.keyTakeaway.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      });
    }

    return NextResponse.json({
      query,
      category: category || 'all',
      totalCount: results.length,
      results,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Search failed', details: error.message }, { status: 500 });
  }
}
