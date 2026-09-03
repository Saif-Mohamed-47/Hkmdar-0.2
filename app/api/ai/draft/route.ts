import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { docType, caseTitle, clientName, opponentName, facts, courtName } = await req.json().catch(() => ({}));

    if (!docType || !caseTitle || !facts) {
      return NextResponse.json({ error: 'البيانات الأساسية مطلوبة (نوع المذكرة، عنوان القضية، والوقائع)' }, { status: 400 });
    }

    const today = new Date().toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' });

    let templateTitle = 'مذكرة دفاع ودفوع قانونية';
    if (docType === 'appeal') templateTitle = 'صحيفة طعن بالنقض';
    if (docType === 'notice') templateTitle = 'إنذار رسمي على يد محضر';
    if (docType === 'lawsuit') templateTitle = 'صحيفة افتتاح دعوى قضائية';

    const documentContent = `
بناءً على طلب السيد / ${clientName || 'الموكل'}
المقيم في: جمهورية مصر العربية
ومحله المختار مكتب الأستاذ / محامي النقض والاستئناف

أنا ................. محضر محكمة ................. الجزئية قد انتقلت وأعلنت:
السيد / ${opponentName || 'المعلن إليه (الخصم)'}
المقيم في: .....................................................

الموضوع: ${templateTitle} في القضية المعنونة: "${caseTitle}"
أمام محكمة: ${courtName || 'محكمة شمال القاهرة الابتدائية'}
بتاريخ: ${today}

═══════════════════════════════════════════════
أولاً: الوقــائــع (Facts Summary)
═══════════════════════════════════════════════
${facts}

═══════════════════════════════════════════════
ثانياً: الأسانيد والدفوع القانونية (Legal Defenses & Grounds)
═══════════════════════════════════════════════
1. الدفع بأحقية الطالب استناداً لنصوص القانون المدني وقانون الإثبات رقم 25 لسنة 1968.
2. الثابت بالأوراق والمستندات صحة موقف الموكل وانتفاء أي تقصير أو إخلال بالالتزامات العقدية أو القانونية.
3. التمسك بالقواعد المستقرة لدى قضاء محكمة النقض المصرية بشأن عبء الإثبات وحماية المراكز القانونية المكتسبة.

═══════════════════════════════════════════════
ثالثاً: الطلبات الختامية (Relief Sought)
═══════════════════════════════════════════════
يلتمس الطالب من عدالة المحكمة الموقرة الحكم له بـ:
1. أصلياً: قبول الطلب / الدعوى شكلاً وفي الموضوع بإلزام المعلن إليه بالمطلوب كاملاً.
2. إلزام المعلن إليه بالمصاريف ومقابل أتعاب المحاماة بحكم مشمول بالنفاذ المعجل.

ولأجل العلم،،،
    `.trim();

    return NextResponse.json({
      title: templateTitle,
      content: documentContent,
      generatedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'خطأ أثناء صياغة المذكرة' }, { status: 500 });
  }
}
