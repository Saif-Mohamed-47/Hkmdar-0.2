'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/lib/context/AppContext';
import { ChatMessage, LegalCitation, CaseIntake } from '@/lib/types';
import {
  Sparkles,
  Send,
  Bot,
  User as UserIcon,
  FileText,
  Scale,
  BookOpen,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Users
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
    text: `أهلاً بك! أنا **المستشار القانوني الذكي في حكمدار**.

أنا مدرب على نصوص القوانين المصرية والعربية وأحكام محكمة النقض والدستورية العليا.
يمكنك استشارتي في أي موضوع قانوني، وسأقوم بـ:
1. تزويدك بالرأي القانوني المباشر.
2. توثيق الاستشارة بمواد القانون وأرقام الطعون القضائية.
3. استخلاص **ملخص تنفيذي لقضيتك (AI Case Brief)** يمكنك إرساله مباشرة بضغطة زر إلى نخبة من المحامين المعتمدين لتمثيلك!

تفضل بطرح سؤالك أو اختر من المواضيع المقترحة بالأسفل:`,
    timestamp: 'الآن',
    citations: [
      {
        id: 'cit-init-1',
        title: 'قانون العمل المصري رقم 12 لسنة 2003',
        lawName: 'التشريع العمالي',
        court: 'المحاكم العمالية والنقض',
        articleNumber: 'م 69 و 122',
        summary: 'حظر الفصل التعسفي وضوابط التعويض العادل ومهلة الإخطار.',
        category: 'labor',
      },
      {
        id: 'cit-init-2',
        title: 'قانون التجارة رقم 17 لسنة 1999',
        lawName: 'قانون التجارة الجنائي',
        court: 'محكمة النقض الجنائية',
        articleNumber: 'المادة 534',
        summary: 'تنظيم أحكام الشيكات والجرائم المترتبة على انعدام الرصيد.',
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

      if (!response.ok) throw new Error('Failed to get AI response');

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
        message: 'تعذر الاتصال بالمستشار الذكي، يرجى المحاولة مرة أخرى',
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
        message: 'تعذر استخراج ملخص القضية',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const hasUserMessages = messages.some((m) => m.sender === 'user');

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] max-w-5xl mx-auto rounded-3xl bg-slate-900/80 border border-slate-800 shadow-2xl overflow-hidden">

      {/* Chat Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md flex items-center justify-between gap-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-amber-500 p-0.5 shadow-md shadow-emerald-950/40">
            <div className="w-full h-full bg-[#070D1E] rounded-[14px] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-emerald-400 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">المستشار القانوني الذكي</h2>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                متصل بالنصوص التشريعية
              </span>
            </div>
            <p className="text-xs text-slate-400">
              مدعوم بمحرك الذكاء الاصطناعي القانوني وسوابق محكمة النقض المصرية
            </p>
          </div>
        </div>

        {/* Action Buttons in Header */}
        <div className="flex items-center gap-2">
          {hasUserMessages && (
            <button
              onClick={handleGenerateCaseBrief}
              disabled={isLoading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold shadow-md shadow-emerald-950/40 transition-all hover:scale-105"
            >
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">تحويل لملف قضية وإرسالها للمحامي</span>
              <span className="sm:hidden">إرسال للمحامي</span>
            </button>
          )}

          <button
            onClick={() => setMessages(INITIAL_MESSAGES)}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="بدء محادثة جديدة"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-2xl shrink-0 flex items-center justify-center shadow-md ${isUser
                    ? 'bg-gradient-to-br from-indigo-600 to-blue-600 text-white'
                    : 'bg-gradient-to-br from-emerald-600 to-teal-700 text-white'
                  }`}
              >
                {isUser ? (
                  <UserIcon className="w-5 h-5" />
                ) : (
                  <Scale className="w-5 h-5" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`space-y-3 max-w-2xl ${isUser ? 'text-left' : 'text-right'}`}>
                <div
                  className={`p-4 sm:p-5 rounded-3xl leading-relaxed text-sm shadow-md ${isUser
                      ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-tr-none font-medium'
                      : 'bg-slate-800/80 border border-slate-700/60 text-slate-100 rounded-tl-none'
                    }`}
                >
                  <div className="whitespace-pre-line leading-relaxed space-y-2">
                    {msg.text}
                  </div>

                  <span className={`block text-[10px] mt-2 opacity-60 ${isUser ? 'text-indigo-100' : 'text-slate-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Statutory Citations Cards */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="p-3.5 rounded-2xl bg-slate-800/40 border border-emerald-500/20 space-y-2 text-right">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <BookOpen className="w-4 h-4" />
                      <span>الأسانيد والمراجع القانونية الموثقة:</span>
                    </div>

                    <div className="space-y-2">
                      {msg.citations.map((cit) => {
                        const isExpanded = expandedCitationId === cit.id;
                        return (
                          <div
                            key={cit.id}
                            className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 hover:border-emerald-500/40 transition-all text-xs"
                          >
                            <div
                              onClick={() =>
                                setExpandedCitationId(isExpanded ? null : cit.id)
                              }
                              className="cursor-pointer flex items-center justify-between gap-2"
                            >
                              <div className="flex items-center gap-2 font-bold text-white truncate">
                                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono">
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

                            <p className="text-slate-300 mt-1 leading-relaxed text-[11px]">
                              {cit.summary}
                            </p>

                            {isExpanded && (
                              <div className="mt-2 pt-2 border-t border-slate-700/60 text-[11px] text-slate-400 space-y-1">
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
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/70 border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-lg">
                    <div className="space-y-0.5 text-right">
                      <p className="text-xs font-bold text-white flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>تم تجهيز الملخص التنفيذي للقضية</span>
                      </p>
                      <p className="text-[11px] text-slate-400">
                        يمكنك الآن إرسال بيانات القضية ومطالباتك مباشرة إلى مكتب المحامي المعتمد.
                      </p>
                    </div>
                    <button
                      onClick={handleGenerateCaseBrief}
                      className="shrink-0 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all hover:scale-105"
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
            <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center">
              <Scale className="w-5 h-5 animate-pulse" />
            </div>
            <div className="p-4 rounded-3xl rounded-tl-none bg-slate-800/80 border border-slate-700/60 flex items-center gap-2 text-xs text-slate-300">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>جاري تحليل الواقعة واستخراج النصوص القانونية وأحكام النقض...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts Bar (when only initial message) */}
      {messages.length <= 2 && (
        <div className="px-6 py-2 border-t border-slate-800/60 bg-slate-900/40 flex items-center gap-2 overflow-x-auto">
          <span className="text-[11px] text-slate-400 shrink-0">أسئلة شائعة:</span>
          {QUICK_PROMPTS.map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-3 py-1.5 rounded-full border border-slate-700 whitespace-nowrap transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      )}

      {/* Input Box */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90 backdrop-blur-md">
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
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-800/90 border border-slate-700 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={!inputText.trim() || isLoading}
            className="px-5 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold shadow-lg shadow-emerald-950/50 transition-all hover:scale-105 disabled:opacity-40 disabled:hover:scale-100 flex items-center justify-center"
          >
            <Send className="w-5 h-5 rotate-180" />
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
