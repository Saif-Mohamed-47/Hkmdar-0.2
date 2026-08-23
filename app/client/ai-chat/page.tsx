'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { ChatMessage, LegalCitation, CaseIntake } from '@/lib/types';
import {
  Send,
  User as UserIcon,
  FileText,
  Scale,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  CheckCircle2,
  Loader2,
  Building2
} from 'lucide-react';
import CaseSummaryModal from '@/components/client/CaseSummaryModal';
import LawyerMatchModal from '@/components/client/LawyerMatchModal';
import { useRouter } from 'next/navigation';

let chatMsgCounter = 0;
function createChatMessageId(prefix: string) {
  chatMsgCounter += 1;
  return `${prefix}-${chatMsgCounter}`;
}

const QUICK_PROMPTS = [
  'فصلني صاحب العمل بدون إنذار بعد 5 سنوات خدمة، ما هي تعويضاتي ومستحقاتي؟',
  'لدي شيك تجاري مرتجع لعدم كفاية الرصيد، ما الإجراءات القانونية ومواعيد السقوط؟',
  'الطرف الآخر أخل ببنود عقد التوريد، كيف أطالب بالفسخ والشرط الجزائي والتعويض؟',
  'أرغب في تأسيس شركة مع شريكين، ما أفضل شكل قانوني لحماية الذمة المالية؟',
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    sender: 'assistant',
    text: `مرحباً بك في **المستشار القانوني الرقمي لمنصة حكمدار**.

يمكنك طرح أي استفسار أو تفاصيل واقعة قانونية للحصول على:
1. التكييف والرأي القانوني المباشر طبقاً للقوانين واللوائح السارية.
2. التوثيق القضائي بنصوص المواد وأحكام وسوابق محكمة النقض.
3. استخلاص **ملخص تنفيذي لقضيتك (Case Brief)** لإرساله مباشرة بضغطة زر إلى مكتب المحامي المعتمد لتمثيلك.

تفضل بكتابة سؤالك أو اختر أحد الموضوعات الشائعة أدناه:`,
    timestamp: 'الآن',
    citations: [
      {
        id: 'cit-init-1',
        title: 'قانون العمل رقم 12 لسنة 2003',
        lawName: 'التشريع العمالي',
        court: 'المحاكم العمالية ومحكمة النقض',
        articleNumber: 'م 69 و 122',
        summary: 'حظر الفصل التعسفي وضوابط التعويض العادل ومقابل مهلة الإخطار.',
        category: 'labor',
      },
      {
        id: 'cit-init-2',
        title: 'قانون التجارة رقم 17 لسنة 1999',
        lawName: 'قانون التجارة والأوراق التجارية',
        court: 'محكمة النقض الجنائية',
        articleNumber: 'المادة 534',
        summary: 'تنظيم أحكام الشيكات والجرائم المترتبة على إصدار شيك بدون رصيد.',
        category: 'criminal',
      }
    ],
    caseBriefReady: false,
  }
];

