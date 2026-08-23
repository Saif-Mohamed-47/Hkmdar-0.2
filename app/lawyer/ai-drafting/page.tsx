'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { 
  FileText, 
  Scale, 
  Copy, 
  Check, 
  Gavel, 
  RotateCcw,
  Sparkles,
  Printer,
  ChevronLeft,
  Loader2
} from 'lucide-react';

const DRAFT_TEMPLATES = [
  {
    id: 'labor-memo',
    title: 'مذكرة بدفاع المدعي في دعوى تعويض عن فصل تعسفي',
    category: 'قانون العمل',
    defaultPrompt: 'صياغة مذكرة بدفاع السيد / أحمد إبراهيم منصور في دعوى فصل تعسفي ضد شركة الشرق، للمطالبة بالتعويض الجابر عملاً بالمادتين 69 و 122 من قانون العمل 12 لسنة 2003 ومقابل مهلة الإخطار ورصيد الإجازات.',
  },
  {
    id: 'warning-notice',
    title: 'إنذار رسمي على يد محضر بالإعذار وفسخ العقد',
    category: 'القانون المدني والتجاري',
    defaultPrompt: 'صياغة إنذار رسمي على يد محضر موجه إلى شركة مقاولات لتخلفها عن تسليم الأعمال في الموعد المحدد بالعقد ومطالبتها بالتنفيذ خلال 7 أيام أو اعتبار العقد مفسوخاً من تلقاء نفسه مع التعويض طبقاً للمادتين 147 و 157 من القانون المدني.',
  },
  {
    id: 'cheque-petition',
    title: 'عريضة جنحة مباشرة - إصدار شيك بنكي بدون رصيد',
    category: 'القانون الجنائي والتجاري',
    defaultPrompt: 'صياغة عريضة جنحة مباشرة شيك بدون رصيد بمبلغ 350,000 جنيه مسحوب على بنك مصر مع الادعاء مدنياً بمبلغ 10,001 جنيه على سبيل التعويض المؤقت استناداً للمادة 534 من قانون التجارة رقم 17 لسنة 1999.',
  },
];

