import { NextRequest, NextResponse } from 'next/server';
import { MOCK_LEGAL_CITATIONS, MOCK_LEGAL_DATABASE } from '@/lib/data/legalData';
import { LegalCitation } from '@/lib/types';

export async function POST(req: NextRequest) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    const queryLower = message.toLowerCase();

    // Check for Python backend proxy if configured
    const pythonBackendUrl = process.env.NEXT_PUBLIC_AI_BACKEND_URL;
    if (pythonBackendUrl) {
      try {
        const response = await fetch(`${pythonBackendUrl}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message, history }),
        });
        if (response.ok) {
          const data = await response.json();
          return NextResponse.json(data);
        }
      } catch (err) {
        console.warn('Python backend unavailable, falling back to built-in legal engine:', err);
      }
    }

    // Built-in Intelligent Legal Assistant Engine
    let replyText = '';
    let citations: LegalCitation[] = [];
    let caseBriefReady = false;

    if (queryLower.includes('فصل') || queryLower.includes('طرد') || queryLower.includes('عمل') || queryLower.includes('راتب') || queryLower.includes('استقالة') || queryLower.includes('شغل') || queryLower.includes('labor') || queryLower.includes('termination')) {
      replyText = `بناءً على نصوص **قانون العمل المصري الموحد رقم 12 لسنة 2003** والمستقر عليه في قضاء **محكمة النقض العمالية**:

1. **مشروعية إنهاء العقد**: لا يجوز لصاحب العمل فصل العامل إلا في حالات الخطأ الجسيم المنصوص عليها حصراً في **المادة (69)**، ويشترط إجراء تحقيق كتابي وإخطار العامل رسمياً.
2. **التعويض المستحق**: في حال ثبوت الفصل التعسفي دون مبرر مشروع، تقضي المحكمة العمالية استناداً للمادة **(122)** بتعويض لا يقل عن **أجر شهرين شاملين عن كل سنة من سنوات الخدمة**.
3. **المستحقات الإضافية**:
   - مقابل مهلة الإخطار (شهرين إلى 3 أشهر حسب مدة الخدمة - م 111).
   - المقابل النقدي لرصيد الإجازات السنوية المتبقية (م 71).
   - شهادة نهاية الخدمة وإخلاء الطرف.

💡 **الإجراء القانوني الموصى به**:
يجب تحرير محضر إثبات حالة بقسم الشرطة ومكتب العمل التابع له مقر العمل خلال **10 أيام** من تاريخ المنع من العمل لقطع مدة السقوط.

هل ترغب في أن أقوم بصياغة **ملخص تنفيذي لقضيتك** وتحويلها إلى أحد كبار المحامين المتخصصين في قضايا العمل لتمثيلك والمطالبة بتعويضاتك؟`;
      citations = MOCK_LEGAL_CITATIONS.labor_termination;
      caseBriefReady = true;
    } else if (queryLower.includes('شيك') || queryLower.includes('أمانة') || queryLower.includes('ايصال') || queryLower.includes('كمبيالة') || queryLower.includes('cheque') || queryLower.includes('debt')) {
      replyText = `وفقاً لأحكام **قانون التجارة المصري رقم 17 لسنة 1999** وتطبيقات **محكمة النقض الجنائية**:

1. **أركان الجريمة**: تنص **المادة (534)** على معاقبة كل من أصدر بسوء نية شيكاً لا يقابله رصيد قائم وقابل للسحب بالحبس والغرامة المالية.
2. **سقوط الدعوى وانقضاؤها**:
   - تسقط دعوى رجوع حامل الشيك بالتقادم بمضي **سنة واحدة** من تاريخ انقضاء ميعاد تقديم الشيك.
   - تنقضي الدعوى الجنائية بالصلح أو الوفاء بقيمة الشيك في أي مرحلة تكون عليها الدعوى وحتى بعد صدور حكم بات.
3. **الدفاع القانوني**: الدفع بمدنية الشيك أو ضمانته لا يعفي من المسؤولية الجنائية أمام القاضي الجنائي، إلا إذا ثبت تجريد الشيك من صفته كورقة دفع فورية أو وجود تزوير صلب/توقيع.

💼 **الخطوة التالية**: ننصح بتقديم طلب استصدار أمر أداء أو تحريك جنحة شيك مباشرة للمحافظة على مواعيد السقوط.`;
      citations = MOCK_LEGAL_CITATIONS.commercial_cheque;
      caseBriefReady = true;
    } else if (queryLower.includes('عقد') || queryLower.includes('شراكة') || queryLower.includes('فسخ') || queryLower.includes('تعويض') || queryLower.includes('شرط جزائي') || queryLower.includes('contract')) {
      replyText = `استناداً إلى نصوص **القانون المدني المصري** وأحكام محكمة النقض:

1. **القوة الملزمة للعقد**: تنص **المادة (147)** على أن "العقد شريعة المتعاقدين"، فلا يجوز نقضه أو تعديله إلا باتفاق الطرفين أو بمقتضى نص القانون.
2. **الفسخ مع التعويض**: تجيز **المادة (157)** للمتعاقد المضرور عند إخلال الطرف الآخر بالتزاماته، وبعد توجيه إنذار رسمي (إعذار)، المطالبة بفسخ العقد وإلزام المخل بالتعويض عن الخسارة وفوات الكسب.
3. **الشرط الجزائي**: صحيح ونافذ ما لم يثبت المدين أن الدائن لم يلحقه أي ضرر، أو أن تقدير التعويض كان مبالغاً فيه إلى درجة كبيرة (المادة 224).

📋 **التوصية**: نوصي بتوثيق محاضر الإخلال بالالتزامات وإرسال إنذار رسمي على يد محضر قبل اتخاذ إجراءات التقاضي أمام المحكمة الاقتصادية أو المدنية.`;
      citations = MOCK_LEGAL_CITATIONS.contract_breach;
      caseBriefReady = true;
    } else if (queryLower.includes('شركة') || queryLower.includes('تأسيس') || queryLower.includes('استثمار') || queryLower.includes('شريك') || queryLower.includes('corporate') || queryLower.includes('startup')) {
      replyText = `بموجب **قانون الشركات رقم 159 لسنة 1981** وقانون الاستثمار رقم 72 لسنة 2017:

1. **الكيانات الأكثر شيوعاً**:
   - **شركة الشخص الواحد (OPC)**: مسؤولية محددة برأس المال مع شخص واحد فقط.
   - **الشركة ذات المسؤولية المحدودة (LLC)**: مناسبة للمشاريع الناشئة والمتوسطة وتوفر حماية للذمة المالية للشركاء.
   - **شركة المساهمة (JSC)**: ممتازة للكيانات الكبرى وجولات التمويل الاستثماري.
2. **إجراءات التأسيس**: تتم رقمياً عبر الهيئة العامة للاستثمار والمناطق الحرة (GAFI) وتشمل استخراج السجل التجاري والبطاقة الضريبية والتسجيل بالغرفة التجارية.

✨ يمكننا ترشيح نخبة من المحامين المتخصصين في تأسيس الشركات وصياغة اتفاقيات الشركاء (SHA) لحماية حقوقك.`;
      citations = [
        {
          id: 'cit-corp',
          title: 'المادة 4 و 115 من قانون الشركات رقم 159 لسنة 1981',
          lawName: 'قانون الشركات المصري',
          court: 'المحاكم الاقتصادية وهيئة الاستثمار',
          articleNumber: 'م 4 & 115',
          summary: 'تنظيم مسؤولية الشركاء وإجراءات التأسيس والحوكمة.',
          category: 'corporate',
          relevanceScore: 94,
        }
      ];
      caseBriefReady = true;
    } else {
      replyText = `مرحباً بك في **المستشار القانوني الذكي لمنظومة حُكمدار**.

لقد قمت بتحليل استفسارك، وأنا جاهز لتقديم المشورة القانونية الدقيقة المدعومة بالنصوص التشريعية والسوابق القضائية في المجالات التالية:
- 🏛️ **قوانين العمل والعمال** (الفصل التعسفي، مكافأة نهاية الخدمة، عقود العمل).
- ⚖️ **القانون التجاري وجنح الشيكات** (الشيكات بدون رصيد، إيصالات الأمانة، الأوراق المالية).
- 📜 **القانون المدني والعقود** (فسخ العقود، التعويضات، الإخلال بالالتزامات، الشرط الجزائي).
- 🏢 **حوكمة وتأسيس الشركات** (المسؤولية المحدودة، اتفاقيات الشركاء، النزاعات الاستثمارية).
- 🏠 **النزاعات العقارية والإيجارات** (عقود الإيجار، دعاوى الطرد، صحة ونفاذ الملكية).
- 👨‍👩‍👧 **الأحوال الشخصية والأسرة** (الخلع، النفقات، قسمة التركات والمواريث).

تفضل بطرح تفاصيل موضوعك، وسأقوم بتحليله وتزويدك بالأسانيد القانونية وصياغة ملف قضية متكامل لإرساله لأفضل محامٍ مختص.`;
      citations = [
        MOCK_LEGAL_DATABASE[0],
        MOCK_LEGAL_DATABASE[2],
      ].map((item) => ({
        id: item.id,
        title: item.title,
        lawName: item.code,
        court: item.courtName,
        articleNumber: item.articleNumber,
        summary: item.keyTakeaway,
        category: item.category,
        relevanceScore: 90,
      }));
      caseBriefReady = false;
    }

    return NextResponse.json({
      reply: replyText,
      citations,
      caseBriefReady,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: 'Internal server error', details: error.message }, { status: 500 });
  }
}
