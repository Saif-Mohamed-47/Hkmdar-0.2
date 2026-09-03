import { NextRequest } from 'next/server';
import { LegalCitation } from '@/lib/types';
import { EGYPTIAN_COMPREHENSIVE_LEGAL_DATABASE, ComprehensiveLegalEntry } from '@/lib/data/legalData';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY || '';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// System prompt defining strict legal boundaries and Egyptian Law focus
const LEGAL_SYSTEM_PROMPT = `أنت "المستشار القانوني حِكِمْدار"، نظام ذكاء اصطناعي سيادي متخصص حصرياً في القوانين والتشريعات والدستور المصري وقضاء محكمة النقض والمحكمة الدستورية العليا والقضاء العسكري ومجلس الدولة.

أسلوبك في العمل والتحقيق القانوني:
1. الدقة والواقعية: استند دائماً إلى أرقام مواد القوانين المصرية ونصوصها الحرفية دون أي خطأ.
2. التفاعل الاستيضاحي: عندما يطرح الموكل واقعة تحتاج لتوضيح، سله عن التفاصيل المحورية قبل الحكم النهائي.
3. التوجيه الإجرائي: وضّح للمواطن الخطوات القضائية العملية (أين يتوجه، ما هي المستندات، وما هي المواعيد القانونية لسقوط الحق).
4. حارس النطاق (Guardrail): إذا كان السؤال خارج إطار القانون والتقاضي (طبخ، برمجة، رياضة)، ارفض الإجابة بلباقة وأكد تخصصك القانوني الحصري.`;

const NON_LEGAL_PATTERNS = [
  /طريقة عمل/i,
  /وصفة/i,
  /أكل/i,
  /طبخ/i,
  /كود برمجي/i,
  /برمجة/i,
  /javascript/i,
  /python/i,
  /كرة قدم/i,
  /مباراة/i,
  /أغنية/i,
  /شعر/i,
  /قصيدة/i,
  /نكتة/i,
  /طقس/i,
];

// Slang to legal keyword normalizer for Egyptian dialect
function normalizeEgyptianQuery(text: string): string {
  let normalized = text;
  const slangReplacements: Array<[RegExp, string]> = [
    [/طرد للغصب|غصب الشقة|اغتصب الشقة/gi, 'دعوى طرد للغصب واسترداد حيازة'],
    [/إيصال أمانة على بياض|وصل أمانة على بياض/gi, 'خيانة ائتمان طعن بالتزوير صلب وتوقيع إيصال أمانة'],
    [/تمكين من شقة الزوجية|مسكن الزوجية/gi, 'قرار تمكين مسكن حضانة وزوجية مناصفة'],
    [/شيك بدون رصيد|شيك راجع/gi, 'جنحة شيك بدون رصيد بنكي'],
    [/فصل تعسفي|طردوني من الشغل/gi, 'فصل تعسفي تعويض مهلة إخطار مستحقات عمالية'],
    [/عقد بيع ابتدائي|صحة توقيع/gi, 'دعوى صحة ونفاذ دعوى صحة توقيع شهر عقاري'],
    [/نفقة صغار|نفقة متعة|مؤخر/gi, 'دعوى نفقة زوجية وصغار ومؤخر صداق'],
    [/هكر|تهكير|تليفوني|فون|خد صور|ابتزاز|سرق صوري/gi, 'اختراق نظام معلوماتي سرقة صور ابتزاز الكتروني مباحث الانترنت قانون 175'],
  ];

  for (const [pattern, legalTerm] of slangReplacements) {
    normalized = normalized.replace(pattern, legalTerm);
  }
  return normalized;
}