export default function LawyerAIDraftingPage() {
  const { user, addToast } = useApp();

  const [selectedTemplate, setSelectedTemplate] = useState(DRAFT_TEMPLATES[0]);
  const [prompt, setPrompt] = useState(DRAFT_TEMPLATES[0].defaultPrompt);
  const [isGenerating, setIsGenerating] = useState(false);
  const [draftedContent, setDraftedContent] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const handleSelectTemplate = (tpl: typeof DRAFT_TEMPLATES[0]) => {
    setSelectedTemplate(tpl);
    setPrompt(tpl.defaultPrompt);
  };

  const handleGenerate = () => {
    setIsGenerating(true);

    setTimeout(() => {
      let generated = '';

      if (selectedTemplate.id === 'labor-memo') {
        generated = `محكمة جنوب القاهرة الابتدائية
الدائرة (3) عمالي كلي
مذكرة بدفاع السيد / أحمد إبراهيم منصور (مدعٍ)
ضد
السيد / رئيس مجلس إدارة شركة الشرق للمقاولات (مدعى عليه)
في الدعوى رقم 4421 لسنة 2024 عمالي كلي، والمحدد لنظرها جلسة 17/08/2024

الوقائع:
حيث إن المدعي كان يعمل لدى الشركة المدعى عليها بموجب عقد عمل غير محدد المدة منذ 15/01/2018 بوظيفة مدير مشروعات براتب شهري قدره 24,000 جنيه مصري، وتفاجأ بتاريخ 10/05/2024 بقيام إدارة الشركة بمنعه من دخول مقر العمل وإنهاء خدماته شفهياً دون مبرر مشروع أو إجراء تحقيق كتابي.

الدفاع والأسانيد القانونية:
أولاً: ثبوت واقعة الفصل التعسفي وانتفاء أي مسوغ مشروع:
تنص المادة (69) من قانون العمل الموحد رقم 12 لسنة 2003 على أنه "لا يجوز فصل العامل إلا إذا ارتكب خطأ جسيماً...".
وحيث إن الأوراق قد خلت من ثمة إنذار كتابي أو تحقيق مجرى مع المدعي، فإن قرار إنهاء الخدمة يقع باطلاً ومفتقراً لسنده القانوني السليم.

ثانياً: استحقاق التعويض الجابر عملاً بالمادة (122) من قانون العمل:
تنص المادة (122) على أنه "إذا أنهى أحد الطرفين العقد دون مبرر مشروع... كان للعامل أن يلجأ للمحكمة بطلب التعويض ولا يجوز أن يقل التعويض عن أجر شهرين عن كل سنة من سنوات الخدمة".
وحيث إن مدة خدمة المدعي بلغت 6 سنوات كاملة، فإن التعويض القانوني المستحق هو:
6 سنوات × شهرين × 24,000 ج.م = 288,000 جنيه مصري (مائتان وثمانية وثمانون ألف جنيه).

ثالثاً: استحقاق مقابل مهلة الإخطار ورصيد الإجازات السنوية:
عملاً بنص المادة (111) يستحق المدعي مقابل مهلة إخطار 3 أشهر (72,000 ج.م) إضافة لمقابل رصيد الإجازات السنوية المستحقة (36,000 ج.م).

بناءً عليه:
يلتمس المدعي من عدالة المحكمة الموقرة:
1. الحكم بإلزام المدعى عليه بصفته بأن يؤدي للمدعي مبلغ 288,000 ج.م تعويضاً عن الفصل التعسفي.
2. الحكم بإلزام المدعى عليه بمهلة الإخطار ومقابل رصيد الإجازات بإجمالي 108,000 ج.م.
3. تسليم شهادة نهاية الخدمة والمصاريف ومقابل أتعاب المحاماة.

وكيل المدعي
المستشار / ${user.name}
محامٍ مقيد بالنقض`;
      } else if (selectedTemplate.id === 'warning-notice') {
        generated = `إنذار رسمي على يد محضر بالإعذار والمطالبة بالوفاء بالالتزامات التعاقدية
بناءً على طلب السيد / محمود عبد الرازق غنيم، ومحله المختار مكتب المستشار / ${user.name}.

أنا .......... محضر محكمة .......... الجزئية قد انتقلت وأعلنت:
السيد / الممثل القانوني لشركة التقنية المتطورة، ومقرها ..........

الموضوع:
بموجب عقد الاتفاق المبرم بين الطالب والمنذر إليه بتاريخ 10/11/2023 التزم المنذر إليه بتسليم المنظومة البرمجية في موعد غايته 15/02/2024، وحيث استلم المنذر إليه دفعة مقدمة قدرها 450,000 ج.م وتخلف عن التسليم حتى تاريخه رغم انقضاء الأجل بـ 120 يوماً.

وحيث تنص المادة 147 مدني على أن "العقد شريعة المتعاقدين"، وتنص المادة 157 مدني على أنه "في العقود الملزمة للجانبين إذا لم يوفِ أحد المتعاقدين بالتزامه جاز للمتعاقد الآخر بعد إعذاره أن يطالب بالفسخ والتعويض".

لذلك:
ينبه الطالب على المنذر إليه بضرورة إتمام التسليم خلال 7 أيام من تاريخ هذا الإنذار، وإلا اعتبر العقد مفسوخاً من تلقاء نفسه مع اتخاذ كافة الإجراءات القضائية للمطالبة برد المبالغ المقبوضة والشرط الجزائي والتعويض عن الخسائر وفوات الكسب.
ولأجل العلم،،،`;
      } else {
        generated = `صحيفة جنحة مباشرة شيك بدون رصيد
بناءً على طلب السيد / .......... المقيم في .......... ومحله المختار مكتب المستشار / ${user.name} المحامي بالنقض.

أنا .......... محضر محكمة .......... قد انتقلت وأعلنت:
السيد / .......... المقيم في .......... مخاطباً مع / ..........
والسيد الأستاذ / وكيل نيابة .......... الجزئية بصفته.

الموضوع:
أصدر المعلن إليه الأول لصالح الطالب شيكاً بنكياً برقم (..........) مسحوباً على بنك .......... بمبلغ وقدره (350,000 ج.م). وحين تقدم الطالب لصرف قيمة الشيك في موعد استحقاقه، أُرتد الشيك مع إفادة البنك المؤرخة في .......... بـ "عدم كفاية الرصيد".

وحيث إن المعلن إليه الأول قد ارتكب الجريمة المنصوص عليها بالمادة (534) من قانون التجارة رقم 17 لسنة 1999، والتي تعاقب بالحبس والغرامة كل من أصدر بسوء نية شيكاً لا يقابله رصيد قائم وقابل للسحب.

لذلك:
يلتمس الطالب توقيع أقصى عقوبة مقررة بالمادة 534 تجارة، وإلزام المتهم بأن يؤدي للطالب مبلغ 10,001 جنيه على سبيل التعويض المدني المؤقت والمصاريف والأتعاب.`;
      }

      setDraftedContent(generated);
      setIsGenerating(false);
      addToast({
        type: 'success',
        title: 'تم إعداد المذكرة القضائية',
        message: 'تم تضمين نصوص القانون والأسانيد القضائية بنجاح',
      });
    }, 900);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draftedContent);
    setCopied(true);
    addToast({
      type: 'success',
      title: 'تم النسخ',
      message: 'تم نسخ نص المذكرة القانونية إلى الحافظة',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111c38] border border-[#c5a059]/30 text-[#dfba73] text-xs font-semibold">
          <Gavel className="w-3.5 h-3.5" />
          <span>استوديو الصياغة القضائية المتقدمة</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          صياغة المذكرات وصحف الدعاوى القضائية
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-3xl leading-relaxed">
          توليد مذكرات الدفاع، الإنذارات الرسمية، وعرائض الدعاوى بأسلوب قضائي رصين مع الاستشهاد التلقائي بمواد التشريعات وأحكام محكمة النقض.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Templates & Input Form */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Templates Picker */}
          <div className="p-6 rounded-3xl legal-card space-y-3 shadow-lg">
            <label className="text-xs font-bold text-slate-300 block">
              نماذج الصياغة القانونية الجاهزة:
            </label>
            <div className="space-y-2">
              {DRAFT_TEMPLATES.map((tpl) => {
                const isSelected = selectedTemplate.id === tpl.id;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl)}
                    className={`p-3.5 rounded-2xl cursor-pointer border transition-all ${
                      isSelected
                        ? 'bg-[#111c38] border-[#c5a059]/60 text-white shadow-md'
                        : 'bg-[#080e1c] border-slate-800 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold">{tpl.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#060a14] text-[#dfba73] border border-[#c5a059]/20 font-medium">
                        {tpl.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prompt / Details Editor */}
          <div className="p-6 rounded-3xl legal-card space-y-4 shadow-lg">
            <label className="text-xs font-bold text-slate-300 block">
              تفاصيل الواقعة والطلبات القضائية المراد تضمينها:
            </label>
            <textarea
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-[#080e1c] border border-slate-800 text-xs text-white leading-relaxed focus:outline-none focus:border-[#c5a059]"
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl btn-legal-gold text-xs font-bold disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري استدعاء النصوص التشريعية والصياغة...</span>
                </>
              ) : (
                <>
                  <Gavel className="w-4 h-4" />
                  <span>إعداد الصياغة القضائية المعتمدة</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right 7 Cols: Output Document Viewer */}
        <div className="lg:col-span-7">
          <div className="h-full rounded-3xl legal-card shadow-xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#dfba73]" />
                <h3 className="text-sm font-bold text-white">
                  المستند القضائي المصاغ (Legal Document Output)
                </h3>
              </div>

              {draftedContent && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#111c38] hover:bg-[#1a2a4e] text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#dfba73]" />
                        <span>نسخ النص</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Content Area */}
            <div className="flex-1 min-h-[420px]">
              {isGenerating ? (
                <div className="h-full flex flex-col items-center justify-center space-y-3 text-center p-8">
                  <div className="w-12 h-12 rounded-2xl bg-[#111c38] border border-[#c5a059]/30 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-[#dfba73] animate-spin" />
                  </div>
                  <p className="text-xs font-bold text-white">جاري إعداد المذكرة القضائية...</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    استخراج النصوص القانونية وأحكام النقض لصياغة مستند مستوفٍ للشروط الشكلية والموضوعية.
                  </p>
                </div>
              ) : draftedContent ? (
                <div className="p-6 rounded-2xl bg-[#060a14] border border-slate-800 text-xs text-slate-100 leading-loose font-serif whitespace-pre-line overflow-y-auto max-h-[500px] shadow-inner select-text">
                  {draftedContent}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-3 text-center p-8 text-slate-400">
                  <Scale className="w-12 h-12 text-slate-700" />
                  <p className="text-xs font-bold text-slate-300">
                    اختر نموذجاً أو اكتب تفاصيل القضية واضغط &ldquo;إعداد الصياغة&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    ستظهر الصياغة القضائية الكاملة هنا مع توقيع المحامي والمواد القانونية المعتمدة.
                  </p>
                </div>
              )}
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
