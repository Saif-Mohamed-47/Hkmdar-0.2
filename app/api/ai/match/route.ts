import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LAWYERS } from '@/lib/data/lawyersData';
import { LegalCategory, LawyerMatchResult } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { category, location, caseDescription, budget } = await req.json();

    const cat = (category || 'labor') as LegalCategory;
    const locLower = (location || '').toLowerCase();
    const descLower = (caseDescription || '').toLowerCase();

    const scoredLawyers: LawyerMatchResult[] = MOCK_LAWYERS.map((lawyer) => {
      let score = 70; // baseline
      const matchReasons: string[] = [];

      // Specialty match
      if (lawyer.specialties.includes(cat)) {
        score += 20;
        matchReasons.push(`تخصص دقيق ومعتمد في ${cat === 'labor' ? 'قضايا العمل' : cat === 'criminal' ? 'القانون الجنائي' : cat === 'corporate' ? 'قضايا الشركات' : cat === 'family' ? 'الأحوال الشخصية' : 'القانون المدني'}`);
      }

      // Location match
      if (locLower && (lawyer.location.toLowerCase().includes(locLower) || locLower.includes('مصر') || locLower.includes('قاهرة'))) {
        score += 5;
        matchReasons.push(`نطاق الممارسة الجغرافية يغطي موقعك (${lawyer.location})`);
      }

      // Experience & Win rate bonus
      if (lawyer.winRate >= 94) {
        score += 5;
        matchReasons.push(`نسبة نجاح استثنائية بلغت ${lawyer.winRate}% في القضايا المماثلة`);
      }

      if (lawyer.experienceYears >= 15) {
        matchReasons.push(`خبرة قضائية تتجاوز ${lawyer.experienceYears} عاماً أمام محاكم الاستئناف والنقض`);
      }

      const costRange = lawyer.consultationFee <= 600 ? 'اقتصادي - مناسب للميزانية' : lawyer.consultationFee <= 800 ? 'متوسط - أتعاب قياسية' : 'متميز - كبار المستشارين';

      return {
        lawyer,
        matchScore: Math.min(score, 99),
        matchReasons,
        estimatedCostRange: `${lawyer.consultationFee} ج.م للاستشارة الأولى (${costRange})`,
      };
    });

    // Sort descending by score
    scoredLawyers.sort((a, b) => b.matchScore - a.matchScore);

    return NextResponse.json({
      matches: scoredLawyers.slice(0, 3),
      totalMatches: scoredLawyers.length,
      category: cat,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Matching failed', details: error.message }, { status: 500 });
  }
}
