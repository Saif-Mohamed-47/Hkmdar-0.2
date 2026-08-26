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
  Pencil,
  Undo2,
  Check,
  X,
  Loader2,
  History,
  Plus,
  Trash2,
  MessageSquare,
} from 'lucide-react';
import CaseSummaryModal from '@/components/client/CaseSummaryModal';
import LawyerMatchModal from '@/components/client/LawyerMatchModal';
import { useRouter } from 'next/navigation';

export interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
}

function createChatMessageId(prefix: string) {
  const rand = Math.random().toString(36).substring(2, 9);
  const time = Date.now();
  return `${prefix}-${time}-${rand}`;
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
    text: `مرحباً بك في المستشار القانوني الرقمي لمنصة حكمدار.

يمكنك طرح أي استفسار أو تفاصيل واقعة قانونية للحصول على:
1. التكييف والرأي القانوني المباشر طبقاً للقوانين واللوائح السارية.
2. التوثيق القضائي بنصوص المواد وأحكام وسوابق محكمة النقض.
3. استخلاص ملخص تنفيذي لقضيتك (Case Brief) لإرساله مباشرة بضغطة زر إلى مكتب المحامي المعتمد لتمثيلك.

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
  const storageKey = `hakmdar_chat_sessions_${user?.id || user?.email || 'default'}`;

  // User-isolated storage key
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(`hakmdar_chat_sessions_${user?.id || user?.email || 'default'}`);
        if (saved) {
          const parsed: ChatSession[] = JSON.parse(saved);
          if (parsed.length > 0) return parsed;
        }
      } catch {}
    }
    return [
      {
        id: 'session-default',
        title: 'استشارة قانونية جديدة',
        updatedAt: new Date().toLocaleDateString('ar-EG'),
        messages: INITIAL_MESSAGES,
      },
    ];
  });

  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'session-default';
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    return sessions[0]?.messages || INITIAL_MESSAGES;
  });

  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedCitationId, setExpandedCitationId] = useState<string | null>(null);

  // Edit message in place state
  const [editingMsgId, setEditingMsgId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Modals state
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [, setIsMatchModalOpen] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<Partial<CaseIntake> | undefined>(undefined);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync session state when switching users
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        if (parsed.length > 0) {
          setSessions(parsed);
          setCurrentSessionId(parsed[0].id);
          setMessages(parsed[0].messages);
        }
      }
    } catch {}
  }, [storageKey]);

  // Persist sessions to user-isolated localStorage
  const saveSessions = (updated: ChatSession[]) => {
    setSessions(updated);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updated));
    } catch {}
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const updateCurrentSessionMessages = (newMessages: ChatMessage[], targetSessionId?: string) => {
    const sId = targetSessionId || currentSessionId;
    setMessages(newMessages);

    // Auto-generate title from first user message if title is default
    let sessionTitle = 'استشارة قانونية جديدة';
    const firstUserMsg = newMessages.find((m) => m.sender === 'user');
    if (firstUserMsg) {
      sessionTitle = firstUserMsg.text.slice(0, 32) + (firstUserMsg.text.length > 32 ? '...' : '');
    }

    setSessions((prevSessions) => {
      const updated = prevSessions.map((s) => {
        if (s.id === sId) {
          return {
            ...s,
            title: s.title === 'استشارة قانونية جديدة' || s.title === 'استشارة قانونية' ? sessionTitle : s.title,
            updatedAt: new Date().toLocaleDateString('ar-EG'),
            messages: newMessages,
          };
        }
        return s;
      });

      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}

      return updated;
    });
  };

  const handleCreateNewChat = () => {
    const newId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: 'استشارة قانونية جديدة',
      updatedAt: new Date().toLocaleDateString('ar-EG'),
      messages: INITIAL_MESSAGES,
    };

    setSessions((prev) => {
      const updated = [newSession, ...prev];
      try {
        localStorage.setItem(storageKey, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    setCurrentSessionId(newId);
    setMessages(INITIAL_MESSAGES);
    setEditingMsgId(null);
    setInputText('');
    setIsSidebarOpen(false);

    addToast({
      type: 'info',
      title: 'جلسة استشارة جديدة',
      message: 'تم فتح استشارة قانونية نظيفة تماماً.',
    });
  };

  const handleSelectSession = (sessionId: string) => {
    const target = sessions.find((s) => s.id === sessionId);
    if (target) {
      setCurrentSessionId(target.id);
      setMessages(target.messages);
      setEditingMsgId(null);
      setIsSidebarOpen(false);
    }
  };

  const handleDeleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    const filtered = sessions.filter((s) => s.id !== sessionId);

    if (filtered.length === 0) {
      const freshId = `session-${Date.now()}`;
      const freshSession: ChatSession = {
        id: freshId,
        title: 'استشارة قانونية جديدة',
        updatedAt: new Date().toLocaleDateString('ar-EG'),
        messages: INITIAL_MESSAGES,
      };
      saveSessions([freshSession]);
      setCurrentSessionId(freshId);
      setMessages(INITIAL_MESSAGES);
    } else {
      saveSessions(filtered);
      if (currentSessionId === sessionId) {
        setCurrentSessionId(filtered[0].id);
        setMessages(filtered[0].messages);
      }
    }

    addToast({
      type: 'info',
      title: 'تم حذف المحادثة',
      message: 'تم حذف الجلسة من سجلك بنجاح.',
    });
  };

  const sendQuery = async (userMsgText: string, currentHistory: ChatMessage[]) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsgText,
          history: currentHistory.map((m) => ({ sender: m.sender, text: m.text })),
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

      const finalMessages = [...currentHistory, {
        id: createChatMessageId('user'),
        sender: 'user' as const,
        text: userMsgText,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
      }, assistantMessage];

      updateCurrentSessionMessages(finalMessages);
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

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text || isLoading) return;

    const userMessage: ChatMessage = {
      id: createChatMessageId('user'),
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMessage];
    updateCurrentSessionMessages(newHistory);
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

      updateCurrentSessionMessages([...newHistory, assistantMessage]);
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

  // Undo changes up to a specific point
  const handleUndoUpToPoint = (messageIndex: number) => {
    const truncatedHistory = messages.slice(0, messageIndex + 1);
    updateCurrentSessionMessages(truncatedHistory);
    setEditingMsgId(null);
    addToast({
      type: 'info',
      title: 'تم التراجع عن الردود اللاحقة',
      message: 'تمت استعادة المحادثة حتى هذه النقطة بنجاح.',
    });
  };

  // Save edited message and re-run analysis from that point onwards
  const handleSaveEditMessage = async (messageIndex: number) => {
    if (!editingText.trim() || isLoading) return;

    const editedMsg: ChatMessage = {
      ...messages[messageIndex],
      text: editingText.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }) + ' (معدل)',
    };

    const historyBefore = messages.slice(0, messageIndex);
    const newHistoryWithEdited = [...historyBefore, editedMsg];

    updateCurrentSessionMessages(newHistoryWithEdited);
    setEditingMsgId(null);
    setEditingText('');

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: editedMsg.text,
          history: historyBefore.map((m) => ({ sender: m.sender, text: m.text })),
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

      updateCurrentSessionMessages([...newHistoryWithEdited, assistantMessage]);
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

  const handleStartEdit = (msg: ChatMessage) => {
    setEditingMsgId(msg.id);
    setEditingText(msg.text);
  };

  const handleCancelEdit = () => {
    setEditingMsgId(null);
    setEditingText('');
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
    <div className="flex h-[calc(100vh-8.5rem)] max-w-6xl mx-auto rounded-3xl legal-card shadow-2xl overflow-hidden relative border border-[var(--border-subtle)]">

      {/* SESSIONS HISTORY SIDEBAR */}
      <aside
        className={`absolute inset-y-0 right-0 z-30 w-72 bg-[#060a14] border-l border-slate-800 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <History className="w-4 h-4 text-[#dfba73]" />
            <span>سجل الاستشارات (History)</span>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* New Consultation Button */}
        <div className="p-3">
          <button
            onClick={handleCreateNewChat}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl btn-legal-gold text-xs font-bold shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>استشارة جديدة</span>
          </button>
        </div>

        {/* Sessions List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {sessions.map((sess) => {
            const isActive = sess.id === currentSessionId;
            return (
              <div
                key={sess.id}
                onClick={() => handleSelectSession(sess.id)}
                className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all text-xs ${
                  isActive
                    ? 'bg-[#111c38] text-white border border-[#c5a059]/40 shadow-sm'
                    : 'text-slate-300 hover:bg-[#0b1224] hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#dfba73]' : 'text-slate-500'}`} />
                  <div className="truncate text-right">
                    <p className="truncate font-semibold">{sess.title}</p>
                    <span className="text-[10px] text-slate-500">{sess.updatedAt}</span>
                  </div>
                </div>

                <button
                  onClick={(e) => handleDeleteSession(e, sess.id)}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-all shrink-0"
                  title="حذف هذه المحادثة"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* User Account Isolation Badge */}
        <div className="p-3 border-t border-slate-800/80 bg-[#080e1c] text-[11px] text-slate-400 flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-[#111c38] border border-[#c5a059]/30 flex items-center justify-center text-[10px] font-bold text-[#dfba73]">
            {user.name ? user.name.slice(0, 1) : 'ح'}
          </div>
          <span className="truncate">{user.name || user.email} (خاص)</span>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-xs"
        />
      )}

      {/* MAIN CHAT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[var(--bg-primary)]">
        
        {/* Chat Header */}
        <div className="px-5 py-3.5 border-b border-slate-800 bg-[#080f20] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-xl text-slate-300 hover:text-white bg-[#0b1224] border border-slate-800 hover:border-[#c5a059]/40 transition-colors cursor-pointer"
              title="فتح سجل الاستشارات"
            >
              <History className="w-4 h-4 text-[#dfba73]" />
            </button>

            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#060a14] border border-[#c5a059]/40 p-1 flex items-center justify-center shadow-md">
                <img src="/hakmdar-icon.png" alt="حِكِمْدار" className="w-full h-full object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs sm:text-sm font-bold text-white">المستشار القانوني الرقمي</h2>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#111c38] text-[#dfba73] border border-[#c5a059]/20 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#c5a059]" />
                    متصل بالنصوص التشريعية
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons in Header */}
          <div className="flex items-center gap-2">
            {hasUserMessages && (
              <button
                onClick={handleGenerateCaseBrief}
                disabled={isLoading}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl btn-legal-gold text-xs font-bold shadow-md cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span className="hidden sm:inline">تحويل لملف قضية وإرسالها للمحامي</span>
                <span className="sm:hidden">إرسال للمحامي</span>
              </button>
            )}
          </div>
        </div>

        {/* Messages Scroll View */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-[var(--bg-primary)]">
          {messages.map((msg, index) => {
            const isUser = msg.sender === 'user';
            const isEditing = editingMsgId === msg.id;

            return (
              <div
                key={msg.id ? `${msg.id}-${index}` : `msg-${index}`}
                className={`flex items-start gap-3.5 group ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
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

                {/* Message Bubble & Control Buttons */}
                <div className={`space-y-2 max-w-2xl ${isUser ? 'text-left' : 'text-right'}`}>
                  
                  {/* User Message Bubble with In-Place Edit Mode */}
                  {isUser && isEditing ? (
                    <div className="p-3.5 rounded-2xl bg-[#111c38] border border-[#c5a059]/50 shadow-lg space-y-2 text-right">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={3}
                        className="w-full p-2 rounded-xl bg-[#060a14] border border-slate-700 text-xs sm:text-sm text-white focus:outline-none focus:border-[#c5a059] resize-none"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={handleCancelEdit}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                          <span>إلغاء</span>
                        </button>
                        <button
                          onClick={() => handleSaveEditMessage(index)}
                          disabled={!editingText.trim()}
                          className="px-3 py-1 rounded-lg bg-[#c5a059] hover:bg-[#dfba73] text-[#060a14] font-bold text-xs flex items-center gap-1 cursor-pointer disabled:opacity-40"
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>حفظ وإعادة التحليل</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`p-4 sm:p-5 rounded-2xl leading-relaxed text-sm shadow-md relative ${
                        isUser
                          ? 'bg-[#111c38] border border-blue-500/20 text-white rounded-tr-none'
                          : 'bg-[#0b1224] border border-slate-800 text-slate-100 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-line leading-relaxed space-y-2 text-xs sm:text-sm">
                        {msg.text.split('\n').map((paragraph, pIdx) => {
                          const parts = paragraph.split(/(\*\*[^*]+\*\*)/g);
                          return (
                            <p key={pIdx} className="leading-relaxed">
                              {parts.map((part, partIdx) => {
                                if (part.startsWith('**') && part.endsWith('**')) {
                                  const cleanContent = part.slice(2, -2);
                                  return (
                                    <strong key={partIdx} className="font-bold text-[#dfba73]">
                                      {cleanContent}
                                    </strong>
                                  );
                                }
                                return part;
                              })}
                            </p>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/5">
                        <span className="block text-[10px] text-slate-400">
                          {msg.timestamp}
                        </span>

                        {/* Interactive Controls (Edit & Undo) */}
                        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {isUser && (
                            <button
                              onClick={() => handleStartEdit(msg)}
                              className="p-1 rounded-md text-slate-400 hover:text-[#dfba73] hover:bg-slate-800/80 transition-colors"
                              title="تعديل هذا النص وإعادة التحليل"
                            >
                              <Pencil className="w-3 h-3" />
                            </button>
                          )}
                          {index < messages.length - 1 && (
                            <button
                              onClick={() => handleUndoUpToPoint(index)}
                              className="p-1 rounded-md text-slate-400 hover:text-amber-400 hover:bg-slate-800/80 transition-colors flex items-center gap-1 text-[10px]"
                              title="التراجع عن جميع الردود والرسائل اللاحقة حتى هذه النقطة (Undo up to this point)"
                            >
                              <Undo2 className="w-3 h-3" />
                              <span className="hidden sm:inline">تراجع لهنا</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

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

                </div>
              </div>
            );
          })}

          {/* Loading Bubble */}
          {isLoading && (
            <div className="flex items-start gap-3.5 text-right animate-pulse">
              <div className="w-9 h-9 rounded-xl bg-[#111c38] border border-[#c5a059]/40 text-[#dfba73] flex items-center justify-center shadow-md">
                <Scale className="w-4 h-4 animate-bounce" />
              </div>
              <div className="p-4 rounded-2xl bg-[#0b1224] border border-slate-800 text-slate-300 text-xs flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-[#dfba73]" />
                <span>جاري استخراج السند القانوني وتكييف الواقعة...</span>
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

      </main>

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
