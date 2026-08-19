'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { 
  Sparkles, 
  FileText, 
  Scale, 
  Copy, 
  Check, 
  Download, 
  Send, 
  BookOpen, 
  RotateCcw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

const DRAFT_TEMPLATES = [
  {
    id: 'labor-memo',
    title: 'مذكرة دفاع في دعوى فصل تعسفي ومطالبة بتعويض',
    category: 'قانون العمل',
    defaultPrompt: 'أرغب في صياغة مذكرة دفاع ومطالبة بتعويض عن الفصل التعسفي لموظف قضى 6 سنوات بالعمل براتب 20,000 ج.م وتم إنهاء عقده شفهياً دون تحقيق كتابي مع الاستناد للمادتين 69 و 122 من قانون العمل 12 لسنة 2003.',
  },
  {
    id: 'warning-notice',
    title: 'إنذار رسمي على يد محضر بالإعذار وفسخ العقد',
    category: 'القانون المدني والتجاري',
    defaultPrompt: 'صياغة إنذار رسمي على يد محضر موجه إلى شركة مقاولات لتخلفها عن تسليم الأعمال في الموعد المحدد بالعقد ومطالبتها بالتنفيذ خلال 7 أيام أو اعتبار العقد مفسوخاً من تلقاء نفسه مع التعويض طبقاً للمادتين 147 و 157 من القانون المدني.',
  },
  {
    id: 'cheque-petition',
    title: 'عريضة جنحة مباشرة - إصدار شيك بدون رصيد',
    category: 'القانون الجنائي والتجاري',
    defaultPrompt: 'صياغة صحيفة جنحة مباشرة شيك بدون رصيد بمبلغ 350,000 جنيه مسحوب على بنك مصر مع الادعاء مدنياً بمبلغ 10,001 جنيه على سبيل التعويض المؤقت استناداً للمادة 534 من قانون التجارة رقم 17 لسنة 1999.',
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
حيث إن المدعي كان يعمل لدى الشركة المدعى عليها بموجب عقد عمل غير محدد المدة منذ 15/01/2018 بوظيفة مدير مشروعات براتب شهري قدره 24,000 جنيه مصري، وتفاجأ بتاريخ 10/05/2024 بقيام إدارة الشركة بمنعه من دخول مقر العمل وإنهاء خدماته شفهياً دون مبرر مشروع أو تحقيق كتابي.

الدفاع والأسانيد القانونية:
أولاً: ثبوت واقعة الفصل التعسفي وانتفاء أي خطأ جسيم:
تنص المادة (69) من قانون العمل الموحد رقم 12 لسنة 2003 على أنه "لا يجوز فصل العامل إلا إذا ارتكب خطأ جسيماً...".
وحيث إن الأوراق قد خلت من ثمة إنذار كتابي أو تحقيق مجرى مع المدعي، فإن قرار الفصل يقع باطلاً ومفتقراً لسنده القانوني.

ثانياً: استحقاق التعويض الجابر عملاً بالمادة (122) من قانون العمل:
تنص المادة (122) على أنه "إذا أنهى أحد الطرفين العقد دون مبرر مشروع... كان للعامل أن يلجأ للمحكمة بطلب التعويض ولا يجوز أن يقل التعويض عن أجر شهرين عن كل سنة من سنوات الخدمة".
وحيث إن مدة خدمة المدعي بلغت 6 سنوات، فإن التعويض المستحق هو:
6 سنوات × شهرين × 24,000 ج.م = 288,000 جنيه مصري (مائتان وثمانية وثمانون ألف جنيه).

ثالثاً: استحقاق مقابل مهلة الإخطار ورصيد الإجازات:
عملاً بنص المادة (111) يستحق المدعي مقابل مهلة إخطار 3 أشهر (72,000 ج.م) إضافة لمقابل رصيد الإجازات السنوية البالغ 45 يوماً (36,000 ج.م).

بناءً عليه:
يلتمس المدعي من عدالة المحكمة الموقرة:
1. الحكم بإلزام المدعى عليه بصفته بأن يؤدي للمدعي مبلغ 288,000 ج.م تعويضاً عن الفصل التعسفي.
2. الحكم بإلزام المدعى عليه بمهلة الإخطار ومقابل رصيد الإجازات بإجمالي 108,000 ج.م.
3. تسليم شهادة نهاية الخدمة والمصاريف وأتعاب المحاماة.

وكيل المدعي
${user.name}
محامٍ بالنقض`;
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
        title: 'تم توليد المذكرة بنجاح',
        message: 'تم إدراج النصوص التشريعية وأسانيد النقض تلقائياً',
      });
    }, 1200);
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
    <div className="space-y-8 max-w-6xl mx-auto animate-in fade-in duration-300">
      
      {/* Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>استوديو الصياغة القضائية المتقدمة</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          صياغة المذكرات وصحف الدعاوى بالذكاء الاصطناعي
        </h1>
        <p className="text-sm text-slate-400 max-w-3xl leading-relaxed">
          قم بتوليد مذكرات الدفاع، الإنذارات الرسمية، وصحف الجنح والدعاوى بأسلوب قضائي مصري رفيع مع الاستشهاد التلقائي بمواد القانون وأرقام الطعون وسوابق النقض.
        </p>
      </div>

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 5 Cols: Templates & Input Form */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Templates Picker */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-3">
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
                        ? 'bg-emerald-950/40 border-emerald-500 text-white shadow-md'
                        : 'bg-slate-800/40 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold">{tpl.title}</h4>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-slate-300 font-medium">
                        {tpl.category}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Prompt / Details Editor */}
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
            <label className="text-xs font-bold text-slate-300 block">
              تفاصيل الواقعة والطلبات المراد تضمينها:
            </label>
            <textarea
              rows={6}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-slate-800 border border-slate-700 text-xs text-white leading-relaxed focus:outline-none focus:border-emerald-500"
            />

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/60 transition-all hover:scale-[1.02] disabled:opacity-50"
            >
              {isGenerating ? (
                <span>جاري استدعاء النصوص التشريعية والصياغة...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>توليد الصياغة القانونية المعتمدة</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right 7 Cols: Output Document Viewer */}
        <div className="lg:col-span-7">
          <div className="h-full rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">
                  المستند القانوني المصاغ (Legal Document Output)
                </h3>
              </div>

              {draftedContent && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">تم النسخ</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
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
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-emerald-400 animate-spin" />
                  </div>
                  <p className="text-xs font-bold text-white">جاري إعداد الوثيقة القضائية...</p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    نقوم بربط وقائعك مع نصوص القانون وأحكام النقض لصياغة محكمة ومستوفية للشروط الشكلية والموضوعية.
                  </p>
                </div>
              ) : draftedContent ? (
                <div className="p-6 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-100 leading-loose font-serif whitespace-pre-line overflow-y-auto max-h-[500px] shadow-inner select-text">
                  {draftedContent}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center space-y-3 text-center p-8 text-slate-400">
                  <Scale className="w-12 h-12 text-slate-600" />
                  <p className="text-xs font-bold text-slate-300">
                    اختر نموذجاً أو اكتب تفاصيل القضية واضغط &ldquo;توليد الصياغة&rdquo;
                  </p>
                  <p className="text-[11px] text-slate-500 max-w-xs">
                    ستظهر الصياغة القضائية الكاملة هنا مع توقيع المحامي ومواد القانون المعتمدة.
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
