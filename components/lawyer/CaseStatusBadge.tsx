import React from 'react';
import { CaseStatus } from '@/lib/types';
import { Clock, CheckCircle2, ShieldCheck, Gavel, Archive, Sparkles, FileText } from 'lucide-react';

interface Props {
  status: CaseStatus;
  size?: 'sm' | 'md';
}

export default function CaseStatusBadge({ status, size = 'sm' }: Props) {
  const config: Record<CaseStatus, { label: string; bg: string; icon: React.ElementType }> = {
    new_intake: {
      label: 'طلب وارد جديد',
      bg: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
      icon: Sparkles,
    },
    under_review: {
      label: 'قيد الدراسة والمراجعة',
      bg: 'bg-slate-800 border-slate-700 text-slate-300',
      icon: Clock,
    },
    accepted: {
      label: 'مقبولة وقيد إعداد الدعوى',
      bg: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
      icon: FileText,
    },
    in_court: {
      label: 'منظورة أمام المحكمة',
      bg: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
      icon: Gavel,
    },
    resolved: {
      label: 'تم كسب الحكم / إنهاء النزاع',
      bg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
      icon: CheckCircle2,
    },
    closed: {
      label: 'مغلقة ومؤرشفة',
      bg: 'bg-slate-800/80 border-slate-800 text-slate-400',
      icon: Archive,
    },
  };

  const current = config[status] || config.new_intake;
  const Icon = current.icon;

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2.5 py-1' : 'text-xs px-3.5 py-1.5';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${current.bg} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{current.label}</span>
    </span>
  );
}
