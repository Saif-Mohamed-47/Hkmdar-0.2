import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LEGAL_CITATIONS } from '@/lib/data/legalData';
import { CaseIntake, LegalCategory } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { messages, clientInfo } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: 'Messages array is required' }, { status: 400 });
    }

    const allText = messages.map((m: any) => m.text).join(' ').toLowerCase();

    let detectedCategory: LegalCategory = 'labor';
    let title = 'طلب دعوى عمالية وتعويض عن إنهاء الخدمة';
    let urgency: CaseIntake['urgency'] = 'high';
    let executiveSummary = 'قام صاحب العمل بإنهاء علاقة العمل بصورة مفاجئة دون مسوغ قانوني أو تحقيق كتابي، مع حرمان الموظف من مستحقاته ومهلة الإخطار ورصيد الإجازات السنوية.';
    let legalClaims = [
      'المطالبة بالتعويض عن الفصل التعسفي بواقع أجر شهرين عن كل سنة خدمة وفقاً للمادة 122 من قانون العمل 12 لسنة 2003.',
      'صرف مقابل مهلة الإخطار القانونية ورصيد الإجازات المستحقة.',
      'إلزام جهة العمل بتسليم شهادة الخبرة وإخلاء الطرف ورد أصل مسوغات التعيين.'
    ];
    let relevantStatutes = MOCK_LEGAL_CITATIONS.labor_termination;
    let aiStrategicRecommendation = 'إيداع محضر رسمي بمكتب العمل وإثبات تاريخ الواقعة فوراً، ثم قيد الدعوى أمام الدائرة العمالية بالمحكمة الابتدائية مع طلب ندب خبير حسابي لتقدير المستحقات المالية.';

    if (allText.includes('شيك') || allText.includes('أمانة') || allText.includes('ايصال')) {
      detectedCategory = 'criminal';
      title = 'جنحة إصدار شيك بدون رصيد قائم وقابل للسحب';
      urgency = 'urgent';
      executiveSummary = 'إصدار شيك تجاري مسحوب على بنك معتمد ورفضه لعدم كفاية الرصيد، مع استحقاق حامل الشيك للوفاء بقيمة المبلغ والمطالبة بالتعويض المدني المؤقت.';
      legalClaims = [
        'معاقبة المتهم بموجب المادة 534 من قانون التجارة رقم 17 لسنة 1999.',
        'الادعاء مدنياً بمبلغ تعويض مؤقت قدره 10,001 جنيه لجبر الضرر المالي.',
        'طلب استصدار أمر منع من السفر أو اتخاذ إجراءات التنفيذ الوقتي.'
      ];
      relevantStatutes = MOCK_LEGAL_CITATIONS.commercial_cheque;
      aiStrategicRecommendation = 'تحريك الجنحة المباشرة أو تقديم بلاغ للنيابة العامة مع إرفاق أصل الشيك وإفادة البنك بالرفض قبل انقضاء مواعيد التقادم الصرفي.';
    } else if (allText.includes('عقد') || allText.includes('شراكة') || allText.includes('فسخ') || allText.includes('توريد')) {
      detectedCategory = 'commercial';
      title = 'نزاع إخلال بالتزامات عقد تجاري ومطالبة بالفسخ والتعويض';
      urgency = 'medium';
      executiveSummary = 'تخلف الطرف الثاني عن الوفاء بالتزاماته التعاقدية الجوهرية وتجاوز المواعيد المحددة بالتسليم رغم استلام الدفعات المالية المتفق عليها.';
      legalClaims = [
        'فسخ العقد سند الدعوى عملاً بالمادتين 147 و 157 من القانون المدني.',
        'إلزام المدعى عليه برد المبالغ المقبوضة مع فائدتها القانونية والتعويض الجابر للضرر وفوات الكسب.'
      ];
      relevantStatutes = MOCK_LEGAL_CITATIONS.contract_breach;
      aiStrategicRecommendation = 'توجيه إنذار رسمي بالإعذار على يد محضر لمنح مهلة 7 أيام ثم رفع الدعوى أمام المحكمة الاقتصادية.';
    }

    const generatedBrief: Partial<CaseIntake> = {
      title,
      category: detectedCategory,
      urgency,
      executiveSummary,
      legalClaims,
      relevantStatutes,
      clientTimeline: [
        { date: 'قبل 3 أشهر', event: 'نشوء العلاقة القانونية والاتفاق المبدئي' },
        { date: 'منذ شهر', event: 'حدوث واقعة النزاع / الإخلال بالالتزام' },
        { date: 'منذ أسبوع', event: 'استشارة المستشار القانوني الذكي في حُكمدار وتجميع الأسانيد' }
      ],
      aiStrategicRecommendation,
      feeEstimate: 'أتعاب استرشادية مقترحة: 8,000 - 15,000 ج.م حسب درجات التقاضي',
      clientName: clientInfo?.name || 'أحمد إبراهيم منصور',
      clientEmail: clientInfo?.email || 'ahmed.mansour@example.com',
      clientPhone: clientInfo?.phone || '+20 102 334 9988',
      clientLocation: clientInfo?.location || 'القاهرة - المعادي',
    };

    return NextResponse.json({
      success: true,
      caseBrief: generatedBrief,
    });
  } catch (error: any) {
    return NextResponse.json({ error: 'Summarization failed', details: error.message }, { status: 500 });
  }
}
