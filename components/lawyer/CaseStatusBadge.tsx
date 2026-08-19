import React from 'react';
import { CaseStatus } from '@/lib/types';
import { Clock, CheckCircle2, ShieldCheck, Gavel, Archive, Sparkles } from 'lucide-react';

interface Props {
  status: CaseStatus;
  size?: 'sm' | 'md';
}

export default function CaseStatusBadge({ status, size = 'sm' }: Props) {
  const config = {
    new_intake: {
      label: 'طلب جديد (AI Intake)',
      bg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
      icon: Sparkles,
    },
    under_review: {
      label: 'قيد الدراسة والمراجعة',
      bg: 'bg-amber-500/15 border-amber-500/30 text-amber-300',
      icon: Clock,
    },
    accepted: {
      label: 'مقبولة وتجهيز الدعوى',
      bg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
      icon: ShieldCheck,
    },
    in_court: {
      label: 'متداولة بالجلسات',
      bg: 'bg-purple-500/15 border-purple-500/30 text-purple-300',
      icon: Gavel,
    },
    resolved: {
      label: 'تم كسب الحكم / التسوية',
      bg: 'bg-teal-500/15 border-teal-500/30 text-teal-300',
      icon: CheckCircle2,
    },
    closed: {
      label: 'مغلقة ومؤرشفة',
      bg: 'bg-slate-500/15 border-slate-500/30 text-slate-400',
      icon: Archive,
    },
  };

  const current = config[status] || config.new_intake;
  const Icon = current.icon;

  const sizeClasses = size === 'sm' ? 'text-[11px] px-2.5 py-1' : 'text-xs px-3.5 py-1.5';

  return (
    <span className={`inline-flex items-center gap-1.5 font-semibold rounded-full border ${current.bg} ${sizeClasses}`}>
      <Icon className="w-3.5 h-3.5" />
      <span>{current.label}</span>
    </span>
  );
}