export default function LegalAIChatPage() {
  const { user, addToast } = useApp();
  const router = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);

  // Modals state
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [isMatchModalOpen, setIsMatchModalOpen] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<Partial<CaseIntake> | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: createChatMessageId('user'),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.map((m) => ({ sender: m.sender, text: m.text })),
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();

      const assistantMessage: ChatMessage = {
        id: createChatMessageId('assistant'),
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
        citations: data.citations,
        caseBriefReady: data.caseBriefReady,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'خطأ في الاتصال',
        message: 'تعذر الاتصال بالمستشار القانوني، يرجى إعادة المحاولة.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateCaseBrief = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages,
          clientInfo: {
            name: user.name,
            email: user.email,
            phone: user.phone,
            location: user.location,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setGeneratedBrief(data.caseBrief);
        setIsSummaryModalOpen(true);
      }
    } catch (err) {
      console.error(err);
      addToast({
        type: 'error',
        title: 'حدث خطأ',
        message: 'تعذر استخراج ملخص القضية.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasUserMessages = messages.some((m) => m.sender === 'user');

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-3xl legal-card shadow-2xl overflow-hidden">

      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-[#080f20] flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#060a14] border border-[#c5a059]/40 p-1 flex items-center justify-center shadow-md overflow-hidden">
            <img src="/hakmdar-icon.png" alt="حِكِمْدار" className="w-full h-full object-contain" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-white">المستشار القانوني الرقمي</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#111c38] text-[#dfba73] border border-[#c5a059]/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                متصل بالنصوص التشريعية
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              مدعوم بقاعدة بيانات التشريعات وسوابق محكمة النقض
            </p>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-2">
          {hasUserMessages && (
            <button
              onClick={handleGenerateCaseBrief}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl btn-legal-gold text-xs font-bold shadow-md cursor-pointer"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">تحويل لملف قضية وإرسالها للمحامي</span>
              <span className="sm:hidden">إرسال للمحامي</span>
            </button>
          )}

          <button
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer border border-slate-800"
            title="بدء استشارة جديدة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[#060a14]">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center shadow-md ${
                  isUser
                    ? 'bg-[#111c38] border border-blue-500/30 text-blue-300'
                    : 'bg-[#111c38] border border-[#c5a059]/40 text-[#dfba73]'
                }`}
              >
                {isUser ? (
                  <UserIcon className="w-4 h-4" />
                ) : (
                  <Scale className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-3 max-w-2xl ${isUser ? 'text-left' : 'text-right'}`}>
                <div
                  className={`p-4 sm:p-5 rounded-2xl leading-relaxed text-sm shadow-md ${
                    isUser
                      ? 'bg-[#111c38] border border-blue-500/20 text-white rounded-tr-none'
                      : 'bg-[#0b1224] border border-slate-800 text-slate-100 rounded-tl-none'
                  }`}
                >
                  <div className="whitespace-pre-line leading-relaxed space-y-2 text-xs sm:text-sm">
                    {msg.text}
                  </div>

                  <span className="block text-[10px] mt-2 text-slate-400">
                    {msg.timestamp}
                  </span>
                </div>

                {/* Statutory Citations Cards */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-[#0b1224] border border-[#c5a059]/20 space-y-2 text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#dfba73]">
                      <BookOpen className="w-4 h-4" />
                      <span>الأسانيد والمراجع القانونية الموثقة:</span>
                    </div>

                    <div className="space-y-2">
                      {msg.citations.map((cit) => {
                        const isExpanded = expandedCitationId === cit.id;
                        return (
                          <div
                            key={cit.id}
                            className="p-3 rounded-xl bg-[#080e1c] border border-slate-800 hover:border-[#c5a059]/40 transition-all text-xs"
                          >
                            <div
                              onClick={() =>
                                setExpandedCitationId(isExpanded ? null : cit.id)
                              }
                              className="cursor-pointer flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 font-bold text-white truncate">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-[#111c38] text-[#dfba73] font-mono border border-[#c5a059]/20">
                                  {cit.articleNumber || 'مادة تشريعية'}
                                </span>
                                <span className="truncate">{cit.title}</span>
                              </div>
                              {isExpanded ? (
                                <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                              ) : (
                                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                              )}
                            </div>

                            <p className="text-slate-300 mt-1.5 leading-relaxed text-[11px]">
                              {cit.summary}
                            </p>

                            {isExpanded && (
                              <div className="mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                                <p><strong>الجهة القضائية / المرجع:</strong> {cit.court}</p>
                                <p><strong>القانون المطبق:</strong> {cit.lawName}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Case Brief Trigger Banner in assistant message */}
                {msg.caseBriefReady && (
                  <div className="p-4 rounded-2xl bg-[#0b1224] border border-[#c5a059]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="space-y-0.5 text-right">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-[#dfba73]" />
                        <span>تم تجهيز الملخص التنفيذي للقضية</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        يمكنك الآن إرسال ملف القضية والطلبات مباشرة إلى مكتب المحامي المعتمد.
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateCaseBrief}
                      className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-xl btn-legal-gold text-xs font-bold shadow-md cursor-pointer"
                    >
                      <FileText className="w-4 h-4" />
                      <span>إرسال القضية للمحامي</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}

        {/* Loading Bubble */}
        {isLoading && (
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-[#111c38] border border-[#c5a059]/40 text-[#dfba73] flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-[#0b1224] border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
              <Loader2 className="w-4 h-4 text-[#dfba73] animate-spin" />
              <span>جاري دراسة الواقعة واستخراج الأسانيد وأحكام النقض...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar (when only initial message) */}
      {messages.length <= 2 && (
        <div className="px-6 py-2.5 border-t border-slate-800 bg-[#080f20] flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-slate-400 shrink-0 font-medium">استفسارات شائعة:</span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] bg-[#0b1224] hover:bg-[#111c38] text-slate-300 hover:text-white px-3 py-1.5 rounded-xl border border-slate-800 whitespace-nowrap transition-colors cursor-pointer"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-[#080f20]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اكتب استشارتك أو تفاصيل الواقعة القانونية هنا..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-[#060a14] border border-slate-800 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-[#c5a059] transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3 rounded-xl btn-legal-gold text-xs font-bold disabled:opacity-40 flex items-center justify-center cursor-pointer shrink-0"
          >
            <Send className="w-4 h-4 rotate-180" />
          </button>
        </form>
      </div>

      {/* Case Summary Modal */}
      <CaseSummaryModal
        isOpen={isSummaryModalOpen}
        onClose={() => setIsSummaryModalOpen(false)}
        initialSummary={generatedBrief}
        onSuccessRedirect={() => router.push('/client/my-cases')}
      />

      {/* Lawyer Match Modal */}
      <LawyerMatchModal
        isOpen={isMatchModalOpen}
        onClose={() => setIsMatchModalOpen(false)}
      />

    </div>
  );
}