// Semantic Matching and Scoring against the Egyptian Legal Encyclopedia
function findBestLegalMatch(queryText: string): ComprehensiveLegalEntry | null {
  const normalizedQuery = normalizeEgyptianQuery(queryText).toLowerCase();

  let bestMatch: ComprehensiveLegalEntry | null = null;
  let highestScore = 0;

  for (const entry of EGYPTIAN_COMPREHENSIVE_LEGAL_DATABASE) {
    let score = 0;

    // Check direct keyword matches in the current prompt
    for (const kw of entry.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += 15;
      }
    }

    if (normalizedQuery.includes(entry.category.toLowerCase())) score += 5;
    if (normalizedQuery.includes(entry.subCategory.toLowerCase())) score += 8;

    if (score > highestScore && score >= 15) {
      highestScore = score;
      bestMatch = entry;
    }
  }

  return bestMatch;
}

// Conversational Dynamic Legal Reasoning Engine
function processInteractiveLegalReasoning(message: string, history: Array<{ sender: string; text: string }>) {
  const query = message.trim();
  const lowerQuery = query.toLowerCase();

  // 1. Direct Knowledge Base Match based on CURRENT prompt only to avoid context bleed
  const matchedEntry = findBestLegalMatch(lowerQuery);

  if (matchedEntry) {
    const reply = `بناءً على نصوص **${matchedEntry.codeName}** وأحكام **${matchedEntry.court}** (${matchedEntry.articles}):

⚖️ **التكييف والرأي القانوني المستقر**:
${matchedEntry.legalAnalysis}

📋 **الخطوات والإجراءات الرسمية الموصى بها**:
${matchedEntry.proceduralSteps.map((step, idx) => `${idx + 1}. ${step}`).join('\n')}

💡 **السند التشريعي الموثق**:
${matchedEntry.title}

هل تود تحويل هذه المعطيات إلى **ملف قضية رسمي (Case Brief)** وإرساله لأحد المحامين المتخصصين المعتمدين في شبكة حِكِمْدار؟`;

    return {
      reply,
      citations: matchedEntry.citations,
      caseBriefReady: true,
    };
  }

  // 2. Specialized Legal Domain Handlers (e.g. Telecommunications, Military, Corporate etc.)
  if (lowerQuery.includes('اتصالات') || lowerQuery.includes('شبكة') || lowerQuery.includes('فودافون') || lowerQuery.includes('اورانج') || lowerQuery.includes('وي') || lowerQuery.includes('تردد')) {
    return {
      reply: `أهلاً بك، بصفتي **المستشار القانوني لمنصة حِكِمْدار**، إليك التكييف القانوني والإجراءات الرسمية لتأسيس وترخيص **شركة اتصالات أو خدمات شبكات في مصر**:

⚖️ **التكييف القانوني والإطار التشريعي**:
تخضع شركات الاتصالات حصرياً لأحكام **قانون تنظيم الاتصالات المصري رقم 10 لسنة 2003** تحت إشراف **الجهاز القومي لتنظيم الاتصالات (NTRA)** والهيئة العامة للاستثمار:

1. **الشكل القانوني الإلزامي للشركة**:
   - يجب أن تؤسس الشركة كـ **شركة مساهمة مصرية (JSC)** طبقاً لقانون الشركات رقم 159 لسنة 1981 وقانون الاستثمار رقم 72 لسنة 2017، وألا يقل رأس المال المصدر والمدفوع عن الحدود المقررة من مجلس إدارة الجهاز القومي لتنظيم الاتصالات.

2. **التراخيص والترددات السيادية (م 14 و 21 من القانون 10 لسنة 2003)**:
   - يحظر إنشاء أو تشغيل أي شبكات اتصالات أو تقديم خدمات الاتصالات للجمهور أو استخدام حيز الترددات اللاسلكية دون الحصول على **ترخيص مسبق وموافقة أمنية وسيادية** من الجهاز القومي لتنظيم الاتصالات.
   - رخص تشغيل شبكات المحمول تخضع لمزادات وحزم ترددية دولية وقرارات من مجلس الوزراء.

📋 **الخطوات والإجراءات الرسمية المطلوبة**:
1. تأسيس شركة مساهمة مصرية عبر الهيئة العامة للاستثمار والمناطق الحرة (GAFI).
2. التقدم للجهاز القومي لتنظيم الاتصالات (القرية الذكية) بطلب الحصول على ترخيص (تقديم خدمات اتصالات / قيمة مضافة / تشغيل شبكات).
3. استيفاء اشتراطات الأمن القومي وربط الشبكات والمواصفات القياسية للأجهزة والمحطات.
4. سداد رسوم الترخيص والتأمين وحصيلة النطاق الترددي المعتمد.

💡 **السند التشريعي الموثق**:
قانون تنظيم الاتصالات رقم 10 لسنة 2003 وقانون الشركات رقم 159 لسنة 1981.

هل تود إعداد ملف استشارة استثماري وتوجيهه لأحد مكاتب المحاماة المتخصصة في الشركات والاتصالات؟`,
      citations: [
        {
          id: 'cit-telecom-law-10',
          title: 'قانون تنظيم الاتصالات رقم 10 لسنة 2003',
          lawName: 'قانون تنظيم الاتصالات',
          court: 'المحاكم الاقتصادية ومجلس الدولة',
          articleNumber: 'المادتان 14 و 21',
          summary: 'شروط ترخيص شبكات وخدمات الاتصالات واختصاصات الجهاز القومي لتنظيم الاتصالات.',
          category: 'corporate',
          relevanceScore: 98,
        },
        {
          id: 'cit-investment-72',
          title: 'قانون الاستثمار رقم 72 لسنة 2017',
          lawName: 'قانون الاستثمار والشركات',
          court: 'المحاكم الاقتصادية',
          articleNumber: 'المادة 11 و 12',
          summary: 'حوافز وضوابط تأسيس الشركات المساهمة الكبرى في قطاعات التكنولوجيا والبنية التحتية.',
          category: 'corporate',
          relevanceScore: 92,
        }
      ],
      caseBriefReady: true,
    };
  }

  // 3. General Legal Analysis with context clarification
  return {
    reply: `أهلاً بك، بصفتي **المستشار القانوني لمنصة حِكِمْدار**، قمت بتحليل استشارتك: "${query}".

وفقاً للقواعد العامة في **التشريع المصري وقانون الإثبات في المواد المدنية والتجارية رقم 25 لسنة 1968**:

1. **المركز القانوني والتكييف الأولي**:
   الواقعة المعروضة تخضع لاختصاص المحاكم المصرية المختصة (مدنية، تجارية، أو إدارية بحسب طبيعة النزاع والخصوم).

2. **الاستيضاح المطلوب لتحديد المادة القانونية بدقة**:
   - ما هي صفتك المباشرة في النزاع (مدعي / متهم / متضرر / شريك / مستثمر)؟
   - هل توجد عقود، تراخيص رسمية، أو مستندات محررة بين أطراف الواقعة؟
   - ما هو المطلب القضائي أو الإجرائي المباشر الذي تسعى إليه؟

أخبرني بهذه التفاصيل وسأقوم فوراً بربط الواقعة برقم المادة الدقيقة في القانون المصري وسوابق محكمة النقض المنطبقة عليها.`,
    citations: [
      {
        id: 'cit-evidence-general',
        title: 'قانون الإثبات في المواد المدنية والتجارية رقم 25 لسنة 1968',
        lawName: 'قانون الإثبات المصري',
        court: 'محكمة النقض المصرية',
        articleNumber: 'المادة 1 والمادة 60',
        summary: 'قواعد توزيع عبء الإثبات وحجية المحررات الرسمية والعرفية أمام القضاء.',
        category: 'civil',
        relevanceScore: 90,
      }
    ],
    caseBriefReady: true,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { message, history, stream = false } = await req.json().catch(() => ({}));

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const trimmedMsg = message.trim();

    // 1. Guardrail: Reject non-legal queries strictly
    const isNonLegal = NON_LEGAL_PATTERNS.some((pattern) => pattern.test(trimmedMsg));
    if (isNonLegal) {
      const guardrailPayload = {
        reply: `⚖️ **تنبيه التخصص القانوني:**\n\nعذراً، أنا **المستشار القانوني حِكِمْدار**، نظام ذكاء اصطناعي سيادي متخصص ومقيد حصرياً للإجابة على **الاستفسارات القانونية، التشريعية، الدستورية، وإجراءات التقاضي في جمهورية مصر العربية**.\n\nيرجى طرح استفسار يتعلق بموضوع قانوني (مثل: قضايا العمل، العقود، الشركات، الشيكات، الإيجارات، أو قضايا المخدرات والجنايات).`,
        citations: [],
        caseBriefReady: false,
      };

      if (!stream) {
        return new Response(JSON.stringify(guardrailPayload), {
          headers: { 'Content-Type': 'application/json' },
        });
      }

      const encoder = new TextEncoder();
      const readable = new ReadableStream({
        start(controller) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: guardrailPayload.reply })}\n\n`));
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ citations: [], caseBriefReady: false, done: true })}\n\n`));
          controller.close();
        },
      });

      return new Response(readable, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // 2. Perform RAG Knowledge Retrieval to Ground the AI
    const internalResult = processInteractiveLegalReasoning(trimmedMsg, Array.isArray(history) ? history : []);
    const citations = internalResult.citations || [];

    // 3. If Gemini is available, use Google GenAI with Live Streaming & Egyptian Legal Persona
    if (genAI) {
      try {
        const ragContext = citations.length > 0
          ? `\n\n[السند التشريعي المرجعي المصري]:\n${citations.map((c) => `- ${c.title} (${c.court}): ${c.summary}`).join('\n')}`
          : '';

        const systemInstruction = `${LEGAL_SYSTEM_PROMPT}

توجيهات التنسيق والشخصية:
1. أنت المستشار القانوني حِكِمْدار، تتحدث بلهجة مصرية قانونية رصينة وفاخرة.
2. تجنب نهائياً استخدام علامات الشباك والعناوين الضخمة (# أو ## أو ###). استخدم العناوين الواضحة مع الترقيم والنقاط فقط.
3. نسق ردك دائماً بنقاط واضحة ومنظمة:
   1. التكييف القانوني
   2. الدفوع والإجراءات الرسمية العملية
   3. السند التشريعي الموثق
4. اختم دائماً بسؤال الموكل بلباقة عما إذا كان يرغب في إعداد ملف قضية وإحالته لمحامٍ معتمد.${ragContext}`;

        const model = genAI.getGenerativeModel({
          model: 'gemini-1.5-pro',
          systemInstruction,
        });

        const resultStream = await model.generateContentStream(trimmedMsg);

        const encoder = new TextEncoder();

        const readable = new ReadableStream({
          async start(controller) {
            try {
              for await (const chunk of resultStream.stream) {
                const text = chunk.text();
                if (text) {
                  controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text })}\n\n`));
                }
              }

              // Final completion event with structured metadata
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({
                    citations,
                    caseBriefReady: true,
                    done: true,
                  })}\n\n`
                )
              );
            } catch (streamErr) {
              console.error('Error during Gemini stream:', streamErr);
            } finally {
              controller.close();
            }
          },
        });

        return new Response(readable, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      } catch (geminiError: any) {
        console.warn('Gemini live stream failed, using internal legal reasoning engine fallback:', geminiError?.message || geminiError);
      }
    }

    // Fallback: Internal Legal Reasoning Engine
    if (!stream) {
      return new Response(JSON.stringify(internalResult), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const encoder = new TextEncoder();
    const words = internalResult.reply.split(' ');

    const readable = new ReadableStream({
      async start(controller) {
        for (let i = 0; i < words.length; i += 3) {
          const chunk = words.slice(i, i + 3).join(' ') + (i + 3 < words.length ? ' ' : '');
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
          await new Promise((resolve) => setTimeout(resolve, 20));
        }

        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              citations: internalResult.citations,
              caseBriefReady: internalResult.caseBriefReady,
              done: true,
            })}\n\n`
          )
        );
        controller.close();
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Legal AI Chat API Error:', error);
    return new Response(JSON.stringify({ error: 'حدث خطأ أثناء معالجة الاستشارة القانونية.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
